export async function onRequest(context) {
  const url = new URL(context.request.url);
  url.hostname = "oindbzby.elementor.cloud";

  // This removes "/blog" before fetching from Elementor
  url.pathname = url.pathname.replace(/^\/blog/, "");

  const proxyRequest = new Request(url.toString(), context.request);
  proxyRequest.headers.set("Host", "oindbzby.elementor.cloud");
  
  return fetch(proxyRequest);
}
