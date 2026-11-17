interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const db = context.env.DB;
    const url = new URL(context.request.url);
    const userId = url.searchParams.get("userId");

    let deposits: any;
    if (userId) {
      deposits = await db.prepare("SELECT * FROM deposits WHERE user_id = ? ORDER BY created_at DESC").bind(userId).all();
    } else {
      deposits = await db.prepare("SELECT * FROM deposits ORDER BY created_at DESC LIMIT 100").all();
    }

    return new Response(JSON.stringify({ success: true, deposits: deposits.results || [] }), {
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
    const { userId, amount, paymentMethod, notes } = body;

    const user: any = await db.prepare("SELECT * FROM users WHERE id = ?").bind(userId).first();
    if (!user) {
      return new Response(JSON.stringify({ success: false, error: "Pengguna tidak ditemukan" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    const depId = "DEP-" + Math.floor(10000 + Math.random() * 90000);
    const randomCode = Math.floor(100 + Math.random() * 900);
    const totalAmount = amount + randomCode;
    const paymentCode = `${paymentMethod.substring(0, 3).toUpperCase()}-${randomCode}`;

    await db.prepare(`
      INSERT INTO deposits (id, user_id, user_name, user_email, amount, payment_method, payment_code, notes, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `).bind(depId, userId, user.name, user.email, totalAmount, paymentMethod, paymentCode, notes || "").run();

    return new Response(JSON.stringify({
      success: true,
      deposit: {
        id: depId,
        user_id: userId,
        amount: totalAmount,
        payment_method: paymentMethod,
        payment_code: paymentCode,
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
