// ==UserScript==
// @name         TuckIT — Keep Chat Context Visible [DEV Meta+DeepSeek Only]
// @namespace    https://github.com/RolanDorisTech/tuckit
// @version      0.0.1-dev-meta-deepseek-7n28-450ms
// @description  DEV proof-of-concept - Meta.ai + DeepSeek only. ChatGPT/Claude/Gemini/OpenWebUI disabled for stable release. Includes no-flicker paste + animated UnTuckIT + mimic drag-bar click fix.
// @supportURL   https://youtube.com/@RolanDorisTech
// @match        *://*.deepseek.com/*
// @match        *://deepseek.com/*
// @match        *://*.meta.ai/*
// @match        *://*.facebook.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-idle
// ==/UserScript==


(() => {
'use strict';
if (window.top!== window.self) return;

const host = location.hostname;
const isMeta = /meta.ai|facebook/i.test(host);
const isDeepSeek = /deepseek.com/i.test(host);
// DEV BUILD: explicitly disabled for stable release - keep vars false to prevent any ChatGPT/Claude/Gemini/OpenWebUI code paths from firing
const isChatGPT = false; // was /chatgpt.com|openai.com/i.test(host)
const isOpenWebUI = false; // was /localhost|127.0.0.1|open-webui|openwebui/i.test(...)
const isClaude = false;
const isGemini = false;
// Hard stop if not Meta or DeepSeek - dev release only
if (!isMeta && !isDeepSeek) { console.log('[TuckIT DEV] disabled on', host, '- Meta+DeepSeek only build'); return; }

const SELECTORS = isMeta
? 'div[data-lexical-editor="true"],div[contenteditable="true"][role="textbox"]'
  : 'textarea[placeholder="Message DeepSeek"],#prompt-textarea,#chat-textarea,textarea[name="prompt"],div[data-lexical-editor="true"],div[contenteditable="true"][role="textbox"]'; // DEV: trimmed Claude/Gemini/ProseMirror extras

const KEY = `tuckit_mode_${location.hostname}`;
const hasGM = typeof GM_getValue === 'function';
const save = m => hasGM? GM_setValue(KEY, m) : localStorage.setItem(KEY, m);

if (typeof GM_addStyle!== 'function') {
  window.GM_addStyle = c => {
    const s = document.createElement('style');
    s.textContent = c;
    document.head.appendChild(s);
  };
}

GM_addStyle(`
.tuckit-handle{position:absolute!important;left:0!important;right:0!important;top:0!important;height:6px!important;cursor:ns-resize!important;z-index:2147483646!important;display:flex!important;justify-content:center!important;touch-action:none!important;background:#083c48!important;border-radius:inherit!important;opacity:1!important;transition:opacity.3s ease, background.2s ease!important;box-sizing:border-box!important;max-width:100%!important}
.tuckit-handle:hover{background:#0a4e5e!important;opacity:1!important}
.tuckit-handle::before{content:''!important;position:absolute!important;top:-14px!important;bottom:-14px!important;left:0!important;right:0!important;background:transparent!important;pointer-events:none!important}
.tuckit-handle::after{content:''!important;width:40px!important;height:3px!important;border-radius:99px!important;background:rgba(255,255,255,.78)!important;margin-top:1.5px!important}
.tuckit-handle.tuckit-faded{opacity:0!important;pointer-events:auto!important}
.tuckit-toggle{position:absolute!important;top:12px!important;right:36px!important;width:28px!important;height:28px!important;border-radius:8px!important;background:#1dcbf2!important;color:#FFEE8C!important;border:1px solid rgba(0,0,0,.10)!important;z-index:2147483647!important;cursor:pointer!important;font-weight:900!important;box-shadow:0 1px 5px rgba(0,0,0,.18)!important;display:flex!important;align-items:center!important;justify-content:center!important;pointer-events:auto!important;touch-action:manipulation!important;user-select:none!important;transition:opacity.3s ease!important;opacity:1!important;flex-direction:column!important;padding:0!important;line-height:0!important}
.tuckit-toggle::before{content:''!important;position:absolute!important;top:-12px!important;bottom:-12px!important;left:-12px!important;right:-12px!important;background:transparent!important}
.tuckit-toggle.tuckit-faded{opacity:0!important;pointer-events:auto!important}
.tuckit-ico{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:3px!important;line-height:0!important;pointer-events:none!important}
.tuckit-tri{width:0!important;height:0!important;border-left:5px solid transparent!important;border-right:5px solid transparent!important;display:block!important}
.tuckit-tri.up{border-bottom:5px solid #FFEE8C!important}
.tuckit-tri.down{border-top:5px solid #FFEE8C!important}
.tuckit-wrap-fixed{transform:none!important;overflow:hidden!important;box-sizing:border-box!important;padding-top:14px!important;will-change:height!important;contain:layout paint!important}
.tuckit-wrap-fixed div{scrollbar-width:none!important}
.tuckit-wrap-fixed div::-webkit-scrollbar{width:0!important;height:0!important;display:none!important}
.tuckit-fat-scroll{scrollbar-width:auto!important;scrollbar-color:#6e6e6e rgba(0,0,0,0.12)!important}
.tuckit-fat-scroll::-webkit-scrollbar{width:20px!important;height:20px!important;display:block!important}
.tuckit-fat-scroll::-webkit-scrollbar-track{margin-top:44px!important}
.tuckit-wrap-fixed textarea,
.tuckit-wrap-fixed [contenteditable="true"],
.tuckit-wrap-fixed div[contenteditable="true"],
.tuckit-wrap-fixed div[data-lexical-editor="true"]{overflow-y:auto!important;overflow-x:hidden!important;scrollbar-width:auto!important;scrollbar-color:#6e6e6e rgba(0,0,0,0.12)!important;scrollbar-gutter:stable!important;padding-right:38px!important;box-sizing:border-box!important;margin-top:2px!important}
.tuckit-wrap-fixed textarea::-webkit-scrollbar,
.tuckit-wrap-fixed [contenteditable="true"]::-webkit-scrollbar,
.tuckit-wrap-fixed div[contenteditable="true"]::-webkit-scrollbar,
.tuckit-wrap-fixed div[data-lexical-editor="true"]::-webkit-scrollbar{width:20px!important;height:20px!important;display:block!important;background:transparent!important}
.tuckit-wrap-fixed textarea::-webkit-scrollbar-track,
.tuckit-wrap-fixed [contenteditable="true"]::-webkit-scrollbar-track,
.tuckit-wrap-fixed div[contenteditable="true"]::-webkit-scrollbar-track,
.tuckit-wrap-fixed div[data-lexical-editor="true"]::-webkit-scrollbar-track{background:rgba(0,0,0,0.10)!important;border-radius:10px!important;margin-top:44px!important;margin-bottom:4px!important}
.tuckit-wrap-fixed textarea::-webkit-scrollbar-thumb,
.tuckit-wrap-fixed [contenteditable="true"]::-webkit-scrollbar-thumb,
.tuckit-wrap-fixed div[contenteditable="true"]::-webkit-scrollbar-thumb,
.tuckit-wrap-fixed div[data-lexical-editor="true"]::-webkit-scrollbar-thumb{background:#8a8a8a!important;background-clip:content-box!important;border:4px solid transparent!important;border-right-width:0px!important;border-radius:12px!important;min-height:60px!important}
.tuckit-gpt-scroll{padding-right:16px!important;scrollbar-gutter:stable!important}
.tuckit-gpt-scroll::-webkit-scrollbar{width:12px!important;display:block!important}
.tuckit-gpt-scroll::-webkit-scrollbar-track{background:rgba(0,0,0,0.10)!important;border-radius:10px!important;margin-top:0px!important;margin-bottom:4px!important}
.tuckit-gpt-scroll::-webkit-scrollbar-thumb{background:#8a8a8a!important;background-clip:content-box!important;border:2px solid transparent!important;border-right-width:0px!important;border-radius:10px!important;min-height:40px!important}
.tuckit-tip{position:fixed!important;z-index:2147483648!important;background:#111!important;color:#FFEE8C!important;padding:5px 9px!important;border-radius:6px!important;font-size:12px!important;font-weight:700!important;pointer-events:none!important;white-space:nowrap!important;display:none;border:1px solid rgba(255,238,140,.4)!important}
.tuckit-tip-hotkey{position:fixed!important;z-index:2147483647!important;background:#1a1a1a!important;color:#8a8a8a!important;padding:3px 6px!important;border-radius:4px!important;font-size:9px!important;font-weight:400!important;pointer-events:none!important;white-space:nowrap!important;display:none;border:1px solid rgba(255,255,255,.08)!important;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace!important;letter-spacing:.2px!important;opacity:0!important;transition:opacity.22s ease!important}
.tuckit-tip-hotkey.tuckit-visible{opacity:1!important}
#tuckit-toast{position:fixed!important;bottom:22px!important;left:50%!important;transform:translateX(-50%)!important;background:#111!important;color:#FFEE8C!important;padding:8px 14px!important;border-radius:8px!important;z-index:2147483649!important;font-size:12px!important;border:1px solid rgba(255,238,140,.4)!important;display:none;box-shadow:0 4px 12px rgba(0,0,0,.4)!important}
.tuckit-wrap-fixed [data-thumb="true"],
.tuckit-wrap-fixed [data-track="true"],
.tuckit-wrap-fixed [data-scrollbar-thumb],
.tuckit-wrap-fixed [data-scrollbar-track]{display:none!important;visibility:hidden!important;opacity:0!important;width:0!important;height:0!important;pointer-events:none!important}
.tuckit-ds-footer{position:absolute!important;bottom:0!important;left:0!important;right:0!important;z-index:6!important;background:inherit!important;margin:0!important;flex-shrink:0!important;overflow:hidden!important}
.tuckit-ds-textarea-wrap{overflow:hidden!important;display:flex!important;flex-direction:column!important;flex:0 1 auto!important;scrollbar-width:none!important;max-height:100%!important}
.tuckit-ds-textarea-wrap::-webkit-scrollbar{width:0!important;height:0!important;display:none!important}
.tuckit-ds-textarea-wrap > div{overflow:hidden!important;scrollbar-width:none!important}
.tuckit-ds-textarea-wrap > div::-webkit-scrollbar{width:0!important;display:none!important}
.tuckit-ds-attach{flex-shrink:0!important;overflow:visible!important;min-height:110px!important;max-height:none!important;overflow-y:visible!important;scrollbar-width:none!important;display:block!important}
.tuckit-ds-attach::-webkit-scrollbar{width:0!important;height:0!important;display:none!important}
.tuckit-wrap-fixed[data-tuckit-deepseek] {overflow:hidden!important;scrollbar-width:none!important}
.tuckit-wrap-fixed[data-tuckit-deepseek]::-webkit-scrollbar{width:0!important;display:none!important}
.tuckit-wrap-fixed[data-tuckit-deepseek] > div:not(.tuckit-ds-textarea-wrap):not(.tuckit-ds-attach){overflow:hidden!important;scrollbar-width:none!important}
.tuckit-wrap-fixed[data-tuckit-deepseek] > div:not(.tuckit-ds-textarea-wrap):not(.tuckit-ds-attach)::-webkit-scrollbar{width:0!important;display:none!important}
${isChatGPT || isOpenWebUI? `
.tuckit-handle{width:140px!important;left:50%!important;right:auto!important;transform:translateX(-50%)!important;border-radius:99px!important}
.tuckit-handle::before{left:-24px!important;right:-24px!important}
` : ''}
`);

let expandHideStyle = null;
function addExpandHide() {
  if (!(isChatGPT || isOpenWebUI)) return;
  if (document.getElementById('tuckit-expand-hide')) return;
  const s = document.createElement('style');
  s.id = 'tuckit-expand-hide';
  s.textContent = 'button[aria-label="Expand"],button[aria-label="Expand composer"]{display:none!important}';
  document.head.appendChild(s);
  expandHideStyle = s;
}
function removeExpandHide() {
  const el = document.getElementById('tuckit-expand-hide');
  if (el) el.remove();
  if (expandHideStyle) { expandHideStyle.remove(); expandHideStyle = null; }
}

function isNewChat() {
  try {
    const path = location.pathname;
    const h = location.hostname;
    if (h.includes('chatgpt.com') || h.includes('openai.com')) {
      if (/\/c\/[a-zA-Z0-9-]+/.test(path)) return false;
      if (/\/g\/[^/]+\/c\//.test(path)) return false;
      if (path.includes('/share/')) return false;
      return true;
    }
    if (h.includes('claude.ai')) {
      if (path.startsWith('/chat/')) return false;
      if (path.startsWith('/c/')) return false;
      return true;
    }
    if (h.includes('deepseek.com')) {
      if (path.includes('/a/chat/s/')) return false;
      if (/\/chat\//.test(path) && path.length > 10) return false;
      return true;
    }
    if (h.includes('meta.ai')) {
      if (/^\/(c|prompt|create)\//.test(path)) return false;
      return true;
    }
    if (h.includes('facebook.com')) {
      if (path === '/' || path === '' || path.startsWith('/ai')) return true;
      return false;
    }
    if (h.includes('gemini.google.com') || h.includes('bard.google.com')) {
      const m = path.match(/^\/app\/([^/?]+)/);
      if (!m) return true;
      const seg = m[1];
      if (['extensions','settings','download','mobile','gems','history'].includes(seg)) return true;
      return seg.length < 10;
    }
    if (h.includes('aistudio.google.com')) {
      if (path.includes('/prompts/new_chat')) return true;
      if (path === '/' || path === '/prompts' || path === '/prompts/') return true;
      if (/\/prompts\/[^/]{6,}/.test(path)) return false;
      return true;
    }
    if (isOpenWebUI) {
      if (path === '/' || path === '' || path === '/chats' || path === '/chat' || path === '/c/new' || path === '/c' || path.endsWith('/new')) return true;
      if (/\/c\/[a-zA-Z0-9_-]+/.test(path)) return false;
      if (/\/chat\/[a-zA-Z0-9_-]+/.test(path)) return false;
      if (/\/chats\/[a-zA-Z0-9_-]+/.test(path)) return false;
      return !/[a-f0-9]{8,}/i.test(path);
    }
    return false;
  } catch { return false; }
}
function isPrevNewChat(prevHref) {
  try {
    const url = new URL(prevHref);
    const p = url.pathname;
    const h = url.hostname;
    if (h.includes('meta.ai')) {
      if (/^\/(c|prompt|create)\//.test(p)) return false;
      return true;
    }
    if (h.includes('facebook.com')) return p === '/' || p === '';
    return false;
  } catch { return false; }
}

let _metaResponseObserver = null;
let _metaResponseTimer = null;
let _metaTransitionPoll = null;
let _metaTransitionFromHome = false;
const META_RESPONSE_BOOT_DELAY = 2500;
const META_FALLBACK_TOTAL = 8500;

function cleanupMetaResponseWait() {
  if (_metaResponseObserver) { try { _metaResponseObserver.disconnect(); } catch {} _metaResponseObserver = null; }
  if (_metaResponseTimer) { clearTimeout(_metaResponseTimer); _metaResponseTimer = null; }
  if (_metaTransitionPoll) { clearInterval(_metaTransitionPoll); _metaTransitionPoll = null; }
  _metaTransitionFromHome = false;
  stopNewChatWatcher();
}
function bootMetaAfterFirstResponse() {
  if (!isMeta) { bootNow(false); return; }
  cleanupTuckIT();
  cleanupMetaResponseWait();
  removeExpandHide();
  _metaTransitionFromHome = true;
  _metaResponseTimer = setTimeout(() => {
    _metaResponseTimer = null;
    _metaTransitionFromHome = false;
    bootNow(false);
    showToast('TuckIT loaded — refresh (Ctrl+R) if crooked');
  }, META_FALLBACK_TOTAL);
  let thinkingSeen = false;
  const hasThinking = () => {
    try { return!!Array.from(document.querySelectorAll('button')).find(b => (b.textContent || '').trim() === 'Thinking'); }
    catch { return false; }
  };
  _metaResponseObserver = new MutationObserver(() => {
    if (hasThinking()) thinkingSeen = true;
    if (thinkingSeen &&!hasThinking()) {
      if (_metaResponseObserver) { try { _metaResponseObserver.disconnect(); } catch {} _metaResponseObserver = null; }
      if (_metaResponseTimer) { clearTimeout(_metaResponseTimer); _metaResponseTimer = null; }
      _metaResponseTimer = setTimeout(() => {
        _metaResponseTimer = null;
        _metaTransitionFromHome = false;
        bootNow(false);
      }, META_RESPONSE_BOOT_DELAY);
    }
  });
  try { _metaResponseObserver.observe(document.documentElement, { childList: true, subtree: true }); } catch {}
}

const isEditable = el => el && (el.tagName === 'TEXTAREA' || el.isContentEditable || el.getAttribute?.('contenteditable') === 'true');

let seen = new WeakSet();
let dragging = null;
let lastExpanded = 0;
let activeWrap = null;
let activeBtn = null;
let tipEl = null;
let hotkeyTipEl = null;
let hotkeyTipElK = null;
let handleSecondTipEl = null;
let hotkeyTimer = null;
let tipHideTimer = null;
let rafPending = false;
let lastMoveEvent = null;
let lastToggleAt = 0;

let tuckitDisabled = hasGM? GM_getValue('tuckit_disabled', false) : localStorage.getItem('tuckit_disabled') === '1';
let _forceMinimalUntil = 0;
const BOOT_SINGLE_DELAY = 1000;
const TOGGLE_SINGLE_DELAY = 2700;
let _lastCaret = { el: null, range: null, taStart: null, taEnd: null, time: 0 };
let _metaHomeBootTimer = null;
let _newChatWatcher = null;
let _newChatWatcherTries = 0;

function saveCaretFromEl(el) {
  try {
    if (!el) return;
    if (el.tagName === 'TEXTAREA') { _lastCaret = { el, taStart: el.selectionStart, taEnd: el.selectionEnd, range: null, time: Date.now() }; return; }
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const r = sel.getRangeAt(0);
      if (el.contains(r.commonAncestorContainer) || el === r.commonAncestorContainer || el.contains(r.startContainer)) {
        _lastCaret = { el, range: r.cloneRange(), taStart: null, taEnd: null, time: Date.now() };
      }
    }
  } catch {}
}
document.addEventListener('selectionchange', () => {
  try {
    const sel = window.getSelection(); if (!sel || sel.rangeCount === 0) return;
    const an = sel.anchorNode; if (!an) return;
    const el = an.nodeType === 1? an : an.parentElement; if (!el) return;
    const editable = el.closest? el.closest('div[data-lexical-editor="true"],div[contenteditable="true"][role="textbox"],div[contenteditable="true"]') : null;
    if (editable) saveCaretFromEl(editable);
  } catch {}
});
document.addEventListener('keyup', e => { if (isEditable(e.target)) saveCaretFromEl(e.target); });
document.addEventListener('mouseup', e => { if (isEditable(e.target)) setTimeout(() => saveCaretFromEl(e.target), 10); });
document.addEventListener('focusin', e => { if (isEditable(e.target)) saveCaretFromEl(e.target); });

function manualScrollContentEditableIntoView(ed, mode) {
  try {
    if (mode === 'first') { ed.scrollTop = 0; ed.scrollLeft = 0; const wrap = ed.closest('.tuckit-wrap-fixed'); if (wrap) wrap.scrollTop = 0; if (ed.parentElement) ed.parentElement.scrollTop = 0; return; }
    // For normal caret, avoid expensive marker insert during large paste — just ensure caret near bottom is visible via native
    const sel = window.getSelection(); if (!sel || sel.rangeCount === 0) return;
    const originalRange = sel.getRangeAt(0).cloneRange(); const caretRange = originalRange.cloneRange(); caretRange.collapse(false);
    const marker = document.createElement('span'); marker.textContent = '\u200b'; marker.style.cssText = 'display:inline;width:0;height:1em;'; let inserted = false;
    try { caretRange.insertNode(marker); inserted = true; } catch { inserted = false; }
    if (inserted) { marker.scrollIntoView({ block: 'nearest', inline: 'nearest' }); const p = marker.parentNode; if (p) { p.removeChild(marker); p.normalize(); } try { sel.removeAllRanges(); sel.addRange(originalRange); } catch {} }
  } catch {}
}
function getMirrorDiv(ta) {
  if (ta._tuckitMirror && ta._tuckitMirror.isConnected) return ta._tuckitMirror;
  const div = document.createElement('div');
  const cs = getComputedStyle(ta);
  ['boxSizing','width','fontFamily','fontSize','fontWeight','fontStyle','letterSpacing','textTransform','wordSpacing','textIndent','paddingTop','paddingRight','paddingBottom','paddingLeft','borderTopWidth','borderRightWidth','borderBottomWidth','borderLeftWidth','lineHeight'].forEach(p => { div.style[p] = cs[p]; });
  div.style.position = 'absolute'; div.style.visibility = 'hidden'; div.style.top = '-9999px'; div.style.left = '-9999px'; div.style.height = 'auto'; div.style.whiteSpace = 'pre-wrap'; div.style.wordWrap = 'break-word';
  document.body.appendChild(div); ta._tuckitMirror = div; return div;
}
function manualScrollTextareaIntoView(ta, mode) {
  try {
    if (mode === 'first') { ta.scrollTop = 0; ta.scrollLeft = 0; const wrap = ta.closest('.tuckit-wrap-fixed'); if (wrap) wrap.scrollTop = 0; return; }
    // For large paste, keep scroll at bottom, not center — prevents flicker
    if (ta.value.length > 2000) { ta.scrollTop = ta.scrollHeight; return; }
    const pos = ta.selectionEnd; if (pos == null) return;
    const div = getMirrorDiv(ta); div.style.width = ta.clientWidth + 'px';
    const before = ta.value.substring(0, pos); const after = ta.value.substring(pos) || '.';
    div.textContent = ''; div.appendChild(document.createTextNode(before));
    const marker = document.createElement('span'); marker.textContent = '\u200b'; div.appendChild(marker); div.appendChild(document.createTextNode(after));
    const markerTop = marker.offsetTop; const markerHeight = marker.offsetHeight || parseFloat(getComputedStyle(ta).lineHeight) || 20;
    const target = Math.max(0, markerTop - (ta.clientHeight / 2) + markerHeight / 2);
    ta.scrollTop = Math.min(Math.max(0, div.scrollHeight - ta.clientHeight), target);
  } catch {}
}
function tuckitScrollToCursor(el, mode = 'caret') {
  if (!el) return;
  try { el.focus({ preventScroll: true }); } catch { try { el.focus(); } catch {} }
  if (el.tagName === 'TEXTAREA') manualScrollTextareaIntoView(el, mode);
  else manualScrollContentEditableIntoView(el, mode);
}
function scheduleSingleFirstAfterRefresh(el, mode) {
  if (!el) return;
  if (el._tuckitBootTimer) clearTimeout(el._tuckitBootTimer);
  const exec = () => {
    try { el.scrollTop = 0; el.scrollLeft = 0; const wrap = el.closest('.tuckit-wrap-fixed'); if (wrap) { wrap.scrollTop = 0; wrap.style.setProperty('padding-top','14px','important'); } if (el.parentElement) el.parentElement.scrollTop = 0; } catch {}
    tuckitScrollToCursor(el, mode);
  };
  if (document.readyState === 'complete') el._tuckitBootTimer = setTimeout(exec, BOOT_SINGLE_DELAY);
  else { window.addEventListener('load', () => { el._tuckitBootTimer = setTimeout(exec, BOOT_SINGLE_DELAY); }, { once: true }); el._tuckitBootTimer = setTimeout(exec, BOOT_SINGLE_DELAY + 500); }
}
function getTip() { if (!tipEl) { tipEl = document.createElement('div'); tipEl.className = 'tuckit-tip'; document.body.appendChild(tipEl); } return tipEl; }
function getHotkeyTip() { if (!hotkeyTipEl) { hotkeyTipEl = document.createElement('div'); hotkeyTipEl.className = 'tuckit-tip-hotkey'; document.body.appendChild(hotkeyTipEl); } return hotkeyTipEl; }
function getHotkeyTipK() { if (!hotkeyTipElK) { hotkeyTipElK = document.createElement('div'); hotkeyTipElK.className = 'tuckit-tip-hotkey'; document.body.appendChild(hotkeyTipElK); } return hotkeyTipElK; }
function getHandleSecondTip() { if (!handleSecondTipEl) { handleSecondTipEl = document.createElement('div'); handleSecondTipEl.className = 'tuckit-tip-hotkey'; document.body.appendChild(handleSecondTipEl); } return handleSecondTipEl; }

function positionCenteredAbove(tipNode, wrap, extraUp) {
  if (!wrap ||!tipNode) return;
  const r = wrap.getBoundingClientRect();
  tipNode.style.setProperty('display','block','important');
  requestAnimationFrame(() => {
    const w = tipNode.offsetWidth;
    const h = tipNode.offsetHeight;
    let left = r.left + r.width / 2 - w / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - w - 8));
    let top = r.top - h - 10 - (extraUp || 0);
    if (top < 8) top = 8;
    tipNode.style.setProperty('left', left + 'px', 'important');
    tipNode.style.setProperty('top', top + 'px', 'important');
  });
}
function showHandleOff(wrap) {
  const t = getHotkeyTipK();
  t.textContent = 'TuckIT OFF: Ctrl + Shift + K';
  positionCenteredAbove(t, wrap, 0);
  t.classList.add('tuckit-visible');
}
function showHandleRefresh(wrap) {
  const first = getHotkeyTipK();
  const second = getHandleSecondTip();
  second.textContent = 'If crooked, refresh (Cmd + R/Ctrl + R)';
  if (first.style.display!== 'none' && first.classList.contains('tuckit-visible')) {
    const fr = first.getBoundingClientRect();
    second.style.setProperty('display','block','important');
    requestAnimationFrame(() => {
      const sw = second.offsetWidth;
      const sh = second.offsetHeight;
      let left = fr.left + fr.width / 2 - sw / 2;
      left = Math.max(8, Math.min(left, window.innerWidth - sw - 8));
      const top = fr.top - sh - 8;
      second.style.setProperty('left', left + 'px', 'important');
      second.style.setProperty('top', top + 'px', 'important');
      second.classList.add('tuckit-visible');
    });
  } else {
    positionCenteredAbove(second, wrap, 30);
    second.classList.add('tuckit-visible');
  }
}
function hideHandleTips() {
  if (hotkeyTipElK) { hotkeyTipElK.classList.remove('tuckit-visible'); hotkeyTipElK.style.setProperty('display','none','important'); }
  if (handleSecondTipEl) { handleSecondTipEl.classList.remove('tuckit-visible'); handleSecondTipEl.style.setProperty('display','none','important'); }
  document.querySelectorAll('.tuckit-wrap-fixed').forEach(w => {
    w._handleTooltipsScheduled = false;
    clearTimeout(w._offTimer);
    clearTimeout(w._refreshTimer);
  });
}
function hideButtonTips() {
  if (tipEl) tipEl.style.setProperty('display','none','important');
  if (hotkeyTipEl) { hotkeyTipEl.classList.remove('tuckit-visible'); hotkeyTipEl.style.setProperty('display','none','important'); }
  clearTimeout(window._btnSecondTimer);
  if (hotkeyTimer) { clearTimeout(hotkeyTimer); hotkeyTimer = null; }
}
function hideAllTips() {
  hideHandleTips();
  hideButtonTips();
  if (tipHideTimer) { clearTimeout(tipHideTimer); tipHideTimer = null; }
}
function showButtonFirst(e) {
  const btn = e.currentTarget;
  const first = getTip();
  const state = btn? btn.dataset.state : 'collapsed';
  first.textContent = state === 'expanded'? 'TuckIT' : 'UnTuckIT';
  first.style.setProperty('display','block','important');
  first.style.setProperty('left', (e.clientX + 12) + 'px', 'important');
  first.style.setProperty('top', (e.clientY - 28) + 'px', 'important');
  if (tipHideTimer) clearTimeout(tipHideTimer);
  tipHideTimer = setTimeout(() => hideButtonTips(), 3500);
  clearTimeout(window._btnSecondTimer);
  window._btnSecondTimer = setTimeout(() => showButtonSecond(), 1000);
}
function showButtonSecond() {
  const first = getTip();
  const second = getHotkeyTip();
  if (first.style.display === 'none') return;
  second.textContent = '(Ctrl+Shift+L)';
  second.style.setProperty('display','block','important');
  requestAnimationFrame(() => {
    const fr = first.getBoundingClientRect();
    second.style.setProperty('left', fr.left + 'px', 'important');
    second.style.setProperty('top', (fr.bottom + 6) + 'px', 'important');
    second.classList.add('tuckit-visible');
  });
}
function moveButtonTips(e) {
  const first = getTip();
  if (first.style.display === 'none') return;
  first.style.setProperty('left', (e.clientX + 12) + 'px', 'important');
  first.style.setProperty('top', (e.clientY - 28) + 'px', 'important');
  const second = getHotkeyTip();
  if (second.style.display!== 'none' && second.classList.contains('tuckit-visible')) {
    const fr = first.getBoundingClientRect();
    second.style.setProperty('left', fr.left + 'px', 'important');
    second.style.setProperty('top', (fr.bottom + 6) + 'px', 'important');
  }
}

function showToast(msg) {
  let t = document.getElementById('tuckit-toast');
  if (!t) { t = document.createElement('div'); t.id = 'tuckit-toast'; document.body.appendChild(t); }
  t.textContent = msg; t.style.setProperty('display','block','important');
  clearTimeout(t._hide); t._hide = setTimeout(() => { t.style.setProperty('display','none','important'); }, 2500);
}
function setDisabled(dis) {
  tuckitDisabled = dis;
  if (hasGM) GM_setValue('tuckit_disabled', dis); else localStorage.setItem('tuckit_disabled', dis? '1' : '0');
  if (dis) { cleanupTuckIT(); cleanupMetaResponseWait(); removeExpandHide(); showToast('TuckIT OFF — Ctrl+Shift+K to turn ON'); }
  else { addExpandHide(); showToast('TuckIT ON — Ctrl+Shift+K to turn OFF'); setTimeout(() => boot(), 200); }
}
function preventAccentPicker(el) {
  if (el._tuckitAccentFixed) return; el._tuckitAccentFixed = true;
  const PROTECTED = new Set(['ArrowRight','ArrowLeft','ArrowUp','ArrowDown','Home','End','PageUp','PageDown','Backspace','Delete','Enter','Tab','Escape']);
  el.addEventListener('keydown', e => {
    if (e.isComposing) return; if (PROTECTED.has(e.key)) return; if (e.key.length!== 1) return;
    if (e.repeat &&!e.metaKey &&!e.ctrlKey &&!e.altKey) {
      try {
        e.preventDefault(); e.stopPropagation();
        if (el.isContentEditable) {
          try { document.execCommand('insertText', false, e.key); } catch {
            const sel = window.getSelection();
            if (sel && sel.rangeCount) { const r = sel.getRangeAt(0); r.deleteContents(); r.insertNode(document.createTextNode(e.key)); r.collapse(false); sel.removeAllRanges(); sel.addRange(r); }
          }
        } else if (el.tagName === 'TEXTAREA') {
          const s = el.selectionStart; const ee = el.selectionEnd; const v = el.value;
          el.value = v.slice(0, s) + e.key + v.slice(ee); el.selectionStart = el.selectionEnd = s + 1;
          el.dispatchEvent(new InputEvent('input', { bubbles: true }));
        }
      } catch {}
    }
  }, true);
}
const FAKE_SB = '[data-thumb="true"],[data-track="true"],[data-scrollbar-thumb],[data-scrollbar-track]';
function hideFakeScrollbars(wrap) { if (!isMeta ||!wrap) return; wrap.querySelectorAll(FAKE_SB).forEach(n => { n.style.setProperty('display','none','important'); }); }
function attachMetaFakeSbKiller(wrap) {
  if (!isMeta ||!wrap) return; if (wrap._metaSbObs) wrap._metaSbObs.disconnect(); let pending = 0;
  const obs = new MutationObserver(() => { if (pending) return; pending = requestAnimationFrame(() => { pending = 0; hideFakeScrollbars(wrap); }); });
  obs.observe(wrap, { childList: true, subtree: true, attributes: true, attributeFilter: ['style','class'] });
  wrap._metaSbObs = obs; hideFakeScrollbars(wrap);
}
function getMetaActionBarEl(wrap) {
  if (!wrap) return null;
  const r = wrap.getBoundingClientRect();
  const t = Array.from(wrap.querySelectorAll('button,div,span')).find(el => /Thinking/i.test((el.textContent || '').trim()) && el.textContent.trim().length < 20);
  if (t) {
    let cur = t;
    for (let i = 0; i < 6 && cur && cur!== wrap; i++) {
      const cr = cur.getBoundingClientRect();
      if (cr.height < 110 && cr.height > 28 && cr.bottom >= r.bottom - 40 && cur.querySelectorAll('button').length >= 1) return cur;
      cur = cur.parentElement;
    }
  }
  const cands = Array.from(wrap.querySelectorAll('div')).filter(d => { const cr = d.getBoundingClientRect(); return cr.height < 110 && cr.height > 28 && cr.bottom >= r.bottom - 30 && d.querySelectorAll('button').length >= 2; });
  cands.sort((a,b) => b.getBoundingClientRect().bottom - a.getBoundingClientRect().bottom);
  return cands[0] || null;
}
function getMetaBottomBarHeight(wrap) { const el = getMetaActionBarEl(wrap); return el? el.offsetHeight : 52; }
function fixMetaDoomScroll(wrap) {
  if (!isMeta || !wrap) return;
  try {
    const feed = discoverFeedScroller(wrap);
    if (feed) {
      feed.style.setProperty('overscroll-behavior','contain','important');
      const max = feed.scrollHeight - feed.clientHeight;
      if (max >= 0 && feed.scrollTop > max) feed.scrollTop = max;
      document.documentElement.style.setProperty('overflow','hidden','important');
      document.body.style.setProperty('overflow','hidden','important');
    } else {
      const maxWin = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      if (window.scrollY > maxWin) window.scrollTo(0, maxWin);
    }
  } catch {}
}
function unfixMetaDoomScroll() {
  try {
    document.documentElement.style.removeProperty('overflow');
    document.body.style.removeProperty('overflow');
  } catch {}
}
function getDeepSeekFooterEl(wrap) {
  if (!wrap) return null;
  try {
    let el = wrap.querySelector('.ec4f5d61');
    if (el && el !== wrap) {
      const rh = el.getBoundingClientRect().height;
      if (rh > 0 && rh < 140) return el;
    }
    const all = Array.from(wrap.querySelectorAll('div')).filter(d => d !== wrap);
    // Prefer small footer near bottom
    const small = all.filter(d => {
      const r = d.getBoundingClientRect();
      return r.height > 20 && r.height < 140 && r.width > 100;
    });
    for (let i = small.length - 1; i >= 0; i--) {
      const d = small[i];
      const t = d.textContent || '';
      if (t.includes('DeepThink') && d.querySelector('button')) return d;
    }
    // fallback: div with 2-4 buttons near bottom, small height
    const cands = small.filter(d => {
      const bc = d.querySelectorAll('button').length;
      return bc >= 2 && bc <= 5;
    });
    if (cands.length) {
      cands.sort((a,b) => b.getBoundingClientRect().bottom - a.getBoundingClientRect().bottom);
      return cands[0];
    }
  } catch {}
  return null;
}
function getDeepSeekFooterH(wrap) { try { const f = getDeepSeekFooterEl(wrap); if (!f || f === wrap) return 72; const h = Math.ceil(f.getBoundingClientRect().height); return (h > 0 && h < 140) ? h : 72; } catch { return 72; } }
function getDeepSeekTextareaWrap(el) { return el? el.parentElement : null; }
function getDeepSeekAttachmentEls(wrap) {
  if (!wrap) return []; const els = [];
  const seen = new Set();
  const addEl = (d) => {
    if (!d) return;
    let cur = d;
    while (cur && cur.parentElement!== wrap && cur.parentElement) cur = cur.parentElement;
    if (cur && cur.parentElement === wrap && !seen.has(cur)) { seen.add(cur); els.push(cur); }
  };
  wrap.querySelectorAll('div').forEach(d => {
    const t = d.textContent || '';
    if (t.includes('Paste original') || (t.includes('==UserScript==') && t.length < 300) || t.includes('ContextLock Project')) {
      addEl(d);
    }
  });
  wrap.querySelectorAll('div').forEach(d=>{
    if (d.querySelector('button') && /\.(txt|html|js|py|json|md|pdf|docx?|png|jpg|jpeg|webp|gif|bmp|svg)/i.test(d.textContent||'')) {
      if (d.getBoundingClientRect().height < 220) addEl(d);
    }
  });
  wrap.querySelectorAll('img').forEach(img=>{
    const r = img.getBoundingClientRect();
    if (r.width < 20 || r.height < 20) return;
    addEl(img.closest('div'));
  });
  wrap.querySelectorAll('div[style*="background-image"], canvas').forEach(c=>{
    const r = c.getBoundingClientRect();
    if (r.width > 60 && r.height > 60) addEl(c);
  });
  return els;
}
function getDeepSeekAttachmentH(wrap) {
  const els = getDeepSeekAttachmentEls(wrap); if (els.length === 0) return 0;
  let total = 0;
  els.forEach(e=>{
    let h = e.scrollHeight || e.getBoundingClientRect().height || 90;
    const img = e.querySelector('img');
    if (img) {
      const ir = img.getBoundingClientRect();
      const ih = Math.max(ir.height, img.naturalHeight || 0, 120);
      h = Math.max(h, ih + 24);
    }
    if (/(\.txt|\.html|\.js|\.py|\.json|\.md)/i.test(e.textContent||'')) {
      h = Math.max(h, 110);
    }
    total += h + 12;
  });
  const perChip = 130;
  const standardized = Math.max(total, els.length * perChip + 20, 140);
  return Math.min(standardized, 380);
}
function getDeepSeekBaseH(wrap) { const minH = getMinH(); const attachH = getDeepSeekAttachmentH(wrap); const footerH = getDeepSeekFooterH(wrap); return attachH > 0? Math.max(minH, attachH + 80 + footerH + 28) : minH; }
function getChatGPTFooterEl(wrap) {
  if (!wrap) return null;
  const btn = Array.from(wrap.querySelectorAll('button')).find(b => /Think/i.test(b.textContent || ''));
  if (!btn) { const plus = wrap.querySelector('button'); if (plus) return plus.closest('div'); return null; }
  let cur = btn.parentElement; for (let i = 0; i < 6 && cur && cur!== wrap; i++) { if (cur.getBoundingClientRect().height < 90) return cur; cur = cur.parentElement; }
  return btn.parentElement;
}
function getChatGPTFooterH(wrap) { const f = getChatGPTFooterEl(wrap); return f? Math.ceil(f.getBoundingClientRect().height) + 6 : 40; }
function pinChatGPTFooter(wrap) {
  if (!(isChatGPT || isOpenWebUI) ||!wrap) return; const f = getChatGPTFooterEl(wrap); if (!f) return;
  wrap.style.setProperty('display','flex','important'); wrap.style.setProperty('flex-direction','column','important');
  const ed = wrap.querySelector('div[contenteditable="true"], textarea, div.ProseMirror');
  if (ed) { ed.style.setProperty('flex','1 1 auto','important'); ed.style.setProperty('min-height','40px','important'); ed.style.setProperty('overflow-y','auto','important'); }
  f.style.setProperty('flex','0 0 auto','important'); f.style.setProperty('position','relative','important'); f.style.setProperty('margin-top','auto','important');
}
function hideDeadScrollbarsDeepSeek(wrap, el) {
  if (!isDeepSeek ||!wrap ||!el) return;
  const footer = getDeepSeekFooterEl(wrap);
  const attachEls = getDeepSeekAttachmentEls(wrap);
  const attachSet = new Set(attachEls);
  wrap.setAttribute('data-tuckit-deepseek','1');
  wrap.style.setProperty('overflow','hidden','important');
  wrap.style.setProperty('scrollbar-width','none','important');
  wrap.querySelectorAll(':scope > div').forEach(d => {
    if (d === el) return;
    if (d.contains(el)) {
      d.style.setProperty('overflow','hidden','important');
      d.style.setProperty('scrollbar-width','none','important');
      return;
    }
    if (attachSet.has(d)) {
      d.classList.add('tuckit-ds-attach');
      d.style.setProperty('min-height','110px','important');
      d.style.setProperty('max-height','none','important');
      d.style.setProperty('overflow','visible','important');
      d.style.setProperty('scrollbar-width','none','important');
      d.style.setProperty('display','block','important');
      return;
    }
    if (d === footer) return;
    // only hide direct children, not deep traversal every time — prevents thrash
    if (d.parentElement === wrap) {
      d.style.setProperty('overflow','hidden','important');
      d.style.setProperty('scrollbar-width','none','important');
    }
  });
  const tWrap = getDeepSeekTextareaWrap(el);
  if (tWrap) {
    tWrap.style.setProperty('overflow','hidden','important');
    tWrap.style.setProperty('scrollbar-width','none','important');
  }
}
function pinDeepSeekFooter(wrap) {
  if (!isDeepSeek ||!wrap) return; const f = getDeepSeekFooterEl(wrap); if (!f) return;
  const fh = Math.ceil(f.getBoundingClientRect().height) || 72;
  wrap.style.setProperty('position','relative','important'); wrap.style.setProperty('padding-bottom',(fh+10)+'px','important'); wrap.style.setProperty('box-sizing','border-box','important'); wrap.style.setProperty('overflow','hidden','important');
  f.classList.add('tuckit-ds-footer'); f.style.setProperty('position','absolute','important'); f.style.setProperty('bottom','0','important'); f.style.setProperty('left','0','important'); f.style.setProperty('right','0','important'); f.style.setProperty('z-index','6','important'); f.style.setProperty('background','inherit','important'); f.style.setProperty('overflow','hidden','important');
}
function attachDeepSeekDeadSbKiller(wrap, el) {
  if (!isDeepSeek ||!wrap) return; if (wrap._dsSbObs) wrap._dsSbObs.disconnect(); let pending = 0;
  const obs = new MutationObserver(() => {
    if (pending) return; pending = requestAnimationFrame(() => {
      pending = 0;
      // only if not currently syncing height — avoid flicker loop
      if (wrap._tuckitSyncing) return;
      hideDeadScrollbarsDeepSeek(wrap, el);
      pinDeepSeekFooter(wrap);
      if (wrap._tuckitAttachPoll) {
        const cnt = getDeepSeekAttachmentEls(wrap).length;
        if (cnt===0 && (wrap._tuckitLastAttachCount||0)>0) {
          wrap._tuckitLastAttachCount = 0;
        }
      }
    });
  });
  obs.observe(wrap, { childList: true, subtree: true, attributes: true, attributeFilter: ['style','class'] });
  wrap._dsSbObs = obs; hideDeadScrollbarsDeepSeek(wrap, el);
}
function makeFat(el, wrap) {
  if (!el) return; const isGPT = isChatGPT || isOpenWebUI;
  if (isGPT) {
    const h = wrap? wrap.offsetHeight : 0;
    if (h < 112) { el.classList.remove('tuckit-fat-scroll','tuckit-gpt-scroll'); el.style.removeProperty('padding-right'); return; }
    el.classList.add('tuckit-gpt-scroll'); el.classList.add('tuckit-fat-scroll');
    try { el.style.setProperty('padding-right','16px','important'); el.style.setProperty('box-sizing','border-box','important'); el.style.setProperty('scrollbar-gutter','stable','important'); el.style.setProperty('overflow-y','auto','important'); } catch {} return;
  }
  if (isDeepSeek) {
    el.classList.add('tuckit-fat-scroll');
    if (wrap) {
      wrap.classList.remove('tuckit-fat-scroll');
      wrap.style.setProperty('scrollbar-width','none','important');
      wrap.style.setProperty('overflow','hidden','important');
    }
    try {
      el.style.setProperty('padding-right','38px','important');
      el.style.setProperty('box-sizing','border-box','important');
      el.style.setProperty('scrollbar-gutter','stable','important');
      el.style.setProperty('overflow-y','auto','important');
      el.style.setProperty('overflow-x','hidden','important');
      el.style.setProperty('scrollbar-width','thin','important');
      el.style.setProperty('scrollbar-color','#6e6e6e rgba(0,0,0,0.12)','important');
      el.style.setProperty('min-height','60px','important');
    } catch {}
    return;
  }
  [el, wrap].forEach(c => { try { c.classList.add('tuckit-fat-scroll'); } catch {} });
  try { el.style.setProperty('padding-right','38px','important'); el.style.setProperty('box-sizing','border-box','important'); el.style.setProperty('scrollbar-gutter','stable','important'); } catch {}
}
function isEditorEmpty(el) {
  if (!el) return true; if (el.tagName === 'TEXTAREA') return!el.value || el.value.trim() === '';
  const txt = (el.innerText || el.textContent || '').trim(); if (txt.length > 0) return false;
  const html = (el.innerHTML || '').replace(/<br\s*\/?>/gi,'').replace(/<p[^>]*>(\s| )*<\/p>/gi,'').replace(/<div[^>]*>(\s| )*<\/div>/gi,'').trim(); return html === '';
}
function discoverFeedScroller(wrap) {
  if (wrap._tuckitFeedScroller) return wrap._tuckitFeedScroller;
  if (wrap._tuckitFeedScroller === null) return null;
  let cur = wrap.parentElement;
  for (let i = 0; i < 12 && cur && cur!== document.documentElement; i++) {
    try { const sh = cur.scrollHeight; const ch = cur.clientHeight; if (sh > ch + 200 && ch > 300) { const cs = getComputedStyle(cur); if (cs.overflowY === 'auto' || cs.overflowY === 'scroll') { wrap._tuckitFeedScroller = cur; return cur; } } } catch {}
    cur = cur.parentElement;
  }
  wrap._tuckitFeedScroller = null; return null;
}
function getWrap(el) {
  if (isMeta) {
    let cur = el.parentElement; const cands = [];
    for (let i = 0; i < 14 && cur && cur!== document.body; i++) {
      if (cur.isContentEditable || cur.getAttribute?.('contenteditable') === 'true') { cur = cur.parentElement; continue; }
      const r = cur.getBoundingClientRect();
      if (r.width > 320 && r.height < 300 && r.height > 60 && r.bottom >= innerHeight - 250) {
        const cs = getComputedStyle(cur); const hasBg = cs.backgroundColor!== 'rgba(0, 0, 0, 0)' && cs.backgroundColor!== 'transparent' && cs.backgroundColor!== '';
        const radius = parseFloat(cs.borderRadius) || parseFloat(cs.borderTopLeftRadius) || 0;
        if (hasBg && radius > 8) cands.push({ el: cur, area: r.width * r.height });
      }
      cur = cur.parentElement;
    }
    if (cands.length) { cands.sort((a,b) => a.area - b.area); return cands[0].el; }
    return el.closest('form') || el.parentElement;
  }
  if (isDeepSeek || isChatGPT || isOpenWebUI) {
    let cur = el.parentElement; const cands = [];
    for (let i = 0; i < 16 && cur && cur!== document.body; i++) {
      const r = cur.getBoundingClientRect();
      if (r.width > 320 && r.width < 900 && r.height > 40 && r.height < 700 && r.bottom >= innerHeight - 420) {
        try { const cs = getComputedStyle(cur); const bg = cs.backgroundColor; const hasBg = bg && bg!== 'rgba(0, 0, 0, 0)' && bg!== 'transparent' && bg!== ''; const radius = parseFloat(cs.borderRadius) || parseFloat(cs.borderTopLeftRadius) || 0; if (hasBg && radius > 10) cands.push({ el: cur, area: r.width * r.height }); } catch {}
      }
      cur = cur.parentElement;
    }
    if (cands.length) { cands.sort((a,b) => a.area - b.area); return cands[0].el; }
    return el.closest('form') || el.parentElement;
  }
  return el.closest('form') || el.parentElement;
}
function getMinH() { if (isChatGPT || isOpenWebUI) return 84; return 132; }
function computeMaxH() { const min = getMinH(); let pct = 0.85; if (isDeepSeek) pct = 0.62; else if (isChatGPT || isOpenWebUI) pct = 0.68; const raw = Math.floor(innerHeight * pct); return Math.max(raw, min * 2 + 20); }
function computeMinimalH(wrap, el) {
  try {
    const cs = el? getComputedStyle(el) : null; let lh = cs? parseFloat(cs.lineHeight) : NaN;
    if (!lh || isNaN(lh)) { const fs = cs? parseFloat(cs.fontSize) : 16; lh = fs * 1.5; }
    const minInput = lh * 2 + 14; let footerH = 0; let attachH = 0;
    if (isMeta) footerH = getMetaBottomBarHeight(wrap);
    else if (isDeepSeek) { footerH = getDeepSeekFooterH(wrap); attachH = getDeepSeekAttachmentH(wrap); }
    else if (isChatGPT || isOpenWebUI) footerH = getChatGPTFooterH(wrap); else footerH = 52;
    const h = Math.ceil(minInput + footerH + attachH + 20 + 8); return Math.max(h, getMinH());
  } catch { return getMinH(); }
}
function getFooterHForSync(wrap) { if (isMeta) return Number.isFinite(wrap._metaFooterH)? wrap._metaFooterH : getMetaBottomBarHeight(wrap); if (isDeepSeek) return getDeepSeekFooterH(wrap); if (isChatGPT || isOpenWebUI) return getChatGPTFooterH(wrap); return 40; }
function getAttachHForSync(wrap) { return isDeepSeek? getDeepSeekAttachmentH(wrap) : 0; }
function getEditorTargetH(wrap, target) { const footerH = getFooterHForSync(wrap); const attachH = getAttachHForSync(wrap); let extra = 12; if (isDeepSeek) extra = 20; else if (isMeta) extra = 12; else if (isChatGPT || isOpenWebUI) extra = 12; return Math.max(isDeepSeek? 80 : 40, target - footerH - attachH - extra - 8); }

function syncTuckSizes(wrap, el, target) {
  if (!wrap ||!el) return; if (wrap.dataset.locked!== '1') return; if (!Number.isFinite(target)) return;
  let finalTarget = target; const minH = wrap._origMin || getMinH(); const maxH = computeMaxH(); finalTarget = Math.max(minH, Math.min(maxH, finalTarget));
  // === NO-FLICKER GUARD: skip if height already within 2px ===
  if (Math.abs(wrap.offsetHeight - finalTarget) < 2 && wrap._tuckitLastAppliedH && Math.abs(wrap._tuckitLastAppliedH - finalTarget) < 2) {
    // still need to ensure editor height matches
    const footerH = getFooterHForSync(wrap); const attachH = getAttachHForSync(wrap); const expectedElH = getEditorTargetH(wrap, finalTarget);
    if (Math.abs(el.offsetHeight - expectedElH) < 2) return;
  }
  if (isDeepSeek) { pinDeepSeekFooter(wrap); hideDeadScrollbarsDeepSeek(wrap, el); } else if (isChatGPT || isOpenWebUI) pinChatGPTFooter(wrap);
  const footerH = getFooterHForSync(wrap); const attachH = getAttachHForSync(wrap); const elH = getEditorTargetH(wrap, finalTarget);
  wrap._tuckitSyncing = true;
  try {
    wrap.style.setProperty('height', `${finalTarget}px`, 'important'); wrap.style.setProperty('box-sizing','border-box','important');
    wrap._tuckitLastAppliedH = finalTarget;
    wrap._tuckitLastSyncTime = Date.now();
    if (isMeta) {
      wrap._metaFooterH = footerH;
      el.style.setProperty('height', `${elH}px`, 'important'); el.style.setProperty('max-height', `${elH}px`, 'important'); el.style.setProperty('min-height','40px','important'); el.style.setProperty('overflow-y','auto','important'); el.style.setProperty('overflow-x','hidden','important');
    } else if (isDeepSeek) {
      wrap.style.setProperty('padding-bottom', `${footerH + 10}px`, 'important');
      const tWrap = getDeepSeekTextareaWrap(el);
      const targetElH = Math.max(60, elH);
      if (tWrap) {
        tWrap.classList.add('tuckit-ds-textarea-wrap');
        tWrap.style.setProperty('height', `${targetElH}px`, 'important');
        tWrap.style.setProperty('max-height', `${targetElH}px`, 'important');
        tWrap.style.setProperty('min-height', `${targetElH}px`, 'important');
        tWrap.style.setProperty('overflow','hidden','important');
        tWrap.style.setProperty('display','flex','important');
        tWrap.style.setProperty('flex-direction','column','important');
      }
      el.style.setProperty('height', `${targetElH}px`, 'important');
      el.style.setProperty('max-height', `${targetElH}px`, 'important');
      el.style.setProperty('min-height','60px','important');
      el.style.setProperty('overflow-y','auto','important');
      el.style.setProperty('overflow-x','hidden','important');
      el.style.setProperty('flex','1 1 auto','important');
      pinDeepSeekFooter(wrap); hideDeadScrollbarsDeepSeek(wrap, el);
      makeFat(el, wrap);
    } else if (isChatGPT || isOpenWebUI) {
      const f = getChatGPTFooterEl(wrap); if (f) { f.style.setProperty('flex','0 0 auto','important'); f.style.setProperty('position','relative','important'); f.style.setProperty('margin-top','auto','important'); }
      el.style.setProperty('height', `${elH}px`, 'important'); el.style.setProperty('max-height', `${elH}px`, 'important'); el.style.setProperty('min-height','40px','important'); el.style.setProperty('flex','0 0 auto','important'); el.style.setProperty('overflow-y','auto','important'); el.style.setProperty('overflow-x','hidden','important'); el.style.setProperty('box-sizing','border-box','important');
    } else {
      el.style.setProperty('height', `${elH}px`, 'important'); el.style.setProperty('max-height', `${elH}px`, 'important'); el.style.setProperty('min-height','40px','important'); el.style.setProperty('overflow-y','auto','important'); el.style.setProperty('overflow-x','hidden','important');
    }
    if (isMeta) { hideFakeScrollbars(wrap); fixMetaDoomScroll(wrap); } makeFat(el, wrap);
    const btn = wrap.querySelector(':scope >.tuckit-toggle'); if (btn) updateTriangle(btn, wrap);
  } finally {
    // keep syncing flag for a tick to block observer loops
    setTimeout(()=>{ wrap._tuckitSyncing = false; }, 40);
  }
}
function installSyncObserver(wrap, el, btn) {
  if (!wrap ||!el) return; if (wrap._tuckitResizeObs) { try { wrap._tuckitResizeObs.disconnect(); } catch {} delete wrap._tuckitResizeObs; }
  if (typeof ResizeObserver!== 'function') return; let queued = false;
  const obs = new ResizeObserver(() => {
    if (queued || wrap._tuckitSyncing) return;
    if (Date.now() - (wrap._tuckitLastSyncTime||0) < 120) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false; if (!wrap.isConnected || wrap.dataset.locked!== '1') return;
      const minH = wrap._origMin || getMinH(); const maxH = computeMaxH();
      if (wrap._tuckitUserTucked) {
        const floor = Number.isFinite(wrap._tuckitManualFloor)? wrap._tuckitManualFloor : minH;
        const expectedElH = getEditorTargetH(wrap, floor);
        const wrapMismatch = Math.abs(wrap.offsetHeight - Math.min(maxH, Math.max(minH, floor))) > 3;
        const elMismatch = Math.abs(el.offsetHeight - expectedElH) > 3;
        if (wrapMismatch || elMismatch) syncTuckSizes(wrap, el, floor); return;
      }
      const currentTarget = Number.isFinite(wrap._tuckitManualFloor)? wrap._tuckitManualFloor : 0;
      if (currentTarget > 0) queueAutoResize(el, wrap, btn, {});
    });
  });
  obs.observe(wrap); obs.observe(el); wrap._tuckitResizeObs = obs;
}
function renderToggleIcon(btn, state) {
  if (!btn) return; btn.innerHTML = ''; const ico = document.createElement('span'); ico.className = 'tuckit-ico ' + (state === 'expanded'? 'together' : 'apart');
  const t1 = document.createElement('span'); const t2 = document.createElement('span'); t1.className = 'tuckit-tri'; t2.className = 'tuckit-tri';
  if (state === 'expanded') { t1.classList.add('down'); t2.classList.add('up'); } else { t1.classList.add('up'); t2.classList.add('down'); }
  ico.appendChild(t1); ico.appendChild(t2); btn.appendChild(ico);
}
function updateTriangle(btn, wrap) {
  if (!btn ||!wrap) return; let state = 'collapsed';
  if ((isChatGPT || isOpenWebUI) && wrap.offsetHeight < 90) { btn.style.setProperty('display','none','important'); btn.dataset.state = 'collapsed'; renderToggleIcon(btn,'collapsed'); return; }
  else if (isChatGPT || isOpenWebUI) btn.style.setProperty('display','flex','important');
  const max = computeMaxH();
  if (isDeepSeek) { const base = getDeepSeekBaseH(wrap); const attachH = getDeepSeekAttachmentH(wrap); const thresh = attachH > 0? base + 40 : max * 0.5; if (wrap.offsetHeight > thresh) state = 'expanded'; }
  else { if (wrap.offsetHeight > max * 0.5) state = 'expanded'; }
  btn.dataset.state = state; renderToggleIcon(btn, state);
}
function captureInline(wrap) {
  return { position: wrap.style.position, left: wrap.style.left, right: wrap.style.right, width: wrap.style.width, top: wrap.style.top, bottom: wrap.style.bottom, inset: wrap.style.inset, margin: wrap.style.margin, transform: wrap.style.transform, overflow: wrap.style.overflow, boxSizing: wrap.style.boxSizing, zIndex: wrap.style.zIndex, height: wrap.style.height, display: wrap.style.display, flexDirection: wrap.style.flexDirection, justifyContent: wrap.style.justifyContent, paddingBottom: wrap.style.paddingBottom, paddingTop: wrap.style.paddingTop };
}
function restoreInline(wrap, o) { if (!o) return; for (const [p, v] of Object.entries(o)) { const cp = p.replace(/[A-Z]/g, m => '-' + m.toLowerCase()); if (v) wrap.style.setProperty(cp, v); else wrap.style.removeProperty(cp); } }

function getDeepSeekInputTwoLinesH(el) {
  try {
    const cs = getComputedStyle(el);
    let lh = parseFloat(cs.lineHeight);
    if (!lh || isNaN(lh)) { const fs = parseFloat(cs.fontSize) || 16; lh = fs * 1.5; }
    return Math.ceil(lh * 2 + 18);
  } catch { return 80; }
}
function maybeExpandForFirstDragAttachment(wrap, el, btn) {
  if (!isDeepSeek || !wrap || !el) return false;
  if (wrap._tuckitSyncing) return false;
  if (wrap._tuckitFirstAttachHandledThisTurn) {
    wrap._tuckitLastAttachCount = getDeepSeekAttachmentEls(wrap).length;
    return false;
  }
  const attachEls = getDeepSeekAttachmentEls(wrap);
  const count = attachEls.length;
  const prev = wrap._tuckitLastAttachCount || 0;
  if (!(count > 0 && prev === 0)) {
    wrap._tuckitLastAttachCount = count;
    return false;
  }
  if (!wrap._tuckitDragArmed && !wrap._tuckitPasteArmed) {
    wrap._tuckitLastAttachCount = count;
    return false;
  }
  const attachH = getDeepSeekAttachmentH(wrap);
  const footerH = getDeepSeekFooterH(wrap);
  const input2H = getDeepSeekInputTwoLinesH(el);
  const extra = 20;
  const buf = 36;
  let target = attachH + input2H + footerH + extra + buf;
  const minH = wrap._origMin || getMinH();
  const maxH = computeMaxH();
  const baseH = getDeepSeekBaseH(wrap);
  target = Math.max(target, baseH, minH + 20);
  target = Math.min(target, maxH);

  lockBottom(wrap);
  wrap._tuckitManualFloor = target;
  wrap._tuckitUserTucked = false;
  syncTuckSizes(wrap, el, target);
  wrap._tuckitFirstAttachHandledThisTurn = true;
  wrap._tuckitDragArmed = false;
  wrap._tuckitPasteArmed = false;
  wrap._tuckitLastAttachCount = count;
  const b = wrap._tuckitBtn || btn;
  if (b) updateTriangle(b, wrap);
  return true;
}

function autoResizeMeta(el, wrap, btn, opts = {}) {
  if (!isMeta ||!el ||!wrap) return; if (wrap.dataset.locked!== '1') return;
  if (Date.now() < _forceMinimalUntil && isEditorEmpty(el)) { const forcedMin = Number.isFinite(wrap._tuckitManualFloor)? wrap._tuckitManualFloor : computeMinimalH(wrap, el); syncTuckSizes(wrap, el, forcedMin); if(isEditorEmpty(el)) el.scrollTop = 0; return; }
  if (isEditorEmpty(el) && wrap._tuckitUserTucked === false && Date.now() >= _forceMinimalUntil) return;
  if (wrap._tuckitUserTucked &&!opts.ignoreFloor &&!opts.force) { const floor = Number.isFinite(wrap._tuckitManualFloor)? wrap._tuckitManualFloor : wrap._origMin || getMinH(); syncTuckSizes(wrap, el, floor); if (isEditorEmpty(el)) el.scrollTop = 0; return; }
  const minH = wrap._origMin || getMinH(); const maxH = computeMaxH(); const footerH = Number.isFinite(wrap._metaFooterH)? wrap._metaFooterH : getMetaBottomBarHeight(wrap); wrap._metaFooterH = footerH;
  const empty = isEditorEmpty(el); const wasEmpty = wrap._tuckitWasEmpty!== false; let finalH;
  if (empty) {
    const manualFloor = Number.isFinite(wrap._tuckitManualFloor)? wrap._tuckitManualFloor : minH; const recentlyToggled = Date.now() - (wrap._tuckitLastToggle || 0) < 3000;
    if (!wasEmpty) { wrap._tuckitManualFloor = minH; finalH = minH; }
    else { if (!opts.ignoreFloor && manualFloor > minH + 20 && recentlyToggled) finalH = Math.min(maxH, manualFloor); else if (!opts.ignoreFloor && manualFloor > minH + 20 &&!opts.force) finalH = Math.min(maxH, manualFloor); else { wrap._tuckitManualFloor = minH; finalH = minH; } }
    syncTuckSizes(wrap, el, finalH); const toggle = btn || wrap.querySelector(':scope >.tuckit-toggle'); if (toggle) updateTriangle(toggle, wrap); hideFakeScrollbars(wrap); makeFat(el, wrap); wrap._tuckitWasEmpty = true; if(empty) el.scrollTop = 0; return;
  }
  wrap._tuckitWasEmpty = false; const contentH = Math.ceil(el.scrollHeight);
  if (!opts.force && wrap.offsetHeight >= maxH && contentH + footerH + 12 >= maxH) { syncTuckSizes(wrap, el, Math.min(maxH, wrap.offsetHeight)); fixMetaDoomScroll(wrap); return; }
  const contentTarget = Math.max(minH, Math.min(maxH, contentH + footerH + 12 + 8)); const manualFloor = opts.ignoreFloor? minH : Number.isFinite(wrap._tuckitManualFloor)? wrap._tuckitManualFloor : minH;
  const target = Math.max(manualFloor, contentTarget); finalH = Math.min(maxH, target); syncTuckSizes(wrap, el, finalH);
  fixMetaDoomScroll(wrap);
  const toggle = btn || wrap.querySelector(':scope >.tuckit-toggle'); if (toggle) updateTriangle(toggle, wrap);
}
function autoResizeDeepSeek(el, wrap, btn, opts = {}) {
  if (!el ||!wrap) return; if (wrap.dataset.locked!== '1') return;
  if (Date.now() < _forceMinimalUntil && isEditorEmpty(el)) { const forcedMin = Number.isFinite(wrap._tuckitManualFloor)? wrap._tuckitManualFloor : computeMinimalH(wrap, el); syncTuckSizes(wrap, el, forcedMin); el.scrollTop = 0; return; }
  if (isEditorEmpty(el) && wrap._tuckitUserTucked === false && Date.now() >= _forceMinimalUntil) return;
  if (wrap._tuckitUserTucked &&!opts.ignoreFloor &&!opts.force) { const floor = Number.isFinite(wrap._tuckitManualFloor)? wrap._tuckitManualFloor : getDeepSeekBaseH(wrap); syncTuckSizes(wrap, el, floor); return; }
  const minH = wrap._origMin || getMinH(); const maxH = computeMaxH(); const footerH = getDeepSeekFooterH(wrap); const attachH = getDeepSeekAttachmentH(wrap);
  pinDeepSeekFooter(wrap); hideDeadScrollbarsDeepSeek(wrap, el);
  const empty = isEditorEmpty(el); const wasEmpty = wrap._tuckitWasEmpty!== false; const minInput = 80; const baseWithAttach = attachH > 0? Math.max(minH, attachH + minInput + footerH + 28 + 8) : minH; let finalH;
  if (empty) {
    const mf = Number.isFinite(wrap._tuckitManualFloor)? wrap._tuckitManualFloor : minH; const recent = Date.now() - (wrap._tuckitLastToggle || 0) < 3000;
    if (attachH > 0) { finalH = opts.ignoreFloor? baseWithAttach : Math.max(baseWithAttach, mf > minH + 20 && recent? Math.min(maxH, mf) : baseWithAttach); if (!wasEmpty) wrap._tuckitManualFloor = baseWithAttach; }
    else if (!wasEmpty) { wrap._tuckitManualFloor = minH; finalH = minH; }
    else { if (!opts.ignoreFloor && mf > minH + 20 && recent) finalH = Math.min(maxH, mf); else if (!opts.ignoreFloor && mf > minH + 20 &&!opts.force) finalH = Math.min(maxH, mf); else { wrap._tuckitManualFloor = minH; finalH = minH; } }
  } else {
    wrap._tuckitWasEmpty = false; const contentH = Math.ceil(el.scrollHeight); const contentTarget = Math.max(baseWithAttach, Math.min(maxH, contentH + attachH + footerH + 18 + 8));
    const mf = opts.ignoreFloor? minH : Number.isFinite(wrap._tuckitManualFloor)? wrap._tuckitManualFloor : minH; finalH = Math.min(maxH, Math.max(mf, contentTarget));
  }
  wrap._tuckitWasEmpty = empty; if (finalH === undefined) return; syncTuckSizes(wrap, el, finalH);
  const toggle = btn || wrap.querySelector(':scope >.tuckit-toggle'); if (toggle) updateTriangle(toggle, wrap); makeFat(el, wrap);
}
function queueAutoResize(el, wrap, btn, opts = {}) {
  if (!wrap) return;
  if (wrap._tuckitSyncing) return;
  if (Date.now() - (wrap._tuckitLastSyncTime||0) < 80 && !opts.force) return;
  if (isDeepSeek && wrap._tuckitDragArmed && (wrap._tuckitLastAttachCount||0)===0 && getDeepSeekAttachmentEls(wrap).length>0 && !wrap._tuckitFirstAttachHandledThisTurn) {
    maybeExpandForFirstDragAttachment(wrap, el, btn);
    return;
  }
  if (wrap._tuckitUserTucked &&!opts.force) { const floor = Number.isFinite(wrap._tuckitManualFloor)? wrap._tuckitManualFloor : (isDeepSeek? getDeepSeekBaseH(wrap) : computeMinimalH(wrap, el)); syncTuckSizes(wrap, el, floor); return; }
  if (wrap._resizeQueued &&!opts.force) return; wrap._resizeQueued = true;
  requestAnimationFrame(() => {
    wrap._resizeQueued = false;
    if (wrap._tuckitSyncing) return;
    if (isMeta) autoResizeMeta(el, wrap, btn, opts);
    else if (isDeepSeek) autoResizeDeepSeek(el, wrap, btn, opts);
  });
}
function lockBottom(wrap) {
  if (wrap.dataset.locked === '1') return; wrap.dataset.orig = JSON.stringify(captureInline(wrap));
  if (isChatGPT || isOpenWebUI) {
    wrap.style.setProperty('position','relative','important'); wrap.style.setProperty('bottom','auto','important');
    const form = wrap.closest('form'); if (form) { form.style.setProperty('position','sticky','important'); form.style.setProperty('bottom','0','important'); form.style.setProperty('z-index','5','important'); }
  } else { wrap.style.setProperty('position','sticky','important'); wrap.style.setProperty('bottom','0','important'); }
  wrap.style.setProperty('z-index','10','important'); wrap.style.setProperty('display','flex','important'); wrap.style.setProperty('flex-direction','column','important'); wrap.style.setProperty('overflow','hidden','important'); wrap.style.setProperty('box-sizing','border-box','important'); wrap.style.setProperty('padding-top','14px','important');
  wrap.classList.add('tuckit-wrap-fixed'); wrap.dataset.locked = '1'; wrap._origMin = getMinH();
  if (wrap._tuckitWasEmpty === undefined) wrap._tuckitWasEmpty = true;
  if (isDeepSeek) pinDeepSeekFooter(wrap); if (isChatGPT || isOpenWebUI) pinChatGPTFooter(wrap);
}
function unlockBottom(wrap) {
  if (isMeta) unfixMetaDoomScroll();
  if (wrap.dataset.orig) { try { restoreInline(wrap, JSON.parse(wrap.dataset.orig)); } catch {} }
  wrap.style.removeProperty('height'); wrap.style.removeProperty('padding-bottom'); wrap.style.removeProperty('padding-top'); wrap.style.removeProperty('will-change'); wrap.style.removeProperty('contain');
  const form = wrap.closest('form'); if (form && (isChatGPT || isOpenWebUI)) { form.style.removeProperty('position'); form.style.removeProperty('bottom'); form.style.removeProperty('z-index'); }
  wrap.classList.remove('tuckit-wrap-fixed'); delete wrap.dataset.locked; delete wrap.dataset.orig; delete wrap._origMin; delete wrap._metaFooterH;
  if (wrap._metaSbObs) { wrap._metaSbObs.disconnect(); delete wrap._metaSbObs; }
  if (wrap._dsSbObs) { wrap._dsSbObs.disconnect(); delete wrap._dsSbObs; }
  if (wrap._tuckitResizeObs) { try { wrap._tuckitResizeObs.disconnect(); } catch {} delete wrap._tuckitResizeObs; }
  wrap.querySelectorAll('div[contenteditable="true"], textarea, div.ProseMirror').forEach(el => {
    el.style.removeProperty('height'); el.style.removeProperty('max-height'); el.style.removeProperty('min-height'); el.style.removeProperty('overflow-y'); el.style.removeProperty('overflow-x'); el.style.removeProperty('flex'); el.style.removeProperty('padding-right'); el.style.removeProperty('box-sizing'); el.style.removeProperty('scrollbar-gutter'); el.style.removeProperty('margin-top');
    el.classList.remove('tuckit-fat-scroll','tuckit-gpt-scroll');
  });
  if (isDeepSeek) {
    const f = getDeepSeekFooterEl(wrap); if (f) { f.classList.remove('tuckit-ds-footer'); f.style.removeProperty('position'); f.style.removeProperty('bottom'); f.style.removeProperty('left'); f.style.removeProperty('right'); }
    const tw = wrap.querySelector('.tuckit-ds-textarea-wrap'); if (tw) tw.classList.remove('tuckit-ds-textarea-wrap');
    wrap.querySelectorAll('.tuckit-ds-attach').forEach(a => a.classList.remove('tuckit-ds-attach'));
  }
  if (isChatGPT || isOpenWebUI) { const f = getChatGPTFooterEl(wrap); if (f) { f.style.removeProperty('flex'); f.style.removeProperty('position'); f.style.removeProperty('margin-top'); } }
}
function cleanupTuckIT() {
  try {
    if (_metaResponseObserver) { try { _metaResponseObserver.disconnect(); } catch {} _metaResponseObserver = null; }
    if (_metaResponseTimer) { clearTimeout(_metaResponseTimer); _metaResponseTimer = null; }
    if (_metaTransitionPoll) { clearInterval(_metaTransitionPoll); _metaTransitionPoll = null; }
    document.querySelectorAll('.tuckit-handle,.tuckit-toggle').forEach(n => n.remove());
    if (tipEl) { tipEl.remove(); tipEl = null; }
    if (hotkeyTipEl) { hotkeyTipEl.remove(); hotkeyTipEl = null; }
    if (hotkeyTipElK) { hotkeyTipElK.remove(); hotkeyTipElK = null; }
    if (handleSecondTipEl) { handleSecondTipEl.remove(); handleSecondTipEl = null; }
    if (hotkeyTimer) { clearTimeout(hotkeyTimer); hotkeyTimer = null; }
    if (tipHideTimer) { clearTimeout(tipHideTimer); tipHideTimer = null; }
    if (_metaHomeBootTimer) { clearTimeout(_metaHomeBootTimer); _metaHomeBootTimer = null; }
    document.querySelectorAll('.tuckit-wrap-fixed').forEach(wrap => {
      try {
        const form = wrap.closest('form'); if (form && (isChatGPT || isOpenWebUI)) { form.style.removeProperty('position'); form.style.removeProperty('bottom'); form.style.removeProperty('z-index'); }
        if (wrap.dataset.orig) { try { restoreInline(wrap, JSON.parse(wrap.dataset.orig)); } catch {} }
        wrap.style.removeProperty('height'); wrap.style.removeProperty('padding-bottom'); wrap.style.removeProperty('padding-top');
        wrap.classList.remove('tuckit-wrap-fixed','tuckit-fat-scroll');
        wrap.querySelectorAll('div[contenteditable="true"], textarea, div.ProseMirror').forEach(el => {
          el.style.removeProperty('height'); el.style.removeProperty('max-height'); el.style.removeProperty('min-height'); el.style.removeProperty('overflow-y'); el.style.removeProperty('overflow-x'); el.style.removeProperty('flex'); el.style.removeProperty('padding-right'); el.style.removeProperty('box-sizing'); el.style.removeProperty('scrollbar-gutter'); el.style.removeProperty('margin-top');
          el.classList.remove('tuckit-fat-scroll','tuckit-gpt-scroll');
        });
        delete wrap.dataset.locked; delete wrap.dataset.orig; delete wrap._origMin; delete wrap._metaFooterH; delete wrap._tuckitManualFloor; delete wrap._tuckitWasEmpty; delete wrap._tuckitLastToggle; delete wrap._tuckitUserTucked;
        delete wrap._tuckitFirstAttachHandledThisTurn; delete wrap._tuckitLastAttachCount; delete wrap._tuckitDragArmed; delete wrap._tuckitPasteArmed; delete wrap._tuckitLastAppliedH; delete wrap._tuckitLastSyncTime;
        if (wrap._metaSbObs) { wrap._metaSbObs.disconnect(); delete wrap._metaSbObs; }
        if (wrap._dsSbObs) { wrap._dsSbObs.disconnect(); delete wrap._dsSbObs; }
        if (wrap._tuckitResizeObs) { try { wrap._tuckitResizeObs.disconnect(); } catch {} delete wrap._tuckitResizeObs; }
      } catch {}
    });
    document.querySelectorAll('.tuckit-fat-scroll,.tuckit-gpt-scroll').forEach(el => {
      el.style.removeProperty('height'); el.style.removeProperty('max-height'); el.style.removeProperty('padding-right'); el.style.removeProperty('flex');
      el.classList.remove('tuckit-fat-scroll','tuckit-gpt-scroll');
    });
    if (document.querySelectorAll) { document.querySelectorAll('.tuckit-wrap-fixed').forEach(w=>{ if(w._tuckitAnimRaf) cancelAnimationFrame(w._tuckitAnimRaf); }); } activeWrap = null; activeBtn = null; dragging = null; seen = new WeakSet();
    stopNewChatWatcher();
    if (isMeta) unfixMetaDoomScroll();
  } catch {}
}
function applyMode(el, wrap, btn, m) {
  if (m.startsWith('custom:')) {
    const h = parseInt(m.split(':')[1],10);
    if (!isNaN(h)) { lockBottom(wrap); wrap._tuckitManualFloor = h; wrap._tuckitUserTucked = h <= computeMaxH() * 0.5; if (h > getMinH() + 20) lastExpanded = h; syncTuckSizes(wrap, el, h); if (isDeepSeek) pinDeepSeekFooter(wrap); if (isChatGPT || isOpenWebUI) { pinChatGPTFooter(wrap); makeFat(el, wrap); } }
  } else if (m === 'compact') {
    lockBottom(wrap); const minH = wrap._origMin || getMinH(); const footerH = isMeta? (wrap._metaFooterH || getMetaBottomBarHeight(wrap)) : (isChatGPT || isOpenWebUI)? getChatGPTFooterH(wrap) : getDeepSeekFooterH(wrap); const attachH = isDeepSeek? getDeepSeekAttachmentH(wrap) : 0;
    const base = attachH > 0? Math.max(minH, attachH + 80 + footerH + 28 + 8) : minH;
    wrap._tuckitManualFloor = base; wrap._tuckitUserTucked = true; wrap._tuckitWasEmpty = isEditorEmpty(el); syncTuckSizes(wrap, el, base); if (isMeta && isEditorEmpty(el)) el.scrollTop = 0;
  } else {
    unlockBottom(wrap); el.style.removeProperty('height'); el.style.removeProperty('max-height'); el.style.removeProperty('overflow-y'); el.style.removeProperty('overflow-x'); el.style.removeProperty('flex'); el.style.removeProperty('min-height'); el.style.removeProperty('display');
    const tWrap = getDeepSeekTextareaWrap(el); if (tWrap) { tWrap.style.removeProperty('height'); tWrap.style.removeProperty('max-height'); }
    wrap._tuckitManualFloor = null; delete wrap._metaFooterH; wrap._tuckitUserTucked = false;
  }
  updateTriangle(btn, wrap); activeWrap = wrap; activeBtn = btn;
}
function afterSendCollapse(wrap, btn, el) {
  if (!wrap ||!el) return;
  if (isMeta && (wrap._metaWasHome || wrap._metaHomePending)) { setTimeout(() => { wrap._metaWasHome = false; wrap._metaHomePending = false; afterSendCollapse(wrap, btn, el); }, 2200); return; }
  _forceMinimalUntil = Date.now() + 3500; const minH = computeMinimalH(wrap, el);
  try { wrap.style.removeProperty('height'); el.style.removeProperty('height'); el.style.removeProperty('max-height'); } catch {}
  applyMode(el, wrap, btn, 'compact'); wrap._tuckitManualFloor = minH; wrap._tuckitUserTucked = true; wrap._tuckitWasEmpty = true; wrap._wasNotEmpty = false;
  wrap._tuckitFirstAttachHandledThisTurn = false;
  wrap._tuckitLastAttachCount = 0;
  wrap._tuckitDragArmed = false;
  wrap._tuckitPasteArmed = false;
  syncTuckSizes(wrap, el, minH); if (isEditorEmpty(el)) { el.scrollTop = 0; el.scrollLeft = 0; }
  save('compact'); updateTriangle(btn, wrap);
  if (el._tuckitBootTimer) clearTimeout(el._tuckitBootTimer);
  el._tuckitBootTimer = setTimeout(() => { try { el.scrollTop = 0; el.scrollLeft = 0; const w = el.closest('.tuckit-wrap-fixed'); if (w) w.scrollTop = 0; } catch {} tuckitScrollToCursor(el, 'first'); }, TOGGLE_SINGLE_DELAY);
}
function findSendButton(wrap) {
  try {
    const form = wrap.closest('form'); const scope = form || wrap.parentElement || wrap; const cands = [];
    scope.querySelectorAll('button, [role="button"]').forEach(b => {
      const aria = (b.getAttribute('aria-label') || '').toLowerCase(); const type = (b.getAttribute('type') || '').toLowerCase();
      if (type === 'submit' || aria.includes('send') || aria.includes('submit')) { const r = b.getBoundingClientRect(); const wr = wrap.getBoundingClientRect(); if (r.width > 0 && r.bottom >= wr.bottom - 100) cands.push(b); }
    });
    if (cands.length === 0 && form) form.querySelectorAll('button[type="submit"]').forEach(b => cands.push(b));
    if (cands.length === 0) document.querySelectorAll('button[aria-label*="Send"], button[type="submit"]').forEach(b => cands.push(b));
    if (cands.length === 0) return null; const wr = wrap.getBoundingClientRect();
    cands.sort((a,b) => { const ra = a.getBoundingClientRect(); const rb = b.getBoundingClientRect(); return Math.hypot(wr.right - ra.right, wr.bottom - ra.bottom) - Math.hypot(wr.right - rb.right, wr.bottom - rb.bottom); });
    return cands[0];
  } catch { return null; }
}
function hookSendActions(wrap, btn, el) {
  try {
    const form = wrap.closest('form') || el.closest('form'); const sBtn = findSendButton(wrap);
    if (sBtn &&!sBtn._tuckitHooked) {
      sBtn._tuckitHooked = true;
      const sched = () => {
        if (!isEditorEmpty(el)) { wrap._wasNotEmpty = true; if (isMeta) wrap._metaWasHome = isNewChat(); setTimeout(() => { if (isEditorEmpty(el)) afterSendCollapse(wrap, btn, el); }, 120); }
        else afterSendCollapse(wrap, btn, el);
      };
      sBtn.addEventListener('pointerdown', sched, true);
      sBtn.addEventListener('click', () => setTimeout(() => { if (isEditorEmpty(el)) afterSendCollapse(wrap, btn, el); }, 80), true);
    }
    if (form &&!form._tuckitHooked) {
      form._tuckitHooked = true;
      form.addEventListener('submit', () => {
        if (!isEditorEmpty(el)) { wrap._wasNotEmpty = true; if (isMeta) wrap._metaWasHome = isNewChat(); }
        setTimeout(() => { if (isEditorEmpty(el)) afterSendCollapse(wrap, btn, el); }, 100);
      }, true);
    }
    if (!el._tuckitEnterHooked) {
      el._tuckitEnterHooked = true;
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' &&!e.shiftKey &&!e.ctrlKey &&!e.metaKey &&!e.altKey &&!e.isComposing) {
          if (!isEditorEmpty(el)) { wrap._wasNotEmpty = true; if (isMeta) wrap._metaWasHome = isNewChat(); setTimeout(() => { if (isEditorEmpty(el)) afterSendCollapse(wrap, btn, el); }, 100); }
        }
      }, true);
    }
    if (!el._tuckitClearObs) {
      let lastEmpty = isEditorEmpty(el);
      const obs = new MutationObserver(() => { const nowEmpty = isEditorEmpty(el); if (!lastEmpty && nowEmpty && wrap._wasNotEmpty) afterSendCollapse(wrap, btn, el); lastEmpty = nowEmpty; });
      obs.observe(el, { childList: true, subtree: true, characterData: true }); el._tuckitClearObs = obs;
    }
  } catch {}
}
function restoreCaretAndRevealNative(input, mode, savedRange, savedTaStart, savedTaEnd) {
  try {
    if (input.tagName === 'TEXTAREA' && savedTaStart!= null) { input.focus(); try { input.setSelectionRange(savedTaStart, savedTaEnd?? savedTaStart); } catch {} }
    else if (savedRange) { const sel = window.getSelection(); try { sel.removeAllRanges(); sel.addRange(savedRange.cloneRange()); input.focus(); } catch {} }
    else { try { input.focus(); } catch {} }
    if (input.tagName === 'TEXTAREA') {
      const origS = input.selectionStart; const origE = input.selectionEnd;
      if (mode === 'first') { input.scrollTop = 0; input.scrollLeft = 0; const wrap = input.closest('.tuckit-wrap-fixed'); if (wrap) wrap.scrollTop = 0; }
      else {
        if (input.value.length > 3000) { input.scrollTop = input.scrollHeight; return; }
        if (origS < input.value.length) { input.setSelectionRange(origS+1, origS+1); void input.offsetHeight; input.setSelectionRange(origS, origE); } else if (origS > 0) { input.setSelectionRange(origS-1, origS-1); void input.offsetHeight; input.setSelectionRange(origS, origE); } manualScrollTextareaIntoView(input, mode);
      }
    } else {
      const sel = window.getSelection(); if (!sel || sel.rangeCount === 0) { manualScrollContentEditableIntoView(input, mode); return; }
      if (mode === 'first') { input.scrollTop = 0; const wrap = input.closest('.tuckit-wrap-fixed'); if (wrap) wrap.scrollTop = 0; manualScrollContentEditableIntoView(input, 'first'); }
      else {
        const origRange = savedRange? savedRange.cloneRange() : sel.getRangeAt(0).cloneRange();
        try { if (typeof sel.modify === 'function') { sel.modify('move','forward','character'); void input.offsetHeight; sel.modify('move','backward','character'); sel.removeAllRanges(); sel.addRange(origRange); } else { manualScrollContentEditableIntoView(input, mode); sel.removeAllRanges(); sel.addRange(origRange); } }
        catch { try { manualScrollContentEditableIntoView(input, mode); const s2 = window.getSelection(); s2.removeAllRanges(); s2.addRange(origRange); } catch {} }
      }
    }
  } catch {}
  try { input.focus({ preventScroll: true }); } catch { try { input.focus(); } catch {} }
}


function mimicDragBarClick(wrap, el, btn) {
  try {
    const handle = wrap.querySelector('.tuckit-handle');
    if (!handle || !wrap || !el) return;
    const r = handle.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    // 1) real pointerdown on our handle - this runs startDrag path that does lockBottom + pin + hide dead scrollbars
    try {
      handle.dispatchEvent(new PointerEvent('pointerdown', { bubbles:true, cancelable:true, clientX:x, clientY:y, pointerId: 99, pointerType:'mouse', isPrimary:true }));
    } catch {
      try { handle.dispatchEvent(new MouseEvent('mousedown', { bubbles:true, cancelable:true, clientX:x, clientY:y })); } catch {}
    }
    // 2) tiny 1px nudge like a real drag does - this is what actually fixes the squish
    const curH = wrap.offsetHeight;
    const nudgeH = curH + 1;
    // force reflow
    void wrap.offsetHeight;
    syncTuckSizes(wrap, el, nudgeH);
    // 3) immediately restore and fire up/click + refocus input
    setTimeout(() => {
      try {
        syncTuckSizes(wrap, el, curH);
        void el.offsetHeight;
        if (isDeepSeek) { pinDeepSeekFooter(wrap); hideDeadScrollbarsDeepSeek(wrap, el); }
        if (isMeta) { hideFakeScrollbars(wrap); fixMetaDoomScroll(wrap); }
        makeFat(el, wrap);
        try {
          handle.dispatchEvent(new PointerEvent('pointerup', { bubbles:true, cancelable:true, clientX:x, clientY:y, pointerId: 99, pointerType:'mouse' }));
          handle.dispatchEvent(new MouseEvent('mouseup', { bubbles:true, cancelable:true, clientX:x, clientY:y }));
          handle.dispatchEvent(new MouseEvent('click', { bubbles:true, cancelable:true, clientX:x, clientY:y }));
        } catch {}
        try { el.focus({ preventScroll:true }); } catch { try { el.focus(); } catch {} }
        if (btn) updateTriangle(btn, wrap);
      } catch {}
    }, 32);
  } catch {}
}

function animateTuckHeight(wrap, el, btn, targetH, dur=190) {
  try {
    if (!wrap || !el) return;
    if (wrap._tuckitAnimRaf) cancelAnimationFrame(wrap._tuckitAnimRaf);
    const startH = wrap.offsetHeight;
    if (Math.abs(startH - targetH) < 2.5) { syncTuckSizes(wrap, el, targetH); if (btn) updateTriangle(btn, wrap);
      if (wrap._tuckitWasExpand) { wrap._tuckitWasExpand = false; setTimeout(()=> mimicDragBarClick(wrap, el, btn), 40); }
      return;
    }
    const start = performance.now();
    wrap._tuckitSyncing = true;
    wrap._tuckitAnimating = true;
    const minH = wrap._origMin || getMinH();
    const maxH = computeMaxH();
    targetH = Math.max(minH, Math.min(maxH, targetH));
    const doFrame = (now) => {
      const elapsed = now - start;
      const p = Math.min(1, elapsed / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      const cur = startH + (targetH - startH) * eased;
      const ft = cur;
      const footerH = getFooterHForSync(wrap);
      const elH = getEditorTargetH(wrap, ft);
      wrap.style.setProperty('height', `${ft}px`, 'important');
      wrap._tuckitLastAppliedH = ft;
      if (isMeta) {
        wrap._metaFooterH = footerH;
        el.style.setProperty('height', `${elH}px`, 'important');
        el.style.setProperty('max-height', `${elH}px`, 'important');
        el.style.setProperty('min-height','40px','important');
        el.style.setProperty('overflow-y','auto','important');
        el.style.setProperty('overflow-x','hidden','important');
      } else if (isDeepSeek) {
        wrap.style.setProperty('padding-bottom', `${footerH + 10}px`, 'important');
        const tWrap = getDeepSeekTextareaWrap(el);
        const targetElH = Math.max(60, elH);
        if (tWrap) {
          tWrap.classList.add('tuckit-ds-textarea-wrap');
          tWrap.style.setProperty('height', `${targetElH}px`, 'important');
          tWrap.style.setProperty('max-height', `${targetElH}px`, 'important');
          tWrap.style.setProperty('min-height', `${targetElH}px`, 'important');
          tWrap.style.setProperty('overflow','hidden','important');
          tWrap.style.setProperty('display','flex','important');
          tWrap.style.setProperty('flex-direction','column','important');
        }
        el.style.setProperty('height', `${targetElH}px`, 'important');
        el.style.setProperty('max-height', `${targetElH}px`, 'important');
        el.style.setProperty('min-height','60px','important');
        el.style.setProperty('overflow-y','auto','important');
        el.style.setProperty('overflow-x','hidden','important');
        el.style.setProperty('flex','1 1 auto','important');
      } else if (isChatGPT || isOpenWebUI) {
        const f = getChatGPTFooterEl(wrap); if (f) { f.style.setProperty('flex','0 0 auto','important'); f.style.setProperty('position','relative','important'); f.style.setProperty('margin-top','auto','important'); }
        el.style.setProperty('height', `${elH}px`, 'important');
        el.style.setProperty('max-height', `${elH}px`, 'important');
        el.style.setProperty('min-height','40px','important');
        el.style.setProperty('flex','0 0 auto','important');
        el.style.setProperty('overflow-y','auto','important');
        el.style.setProperty('overflow-x','hidden','important');
        el.style.setProperty('box-sizing','border-box','important');
      } else {
        el.style.setProperty('height', `${elH}px`, 'important');
        el.style.setProperty('max-height', `${elH}px`, 'important');
        el.style.setProperty('min-height','40px','important');
        el.style.setProperty('overflow-y','auto','important');
        el.style.setProperty('overflow-x','hidden','important');
      }
      if (p > 0.35 && p < 0.85) {
        if (isDeepSeek) { pinDeepSeekFooter(wrap); }
        if (isMeta) { hideFakeScrollbars(wrap); }
      }
      if (p < 1) {
        wrap._tuckitAnimRaf = requestAnimationFrame(doFrame);
      } else {
        wrap._tuckitSyncing = false;
        wrap._tuckitAnimating = false;
        wrap._tuckitLastSyncTime = Date.now();
        if (isDeepSeek) { pinDeepSeekFooter(wrap); hideDeadScrollbarsDeepSeek(wrap, el); }
        if (isMeta) { hideFakeScrollbars(wrap); fixMetaDoomScroll(wrap); }
        if (isChatGPT || isOpenWebUI) { pinChatGPTFooter(wrap); }
        makeFat(el, wrap);
        if (btn) updateTriangle(btn, wrap);
        if (wrap._tuckitWasExpand) {
          wrap._tuckitWasExpand = false;
          setTimeout(() => mimicDragBarClick(wrap, el, btn), 45);
        }
      }
    };
    wrap._tuckitAnimRaf = requestAnimationFrame(doFrame);
  } catch (e) {
    try { syncTuckSizes(wrap, el, targetH); } catch {}
    wrap._tuckitSyncing = false;
    wrap._tuckitAnimating = false;
  }
}

function toggleCurrent(wrap, btn) {
  if (!wrap ||!btn) return;
  // DEV FIX: hard 450ms debounce to prevent breakage from rapid retoggle (triangle + Ctrl+Shift+L)
  const now = Date.now();
  if (now - lastToggleAt < 450) return;
  if (wrap._tuckitAnimating) return; // block any toggle while animating
  lastToggleAt = now;
  wrap._tuckitLastToggle = Date.now();
  const input = wrap.querySelector('div[contenteditable="true"], textarea, div.ProseMirror'); if (!input) return;
  saveCaretFromEl(input);
  const savedRange = _lastCaret.el === input && _lastCaret.range? _lastCaret.range.cloneRange() : null;
  const savedTaStart = _lastCaret.el === input? _lastCaret.taStart : null;
  const savedTaEnd = _lastCaret.el === input? _lastCaret.taEnd : null;
  const minH = wrap._origMin || getMinH(); const maxH = computeMaxH();
  const doReveal = mode => restoreCaretAndRevealNative(input, mode, savedRange, savedTaStart, savedTaEnd);
  _forceMinimalUntil = 0;
  const isExp = btn.dataset.state === 'expanded' || wrap.offsetHeight > maxH * 0.52;
  if (isExp) {
    const minimal = computeMinimalH(wrap, input);
    wrap._tuckitManualFloor = minimal; wrap._tuckitUserTucked = true; wrap._tuckitWasEmpty = isEditorEmpty(input);
    // ANIMATE collapse like quick drag up
    animateTuckHeight(wrap, input, btn, minimal, isDeepSeek? 190 : isMeta? 175 : 200);
    save('compact');
    requestAnimationFrame(() => doReveal('caret')); setTimeout(() => doReveal('caret'), 180);
    clearTimeout(wrap._tuckitTuckTimer); wrap._tuckitTuckTimer = setTimeout(() => doReveal('caret'), TOGGLE_SINGLE_DELAY);
  } else {
    let target = lastExpanded; if (!target || target <= minH + 20 || target <= maxH * 0.5) target = maxH; target = Math.max(target, Math.floor(maxH * 0.58));
    try { if (!isEditorEmpty(input)) { const scrollH = input.scrollHeight; const extra = (isMeta? getMetaBottomBarHeight(wrap) : isDeepSeek? getDeepSeekFooterH(wrap) + getDeepSeekAttachmentH(wrap) : 40) + 24; const needed = scrollH + extra; if (needed > target) target = Math.min(maxH, Math.max(target, needed)); } } catch {}
    target = Math.min(maxH, Math.max(minH, target)); wrap._tuckitManualFloor = target; wrap._tuckitUserTucked = false; wrap._tuckitWasEmpty = isEditorEmpty(input); lastExpanded = target;
    const baseDur = isDeepSeek? 220 : isMeta? 200 : 220;
    const isFirstExpand = !wrap._tuckitFirstExpandDone;
    const dur = isFirstExpand ? Math.round(baseDur * 3) : baseDur;
    wrap._tuckitWasExpand = true;
    animateTuckHeight(wrap, input, btn, target, dur);
    if (isFirstExpand) {
      wrap._tuckitFirstExpandDone = true;
      // keep flag for session, reset only on new page / afterSendCollapse stays true so only true first is slow
    }
    save(`custom:${target}`);
    requestAnimationFrame(() => doReveal('caret')); setTimeout(() => doReveal('caret'), 180);
    clearTimeout(wrap._tuckitTuckTimer); wrap._tuckitTuckTimer = setTimeout(() => doReveal('caret'), TOGGLE_SINGLE_DELAY);
  }
  showUI(btn);
}


function showUI(btn) {
  if (!btn) return;
  const wrap = btn.parentElement;
  const handle = wrap?.querySelector('.tuckit-handle');
  btn.classList.remove('tuckit-faded');
  btn.style.setProperty('opacity','1','important');
  if (handle) { handle.classList.remove('tuckit-faded'); handle.style.setProperty('opacity','1','important'); }
  clearTimeout(btn._hideT);
  if (wrap) { clearTimeout(wrap._hideHandleTimer); wrap._hideHandleTimer = null; }
}
function scheduleHideUI(btn) {
  if (!btn) return;
  clearTimeout(btn._hideT);
  btn._hideT = setTimeout(() => {
    const wrap = btn.parentElement;
    btn.classList.add('tuckit-faded');
    btn.style.setProperty('opacity','0','important');
    const handle = wrap?.querySelector('.tuckit-handle');
    if (handle) { handle.classList.add('tuckit-faded'); handle.style.setProperty('opacity','0','important'); }
    hideAllTips();
  }, 800);
}
function showToggle(btn) { showUI(btn); }
function hideToggle(btn) {
  if (!btn) return;
  const wrap = btn.parentElement;
  btn.classList.add('tuckit-faded');
  btn.style.setProperty('opacity','0','important');
  const handle = wrap?.querySelector('.tuckit-handle');
  if (handle) { handle.classList.add('tuckit-faded'); handle.style.setProperty('opacity','0','important'); }
  hideAllTips();
  clearTimeout(btn._hideT);
}

function doDragMove(e) {
  if (!dragging) return; const d = dragging;
  if (!d.locked) {
    if (Math.abs(e.clientY - d.startY) < 4) return;
    lockBottom(d.wrap); if (isMeta) hideFakeScrollbars(d.wrap); if (isDeepSeek) { pinDeepSeekFooter(d.wrap); hideDeadScrollbarsDeepSeek(d.wrap, d.el); } if (isChatGPT || isOpenWebUI) pinChatGPTFooter(d.wrap);
    d.locked = true; d.feedScroller = discoverFeedScroller(d.wrap); d.startFeedScrollTop = d.feedScroller? d.feedScroller.scrollTop : 0;
  }
  const minH = d.wrap._origMin || getMinH(); const maxH = computeMaxH(); const newH = Math.max(minH, Math.min(maxH, d.startWrapH + (d.startY - e.clientY)));
  if (Math.abs(newH - d.wrap.offsetHeight) < 1) return;
  d.wrap._tuckitManualFloor = newH; d.wrap._tuckitUserTucked = newH <= maxH * 0.5; if (newH > getMinH() + 20) lastExpanded = newH;
  syncTuckSizes(d.wrap, d.el, newH); showUI(d.btn); updateTriangle(d.btn, d.wrap);
  if (isMeta) hideFakeScrollbars(d.wrap); if (isDeepSeek) pinDeepSeekFooter(d.wrap); if (isChatGPT || isOpenWebUI) pinChatGPTFooter(d.wrap);
  makeFat(d.el, d.wrap);
  if (d.feedScroller) { const inc = newH - (d.lastWrapH?? d.startWrapH); if (Math.abs(inc) >= 1) { const sc = d.feedScroller; const maxH2 = sc.scrollHeight - sc.clientHeight; let target = sc.scrollTop + inc; target = Math.max(0, Math.min(maxH2, target)); sc.scrollTop = target; d.lastWrapH = newH; } }
  d.moved = true;
}
window.addEventListener('pointermove', e => {
  document.querySelectorAll('.tuckit-wrap-fixed').forEach(wrap => {
    const r = wrap.getBoundingClientRect();
    const inDragZone = e.clientX >= r.left - 60 && e.clientX <= r.right + 60 && e.clientY >= r.top - 80 && e.clientY <= r.top + 120;
    const btn = wrap.querySelector('.tuckit-toggle');
    if (!btn) return;
    if (inDragZone) {
      showUI(btn);
      if (!wrap._handleTooltipsScheduled) {
        wrap._handleTooltipsScheduled = true;
        clearTimeout(wrap._offTimer); clearTimeout(wrap._refreshTimer);
        wrap._offTimer = setTimeout(() => showHandleOff(wrap), 1500);
        wrap._refreshTimer = setTimeout(() => showHandleRefresh(wrap), 3000);
      }
    } else {
      if (wrap._handleTooltipsScheduled) {
        hideHandleTips();
      }
      const br = btn.getBoundingClientRect();
      const nearBtn = Math.hypot(e.clientX - (br.left + br.width / 2), e.clientY - (br.top + br.height / 2)) < 220;
      if (!nearBtn &&!dragging) {
        if (!wrap._hideHandleTimer) {
          wrap._hideHandleTimer = setTimeout(() => {
            wrap._hideHandleTimer = null;
            btn.classList.add('tuckit-faded'); btn.style.setProperty('opacity','0','important');
            const h = wrap.querySelector('.tuckit-handle'); if (h) { h.classList.add('tuckit-faded'); h.style.setProperty('opacity','0','important'); }
            hideAllTips();
          }, 800);
        }
      } else {
        clearTimeout(wrap._hideHandleTimer); wrap._hideHandleTimer = null;
      }
    }
  });
  document.querySelectorAll('.tuckit-toggle').forEach(btn => { const r = btn.getBoundingClientRect(); const dist = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2)); if (dist < 220) showUI(btn); });
  if (!dragging) return; e.preventDefault(); e.stopImmediatePropagation(); lastMoveEvent = e;
  if (!rafPending) { rafPending = true; requestAnimationFrame(() => { rafPending = false; if (lastMoveEvent) doDragMove(lastMoveEvent); }); }
}, true);
window.addEventListener('pointerup', () => {
  if (!dragging) return; if (!dragging.moved) { dragging = null; document.documentElement.classList.remove('tuckit-dragging'); hideAllTips(); return; }
  const d = dragging; const h = d.wrap.offsetHeight; d.wrap._tuckitManualFloor = h; d.wrap._tuckitUserTucked = h <= computeMaxH() * 0.5; if (h > getMinH() + 20) lastExpanded = h;
  syncTuckSizes(d.wrap, d.el, h); save(`custom:${h}`); dragging = null; document.documentElement.classList.remove('tuckit-dragging'); hideAllTips();
}, true);
window.addEventListener('pointercancel', () => { if (!dragging) return; dragging = null; document.documentElement.classList.remove('tuckit-dragging'); hideAllTips(); }, true);
window.addEventListener('keydown', e => {
  if (e.ctrlKey && e.shiftKey && e.code === 'KeyK') { e.preventDefault(); e.stopPropagation(); setDisabled(!tuckitDisabled); return; }
  if (e.ctrlKey && e.shiftKey && e.code === 'KeyL') {
    e.preventDefault(); e.stopPropagation(); if (tuckitDisabled) return;
    if (Date.now() - lastToggleAt < 450) return; // same 450ms limit for hotkey
    let wrap = activeWrap; let btn = activeBtn; if (!wrap ||!btn) { const first = document.querySelector('.tuckit-toggle'); if (first) { wrap = first.closest('.tuckit-wrap-fixed') || first.parentElement; btn = first; } }
    if (!wrap ||!btn) return; toggleCurrent(wrap, btn);
  }
}, true);

function scanNode(node, allowNewMeta = false) {
  if (tuckitDisabled) return; if (!allowNewMeta && isNewChat()) return; if (!node || node.nodeType!== 1) return;
  if (node.matches && node.matches(SELECTORS)) { inject(node); return; }
  if (node.querySelectorAll) { try { const list = node.querySelectorAll(SELECTORS); for (let i = 0; i < Math.min(list.length, 5); i++) inject(list[i]); } catch {} }
}

function inject(el) {
  if (tuckitDisabled) return; if (seen.has(el) ||!isEditable(el)) return;
  const wrap = getWrap(el); if (!wrap || wrap.querySelector(':scope >.tuckit-handle')) { seen.add(el); return; }
  seen.add(el);
  if (getComputedStyle(wrap).position === 'static') wrap.style.setProperty('position','relative','important');
  preventAccentPicker(el);
  const handle = document.createElement('div'); handle.className = 'tuckit-handle tuckit-faded'; handle.style.setProperty('opacity','0','important');
  const btn = document.createElement('button'); btn.className = 'tuckit-toggle tuckit-faded'; btn.type = 'button'; btn.dataset.state = 'collapsed'; btn.style.setProperty('opacity','0','important');
  handle.removeAttribute('title'); btn.removeAttribute('title');
  renderToggleIcon(btn, 'collapsed');

  btn.addEventListener('pointerenter', (e) => { showUI(btn); showButtonFirst(e); });
  btn.addEventListener('pointermove', (e) => { showUI(btn); moveButtonTips(e); });
  btn.addEventListener('pointerleave', () => { hideButtonTips(); scheduleHideUI(btn); });
  btn.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); hideAllTips(); if (Date.now() - lastToggleAt < 600) return; toggleCurrent(wrap, btn); });

  handle.addEventListener('pointerenter', () => {
    showUI(btn);
    const w = handle.parentElement;
    if (!w._handleTooltipsScheduled) {
      w._handleTooltipsScheduled = true;
      clearTimeout(w._offTimer); clearTimeout(w._refreshTimer);
      w._offTimer = setTimeout(() => showHandleOff(w), 1500);
      w._refreshTimer = setTimeout(() => showHandleRefresh(w), 3000);
    }
  });
  handle.addEventListener('pointerleave', () => { scheduleHideUI(btn); });

  const startDrag = e => {
    if (e.target.closest('.tuckit-toggle')) return;
    e.preventDefault(); e.stopPropagation();
    dragging = { el, wrap, btn, startY: e.clientY, startWrapH: wrap.offsetHeight, lastWrapH: wrap.offsetHeight, locked: false, moved: false, feedScroller: null, startFeedScrollTop: 0 };
    document.documentElement.classList.add('tuckit-dragging'); hideAllTips();
    if (e.target.setPointerCapture) { try { e.target.setPointerCapture(e.pointerId); } catch {} }
  };
  handle.addEventListener('pointerdown', startDrag);
  wrap.addEventListener('pointerdown', e => {
    if (e.target.closest('.tuckit-toggle') || e.target.closest('.tuckit-handle') || e.target === el || el.contains(e.target)) return;
    const r = wrap.getBoundingClientRect(); if (e.clientY - r.top < 18 && e.clientY - r.top >= 0) startDrag(e);
  });

  wrap.appendChild(handle); wrap.appendChild(btn);
  setTimeout(() => showUI(btn), 600);

  const qr = opts => queueAutoResize(el, wrap, btn, opts); wrap._tuckitBtn = btn; wrap._wasNotEmpty =!isEditorEmpty(el);

  wrap._tuckitFirstAttachHandledThisTurn = wrap._tuckitFirstAttachHandledThisTurn || false;
  wrap._tuckitLastAttachCount = getDeepSeekAttachmentEls(wrap).length;
  wrap._tuckitDragArmed = false;
  wrap._tuckitPasteArmed = false;

  if (isDeepSeek) {
    let attachDebounce = null;
    const scheduleAttachExpand = () => {
      clearTimeout(attachDebounce);
      attachDebounce = setTimeout(()=> maybeExpandForFirstDragAttachment(wrap, el, btn), 80);
    };
    const arm = () => { wrap._tuckitDragArmed = true; wrap._tuckitPasteArmed = true; };
    wrap.addEventListener('dragenter', arm, true);
    wrap.addEventListener('dragover', arm, true);
    wrap.addEventListener('drop', ()=>{ arm(); scheduleAttachExpand(); }, true);

    const handleFilePaste = (e)=>{
      try {
        const dt = e.clipboardData;
        if (!dt) { scheduleAttachExpand(); return; }
        const hasFile = (dt.files && dt.files.length>0) || Array.from(dt.items||[]).some(it=> it.kind==='file' || (it.type && it.type.startsWith('image/')));
        if (hasFile || (dt.types && (dt.types.includes('Files') || dt.types.includes('image/png')))) {
          wrap._tuckitPasteArmed = true;
          wrap._tuckitDragArmed = true;
          scheduleAttachExpand();
        }
      } catch { scheduleAttachExpand(); }
    };
    el.addEventListener('paste', handleFilePaste, true);
    wrap.addEventListener('paste', handleFilePaste, true);

    document.addEventListener('change', (e)=>{
      if (e.target && e.target.matches && e.target.matches('input[type=file]')) {
        arm(); scheduleAttachExpand();
      }
    }, true);

    if (!wrap._tuckitAttachPoll) {
      wrap._tuckitAttachPoll = true;
      const attObs = new MutationObserver(()=>{
        if (wrap._tuckitSyncing) return;
        const cnt = getDeepSeekAttachmentEls(wrap).length;
        if (!wrap._tuckitFirstAttachHandledThisTurn && cnt>0 && (wrap._tuckitLastAttachCount||0)===0 && (wrap._tuckitDragArmed || wrap._tuckitPasteArmed)) {
          scheduleAttachExpand();
        } else if (cnt===0 && wrap._tuckitFirstAttachHandledThisTurn) {
          // keep reset for removal handled in afterSendCollapse
        }
        // update count non-destructively
        if (!wrap._tuckitFirstAttachHandledThisTurn) wrap._tuckitLastAttachCount = cnt;
      });
      attObs.observe(wrap, {childList:true, subtree:true});
      wrap._tuckitAttachPollObs = attObs;
    }
  }

  // === NO-FLICKER STABLE PASTE HANDLER ===
  const stablePasteResize = () => {
    // double rAF: wait for DOM insertion + scrollHeight update
    requestAnimationFrame(()=>{
      requestAnimationFrame(()=>{
        if (!wrap.isConnected) return;
        if (wrap._tuckitUserTucked) {
          // if user manually tucked, keep floor but ensure not clipped
          syncTuckSizes(wrap, el, wrap._tuckitManualFloor ?? computeMinimalH(wrap, el));
        } else {
          queueAutoResize(el, wrap, btn, {force:true, ignoreFloor:true});
        }
        // for large text, ensure caret at bottom visible without center-jump
        if (el.tagName === 'TEXTAREA' && el.value.length > 2000) {
          el.scrollTop = el.scrollHeight;
        }
      });
    });
  };

  el.addEventListener('input', () => {
    saveCaretFromEl(el);
    const nowEmpty = isEditorEmpty(el); const wasNotEmpty = wrap._wasNotEmpty; wrap._wasNotEmpty =!nowEmpty;
    if (wasNotEmpty && nowEmpty) { afterSendCollapse(wrap, btn, el); return; }
    hideToggle(btn);
    if (wrap._tuckitUserTucked) { syncTuckSizes(wrap, el, wrap._tuckitManualFloor?? computeMinimalH(wrap, el)); return; }
    qr({});
  });

  el.addEventListener('paste', (e) => {
    saveCaretFromEl(el); wrap._wasNotEmpty = true;
    // don't force to minH first — that was flicker root cause
    // file paste is handled by file handler above; for text paste do stable resize
    try {
      const dt = e.clipboardData;
      const isFile = dt && ((dt.files && dt.files.length>0) || Array.from(dt.items||[]).some(it=> it.kind==='file'));
      if (isDeepSeek && isFile && !wrap._tuckitFirstAttachHandledThisTurn) {
        // let attach handler expand, skip text resize
        return;
      }
    } catch {}
    stablePasteResize();
  });

  el.addEventListener('drop', () => {
    wrap._wasNotEmpty = true;
    stablePasteResize();
  });

  el.addEventListener('cut', () => { saveCaretFromEl(el); queueAutoResize(el, wrap, btn, {}); });
  el.addEventListener('compositionend', () => { saveCaretFromEl(el); queueAutoResize(el, wrap, btn, {}); });
  el.addEventListener('keyup', e => { if (e.key === 'Backspace' || e.key === 'Delete') { saveCaretFromEl(el); queueAutoResize(el, wrap, btn, {}); } });
  el.addEventListener('focus', () => {
    activeWrap = wrap; activeBtn = btn; showUI(btn); if (isMeta) hideFakeScrollbars(wrap); makeFat(el, wrap);
    if (isDeepSeek) { pinDeepSeekFooter(wrap); hideDeadScrollbarsDeepSeek(wrap, el); }
    if (isChatGPT || isOpenWebUI) pinChatGPTFooter(wrap);
    if (wrap._tuckitUserTucked) syncTuckSizes(wrap, el, wrap._tuckitManualFloor?? computeMinimalH(wrap, el)); else qr({});
    saveCaretFromEl(el);
  });

  try { localStorage.removeItem(KEY); if (hasGM) GM_setValue(KEY, 'native'); } catch {}
  applyMode(el, wrap, btn, 'native'); makeFat(el, wrap);
  if (isDeepSeek) { pinDeepSeekFooter(wrap); hideDeadScrollbarsDeepSeek(wrap, el); attachDeepSeekDeadSbKiller(wrap, el); }
  if (isChatGPT || isOpenWebUI) pinChatGPTFooter(wrap);
  const minH0 = getMinH(); wrap._tuckitManualFloor = minH0; wrap._tuckitWasEmpty = isEditorEmpty(el); wrap._tuckitUserTucked = false;
  if (isEditorEmpty(el)) { applyMode(el, wrap, btn, 'compact'); save('compact'); scheduleSingleFirstAfterRefresh(el, 'first'); }
  else queueAutoResize(el, wrap, btn, {});
  if (isMeta) setTimeout(() => attachMetaFakeSbKiller(wrap), 200);
  if (isChatGPT || isOpenWebUI) { setTimeout(() => { const nb = wrap.querySelector('button[aria-label="Expand"]'); if (nb) nb.style.setProperty('display','none','important'); }, 300); }
  installSyncObserver(wrap, el, btn); hookSendActions(wrap, btn, el);
}

function bootNow(allowNewMeta = false) {
  if (tuckitDisabled) { removeExpandHide(); return; }
  if (_metaTransitionFromHome) return;
  addExpandHide();
  document.querySelectorAll(SELECTORS).forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.width >= 60 && r.height >= 16 && r.bottom > innerHeight * 0.30) { if (allowNewMeta ||!isNewChat()) inject(el); }
  });
  let queue = []; let scheduled = false;
  const obs = new MutationObserver(muts => {
    if (tuckitDisabled) return; if (!allowNewMeta && isNewChat()) return; if (_metaTransitionFromHome) return;
    muts.forEach(m => { m.addedNodes.forEach(n => { if (n.nodeType === 1) queue.push(n); }); });
    if (scheduled) return; scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false; const batch = queue.splice(0,30); batch.forEach(n => scanNode(n, allowNewMeta));
      if (queue.length) { scheduled = true; requestAnimationFrame(() => { scheduled = false; const batch2 = queue.splice(0,30); batch2.forEach(n => scanNode(n, allowNewMeta)); }); }
    });
  });
  obs.observe(document.documentElement, { childList: true, subtree: true });
}

function bootMetaHomeDelayed() {
  if (tuckitDisabled) return;
  startNewChatWatcher();
}
function startNewChatWatcher() {
  if (tuckitDisabled) return;
  if (_newChatWatcher) { clearInterval(_newChatWatcher); _newChatWatcher = null; }
  _newChatWatcherTries = 0;
  _newChatWatcher = setInterval(() => {
    _newChatWatcherTries++;
    try {
      if (tuckitDisabled) { clearInterval(_newChatWatcher); _newChatWatcher = null; return; }
      if (!isNewChat()) {
        clearInterval(_newChatWatcher); _newChatWatcher = null;
        if (isMeta) {
          bootMetaAfterFirstResponse();
        } else {
          setTimeout(()=> bootNow(false), 400);
        }
        return;
      }
      if (_newChatWatcherTries > 600) { clearInterval(_newChatWatcher); _newChatWatcher = null; }
    } catch {
      clearInterval(_newChatWatcher); _newChatWatcher = null;
    }
  }, 500);
}
function stopNewChatWatcher() {
  if (_newChatWatcher) { clearInterval(_newChatWatcher); _newChatWatcher = null; }
  if (_metaHomeBootTimer) { clearTimeout(_metaHomeBootTimer); _metaHomeBootTimer = null; }
}

function boot() {
  if (tuckitDisabled) { removeExpandHide(); return; }
  if (_metaTransitionFromHome) return;
  if (isNewChat()) {
    cleanupTuckIT();
    removeExpandHide();
    startNewChatWatcher();
    return;
  }
  bootNow(false);
}

let _lastHref = location.href;
function checkUrlChange() {
  if (location.href === _lastHref) return;
  const prev = _lastHref; _lastHref = location.href;
  const nowNew = isNewChat(); const prevNew = isPrevNewChat(prev);
  if (nowNew) {
    cleanupTuckIT(); cleanupMetaResponseWait(); removeExpandHide();
    stopNewChatWatcher();
    if (isMeta) unfixMetaDoomScroll();
    startNewChatWatcher();
  } else if (!tuckitDisabled) {
    if (prevNew && !nowNew) {
      stopNewChatWatcher();
    if (isMeta) unfixMetaDoomScroll();
      if (isMeta) { bootMetaAfterFirstResponse(); }
      else { setTimeout(() => boot(), 500); }
    } else if (isMeta && prev && (prev.endsWith('meta.ai/') || prev.endsWith('meta.ai'))) {
      setTimeout(() => boot(), 2200);
    } else {
      setTimeout(() => boot(), 400);
    }
  }
}

(function() {
  const _push = history.pushState; const _replace = history.replaceState;
  history.pushState = function(...a) { const r = _push.apply(this, a); checkUrlChange(); return r; };
  history.replaceState = function(...a) { const r = _replace.apply(this, a); checkUrlChange(); return r; };
  window.addEventListener('popstate', checkUrlChange);
  setInterval(checkUrlChange, 1000);
})();

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
})();

