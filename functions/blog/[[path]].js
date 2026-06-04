class LinkRewriter {
  element(element) {
    // Determine which attribute to look at based on the tag type
    const attributeName = element.tagName === 'form' ? 'action' : 'href';
    const value = element.getAttribute(attributeName);
    
    if (value) {
      // Only swap the domain for clickable links and forms
      const newValue = value.replace(
        "https://oindbzby.elementor.cloud", 
        "https://travel-blog-6zi.pages.dev"
      );
      element.setAttribute(attributeName, newValue);
    }
  }
}

export async function onRequest(context) {
  const url = new URL(context.request.url);
  url.hostname = "oindbzby.elementor.cloud";

  // Rebuild headers to bypass Elementor Bot Protection
  const proxyHeaders = new Headers();
  proxyHeaders.set("Host", "oindbzby.elementor.cloud");
  
  const userAgent = context.request.headers.get("User-Agent") || "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
  proxyHeaders.set("User-Agent", userAgent);
  proxyHeaders.set("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8");
  proxyHeaders.set("Accept-Language", "en-US,en;q=0.5");

  const requestInit = {
    method: context.request.method,
    headers: proxyHeaders,
    redirect: 'manual'
  };

  if (context.request.method !== "GET" && context.request.method !== "HEAD") {
    requestInit.body = context.request.body;
  }

  const proxyRequest = new Request(url.toString(), requestInit);
  const response = await fetch(proxyRequest);

  // Intercept and rewrite redirects (fixes trailing slash issues)
  if (response.status >= 300 && response.status < 400) {
    const location = response.headers.get('Location');
    if (location) {
      const newLocation = location.replace(
        "https://oindbzby.elementor.cloud",
        "https://travel-blog-6zi.pages.dev"
      );
      const redirectResponse = new Response(response.body, response);
      redirectResponse.headers.set('Location', newLocation);
      return redirectResponse;
    }
  }

  // Apply the HTMLRewriter ONLY to <a> tags (links) and <form> tags
  return new HTMLRewriter()
    .on('a[href]', new LinkRewriter())
    .on('form[action]', new LinkRewriter())
    .transform(response);
}
