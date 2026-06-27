# Agent Playbooks — Microfrontends e Implementaciones

Conjunto de guías **portables y parametrizadas** destiladas de los instructivos HTML del proyecto `dashboard-nextjs`. Sirven como **archivos de contexto** para reutilizar en otros proyectos React/Next.js: dáselos a tu agente (o léelos tú) para ejecutar la tarea correspondiente sin reinventar el patrón.

## Cómo usar estos playbooks

1. Copia la carpeta `agent-playbooks/` al proyecto destino (o apunta a ella).
2. Abre el playbook que corresponde a la tarea (ver índice).
3. Sustituye los **placeholders** `{{...}}` (ver tabla abajo) por los valores reales de tu proyecto.
4. Sigue los pasos en orden y valida con el checklist final de cada playbook.

Para agentes: cada playbook es autocontenido, define sus variables al inicio, da skeletons de código listos para adaptar, y termina con un checklist de verificación. No asumas rutas/nombres del proyecto original — todo lo específico está parametrizado.

## Índice

| # | Playbook | Cuándo usarlo |
|---|----------|----------------|
| 00 | `mfe-00-architecture-and-conventions.md` | Entender los 3 patrones de integración MFE y elegir uno antes de codificar |
| 01 | `mfe-01-create-new-module.md` | Agregar un nuevo módulo MFE (host + MFE) con CRUD |
| 02 | `mfe-02-publish-as-npm-package.md` | Convertir un MFE en paquete npm dual (app + librería) |
| 03 | `infra-01-docker-ec2-nginx-deploy.md` | Llevar host + MFEs a producción en AWS EC2 con Docker, Nginx, HTTPS |
| 04 | `infra-02-aws-vpc.md` | Crear la red (VPC, subnets, IGW, NAT, route tables, security groups) |
| 05 | `infra-03-aws-lambda-foundation.md` | Crear/configurar una función Lambda desde cero (IAM, env, VPC, triggers, layers) |
| 06 | `serverless-01-pdf-report-lambda-s3.md` | Lambda que genera un PDF de datos y lo guarda en S3 con URL pre-firmada |
| 07 | `serverless-02-email-report-ses.md` | Enviar el reporte por email con AWS SES o Nodemailer (manual + programado) |

Orden sugerido para una implementación completa: 00 → 01 (→ 02 si publicas a npm) → 03 (producción) → 04 → 05 → 06 → 07 (serverless/reportes).

## Placeholders comunes

| Placeholder | Significado | Ejemplo |
|-------------|-------------|---------|
| `{{MODULE}}` | nombre del módulo en minúscula/plural | `orders` |
| `{{MODULE_PASCAL}}` | nombre del módulo en PascalCase singular | `Order` |
| `{{MFE_NAME}}` | nombre del paquete/carpeta del MFE | `orders-mfe` |
| `{{MFE_PORT}}` | puerto de dev del MFE | `3005` |
| `{{HOST_PORT}}` | puerto del host | `3000` |
| `{{HOST_URL}}` | URL del host (env) | `http://localhost:3000` |
| `{{DOMAIN}}` | dominio de producción | `app.midominio.com` |
| `{{REGION}}` | región AWS | `us-east-1` |
| `{{BUCKET}}` | bucket S3 | `mi-bucket-reportes` |
| `{{DB_MODEL_FIELDS}}` | campos del modelo de datos | `name, price, status` |

## Convenciones base que asumen todos los playbooks

- **Host = dueño de los datos.** Modelos (Mongoose u ORM) y rutas API viven en el host; el MFE consume la API del host por HTTP. Nunca pongas el acceso a DB en el MFE.
- **El MFE corre en otro origen** (puerto/subdominio), así que toda API que consuma necesita **CORS** + handler `OPTIONS` en el host.
- **URLs por variable de entorno**, nunca hardcodeadas: el MFE usa `NEXT_PUBLIC_HOST_URL`/`NEXT_PUBLIC_API_URL`; el host usa `NEXT_PUBLIC_{{MODULE}}_MFE_URL`.
- **Tokens de diseño compartidos**: copia las CSS variables del host (`globals.css`) al MFE para verse idéntico al integrarse.
- **Next 15/16**: `params` de route handlers es `Promise` → `const { id } = await params`. Patrón de modelo: `models.X || mongoose.model("X", Schema)`.

> Nota: el proyecto original ya migró del patrón iframe/multi-zone al patrón **paquete npm** (los MFEs se importan como componentes React). Los tres patrones están documentados; elige según el playbook 00.
