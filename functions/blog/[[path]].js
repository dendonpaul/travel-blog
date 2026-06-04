export async function onRequest(context) {
  // 1. Get the original URL requested by the user
  const url = new URL(context.request.url);

  // 2. Change the destination hostname to your Elementor site
  url.hostname = "oindbzby.elementor.cloud";

  // Optional: If your Elementor site doesn't actually have a "/blog" page and 
  // is instead installed at the root level (/), you'll need to strip "/blog" 
  // from the path before fetching. If so, uncomment the line below:
  // url.pathname = url.pathname.replace(/^\/blog/, "");

  // 3. Clone the incoming request to safely modify it
  const proxyRequest = new Request(url.toString(), context.request);

  // 4. Update the Host header so the Elementor server knows which site to serve
  proxyRequest.headers.set("Host", "oindbzby.elementor.cloud");
  
  // 5. Fetch the content from Elementor and return it to the user
  return fetch(proxyRequest);
}
