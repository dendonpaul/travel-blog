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
  
  // Set the destination to your Elementor site
  url.hostname = "oindbzby.elementor.cloud";

  const proxyRequest = new Request(url.toString(), context.request);
  proxyRequest.headers.set("Host", "oindbzby.elementor.cloud");
  
  // Fetch from Elementor, but use { redirect: 'manual' } so we can intercept them
  const response = await fetch(proxyRequest, {
    redirect: 'manual'
  });

  // 1. Intercept and rewrite Redirects (e.g., Trailing slash redirects)
  if (response.status >= 300 && response.status < 400) {
    const location = response.headers.get('Location');
    if (location) {
      // Swap the domain in the redirect header
      const newLocation = location.replace(
        "https://oindbzby.elementor.cloud",
        "https://travel-blog-6zi.pages.dev"
      );
      
      // Create a new response with the fixed location
      const redirectResponse = new Response(response.body, response);
      redirectResponse.headers.set('Location', newLocation);
      return redirectResponse;
    }
  }

  // 2. If it's a normal page load, apply the HTMLRewriter
  return new HTMLRewriter()
    .on('[href]', new DomainRewriter())
    .on('[src]', new DomainRewriter())
    .on('[action]', new DomainRewriter())
    .transform(response);
}
