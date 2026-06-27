# 03 · Despliegue en AWS EC2 con Docker + Nginx + HTTPS

Llevar host + MFEs a producción en una EC2 Ubuntu, con Docker Compose, Nginx como reverse proxy, SSL de Let's Encrypt y subdominios por MFE.

## Arquitectura

```
Internet → Nginx (443/80, único punto de entrada) → {
  {{DOMAIN}}/*            → host container :{{HOST_PORT}}
  mfe-tx.{{DOMAIN}}/*     → mfe-transactions :3001
  mfe-users.{{DOMAIN}}/*  → mfe-users :3002
}
Host → MongoDB Atlas (DB gestionada)
```
El usuario solo ve `{{DOMAIN}}`. Los puertos internos nunca se exponen al público.

## Variables
```
DOMAIN  = {{DOMAIN}}
REGION  = {{REGION}}
MONGODB_URI = (secreto, solo en el servidor)
```

## Paso 1 — Ajustar código para producción
Los iframes/URLs de MFE deben leerse de variables de entorno (no `localhost` hardcodeado).
```tsx
const MFE_TX = process.env.NEXT_PUBLIC_TRANSACTIONS_MFE_URL ?? "http://localhost:3001";
// <iframe src={`${MFE_TX}/dashboard/transactions`} ... />
```
`.env.local` (dev, en `.gitignore`):
```
NEXT_PUBLIC_TRANSACTIONS_MFE_URL=http://localhost:3001
NEXT_PUBLIC_USERS_MFE_URL=http://localhost:3002
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
```
> Patrón A (npm): este paso casi no aplica a iframes, pero igual parametriza cualquier URL externa.

## Paso 2 — Dockerfiles (uno por app)
Requiere `output: "standalone"` en cada `next.config.ts`.
`Dockerfile` (host; idéntico para cada MFE cambiando `EXPOSE`):
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
ARG NEXT_PUBLIC_TRANSACTIONS_MFE_URL
ARG NEXT_PUBLIC_USERS_MFE_URL
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE {{HOST_PORT}}
CMD ["node", "server.js"]
```
`.dockerignore` (en cada carpeta):
```
node_modules
.next
.env.local
.env*.local
npm-debug.log*
```
> Las `NEXT_PUBLIC_*` deben existir en **build time** (van como `ARG` y se pasan desde compose).

## Paso 3 — docker-compose.yml (raíz)
```yaml
services:
  host:
    build:
      context: .
      args:
        NEXT_PUBLIC_TRANSACTIONS_MFE_URL: https://mfe-tx.{{DOMAIN}}
        NEXT_PUBLIC_USERS_MFE_URL: https://mfe-users.{{DOMAIN}}
    environment:
      MONGODB_URI: ${MONGODB_URI}
      NODE_ENV: production
    ports: ["{{HOST_PORT}}:{{HOST_PORT}}"]
    restart: unless-stopped
    networks: [app-network]
  mfe-transactions:
    build: { context: ./transactions-mfe, args: { NEXT_PUBLIC_API_URL: https://{{DOMAIN}} } }
    environment: { NODE_ENV: production, PORT: 3001 }
    ports: ["3001:3001"]
    restart: unless-stopped
    networks: [app-network]
  nginx:
    image: nginx:alpine
    ports: ["80:80", "443:443"]
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
    depends_on: [host, mfe-transactions]
    restart: unless-stopped
    networks: [app-network]
networks: { app-network: { driver: bridge } }
```
`.env` del servidor (creado a mano en EC2, nunca en git): `MONGODB_URI=...`, secretos de auth, etc.

## Paso 4 — Nginx (`nginx/nginx.conf`)
Redirige 80→443; un `server` por dominio/subdominio; los MFEs llevan `add_header Content-Security-Policy "frame-ancestors https://{{DOMAIN}}"` para permitir el iframe del host.
```nginx
events { worker_connections 1024; }
http {
  server { listen 80; server_name {{DOMAIN}} mfe-tx.{{DOMAIN}}; return 301 https://$host$request_uri; }
  server {
    listen 443 ssl; server_name {{DOMAIN}};
    ssl_certificate     /etc/letsencrypt/live/{{DOMAIN}}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/{{DOMAIN}}/privkey.pem;
    location / {
      proxy_pass http://host:{{HOST_PORT}};
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection 'upgrade';
      proxy_set_header Host $host; proxy_cache_bypass $http_upgrade;
    }
  }
  server {
    listen 443 ssl; server_name mfe-tx.{{DOMAIN}};
    ssl_certificate     /etc/letsencrypt/live/{{DOMAIN}}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/{{DOMAIN}}/privkey.pem;
    add_header Content-Security-Policy "frame-ancestors https://{{DOMAIN}}";
    location / { proxy_pass http://mfe-transactions:3001; proxy_http_version 1.1; proxy_set_header Host $host; }
  }
}
```

## Paso 5 — Crear la EC2
- AMI: Ubuntu Server 22.04 LTS · Tipo: t3.medium (2 vCPU/4GB mín.) · Storage: 30 GB gp3.
- Key pair `.pem` (guárdalo).
- **Security Group inbound**: 22 (tu IP), 80 (0.0.0.0/0), 443 (0.0.0.0/0). **NO** abras 3000/3001/3002 al público.
- Asigna una **Elastic IP** (IP fija).
- Conéctate: `chmod 400 key.pem && ssh -i key.pem ubuntu@<ELASTIC_IP>`

## Paso 6 — Instalar Docker (en la EC2)
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y ca-certificates curl gnupg git
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo usermod -aG docker ubuntu && newgrp docker
sudo systemctl enable docker && sudo systemctl start docker
```

## Paso 7 — Clonar, SSL y levantar
```bash
cd /home/ubuntu && git clone <REPO_URL> && cd <repo>
nano .env                       # MONGODB_URI, secretos...
sudo apt install -y certbot
sudo certbot certonly --manual --preferred-challenges dns -d {{DOMAIN}} -d *.{{DOMAIN}}
docker compose build
docker compose up -d
docker compose ps
```
El certificado wildcard `*.{{DOMAIN}}` cubre todos los subdominios de MFE.

## Paso 8 — DNS
Registros tipo **A** apuntando a la Elastic IP: `@` (raíz), `www`, `mfe-tx`, `mfe-users`, etc. Verifica: `nslookup {{DOMAIN}}` y `curl -I https://{{DOMAIN}}`.

## Paso 9 — Actualizar despliegue
```bash
git pull origin main
docker compose build host           # o el servicio que cambió
docker compose up -d --no-deps host # reinicio sin afectar los demás
```

## Paso 10 — Escalar
```bash
docker compose up -d --scale mfe-transactions=3
```
Para balancear, define un `upstream` en Nginx apuntando al nombre del servicio (Docker DNS resuelve a todas las réplicas, round-robin). Escala mayor: Docker Swarm o Amazon ECS.

## Operación
```bash
docker compose ps
docker compose logs -f [host|nginx|mfe-...]
docker stats
docker system prune -af
sudo certbot renew && docker compose restart nginx
# cron renovación: 0 3 * * 1 certbot renew --quiet && docker compose -f /home/ubuntu/<repo>/docker-compose.yml restart nginx
```

## Checklist
- [ ] URLs de MFE por env; `output: "standalone"` en host y cada MFE
- [ ] Dockerfile + `.dockerignore` por app
- [ ] `docker-compose.yml` con host, MFEs y nginx
- [ ] Nginx con subdominios + `frame-ancestors` en MFEs
- [ ] EC2 Ubuntu 22.04, t3.medium, 30GB, Elastic IP
- [ ] Security Group solo 22/80/443
- [ ] Docker instalado y habilitado al arranque
- [ ] Certificado wildcard `*.{{DOMAIN}}`
- [ ] Registros DNS A para raíz + subdominios
- [ ] `.env` de producción en el servidor
- [ ] `docker compose up -d` con todos los containers `Up`
- [ ] Renovación SSL en cron
