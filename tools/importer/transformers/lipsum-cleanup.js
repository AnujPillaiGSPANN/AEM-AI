/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: lipsum.com cleanup.
 * Selectors from captured DOM of https://www.lipsum.com/
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove ad slots and banners that may interfere with block parsing
    // Found in captured HTML: <div class="banner">, ad container divs
    WebImporter.DOMUtils.remove(element, [
      '.banner',
      '#lipsumcom_header',
      '#lipsumcom_left_siderail',
      '#lipsumcom_right_siderail',
      '#lipsumcom_incontent',
      '#lipsumcom_leaderboard_bottom',
      '#bannerL',
      '#bannerR',
      'ins.adsbygoogle',
      '.primisslate',
      '.fs-sticky-footer',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable content
    // Found in captured HTML: #Languages (language selector bar), iframes, footer contact
    WebImporter.DOMUtils.remove(element, [
      '#Languages',
      'iframe',
      'link',
      'noscript',
    ]);

    // Remove the footer contact/legal box (last .boxed with email and privacy links)
    const allBoxed = element.querySelectorAll('.boxed');
    if (allBoxed.length > 0) {
      const lastBoxed = allBoxed[allBoxed.length - 1];
      const hasEmail = lastBoxed.querySelector('a[href*="mailto:"]');
      const hasPrivacy = lastBoxed.querySelector('a[href*="privacy"]');
      if (hasEmail || hasPrivacy) {
        lastBoxed.remove();
      }
    }

    // Remove the Do Not Sell button
    const pmLink = element.querySelector('#pmLink');
    if (pmLink) {
      const parent = pmLink.closest('div');
      if (parent) parent.remove();
    }

    // Clean up empty divs left by ad removal
    element.querySelectorAll('.up-hide').forEach((el) => el.remove());
  }
}
