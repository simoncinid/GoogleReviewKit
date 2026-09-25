export async function readEnv(name: string): Promise<string | undefined> {
  let value = process.env[name]?.trim();
  if (!value) {
    try {
      const { env } = await import("cloudflare:workers");
      value = (env as Record<string, string | undefined>)[name]?.trim();
    } catch {}
  }
  return value || undefined;
}

export async function stripeForm(
  path: string,
  params: URLSearchParams,
  secret: string,
) {
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });
  const data = (await res.json()) as Record<string, unknown> & {
    error?: { message?: string };
  };
  return { ok: res.ok, status: res.status, data };
}

export async function stripeGet(path: string, secret: string) {
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    headers: { Authorization: `Bearer ${secret}` },
    cache: "no-store",
  });
  const data = (await res.json()) as Record<string, unknown> & {
    error?: { message?: string };
  };
  return { ok: res.ok, status: res.status, data };
}
