import mongoose, { Schema, models } from "mongoose";
import { MODULE_KEYS } from "@/app/src/lib/modules";

/**
 * Modelo de Usuario en MongoDB
 *
 * Define la estructura del documento "users" en la base de datos.
 * Incluye timestamps automáticos (createdAt, updatedAt) que Mongoose
 * agrega y actualiza en cada operación.
 *
 * Campos:
 *  - name          : Nombre completo del usuario
 *  - email         : Email único (se convierte a minúsculas automáticamente)
 *  - password      : Contraseña hasheada con bcrypt (NUNCA se guarda en texto plano)
 *  - role          : Rol del usuario, útil para control de acceso ("admin" | "user")
 *  - subscriptions : Módulos (MFE) a los que el usuario tiene acceso. Cada valor
 *                    debe ser una key válida del registro de módulos (lib/modules.ts).
 *                    Un admin ve todos los módulos sin importar este arreglo.
 */
const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es requerido"],
      trim: true, // elimina espacios al inicio y al final
    },
    email: {
      type: String,
      required: [true, "El email es requerido"],
      unique: true, // crea un índice único en MongoDB
      lowercase: true, // normaliza el email a minúsculas
      trim: true,
    },
    password: {
      type: String,
      required: [true, "La contraseña es requerida"],
      minlength: [6, "Mínimo 6 caracteres"],
    },
    role: {
      type: String,
      enum: ["admin", "user"], // solo estos valores son válidos
      default: "user",
    },
    subscriptions: {
      type: [String],
      // Cada elemento del arreglo debe ser una key de módulo conocida
      enum: MODULE_KEYS,
      default: [],
    },
  },
  {
    timestamps: true, // agrega createdAt y updatedAt automáticamente
  }
);

/**
 * Prevención de re-compilación del modelo en hot-reload de Next.js
 *
 * En desarrollo, Next.js puede re-importar módulos múltiples veces.
 * Si intentamos llamar a mongoose.model() cuando el modelo ya existe,
 * Mongoose lanzará un error. Por eso verificamos si ya existe con models.User.
 */
export const User = models.User || mongoose.model("User", UserSchema);
