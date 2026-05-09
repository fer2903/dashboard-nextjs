import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/app/src/lib/stripe";

/**
 * POST /api/stripe/webhook
 *
 * Endpoint que Stripe llama cuando ocurren eventos en tu cuenta
 * (pago completado, fallido, suscripción cancelada, etc.).
 *
 * Pasos críticos:
 *  1. Leer el body como TEXTO RAW (no parseado a JSON) — la firma se calcula
 *     sobre los bytes exactos enviados por Stripe. Si Next.js parsea el body,
 *     la verificación de firma falla.
 *  2. Verificar la firma con `stripe.webhooks.constructEvent` usando el
 *     header `stripe-signature` y el `STRIPE_WEBHOOK_SECRET`.
 *  3. Manejar los `event.type` que te interesen.
 *  4. Devolver 200 lo antes posible. Si tardas demasiado, Stripe reintenta.
 *
 * IMPORTANTE — Forzar runtime Node.js:
 *  Por defecto, las route handlers pueden correr en Edge. La verificación
 *  de firma de Stripe usa APIs de Node (crypto), por eso forzamos `nodejs`.
 *
 * Cómo probarlo en local:
 *  1. Instala Stripe CLI: https://stripe.com/docs/stripe-cli
 *  2. `stripe login`
 *  3. `stripe listen --forward-to localhost:3000/api/stripe/webhook`
 *     → Imprime un `whsec_...` que va a STRIPE_WEBHOOK_SECRET
 *  4. En otra terminal: `stripe trigger checkout.session.completed`
 */

export const runtime = "nodejs";
// Asegura que la respuesta no se cachee
export const dynamic = "force-dynamic";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(request: NextRequest) {
  if (!WEBHOOK_SECRET) {
    console.error("[stripe/webhook] STRIPE_WEBHOOK_SECRET no está configurada");
    return NextResponse.json(
      { error: "Webhook secret no configurado" },
      { status: 500 }
    );
  }

  // 1. Body raw — NO usar request.json()
  const rawBody = await request.text();

  // 2. Firma del header
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "Falta header stripe-signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, WEBHOOK_SECRET);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Firma inválida";
    console.error(`[stripe/webhook] Firma inválida: ${message}`);
    return NextResponse.json(
      { error: `Webhook signature failed: ${message}` },
      { status: 400 }
    );
  }

  // 3. Manejar el evento. Solo registramos algunos eventos representativos;
  //    en una integración real aquí actualizarías tu base de datos
  //    (ej: marcar la orden como pagada, otorgar acceso, enviar email, etc.).
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(
        `[stripe/webhook] ✅ Checkout completado: ${session.id} — ${session.amount_total} ${session.currency}`
      );
      // TODO: marcar la orden como pagada en MongoDB usando session.id
      break;
    }

    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(`[stripe/webhook] ⌛ Sesión expirada: ${session.id}`);
      break;
    }

    case "payment_intent.succeeded": {
      const intent = event.data.object as Stripe.PaymentIntent;
      console.log(`[stripe/webhook] 💰 Pago exitoso: ${intent.id}`);
      break;
    }

    case "payment_intent.payment_failed": {
      const intent = event.data.object as Stripe.PaymentIntent;
      console.log(
        `[stripe/webhook] ❌ Pago fallido: ${intent.id} — ${intent.last_payment_error?.message}`
      );
      break;
    }

    default:
      // Útil mientras desarrollas para descubrir qué eventos llegan
      console.log(`[stripe/webhook] Evento no manejado: ${event.type}`);
  }

  // 4. ACK rápido a Stripe
  return NextResponse.json({ received: true });
}
