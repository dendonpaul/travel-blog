// 1. Define the Rewriter Class
class DomainRewriter {
  element(element) {
    // Look at href (links), src (images/scripts), and action (forms)
    const attributes = ['href', 'src', 'action'];
    
    for (const attr of attributes) {
      const value = element.getAttribute(attr);
      if (value) {
        // Swap the Elementor domain with your Cloudflare domain.
        // Note: We append "/blog" to the replacement so links like 
        // "/my-post" correctly map to "/blog/my-post" on your Pages site.
        const newValue = value.replace(
          "https://lltjwccw.elementor.cloud", 
          "https://travel-blog-6zi.pages.dev/blog"
        );
        element.setAttribute(attr, newValue);
      }
    }
  }
}

// 2. The Main Proxy Function
export async function onRequest(context) {
  const url = new URL(context.request.url);
  
  // Set the destination to your Elementor site
  url.hostname = "lltjwccw.elementor.cloud";

  // If you needed to strip "/blog" from the path earlier to prevent a 404, 
  // make sure you keep this line uncommented:
  url.pathname = url.pathname.replace(/^\/blog/, "");

  // Create the proxy request
  const proxyRequest = new Request(url.toString(), context.request);
  proxyRequest.headers.set("Host", "lltjwccw.elementor.cloud");
  
  // Fetch the original response from Elementor
  const response = await fetch(proxyRequest);

  // 3. Apply the HTMLRewriter before sending it to the user
  return new HTMLRewriter()
    .on('[href]', new DomainRewriter())
    .on('[src]', new DomainRewriter())
    .on('[action]', new DomainRewriter())
    .transform(response);
}
