interface Env {
  DB: D1Database;
  PROVIDER_BASE_URL?: string;
  PROVIDER_API_ID?: string;
  PROVIDER_API_KEY?: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const db = context.env.DB;
    const body = await context.request.json() as any;
    const { orderId } = body;

    const order: any = await db.prepare("SELECT * FROM orders WHERE id = ?").bind(orderId).first();
    if (!order) {
      return new Response(JSON.stringify({ success: false, error: "Pesanan tidak ditemukan" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    const baseUrl = context.env.PROVIDER_BASE_URL || "https://fayupedia.id/api";
    const apiId = context.env.PROVIDER_API_ID || "1";
    const apiKey = context.env.PROVIDER_API_KEY || "9ubxni-usujoy-sorewn-thv50e-empe7a";

    let refillId = "REF-" + Math.floor(1000 + Math.random() * 9000);

    if (order.provider_order_id) {
      try {
        const formData = new URLSearchParams();
        formData.append("api_id", apiId);
        formData.append("api_key", apiKey);
        formData.append("id", String(order.provider_order_id));

        const res = await fetch(`${baseUrl}/refill`, {
          method: "POST",
          body: formData
        });
        if (res.ok) {
          const json: any = await res.json();
          if (json.status && json.refill) {
            refillId = String(json.refill);
          }
        }
      } catch {}
    }

    await db.prepare("UPDATE orders SET refill_id = ?, refill_status = 'processing' WHERE id = ?")
      .bind(refillId, orderId).run();

    return new Response(JSON.stringify({ success: true, refillId }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
