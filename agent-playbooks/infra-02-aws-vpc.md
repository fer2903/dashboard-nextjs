# 04 · AWS VPC desde cero

Red privada de producción con subnets públicas/privadas en 2 AZs, IGW, NAT Gateway, route tables y security groups. Es la base sobre la que corren EC2, Lambda y RDS.

## Conceptos
- **VPC**: tu red privada en AWS (define un CIDR, ej. `10.0.0.0/16` = 65k IPs).
- **Subnet**: segmento de la VPC en una AZ; es pública o privada según su route table.
- **Internet Gateway (IGW)**: puerta a internet para subnets públicas.
- **NAT Gateway**: deja salir a internet a subnets privadas sin que sean accesibles desde fuera.
- **Route Table**: define a dónde va el tráfico de cada subnet.
- **Security Group**: firewall stateful a nivel de recurso.

## Plan de direccionamiento (ejemplo)
| Recurso | CIDR | AZ | Tipo |
|---------|------|----|----|
| VPC | `10.0.0.0/16` | — | VPC |
| public-subnet-a | `10.0.1.0/24` | {{REGION}}a | Pública |
| private-subnet-a | `10.0.2.0/24` | {{REGION}}a | Privada |
| public-subnet-b | `10.0.3.0/24` | {{REGION}}b | Pública |
| private-subnet-b | `10.0.4.0/24` | {{REGION}}b | Privada |

## Pasos (Consola AWS → VPC)

1. **Crear VPC**: "VPC only", name `prod-vpc`, CIDR `10.0.0.0/16`. Luego Edit settings → habilita *DNS hostnames* y *DNS resolution*.
2. **Crear 4 subnets** (arriba). En las **públicas** activa *auto-assign public IPv4*; en las **privadas** no.
3. **Internet Gateway**: crea `prod-igw` → Actions → Attach to VPC → `prod-vpc`.
4. **NAT Gateway**: crea `nat-gw-a` en `public-subnet-a`, Connectivity *Public*, *Allocate Elastic IP*. (Producción: uno por AZ → `nat-gw-b` en `public-subnet-b`.)
5. **Route Tables**:
   - `rtb-public`: ruta `0.0.0.0/0` → IGW `prod-igw`; asocia las subnets públicas.
   - `rtb-private-a`: ruta `0.0.0.0/0` → NAT `nat-gw-a`; asocia `private-subnet-a`.
   - `rtb-private-b`: ruta `0.0.0.0/0` → NAT `nat-gw-b`; asocia `private-subnet-b`.
6. **Security Groups** (uno por capa; referénciate entre SGs, no por IP):

   | SG | Inbound | Fuente | Uso |
   |----|---------|--------|-----|
   | `sg-alb` | 80, 443 | `0.0.0.0/0` | Load Balancer |
   | `sg-app` | 3000, 3001… | `sg-alb` | App Next.js / MFEs |
   | `sg-lambda` | — | (solo outbound a `sg-db`) | Funciones Lambda |
   | `sg-db` | 27017 / 5432 | `sg-app`, `sg-lambda` | Base de datos |

7. **Verificar**: EC2 en subnet pública → `curl https://checkip.amazonaws.com` muestra IP pública; EC2 en subnet privada → muestra la IP del NAT. Usa *VPC Reachability Analyzer* para confirmar rutas.

## Producción
- **VPC Flow Logs** → CloudWatch para auditoría de tráfico.
- **VPC Endpoints** (Gateway para S3/DynamoDB, Interface para otros) para acceder a servicios AWS desde subnets privadas sin pasar por internet.
- **Network ACLs** (stateless, a nivel subnet) como capa extra para bloquear IPs.
- **Costo**: NAT Gateway ~$32/mes + $0.045/GB. Dev: un solo NAT. Prod: uno por AZ.

## Notas para Lambda en VPC
- Conectar Lambda a la VPC añade ~400ms de cold start; hazlo solo si necesitas RDS/Mongo privado.
- El IAM role de la Lambda necesita `AWSLambdaVPCAccessExecutionRole` (crea las ENI).
- La subnet privada de la Lambda debe tener ruta `0.0.0.0/0 → NAT GW` para salir a internet.

## Checklist
- [ ] VPC `10.0.0.0/16` con DNS hostnames/resolution
- [ ] 4 subnets (2 públicas con auto-IP, 2 privadas)
- [ ] IGW creado y adjunto
- [ ] NAT Gateway(s) con Elastic IP
- [ ] Route tables: pública→IGW, privadas→NAT, asociadas
- [ ] Security groups por capa, referenciados entre sí
- [ ] Conectividad verificada (pública y privada)
