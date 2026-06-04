class DomainRewriter {
  element(element) {
    const attributes = ['href', 'src', 'action'];
    
    for (const attr of attributes) {
      const value = element.getAttribute(attr);
      if (value) {
        const newValue = value.replace(
          "https://oindbzby.elementor.cloud", 
          "https://travel-blog-6zi.pages.dev"
        );
        element.setAttribute(attr, newValue);
      }
    }
  }
}

export async function onRequest(context) {
  const url = new URL(context.request.url);
  url.hostname = "oindbzby.elementor.cloud";

  // 1. Rebuild headers to look like a human browser
  const proxyHeaders = new Headers();
  proxyHeaders.set("Host", "oindbzby.elementor.cloud");
  
  // Pass the user's actual browser info so Elementor doesn't think we are a bot
  const userAgent = context.request.headers.get("User-Agent") || "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
  proxyHeaders.set("User-Agent", userAgent);
  proxyHeaders.set("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8");
  proxyHeaders.set("Accept-Language", "en-US,en;q=0.5");

  // Setup the request configuration
  const requestInit = {
    method: context.request.method,
    headers: proxyHeaders,
    redirect: 'manual'
  };

  // Only attach a body if it's a POST/PUT request (like submitting a search form)
  if (context.request.method !== "GET" && context.request.method !== "HEAD") {
    requestInit.body = context.request.body;
  }

  // 2. Fetch the page with our camouflaged headers
  const proxyRequest = new Request(url.toString(), requestInit);
  const response = await fetch(proxyRequest);

  // 3. Handle WordPress Redirects
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

  // 4. Apply the HTMLRewriter to swap domains in links/images
  return new HTMLRewriter()
    .on('[href]', new DomainRewriter())
    .on('[src]', new DomainRewriter())
    .on('[action]', new DomainRewriter())
    .transform(response);
}
