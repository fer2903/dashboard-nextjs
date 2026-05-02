import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/app/src/lib/mongodb";
import { User } from "@/app/src/models/User";
import { signToken } from "@/app/src/lib/jwt";

/**
 * POST /api/auth/login
 *
 * Autentica al usuario y genera un JWT guardado en cookie httpOnly.
 *
 * Body esperado:
 *  { email: string, password: string }
 *
 * Flujo:
 *  1. Validar campos
 *  2. Buscar usuario por email en MongoDB
 *  3. Comparar contraseña ingresada con el hash guardado (bcrypt.compare)
 *  4. Si son válidos → generar JWT con signToken()
 *  5. Guardar el token en una cookie httpOnly (no accesible desde JS del browser)
 *  6. Devolver info del usuario
 *
 * Seguridad:
 *  - Se usa el mismo mensaje de error para "usuario no encontrado" y "contraseña incorrecta"
 *    para no dar pistas a posibles atacantes sobre qué emails están registrados
 *  - Cookie httpOnly previene ataques XSS (Cross-Site Scripting)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // --- Validación de campos requeridos ---
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña son requeridos" },
        { status: 400 }
      );
    }

    // --- Conectar a MongoDB ---
    await connectDB();

    // --- Buscar usuario por email ---
    const user = await User.findOne({ email: email.toLowerCase() });

    // Mensaje genérico por seguridad (no revelar si el email existe o no)
    if (!user) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 } // 401 Unauthorized
      );
    }

    // --- Comparar contraseña con el hash guardado en DB ---
    // bcrypt.compare() es seguro contra timing attacks
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // --- Generar token JWT con datos del usuario ---
    const token = await signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // --- Construir respuesta ---
    const response = NextResponse.json({
      message: "Login exitoso",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    // --- Guardar token en cookie httpOnly ---
    // httpOnly: true → el token NO es accesible desde document.cookie en el browser
    // secure: true en producción → solo se envía por HTTPS
    // sameSite: "lax" → protección básica contra CSRF
    // maxAge: tiempo de vida en segundos (7 días)
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[LOGIN ERROR]", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
