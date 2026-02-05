export async function safeFetch(url, options = {}) {
  const res = await fetch(url, { redirect: "follow", ...options });
  return res;
}
