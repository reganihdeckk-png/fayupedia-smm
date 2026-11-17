interface Env {
  DB: D1Database;
  PROVIDER_BASE_URL?: string;
  PROVIDER_API_ID?: string;
  PROVIDER_API_KEY?: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const db = context.env.DB;
    const url = new URL(context.request.url);
    const userId = url.searchParams.get("userId");

    let query = "SELECT * FROM orders ORDER BY created_at DESC LIMIT 100";
    let orders: any;
    if (userId) {
      orders = await db.prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC").bind(userId).all();
    } else {
      orders = await db.prepare(query).all();
    }

    return new Response(JSON.stringify({ success: true, orders: orders.results || [] }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const db = context.env.DB;
    const body = await context.request.json() as any;
    const { userId, serviceId, target, quantity } = body;

    const user: any = await db.prepare("SELECT * FROM users WHERE id = ?").bind(userId).first();
    if (!user) {
      return new Response(JSON.stringify({ success: false, error: "Pengguna tidak ditemukan" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Call Fayupedia Provider API
    const baseUrl = context.env.PROVIDER_BASE_URL || "https://fayupedia.id/api";
    const apiId = context.env.PROVIDER_API_ID || "1";
    const apiKey = context.env.PROVIDER_API_KEY || "9ubxni-usujoy-sorewn-thv50e-empe7a";

    let providerOrderId = "FYP-" + Math.floor(1000 + Math.random() * 9000);
    try {
      const formData = new URLSearchParams();
      formData.append("api_id", apiId);
      formData.append("api_key", apiKey);
      formData.append("service", String(serviceId));
      formData.append("target", target);
      formData.append("quantity", String(quantity));

      const pRes = await fetch(`${baseUrl}/order`, {
        method: "POST",
        body: formData
      });
      if (pRes.ok) {
        const pJson: any = await pRes.json();
        if (pJson.status && pJson.order) {
          providerOrderId = String(pJson.order);
        }
      }
    } catch {}

    const orderId = "ORD-" + Math.floor(10000 + Math.random() * 90000);
    const charge = Math.ceil((25000 / 1000) * quantity); // approximate or passed

    // Deduct user balance in D1 SQL
    await db.prepare("UPDATE users SET balance = balance - ? WHERE id = ?").bind(charge, userId).run();

    // Insert order in D1 SQL
    await db.prepare(`
      INSERT INTO orders (id, user_id, user_email, provider_order_id, service_id, service_name, category, target, quantity, price, charge, status, remains)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      orderId,
      userId,
      user.email,
      providerOrderId,
      serviceId,
      body.serviceName || "SMM Layanan " + serviceId,
      body.category || "Social Media",
      target,
      quantity,
      charge,
      charge,
      "pending",
      quantity
    ).run();

    return new Response(JSON.stringify({
      success: true,
      order: {
        id: orderId,
        user_id: userId,
        provider_order_id: providerOrderId,
        service_id: serviceId,
        service_name: body.serviceName || "SMM Layanan " + serviceId,
        target,
        quantity,
        charge,
        status: "pending",
        created_at: new Date().toISOString()
      }
    }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
