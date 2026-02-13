exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ok: false, error: "method_not_allowed" }),
      };
    }

    const workerUrl = process.env.TKO_WORKER_RUN_URL; 
    const token = process.env.TKO_GATEWAY_TOKEN;

    if (!workerUrl || !token) {
      return {
        statusCode: 500,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ok: false, error: "missing_env" }),
      };
    }

    const body = JSON.parse(event.body || "{}");

    const upstream = await fetch(workerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const text = await upstream.text();

    return {
      statusCode: upstream.status,
      headers: { "content-type": "application/json" },
      body: text,
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ok: false, error: "proxy_failed", details: String(e) }),
    };
  }
};

