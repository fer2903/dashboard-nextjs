import { NextRequest, NextResponse } from "next/server";
import { stripe, APP_URL } from "@/app/src/lib/stripe";

/**
 * POST /api/stripe/checkout
 *
 * Crea una Checkout Session en Stripe y devuelve la URL hospedada
 * a la que el cliente debe redirigir al usuario para completar el pago.
 *
 * Body esperado:
 *  {
 *    items: [
 *      { name: string, amount: number (en la unidad principal, ej. 19.99), quantity: number }
 *    ],
 *    currency?: string  // por defecto "usd"
 *  }
 *
 * Respuesta:
 *  { id: string, url: string }
 *
 * Notas de diseño:
 *  - Usamos `mode: "payment"` (pago único). Para suscripciones sería "subscription".
 *  - `line_items` se construye en el servidor con `price_data` inline para no
 *    depender de productos pre-creados en el dashboard de Stripe. Esto está
 *    bien para una integración básica; en producción es preferible referenciar
 *    Price IDs reales para que el monto no se manipule desde el cliente.
 *  - `success_url` recibe `{CHECKOUT_SESSION_ID}` como template de Stripe;
 *    Stripe lo reemplaza por el ID real al redirigir.
 */

type CheckoutItem = {
  name: string;
  amount: number; // unidad principal (ej. dólares, no centavos)
  quantity: number;
};

type CheckoutBody = {
  items: CheckoutItem[];
  currency?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CheckoutBody;

    // Validación mínima
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: "Se requiere al menos un item" },
        { status: 400 }
      );
    }

    const currency = (body.currency || "usd").toLowerCase();

    // Stripe espera los montos en la unidad MÍNIMA de la moneda (centavos).
    // Convertimos: 19.99 USD → 1999 cents.
    const line_items = body.items.map((item) => ({
      price_data: {
        currency,
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.amount * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      success_url: `${APP_URL}/dashboard/payments/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/dashboard/payments/cancel`,
    });

    return NextResponse.json({
      id: session.id,
      url: session.url,
    });
  } catch (error) {
    // Stripe puede lanzar errores específicos con código y mensaje;
    // los devolvemos para facilitar el debugging en desarrollo.
    const message =
      error instanceof Error ? error.message : "Error al crear la sesión";
    console.error("[/api/stripe/checkout] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
