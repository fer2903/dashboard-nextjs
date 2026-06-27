# 06 · Lambda que genera un reporte PDF y lo guarda en S3

Lambda que consulta la API del host, genera un PDF con PDFKit, lo sube a S3 y retorna una **URL pre-firmada** de descarga. Requiere los fundamentos del playbook 05.

## Flujo
1. UI del dashboard → `POST {{HOST_URL}}/api/reports/{{MODULE}}`.
2. El host invoca la Lambda (vía API Gateway / function URL).
3. Lambda obtiene los datos de `{{HOST_URL}}/api/{{MODULE}}`, genera el PDF, lo sube a S3.
4. Retorna URL pre-firmada (válida 1h); el navegador descarga directo de S3.

## Paso 1 — Bucket S3
S3 → Create bucket: `{{BUCKET}}` (único global), region `{{REGION}}`. **Mantén "Block all public access" activado** (los PDFs son privados; se acceden por URL pre-firmada). Opcional: lifecycle rule para borrar a los 30 días. Env: `S3_BUCKET_NAME={{BUCKET}}`.

## Paso 2 — Estructura del proyecto
```
{{MODULE}}-pdf/
├── package.json        # "type":"module"
├── index.mjs           # handler
└── lib/
    ├── fetchData.mjs   # consulta la API del host
    ├── generatePdf.mjs # construye el PDF
    └── uploadToS3.mjs  # sube + URL pre-firmada
```
`package.json` deps: `pdfkit`, `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`.

## Paso 3 — Obtener datos (`lib/fetchData.mjs`)
```js
export async function fetchData({ startDate, endDate } = {}) {
  const HOST_API_URL = process.env.HOST_API_URL;
  if (!HOST_API_URL) throw new Error("HOST_API_URL no configurada");
  const params = new URLSearchParams();
  if (startDate) params.set("startDate", startDate);
  if (endDate) params.set("endDate", endDate);
  const res = await fetch(`${HOST_API_URL}/api/{{MODULE}}?${params}`, {
    headers: { "X-Internal-Token": process.env.INTERNAL_API_TOKEN ?? "", "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}
```
> `X-Internal-Token`: opcional pero recomendado; valida en tu API que la llamada viene de la Lambda.

## Paso 4 — Generar PDF (`lib/generatePdf.mjs`)
Devuelve un `Buffer` en memoria (sin tocar disco):
```js
import PDFDocument from "pdfkit";
const fmtMoney = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n ?? 0);

export function generatePdf(rows) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const chunks = [];
    doc.on("data", (c) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // Encabezado
    doc.rect(0, 0, doc.page.width, 80).fill("#1C2536");
    doc.fillColor("#818cf8").fontSize(22).font("Helvetica-Bold").text("Reporte", 50, 22);
    doc.fillColor("#9CA3AF").fontSize(9).text(`Generado: ${new Date().toLocaleString("es-MX")}`, 0, 35, { align: "right" });
    doc.moveDown(3);

    // Resumen
    const total = rows.reduce((s, r) => s + (r.amount || 0), 0);
    const y = doc.y;
    doc.rect(50, y, doc.page.width - 100, 60).fillAndStroke("#F4F6F8", "#E5E7EB");
    doc.fillColor("#111827").fontSize(10).font("Helvetica-Bold").text("Registros", 70, y + 12);
    doc.fillColor("#4f46e5").fontSize(18).text(String(rows.length), 70, y + 26);
    doc.fillColor("#111827").fontSize(10).font("Helvetica-Bold").text("Total", 220, y + 12);
    doc.fillColor("#059669").fontSize(18).text(fmtMoney(total), 220, y + 26);
    doc.moveDown(4.5);

    // Filas (con paginación)
    rows.forEach((r, i) => {
      if (doc.y > 750) doc.addPage();
      const yr = doc.y;
      if (i % 2 === 0) doc.rect(50, yr - 2, doc.page.width - 100, 18).fill("#FAFAFA");
      doc.fillColor("#111827").fontSize(8).font("Helvetica").text(r.name ?? "—", 80, yr);
      doc.fillColor("#059669").text(fmtMoney(r.amount), 320, yr);
      doc.moveDown(1.2);
    });
    doc.end();
  });
}
```

## Paso 5 — Subir a S3 + URL pre-firmada (`lib/uploadToS3.mjs`)
```js
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
const s3 = new S3Client({ region: process.env.AWS_REGION ?? "{{REGION}}" });

export async function uploadPdfToS3(pdfBuffer, fileName) {
  const Bucket = process.env.S3_BUCKET_NAME;
  const Key = `reports/${fileName}`;
  await s3.send(new PutObjectCommand({
    Bucket, Key, Body: pdfBuffer, ContentType: "application/pdf",
    ContentDisposition: `attachment; filename="${fileName}"`,
    Metadata: { "generated-at": new Date().toISOString() },
  }));
  return getSignedUrl(s3, new GetObjectCommand({ Bucket, Key }), { expiresIn: 3600 }); // 1h
}
```

## Paso 6 — Handler (`index.mjs`)
```js
import { fetchData } from "./lib/fetchData.mjs";
import { generatePdf } from "./lib/generatePdf.mjs";
import { uploadPdfToS3 } from "./lib/uploadToS3.mjs";

export const handler = async (event) => {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const rows = await fetchData({ startDate: body.startDate, endDate: body.endDate });
    if (rows.length === 0)
      return { statusCode: 200, body: JSON.stringify({ message: "Sin datos para el período" }) };
    const pdf = await generatePdf(rows);
    const fileName = `{{MODULE}}-${new Date().toISOString().slice(0,10)}-${Date.now()}.pdf`;
    const downloadUrl = await uploadPdfToS3(pdf, fileName);
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ success: true, fileName, downloadUrl, total: rows.length }),
    };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
```

## Paso 7 — Empaquetar y desplegar
```bash
# Layer con dependencias
mkdir -p layer/nodejs && cp package.json layer/nodejs/
(cd layer/nodejs && npm install --production)
zip -r layer.zip layer/
aws lambda publish-layer-version --layer-name {{MODULE}}-pdf-deps --zip-file fileb://layer.zip --compatible-runtimes nodejs20.x --region {{REGION}}
# Código
zip -r function.zip index.mjs lib/
aws lambda update-function-code --function-name {{MODULE}}-fn --zip-file fileb://function.zip --region {{REGION}}
aws lambda update-function-configuration --function-name {{MODULE}}-fn \
  --environment "Variables={HOST_API_URL={{HOST_URL}},S3_BUCKET_NAME={{BUCKET}},AWS_REGION={{REGION}},INTERNAL_API_TOKEN=<secreto>}" \
  --timeout 30 --memory-size 512 --region {{REGION}}
```

## Paso 8 — Endpoint en el host (Next.js)
`app/api/reports/{{MODULE}}/route.ts`
```ts
import { NextRequest, NextResponse } from "next/server";
const LAMBDA_URL = process.env.LAMBDA_{{MODULE}}_PDF_URL!;
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const r = await fetch(LAMBDA_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await r.json();
  if (!r.ok) return NextResponse.json({ error: data.error }, { status: 500 });
  return NextResponse.json({ downloadUrl: data.downloadUrl, fileName: data.fileName, total: data.total });
}
```
Botón en la UI (cliente): hace `POST` al endpoint y abre `data.downloadUrl` con `window.open(url, "_blank")`.

## Probar
- Lambda Console → Test con `{"body":"{}"}` y revisa logs.
- S3 → `{{BUCKET}}/reports/` debe tener el PDF.
- Dashboard → botón "Descargar Reporte" abre el PDF.

## Checklist
- [ ] Bucket privado `{{BUCKET}}` (Block public access ON)
- [ ] IAM role con `s3:PutObject/GetObject` sobre el bucket
- [ ] Layer con pdfkit + aws-sdk; código sin node_modules
- [ ] Env: HOST_API_URL, S3_BUCKET_NAME, AWS_REGION, INTERNAL_API_TOKEN
- [ ] Handler retorna `downloadUrl` pre-firmada
- [ ] Endpoint del host + botón en UI
- [ ] PDF aparece en S3 y se descarga desde el dashboard
