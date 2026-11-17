interface Env {
  DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const db = context.env.DB;
    const body = await context.request.json() as any;
    const { name, email, password, avatar_url } = body;

    if (!name || !email) {
      return new Response(JSON.stringify({ success: false, error: "Nama dan email wajib diisi" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Check existing
    const existing = await db.prepare("SELECT * FROM users WHERE LOWER(email) = LOWER(?)").bind(email).first();
    if (existing) {
      return new Response(JSON.stringify({ success: false, error: "Email sudah terdaftar" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const id = "usr_" + crypto.randomUUID().substring(0, 8);
    const avatar = avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`;
    const startingBalance = 10000; // Bonus pendaftaran

    // Simple hash for password
    const encoder = new TextEncoder();
    const data = encoder.encode(password || "default123");
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const passwordHash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

    await db.prepare(
      "INSERT INTO users (id, name, email, password_hash, role, balance, avatar_url) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).bind(id, name, email, passwordHash, "user", startingBalance, avatar).run();

    const user = {
      id,
      name,
      email,
      role: "user",
      balance: startingBalance,
      avatar_url: avatar,
      created_at: new Date().toISOString()
    };

    return new Response(JSON.stringify({ success: true, user }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
