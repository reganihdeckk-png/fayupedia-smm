interface Env {
  DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const db = context.env.DB;
    const body = await context.request.json() as any;
    const email = body.email || "google.user@gmail.com";
    const name = body.name || "Google User";
    const avatar = body.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`;
    const googleId = body.google_id || "g_" + crypto.randomUUID().substring(0, 10);

    let user: any = await db.prepare("SELECT * FROM users WHERE LOWER(email) = LOWER(?)").bind(email).first();

    if (!user) {
      const id = "usr_g_" + crypto.randomUUID().substring(0, 8);
      const startingBalance = 15000;
      await db.prepare(
        "INSERT INTO users (id, name, email, role, balance, avatar_url, google_id) VALUES (?, ?, ?, ?, ?, ?, ?)"
      ).bind(id, name, email, "user", startingBalance, avatar, googleId).run();

      user = {
        id,
        name,
        email,
        role: "user",
        balance: startingBalance,
        avatar_url: avatar,
        google_id: googleId,
        created_at: new Date().toISOString()
      };
    }

    const { password_hash, ...safeUser } = user;
    return new Response(JSON.stringify({ success: true, user: safeUser }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
