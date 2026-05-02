import { SignJWT, jwtVerify } from "jose";

/**
 * Utilidades para manejo de JSON Web Tokens (JWT)
 *
 * Usamos la librería `jose` en lugar de `jsonwebtoken` porque:
 *  - `jose` es compatible con el Edge Runtime de Next.js (usado en middleware)
 *  - `jsonwebtoken` depende de módulos Node.js (crypto) que no están disponibles en Edge
 *
 * Flujo JWT:
 *  1. Usuario hace login → se genera un token con signToken()
 *  2. Token se guarda en una cookie httpOnly (segura, no accesible desde JS)
 *  3. En cada request, el middleware verifica el token con verifyToken()
 *  4. Si el token es válido → se permite el acceso
 *  5. Si es inválido o expirado → se redirige al login
 */

// Codificamos el secreto como Uint8Array (requerido por jose)
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-cambia-esto-en-produccion"
);

/**
 * Tipo que describe el payload del JWT
 * Esta información quedará codificada dentro del token
 */
export type JWTPayload = {
  userId: string;
  email: string;
  role: string;
};

/**
 * Genera un token JWT firmado con los datos del usuario
 *
 * @param payload - Datos del usuario a incluir en el token
 * @returns Promise con el token JWT como string
 *
 * Algoritmo: HS256 (HMAC con SHA-256) — simétrico, usa la misma clave para firmar y verificar
 * Expiración: 7 días
 */
export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT(payload as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" }) // algoritmo de firma
    .setIssuedAt() // iat: fecha de emisión
    .setExpirationTime("7d") // exp: 7 días de validez
    .sign(JWT_SECRET);
}

/**
 * Verifica y decodifica un token JWT
 *
 * @param token - Token JWT a verificar
 * @returns Promise con el payload decodificado
 * @throws Error si el token es inválido, modificado o expirado
 */
export async function verifyToken(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, JWT_SECRET);
  return payload as unknown as JWTPayload;
}
