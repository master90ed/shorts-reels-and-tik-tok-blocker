// ==UserScript==
// @name         Disable YouTube Shorts (Mobile)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hides YouTube Shorts on mobile YouTube
// @match        *://m.youtube.com/*
// @match        *://www.youtube.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
  const SHORTS_SELECTORS = [
    // Shorts shelf / section
    'ytm-rich-section-renderer',       // Shorts shelf on home
    'ytm-reel-shelf-renderer',         // Reels/Shorts shelf
    'ytm-shorts-lockup-view-model',    // Individual short card
    '[is-shorts]',                     // Shorts flagged elements
    'ytm-pivot-bar-item-renderer[tab-identifier="FEshorts"]', // Bottom nav Shorts tab
  ];

  const CSS = `
    /* Hide Shorts shelf and cards */
    ytm-rich-section-renderer:has(ytm-reel-shelf-renderer),
    ytm-reel-shelf-renderer,
    ytm-shorts-lockup-view-model,
    [is-shorts],
    ytm-pivot-bar-item-renderer[tab-identifier="FEshorts"] {
      display: none !important;
    }
  `;

  // Inject CSS immediately
  function injectCSS() {
    const style = document.createElement('style');
    style.textContent = CSS;
    (document.head || document.documentElement).appendChild(style);
  }

  // Remove Shorts elements from DOM
  function removeShorts() {
    SHORTS_SELECTORS.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        // If it's the Shorts nav tab, just hide it
        el.style.setProperty('display', 'none', 'important');
      });
    });

    // Redirect if user lands on a /shorts/ URL
    if (location.pathname.startsWith('/shorts/')) {
      const videoId = location.pathname.split('/shorts/')[1].split('?')[0];
      location.replace(`/watch?v=${videoId}`);
    }
  }

  // Observe DOM changes (YouTube is a SPA, content loads dynamically)
  function observeDOM() {
    const observer = new MutationObserver(() => removeShorts());
    observer.observe(document.body, { childList: true, subtree: true });
  }

  injectCSS();
  document.addEventListener('DOMContentLoaded', () => {
    removeShorts();
    observeDOM();
  });

  // Also run on YouTube's SPA navigation events
  window.addEventListener('yt-navigate-finish', removeShorts);
  window.addEventListener('yt-page-data-updated', removeShorts);
})();
