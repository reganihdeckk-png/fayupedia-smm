interface Env {
  PROVIDER_BASE_URL?: string;
  PROVIDER_API_ID?: string;
  PROVIDER_API_KEY?: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const baseUrl = context.env.PROVIDER_BASE_URL || "https://fayupedia.id/api";
  const apiId = context.env.PROVIDER_API_ID || "1";
  const apiKey = context.env.PROVIDER_API_KEY || "9ubxni-usujoy-sorewn-thv50e-empe7a";

  try {
    const formData = new URLSearchParams();
    formData.append("api_id", apiId);
    formData.append("api_key", apiKey);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`${baseUrl}/services`, {
      method: "POST",
      body: formData,
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 FayupediaSMM/1.0"
      }
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data: any = await res.json();
      if (data.status && Array.isArray(data.services) && data.services.length > 0) {
        return new Response(JSON.stringify({ status: true, services: data.services }), {
          headers: { "Content-Type": "application/json" }
        });
      }
    }
  } catch (err) {}

  // Return fallback response
  return new Response(JSON.stringify({ status: true, services: [] }), {
    headers: { "Content-Type": "application/json" }
  });
};
