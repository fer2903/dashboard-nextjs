import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/app/src/lib/mongodb";
import { User } from "@/app/src/models/User";

/**
 * POST /api/auth/register
 *
 * Registra un nuevo usuario en la base de datos.
 *
 * Body esperado:
 *  { name: string, email: string, password: string }
 *
 * Validaciones:
 *  - Todos los campos son obligatorios
 *  - La contraseña debe tener al menos 6 caracteres
 *  - El email no puede estar ya registrado
 *
 * Seguridad:
 *  - La contraseña se hashea con bcrypt antes de guardar
 *  - bcrypt.hash(password, 10) → el "10" es el número de salt rounds
 *    (más alto = más seguro pero más lento; 10 es el estándar recomendado)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    // --- Validación de campos requeridos ---
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 } // 400 Bad Request
      );
    }

    // --- Validación de longitud de contraseña ---
    if (password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      );
    }

    // --- Validación básica de formato de email ---
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "El formato del email no es válido" },
        { status: 400 }
      );
    }

    // --- Conexión a MongoDB ---
    await connectDB();

    // --- Verificar si el email ya existe ---
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: "Este email ya está registrado" },
        { status: 409 } // 409 Conflict
      );
    }

    // --- Hashear la contraseña ---
    // NUNCA guardar contraseñas en texto plano
    // bcrypt genera un hash diferente cada vez (por el salt aleatorio)
    const hashedPassword = await bcrypt.hash(password, 10);

    // --- Crear usuario en MongoDB ---
    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: "user",
    });

    // --- Respuesta exitosa (sin devolver la contraseña) ---
    return NextResponse.json(
      {
        message: "Usuario registrado exitosamente",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 } // 201 Created
    );
  } catch (error) {
    console.error("[REGISTER ERROR]", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
