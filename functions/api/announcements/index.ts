interface Env {
  DB?: D1Database;
  OFFICIAL_WA_CHANNEL?: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const channelUrl = context.env.OFFICIAL_WA_CHANNEL || "https://whatsapp.com/channel/0029VbE5A9VBPzjScJYKA50E";
  return new Response(JSON.stringify({
    success: true,
    announcement: {
      id: "ann-1",
      title: "Saluran Resmi Fayupedia SMM",
      content: "PENTING: Seluruh informasi update layanan, perbaikan server, dan promo saldo harian SELALU diinfokan di Saluran WhatsApp Resmi kami. Pastikan Anda telah bergabung sekarang!",
      channel_url: channelUrl,
      active: true,
      created_at: new Date().toISOString()
    }
  }), {
    headers: { "Content-Type": "application/json" }
  });
};
