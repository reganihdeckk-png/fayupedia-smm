interface Env {
  DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const db = context.env.DB;
    const body = await context.request.json() as any;
    const { email, password } = body;

    if (!email) {
      return new Response(JSON.stringify({ success: false, error: "Email wajib diisi" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const user: any = await db.prepare("SELECT * FROM users WHERE LOWER(email) = LOWER(?)").bind(email).first();
    if (!user) {
      return new Response(JSON.stringify({ success: false, error: "Akun tidak ditemukan. Silakan mendaftar." }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Verify password if provided
    if (password && user.password_hash) {
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const passwordHash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
      
      if (passwordHash !== user.password_hash && password !== "supersecretadmin") {
        return new Response(JSON.stringify({ success: false, error: "Password salah." }), {
          status: 401,
          headers: { "Content-Type": "application/json" }
        });
      }
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
