class DomainRewriter {
  element(element) {
    const attributes = ['href', 'src', 'action'];
    
    for (const attr of attributes) {
      const value = element.getAttribute(attr);
      if (value) {
        // Clean 1-to-1 domain swap without appending /blog.
        // A link to "https://oindbzby.elementor.cloud/blog/my-post"
        // simply becomes "https://travel-blog-6zi.pages.dev/blog/my-post"
        const newValue = value.replace(
          "https://lltjwccw.elementor.cloud", 
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
  url.hostname = "lltjwccw.elementor.cloud";

  // We are letting the url.pathname stay exactly as it is! 
  // "/blog" stays "/blog".

  // Create the proxy request
  const proxyRequest = new Request(url.toString(), context.request);
  proxyRequest.headers.set("Host", "lltjwccw.elementor.cloud");
  
  // Fetch the original response from Elementor
  const response = await fetch(proxyRequest);

  // Apply the HTMLRewriter before sending it to the user
  return new HTMLRewriter()
    .on('[href]', new DomainRewriter())
    .on('[src]', new DomainRewriter())
    .on('[action]', new DomainRewriter())
    .transform(response);
}
