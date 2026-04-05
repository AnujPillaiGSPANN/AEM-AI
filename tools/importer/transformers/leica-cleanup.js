/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Leica Microsystems site-wide cleanup.
 * Selectors from captured DOM of https://www.leica-microsystems.com/applications/education/
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove cookie consent, modals, and overlays that may block parsing
    WebImporter.DOMUtils.remove(element, [
      '.t3m-Modal',
      '[id*="CybotCookiebot"]',
      '[class*="cookie"]',
      '#onetrust-consent-sdk',
    ]);
  }

  if (hookName === H.after) {
    // Remove site header (navigation, logo, utility bar, search, language menu)
    WebImporter.DOMUtils.remove(element, [
      '#t3m-Header--main',
      '.t3m-Header',
      '.t3m-MainNavigation',
      '#t3m-Modal--mobileNavigation',
      '#t3m-Modal--languageMenu',
    ]);

    // Remove footer and partner logos bar (site chrome, not page content)
    WebImporter.DOMUtils.remove(element, [
      'footer',
      '[role="contentinfo"]',
    ]);

    // Remove non-authorable elements
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'link',
      'noscript',
      'script',
      '[class*="t3m-hide-for-print"]',
    ]);

    // Remove tracking pixels and ad images
    element.querySelectorAll('img').forEach((img) => {
      const src = img.getAttribute('src') || '';
      if (src.includes('google.com/pagead')
        || src.includes('clarity.ms')
        || src.includes('ads.linkedin.com')
        || src.includes('bat.bing.com')
        || src.includes('px.ads.linkedin')
        || src.startsWith('data:image/svg+xml')) {
        img.remove();
      }
    });

    // Clean data attributes
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-di-res-id');
      el.removeAttribute('data-di-rand');
      el.removeAttribute('data-track');
      el.removeAttribute('onclick');
    });

    // Remove "Scroll to top" link
    const scrollTop = element.querySelector('a[href="#t3m-SiteWrapper"]');
    if (scrollTop) scrollTop.remove();
 * Transformer: Leica Microsystems cleanup
 * Selectors from captured DOM of https://www.leica-microsystems.com/contact/contact-us-online/
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove modals/overlays and non-content chrome early (from captured DOM)
    WebImporter.DOMUtils.remove(element, [
      '#t3m-Modal--closeContactFormConfirmation', // Contact form confirmation modal
      '#t3m-Modal--mobileNavigation',             // Mobile nav overlay
      '#t3m-Modal--languageMenu',                 // Language selector modal
      '.t3m-Modal--slideDown',                    // Slide-down modals
      '#onetrust-consent-sdk',                    // OneTrust cookie consent banner
      'footer + div',                             // Danaher brands bar (must remove before footer)
      '[id^="batBeacon"]',                        // Bing tracking pixels
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable site chrome (from captured DOM)
    WebImporter.DOMUtils.remove(element, [
      '#t3m-Header--main',         // Main header with logo, nav, search
      '#dmf-element-1',            // Online shop bar (Login, Cart, Quote Cart)
      'footer',                    // Site footer (Danaher logo, Company/Legal links, social)
      'nav',                       // All nav elements (main nav, breadcrumb, mobile nav)
      '#t3m-ToTop',                // Scroll to top button
      'iframe',                    // Any iframes
      'link',                      // Link elements
      'noscript',                  // Noscript elements
    ]);
  }
}
