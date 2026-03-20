const SCRIPTS = {
  yt: `// ==UserScript==
// @name         Block YouTube Shorts
// @match        *://m.youtube.com/*
// @match        *://www.youtube.com/*
// @run-at       document-start
// ==/UserScript==
(function () {
  const css = \`
    ytm-reel-shelf-renderer,
    ytm-shorts-lockup-view-model,
    [is-shorts],
    ytm-pivot-bar-item-renderer[tab-identifier="FEshorts"],
    ytm-rich-section-renderer:has(ytm-reel-shelf-renderer) {
      display: none !important;
    }
  \`;
  const s = document.createElement('style');
  s.textContent = css;
  (document.head || document.documentElement).appendChild(s);
  function check() {
    if (location.pathname.startsWith('/shorts/')) {
      const id = location.pathname.split('/shorts/')[1].split('?')[0];
      location.replace('/watch?v=' + id);
    }
  }
  new MutationObserver(check).observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener('yt-navigate-finish', check);
  check();
})();`,

  ig: `// ==UserScript==
// @name         Block Instagram Reels
// @match        *://www.instagram.com/*
// @match        *://instagram.com/*
// @run-at       document-start
// ==/UserScript==
(function () {
  const css = \`
    a[href="/reels/"],
    [aria-label="Reels"],
    ._aagu:has(video),
    div[data-visualcompletion="media-vc-image"]:has(~ div video) {
      display: none !important;
    }
  \`;
  const s = document.createElement('style');
  s.textContent = css;
  (document.head || document.documentElement).appendChild(s);
  function check() {
    if (location.pathname.startsWith('/reels')) {
      location.replace('/');
    }
  }
  new MutationObserver(check).observe(document.documentElement, { childList: true, subtree: true });
  check();
})();`,

  tt: `// ==UserScript==
// @name         Block TikTok Feed
// @match        *://www.tiktok.com/*
// @match        *://tiktok.com/*
// @run-at       document-start
// ==/UserScript==
(function () {
  const css = \`
    .tiktok-feed-container,
    [data-e2e="recommend-list-item-container"],
    [class*="DivVideoFeedV2"],
    [class*="DivItemContainer"] {
      display: none !important;
    }
  \`;
  const s = document.createElement('style');
  s.textContent = css;
  (document.head || document.documentElement).appendChild(s);
})();`
};

const state = {
  yt: localStorage.getItem('block_yt') === 'true',
  ig: localStorage.getItem('block_ig') === 'true',
  tt: localStorage.getItem('block_tt') === 'true',
};

function isAnyActive() {
  return state.yt || state.ig || state.tt;
}

function applyUI() {
  document.body.classList.toggle('active', isAnyActive());
  document.getElementById('statusText').textContent = isAnyActive() ? 'ENABLED' : 'DISABLED';

  ['yt', 'ig', 'tt'].forEach(p => {
    document.getElementById('toggle-' + p).checked = state[p];
    document.getElementById('row-' + p).classList.toggle('on', state[p]);
    localStorage.setItem('block_' + p, state[p]);
  });
}

function masterToggle() {
  const turnOn = !isAnyActive();
  state.yt = state.ig = state.tt = turnOn;
  applyUI();
  showToast(turnOn ? 'All platforms blocked!' : 'All platforms unblocked');
}

function platformToggle(platform) {
  state[platform] = document.getElementById('toggle-' + platform).checked;
  applyUI();
  const names = { yt: 'YouTube Shorts', ig: 'Instagram Reels', tt: 'TikTok' };
  showToast(names[platform] + (state[platform] ? ' blocked ✓' : ' unblocked'));
}

function copyScripts() {
  const active = Object.keys(state).filter(p => state[p]);
  if (!active.length) {
    showToast('Enable at least one platform first');
    return;
  }
  const combined = active.map(p => SCRIPTS[p]).join('\n\n// ---\n\n');
  if (navigator.clipboard) {
    navigator.clipboard.writeText(combined).then(() => {
      showToast('Scripts copied! Paste into Tampermonkey');
    });
  } else {
    showToast('Copy manually from disable-shorts.js');
  }
}

function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = `
      position: fixed; bottom: 36px; left: 50%; transform: translateX(-50%);
      background: #1e1e35; color: #ccc; padding: 12px 20px;
      border-radius: 20px; font-size: 13px; text-align: center;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5); max-width: 280px;
      border: 1px solid #2a2a3e; z-index: 999; transition: opacity 0.3s;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.style.opacity = '0', 3000);
}

applyUI();
