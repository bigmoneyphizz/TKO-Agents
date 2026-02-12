export default async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ ok: false, error: "method_not_allowed" }), {
        status: 405,
        headers: { "content-type": "application/json" }
      });
    }

    const workerUrl = process.env.TKO_WORKER_RUN_URL; // e.g. https://<your-worker>/run
    const token = process.env.TKO_GATEWAY_TOKEN;

    if (!workerUrl || !token) {
      return new Response(JSON.stringify({ ok: false, error: "missing_env" }), {
        status: 500,
        headers: { "content-type": "application/json" }
      });
    }

    const body = await req.json();

    const upstream = await fetch(workerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    const text = await upstream.text();

    return new Response(text, {
      status: upstream.status,
      headers: { "content-type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: "proxy_failed", details: String(e) }), {
      status: 500,
      headers: { "content-type": "application/json" }
    });
  }
};

