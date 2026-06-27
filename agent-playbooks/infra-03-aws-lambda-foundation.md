# 05 · AWS Lambda desde cero (fundamentos)

Crear y configurar una función Lambda: IAM, runtime, variables de entorno, VPC, triggers, layers, despliegue y monitoreo. Base para los playbooks 06 (PDF) y 07 (email).

## Conceptos y límites
- Lambda ejecuta código por evento, sin servidores. Primeros 1M req/mes gratis.
- **Timeout** máx 15 min · **Memoria** 128MB–10GB · **Paquete** 50MB zip / 250MB descomprimido · **/tmp** 512MB–10GB.
- **Cold start**: la primera invocación tarda más; usa *Provisioned Concurrency* para eliminarlo en prod.

## Paso 1 — IAM Role (mínimo privilegio)
IAM → Roles → Create role → AWS service → Lambda.
- Adjunta `AWSLambdaBasicExecutionRole` (logs CloudWatch). Si usas VPC, también `AWSLambdaVPCAccessExecutionRole`.
- Nombre: `lambda-{{MODULE}}-role`. Guarda el ARN.
- Política inline para S3/SES/Logs (ajusta recursos):
```json
{
  "Version": "2012-10-17",
  "Statement": [
    { "Effect": "Allow", "Action": ["s3:PutObject", "s3:GetObject"], "Resource": "arn:aws:s3:::{{BUCKET}}/*" },
    { "Effect": "Allow", "Action": ["ses:SendEmail", "ses:SendRawEmail"], "Resource": "*" },
    { "Effect": "Allow", "Action": ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"], "Resource": "*" }
  ]
}
```
> Nunca uses `AdministratorAccess` en producción.

## Paso 2 — Crear la función
Lambda → Create function → Author from scratch.
- Name: `{{MODULE}}-fn` · Runtime: Node.js 20.x · Arch: x86_64 · Role: existing → `lambda-{{MODULE}}-role`.
- Opcional: *Enable function URL* (HTTP sin API Gateway, útil en dev).
- Config recomendada: Timeout 30s · Memory 512MB · Ephemeral storage 512MB · Reserved concurrency 10 (limita costo en dev).

## Paso 3 — Estructura del handler
`index.mjs` (handler = `index.handler`; con ESM el `package.json` lleva `"type": "module"`):
```js
export const handler = async (event, context) => {
  const body = event.body ? JSON.parse(event.body) : event;
  console.log("Event:", JSON.stringify(body, null, 2));
  try {
    const result = await procesarSolicitud(body);
    return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ success: true, data: result }) };
  } catch (error) {
    console.error("Error:", error);
    return { statusCode: 500, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ error: error.message }) };
  }
};
```

## Paso 4 — Variables de entorno
Configuration → Environment variables. Accesibles vía `process.env.NOMBRE`. Típicas: `MONGO_URI`, `HOST_API_URL`, `S3_BUCKET_NAME`, `SES_FROM_EMAIL`, `NODE_ENV`.
> Secretos sensibles → AWS Secrets Manager o SSM Parameter Store, no env en texto plano.

## Paso 5 — Conectar a la VPC (solo si necesitas RDS/Mongo privado)
Configuration → VPC → Edit → selecciona subnets **privadas** + `sg-lambda`. El role necesita `AWSLambdaVPCAccessExecutionRole`. La subnet privada debe rutar `0.0.0.0/0 → NAT GW`. (Ver playbook 04.)

## Paso 6 — Triggers
- **API Gateway (HTTP)**: Add trigger → API Gateway → HTTP API. Security Open (dev) o JWT Authorizer (prod). Da una URL `POST https://xxxx.execute-api.{{REGION}}.amazonaws.com/...`.
- **EventBridge (programado)**: Add trigger → EventBridge → Schedule expression, ej. `cron(0 8 * * ? *)` (8am UTC diario). Para reportes periódicos.

## Paso 7 — Lambda Layers (dependencias npm)
Separa `node_modules` del código (zip pequeño, layer reutilizable):
```bash
mkdir -p nodejs/node_modules && cd nodejs
npm install <deps>
cd .. && zip -r dependencies-layer.zip nodejs/   # estructura: nodejs/node_modules/...
```
Lambda → Layers → Create layer → sube el zip, runtime Node.js 20.x. Luego adjúntalo a la función (Layers → Add a layer → Custom).

## Paso 8 — Desplegar (AWS CLI)
```bash
aws configure
zip -r function.zip index.mjs lib/
aws lambda update-function-code --function-name {{MODULE}}-fn --zip-file fileb://function.zip --region {{REGION}}
aws lambda invoke --function-name {{MODULE}}-fn --payload '{"test":true}' --cli-binary-format raw-in-base64-out response.json
cat response.json
```
> Para proyectos grandes: AWS SAM o Serverless Framework (`sam deploy` / `serverless deploy`).

## Monitoreo (CloudWatch)
- Logs: Monitor → View CloudWatch logs (busca por `requestId`).
- Métricas: Invocations, Duration, Errors, Throttles.
- Alarmas: CloudWatch → Alarms → ej. Errors > 5 en 5 min → SNS → Email.

## Checklist
- [ ] IAM role con permisos mínimos (logs + S3/SES si aplica)
- [ ] Función creada con runtime, timeout, memoria correctos
- [ ] Variables de entorno (secretos en Secrets Manager/SSM)
- [ ] VPC solo si se requiere recurso privado
- [ ] Trigger configurado (API Gateway y/o EventBridge)
- [ ] Dependencias en un Layer
- [ ] Deploy verificado con `invoke`
- [ ] Logs/alarmas en CloudWatch
