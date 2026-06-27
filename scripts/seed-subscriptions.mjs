/**
 * Seed / migración de suscripciones a módulos
 *
 * Qué hace (idempotente):
 *  1. Migra usuarios existentes: añade `subscriptions: []` donde falte.
 *  2. Crea/actualiza 3 usuarios de prueba para validar el control de acceso:
 *       - admin@demo.com  (admin, ve todos los módulos)
 *       - alerts@demo.com (user, suscrito solo a "alerts")
 *       - basic@demo.com  (user, sin suscripciones)
 *
 * Uso:
 *   MONGO_URI="mongodb+srv://..." node scripts/seed-subscriptions.mjs
 *
 * Requiere las dependencias del proyecto (mongoose, bcryptjs), ya instaladas.
 * NO ejecuta nada por sí solo: corre el comando anterior con tu MONGO_URI.
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("✗ Falta la variable de entorno MONGO_URI");
  process.exit(1);
}

const MODULE_KEYS = ["transactions", "products", "alerts"];

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, lowercase: true, trim: true },
    password: String,
    role: { type: String, enum: ["admin", "user"], default: "user" },
    subscriptions: { type: [String], enum: MODULE_KEYS, default: [] },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

const TEST_USERS = [
  { name: "Admin Demo",  email: "admin@demo.com",  role: "admin", subscriptions: [] },
  { name: "Alerts User", email: "alerts@demo.com", role: "user",  subscriptions: ["alerts"] },
  { name: "Basic User",  email: "basic@demo.com",  role: "user",  subscriptions: [] },
];
const TEST_PASSWORD = "demo1234";

async function main() {
  await mongoose.connect(MONGO_URI, { bufferCommands: false });
  console.log("✓ Conectado a MongoDB");

  // 1) Migración: subscriptions faltante → []
  const migrated = await User.updateMany(
    { subscriptions: { $exists: false } },
    { $set: { subscriptions: [] } }
  );
  console.log(`✓ Migración: ${migrated.modifiedCount} usuario(s) inicializados con subscriptions: []`);

  // 2) Usuarios de prueba (upsert)
  const hash = await bcrypt.hash(TEST_PASSWORD, 10);
  for (const u of TEST_USERS) {
    await User.findOneAndUpdate(
      { email: u.email },
      {
        $set: {
          name: u.name,
          role: u.role,
          subscriptions: u.subscriptions,
        },
        $setOnInsert: { password: hash },
      },
      { upsert: true, new: true }
    );
    console.log(`✓ Usuario de prueba: ${u.email} (${u.role}) → [${u.subscriptions.join(", ") || "sin módulos"}]`);
  }

  console.log(`\nContraseña de los usuarios de prueba: ${TEST_PASSWORD}`);
  await mongoose.disconnect();
  console.log("✓ Listo");
}

main().catch(async (err) => {
  console.error("✗ Error en el seed:", err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
