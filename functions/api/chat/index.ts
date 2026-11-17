interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const db = context.env.DB;
    const res: any = await db.prepare("SELECT * FROM chat_messages ORDER BY created_at ASC LIMIT 100").all();
    return new Response(JSON.stringify({ success: true, messages: res.results || [] }), {
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
    const { userId, senderName, senderRole, message } = body;

    const id = "msg_" + crypto.randomUUID().substring(0, 8);
    await db.prepare(
      "INSERT INTO chat_messages (id, user_id, sender_name, sender_role, message) VALUES (?, ?, ?, ?, ?)"
    ).bind(id, userId, senderName, senderRole || "user", message).run();

    return new Response(JSON.stringify({
      success: true,
      chat: {
        id,
        user_id: userId,
        sender_name: senderName,
        sender_role: senderRole || "user",
        message,
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
