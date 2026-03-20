// ==UserScript==
// @name         Shorts & Reels Blocker
// @namespace    https://github.com/shorts-blocker
// @version      1.0
// @description  Blocks YouTube Shorts, Instagram Reels, and TikTok feed
// @author       Shorts Blocker
// @match        *://m.youtube.com/*
// @match        *://www.youtube.com/*
// @match        *://www.instagram.com/*
// @match        *://instagram.com/*
// @match        *://www.tiktok.com/*
// @match        *://tiktok.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  const host = location.hostname.replace('www.', '');

  // ─── YouTube Shorts ───────────────────────────────────────────
  if (host === 'youtube.com' || host === 'm.youtube.com') {
    injectCSS(`
      ytm-reel-shelf-renderer,
      ytm-shorts-lockup-view-model,
      [is-shorts],
      ytm-pivot-bar-item-renderer[tab-identifier="FEshorts"],
      ytm-rich-section-renderer:has(ytm-reel-shelf-renderer),
      a[title="Shorts"], a[href="/shorts"] {
        display: none !important;
      }
    `);

    function redirectShorts() {
      if (location.pathname.startsWith('/shorts/')) {
        const id = location.pathname.split('/shorts/')[1].split('?')[0];
        location.replace('/watch?v=' + id);
      }
    }

    observe(redirectShorts);
    window.addEventListener('yt-navigate-finish', redirectShorts);
    redirectShorts();
  }

  // ─── Instagram Reels ──────────────────────────────────────────
  if (host === 'instagram.com') {
    injectCSS(`
      a[href="/reels/"],
      a[href*="/reels"],
      [aria-label="Reels"],
      [data-visualcompletion="ignore-dynamic"]:has(a[href*="/reel/"]) {
        display: none !important;
      }
    `);

    function redirectReels() {
      if (location.pathname.startsWith('/reels')) {
        location.replace('/');
      }
    }

    observe(redirectReels);
    redirectReels();
  }

  // ─── TikTok Feed ──────────────────────────────────────────────
  if (host === 'tiktok.com') {
    injectCSS(`
      [data-e2e="recommend-list-item-container"],
      [class*="DivVideoFeedV2"],
      [class*="DivItemContainer"],
      [class*="VideoFeed"] {
        display: none !important;
      }
    `);
  }

  // ─── Helpers ──────────────────────────────────────────────────
  function injectCSS(css) {
    const style = document.createElement('style');
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
  }

  function observe(fn) {
    new MutationObserver(fn).observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

})();
