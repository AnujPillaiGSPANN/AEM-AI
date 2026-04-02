/* eslint-disable */
/* global WebImporter */

/**
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
