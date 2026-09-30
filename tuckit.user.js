// ==UserScript==
// @name         Drag to Resize, Click to Tuck, Made for AI Chats (TuckIT by RDT)
// @namespace    https://github.com/RolanDorisTech/tuckit
// @version      0.1.1-alpha.2
// @description  Does Meta AI input cover your chat? Does DeepSeek box get too big? TuckIT pins input to bottom so it NEVER covers messages. Drag teal bar to resize (smooth), triangle to tuck. For Meta AI & DeepSeek. By RDT - @RolanDorisTech
// @author       RDT - Rolan Doris Tech
// @supportURL   https://youtube.com/@RolanDorisTech
// @homepageURL  https://github.com/RolanDorisTech/tuckit
// @homepage     https://greasyfork.org/en/scripts/597734
// @updateURL    https://raw.githubusercontent.com/RolanDorisTech/tuckit/main/tuckit.user.js
// @downloadURL  https://raw.githubusercontent.com/RolanDorisTech/tuckit/main/tuckit.user.js
// @match        *://*.deepseek.com/*
// @match        *://deepseek.com/*
// @match        *://*.meta.ai/*
// @match        *://*.facebook.com/ai/*
// @match        *://*.facebook.com/*ai*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-idle
// @license      Apache-2.0
// ==/UserScript==
(() => {
'use strict';
if (window.top !== window.self) return;
const host = location.hostname;
const isMeta = /meta\.ai|facebook/i.test(host);
const isDeepSeek = /deepseek\.com/i.test(host);
if (!isMeta && !isDeepSeek) return;
if (/facebook\.com/i.test(host) && !location.href.toLowerCase().includes('/ai')) return;
const SELECTORS = isMeta ? 'div[data-lexical-editor="true"],div[contenteditable="true"][role="textbox"]' : 'textarea[placeholder="Message DeepSeek"],#prompt-textarea,textarea[name="prompt"],div[data-lexical-editor="true"],div[contenteditable="true"][role="textbox"]';
const KEY = `tuckit_mode_${location.hostname}`;
const hasGM = typeof GM_getValue === 'function';
const save = m => hasGM ? GM_setValue(KEY, m) : localStorage.setItem(KEY, m);
if (typeof GM_addStyle !== 'function') window.GM_addStyle = c => { const s=document.createElement('style'); s.textContent=c; document.head.appendChild(s); };
GM_addStyle(`
.tuckit-handle{position:absolute!important;left:0!important;right:0!important;top:0!important;height:6px!important;cursor:ns-resize!important;z-index:2147483646!important;display:flex!important;justify-content:center!important;touch-action:none!important;background:#083c48!important;border-radius:inherit!important;opacity:1!important;transition:opacity .3s ease,background .2s!important;box-sizing:border-box!important}
.tuckit-handle:hover{background:#0a4e5e!important}
.tuckit-handle::before{content:''!important;position:absolute!important;top:-14px!important;bottom:-14px!important;left:0!important;right:0!important}
.tuckit-handle::after{content:''!important;width:40px!important;height:3px!important;border-radius:99px!important;background:rgba(255,255,255,.78)!important;margin-top:1.5px!important}
.tuckit-handle.tuckit-faded{opacity:0!important}
.tuckit-toggle{position:absolute!important;top:10px!important;right:47px!important;width:28px!important;height:28px!important;border-radius:8px!important;background:#1dcbf2!important;color:#FFEE8C!important;border:1px solid rgba(0,0,0,.1)!important;z-index:2147483647!important;cursor:pointer!important;font-weight:900!important;box-shadow:0 1px 5px rgba(0,0,0,.18)!important;display:flex!important;align-items:center!important;justify-content:center!important;user-select:none!important;opacity:1!important;flex-direction:column!important;padding:0!important;line-height:0!important;transition:opacity .3s!important}
.tuckit-toggle::before{content:''!important;position:absolute!important;top:-12px!important;bottom:-12px!important;left:-12px!important;right:-12px!important}
.tuckit-toggle.tuckit-faded{opacity:0!important}
.tuckit-ico{display:flex!important;flex-direction:column!important;align-items:center!important;gap:3px!important;pointer-events:none!important}
.tuckit-tri{width:0!important;height:0!important;border-left:5px solid transparent!important;border-right:5px solid transparent!important;display:block!important}
.tuckit-tri.up{border-bottom:5px solid #FFEE8C!important}
.tuckit-tri.down{border-top:5px solid #FFEE8C!important}
.tuckit-wrap-fixed{transform:none!important;overflow:hidden!important;box-sizing:border-box!important;padding-top:14px!important;will-change:height!important;contain:layout paint!important;gap:0!important;row-gap:0!important;column-gap:0!important;display:flex!important;flex-direction:column!important}
.tuckit-wrap-fixed > div{margin-top:0!important;gap:0!important}
.tuckit-wrap-fixed div{scrollbar-width:none!important}
.tuckit-wrap-fixed div::-webkit-scrollbar{width:0!important;display:none!important}
.tuckit-fat-scroll{scrollbar-width:thin!important;scrollbar-color:#6e6e6e rgba(0,0,0,.12)!important}
.tuckit-fat-scroll::-webkit-scrollbar{width:12px!important;height:12px!important;display:block!important}
.tuckit-fat-scroll::-webkit-scrollbar-track{margin-top:14px!important}
.tuckit-wrap-fixed textarea,.tuckit-wrap-fixed [contenteditable="true"],.tuckit-wrap-fixed div[data-lexical-editor="true"]{overflow-y:auto!important;overscroll-behavior:contain!important;overflow-x:hidden!important;scrollbar-width:thin!important;scrollbar-gutter:auto!important;padding-right:49px!important;box-sizing:border-box!important;margin-top:0!important;flex:1 1 auto!important}
.tuckit-wrap-fixed textarea::-webkit-scrollbar,.tuckit-wrap-fixed [contenteditable="true"]::-webkit-scrollbar,.tuckit-wrap-fixed div[data-lexical-editor="true"]::-webkit-scrollbar{width:12px!important;display:block!important;background:transparent!important}
.tuckit-wrap-fixed textarea::-webkit-scrollbar-track,.tuckit-wrap-fixed [contenteditable="true"]::-webkit-scrollbar-track,.tuckit-wrap-fixed div[data-lexical-editor="true"]::-webkit-scrollbar-track{background:rgba(0,0,0,.1)!important;border-radius:10px!important;margin-top:14px!important;margin-bottom:4px!important}
.tuckit-wrap-fixed textarea::-webkit-scrollbar-thumb,.tuckit-wrap-fixed [contenteditable="true"]::-webkit-scrollbar-thumb,.tuckit-wrap-fixed div[data-lexical-editor="true"]::-webkit-scrollbar-thumb{background:#8a8a8a!important;background-clip:content-box!important;border:3px solid transparent!important;border-right-width:0px!important;border-radius:12px!important;min-height:60px!important}
.tuckit-tip{position:fixed!important;z-index:2147483648!important;background:#111!important;color:#FFEE8C!important;padding:5px 9px!important;border-radius:6px!important;font-size:12px!important;font-weight:700!important;pointer-events:none!important;white-space:nowrap!important;display:none;border:1px solid rgba(255,238,140,.4)!important}
.tuckit-tip-hotkey{position:fixed!important;z-index:2147483647!important;background:#1a1a1a!important;color:#8a8a8a!important;padding:3px 6px!important;border-radius:4px!important;font-size:9px!important;pointer-events:none!important;white-space:nowrap!important;display:none;border:1px solid rgba(255,255,255,.08)!important;font-family:ui-monospace,monospace!important;letter-spacing:.2px!important;opacity:0!important;transition:opacity .22s!important}
.tuckit-tip-hotkey.tuckit-visible{opacity:1!important}
#tuckit-toast{position:fixed!important;bottom:22px!important;left:50%!important;transform:translateX(-50%)!important;background:#111!important;color:#FFEE8C!important;padding:8px 14px!important;border-radius:8px!important;z-index:2147483649!important;font-size:12px!important;border:1px solid rgba(255,238,140,.4)!important;display:none;box-shadow:0 4px 12px rgba(0,0,0,.4)!important}
.tuckit-wrap-fixed [data-thumb="true"],.tuckit-wrap-fixed [data-track="true"],.tuckit-wrap-fixed [data-scrollbar-thumb],.tuckit-wrap-fixed [data-scrollbar-track]{display:none!important;visibility:hidden!important;width:0!important;height:0!important}
.tuckit-ds-footer{position:absolute!important;bottom:0!important;left:0!important;right:0!important;z-index:6!important;background:inherit!important;margin:0!important;flex-shrink:0!important;overflow:hidden!important}
.tuckit-ds-textarea-wrap{overflow:hidden!important;display:flex!important;flex-direction:column!important;flex:1 1 auto!important;scrollbar-width:none!important;max-height:100%!important;margin:0!important;margin-top:0!important;padding-top:0!important;gap:0!important}
.tuckit-ds-attach{flex-shrink:0!important;overflow:visible!important;min-height:0!important;max-height:none!important;overflow-y:visible!important;scrollbar-width:none!important;display:block!important;margin:0!important;margin-bottom:8px!important;padding-bottom:0!important;gap:0!important}
.tuckit-wrap-fixed[data-tuckit-deepseek]{overflow:hidden!important;scrollbar-width:none!important;gap:0!important}
.tuckit-wrap-fixed[data-tuckit-deepseek="1"]{padding-right:7px!important}
.tuckit-wrap-fixed[data-tuckit-deepseek="1"] .tuckit-toggle{right:28px!important}
`);
let disabled = hasGM ? GM_getValue('tuckit_disabled', false) : localStorage.getItem('tuckit_disabled')==='1';
let dragging=null, activeWrap=null, activeBtn=null;
let tipEl=null, hkEl=null, hkKEl=null, hk2El=null, lastToggle=0, lastExpanded=0;
let seen=new WeakSet(), _lastCaret={el:null,range:null,taS:null,taE:null,time:0};
let _metaObs=null,_metaTimer=null,_homeWatch=null,_homeTries=0;
let _bootObs=null, _bootT=null, _wraps=[];
const isEditable = el=> el && (el.tagName==='TEXTAREA'|| el.isContentEditable || el.getAttribute?.('contenteditable')==='true');
const isInCode = el=> { try{return !!el.closest('pre,code,.ds-markdown-code-block,[class*="code-block"],[class*="hljs"],[class*="shiki"],[class*="markdown"] code');}catch{return false;} };
const isEmpty = el=>{ if(!el) return true; if(el.tagName==='TEXTAREA') return !el.value.trim(); const t=(el.innerText||el.textContent||'').trim(); if(t) return false; const h=(el.innerHTML||'').replace(/<br\s*\/?>/gi,'').replace(/<p[^>]*>(\s|&nbsp;)*?<\/p>/gi,'').trim(); return !h; };
function saveCaret(el){ try{ if(!el) return; if(el.tagName==='TEXTAREA'){ _lastCaret={el,taS:el.selectionStart,taE:el.selectionEnd,range:null,time:Date.now()}; return; } const sel=window.getSelection(); if(sel&&sel.rangeCount){ const r=sel.getRangeAt(0); if(el.contains(r.commonAncestorContainer)||el===r.commonAncestorContainer||el.contains(r.startContainer)) _lastCaret={el,range:r.cloneRange(),taS:null,taE:null,time:Date.now()}; } }catch{} }
document.addEventListener('selectionchange',()=>{ try{ const ae=document.activeElement; if(!ae||!isEditable(ae)) return; const ed=ae.tagName==='TEXTAREA'?ae:(ae.closest?.('div[data-lexical-editor="true"],div[contenteditable="true"][role="textbox"]')||ae); saveCaret(ed);}catch{} });
['keyup','focusin'].forEach(ev=> document.addEventListener(ev,e=>{ if(isEditable(e.target)) saveCaret(e.target); }));
document.addEventListener('mouseup',e=>{ if(isEditable(e.target)) setTimeout(()=>saveCaret(e.target),10); });
function resetAnc(ed){ try{ let c=ed.parentElement; while(c&&c!==document.body){ if(c.scrollTop) c.scrollTop=0; if(c.scrollLeft) c.scrollLeft=0; if(c.classList&&c.classList.contains('tuckit-wrap-fixed')) break; c=c.parentElement; } }catch{} }
function scrollEdIntoView(ed,mode){ try{ if(mode==='first'){ resetAnc(ed); ed.scrollTop=0; return; } scrollCaretIntoView(ed); resetAnc(ed); }catch{} }
function scrollTAIntoView(ta,mode){ try{ if(mode==='first'){ resetAnc(ta); ta.scrollTop=0; return; } if(ta.value.length>2000){ ta.scrollTop=ta.scrollHeight; return; } const pos=ta.selectionEnd; if(pos==null) return; const cs=getComputedStyle(ta); const lh=parseFloat(cs.lineHeight)||20; const textBefore=ta.value.slice(0,pos); const avgCharW=parseFloat(cs.fontSize)*0.6||8; const charsPerLine=Math.max(1, Math.floor(ta.clientWidth/avgCharW)); let wrappedLines=0; textBefore.split('\n').forEach(line=>{ wrappedLines+=Math.max(1, Math.ceil(line.length/charsPerLine)); }); const target=Math.max(0, wrappedLines*lh - ta.clientHeight/2); const maxScroll=Math.max(0, ta.scrollHeight - ta.clientHeight); ta.scrollTop=Math.min(maxScroll, target); }catch{} }
function scrollCaretIntoView(el){ try{ if(!el) return; if(el.tagName==='TEXTAREA'){ scrollTAIntoView(el,'caret'); return; } const sel=window.getSelection(); if(!sel||!sel.rangeCount) return; const r=sel.getRangeAt(0).cloneRange(); const rect=r.getBoundingClientRect(); if(!rect||(rect.top===0&&rect.bottom===0)) return; const er=el.getBoundingClientRect(); if(rect.bottom>er.bottom-8){ el.scrollTop+=rect.bottom-er.bottom+22; } else if(rect.top<er.top+8){ el.scrollTop-=er.top-rect.top+22; } }catch{} }
function reveal(el,mode,saved){ if(!el) return; try{ el.focus({preventScroll:true}); }catch{ try{el.focus();}catch{} } if(el.tagName==='TEXTAREA'){ if(saved?.taS!=null){ try{ el.setSelectionRange(saved.taS,saved.taE??saved.taS);}catch{} } mode==='first'? scrollTAIntoView(el,'first'): scrollTAIntoView(el,'caret'); } else { if(saved?.range){ const sel=window.getSelection(); try{ sel.removeAllRanges(); sel.addRange(saved.range.cloneRange()); }catch{} } scrollEdIntoView(el,mode); } try{ el.focus({preventScroll:true}); }catch{ try{el.focus();}catch{} } }
function getEl(cls){ let e=document.querySelector('.'+cls); if(!e){ e=document.createElement('div'); e.className=cls; document.body.appendChild(e); } return e; }
function showToast(m){ let t=document.getElementById('tuckit-toast'); if(!t){ t=document.createElement('div'); t.id='tuckit-toast'; document.body.appendChild(t); } t.textContent=m; t.style.display='block'; if(t._h) clearTimeout(t._h); t._h=setTimeout(()=>{ t.style.display='none'; },2500); }
function placeAbove(tip,wrap,extra=0){ if(!wrap||!tip) return; const r=wrap.getBoundingClientRect(); tip.style.display='block'; requestAnimationFrame(()=>{ const w=tip.offsetWidth,h=tip.offsetHeight; let l=r.left+r.width/2-w/2; l=Math.max(8,Math.min(l,innerWidth-w-8)); let tp=r.top-h-10-extra; if(tp<8) tp=8; tip.style.left=l+'px'; tip.style.top=tp+'px'; }); }
function hideTips(){ [tipEl,hkEl,hkKEl,hk2El].forEach(x=>{ if(!x) return; x.classList?.remove('tuckit-visible'); x.style.display='none'; }); document.querySelectorAll('.tuckit-wrap-fixed').forEach(w=>{ w._ttSched=false; if(w._offT) clearTimeout(w._offT); clearTimeout(w._refT); }); clearTimeout(window._btn2T); }
function getMinH(){ return 132; }
function computeMaxH(){ let pct=isDeepSeek?0.78:0.85; const raw=Math.floor(innerHeight*pct); return Math.max(raw,getMinH()*2+20); }
function getMetaBar(wrap){ try{ const r=wrap.getBoundingClientRect(); let btn=Array.from(wrap.querySelectorAll('button')).find(b=> (b.textContent||'').trim()==='Thinking'); if(btn){ let cur=btn; for(let i=0;i<6&&cur&&cur!==wrap;i++){ const cr=cur.getBoundingClientRect(); if(cr.height>28&&cr.height<110&&cr.bottom>=r.bottom-40&&cur.querySelectorAll('button').length>=1) return cur; cur=cur.parentElement; } } const cands=Array.from(wrap.querySelectorAll('div')).filter(d=>{ const cr=d.getBoundingClientRect(); return cr.height>28&&cr.height<110&&cr.bottom>=r.bottom-30&&d.querySelectorAll('button').length>=2; }); cands.sort((a,b)=>b.getBoundingClientRect().bottom-a.getBoundingClientRect().bottom); return cands[0]||null; }catch{return null;} }
function getMetaBarH(wrap){ const el=getMetaBar(wrap); return el?el.offsetHeight:52; }
function findDSFooter(wrap){ try{ let el=wrap.querySelector('.ec4f5d61'); if(el&&el!==wrap){ const h=el.getBoundingClientRect().height; if(h>0&&h<140) return el; } const all=Array.from(wrap.querySelectorAll('div')).filter(d=>d!==wrap); const small=all.filter(d=>{ const r=d.getBoundingClientRect(); return r.height>20&&r.height<140&&r.width>100; }); for(let i=small.length-1;i>=0;i--){ const d=small[i]; if((d.textContent||'').includes('DeepThink')&&d.querySelector('button')) return d; } const cands=small.filter(d=>{ const bc=d.querySelectorAll('button').length; return bc>=2&&bc<=5; }); if(cands.length){ cands.sort((a,b)=>b.getBoundingClientRect().bottom-a.getBoundingClientRect().bottom); return cands[0]; } }catch{} return null; }
function getDSFooter(wrap){ try{ const c=wrap._dsFc; if(c&&c.isConnected&&wrap.contains(c)&&Date.now()-(wrap._dsFcT||0)<1500) return c; }catch{} const f=findDSFooter(wrap); wrap._dsFc=f; wrap._dsFcT=Date.now(); return f; }
function getDSFooterH(wrap){ try{ const f=getDSFooter(wrap); if(!f||f===wrap) return 72; const h=Math.ceil(f.getBoundingClientRect().height); return (h>0&&h<140)?h:72; }catch{return 72;} }
function getDSAttachEls(wrap){
  if(!wrap) return [];
  const els=[], seenS=new Set();
  const editor = wrap.querySelector('textarea, div[data-lexical-editor="true"], div[contenteditable="true"][role="textbox"]');
  const footer = getDSFooter(wrap);
  const topChild = (node)=>{ if(!node) return null; let cur=node; while(cur && cur.parentElement!==wrap && cur.parentElement){ cur=cur.parentElement; } return (cur && cur.parentElement===wrap)? cur : null; };
  const isEditorLineage = (node)=>{ if(!node) return true; if(node===wrap) return true; if(editor){ if(node===editor) return true; if(node.contains && node.contains(editor)) return true; if(editor.contains && editor.contains(node)) return true; } return false; };
  const isFooterLineage = (node)=>{ if(!footer) return false; return node===footer||node.contains(footer)||footer.contains(node); };
  const directDivs = Array.from(wrap.children).filter(c=>c.tagName==='DIV');
  directDivs.forEach(d=>{
    if(isEditorLineage(d)||isFooterLineage(d)) return;
    const t=d.textContent||'';
    if(t.includes('Paste original')){ const tc=topChild(d)||d; if(!seenS.has(tc)){ seenS.add(tc); els.push(tc); } return; }
    if(d.querySelector('button') && /\.(txt|html|js|py|json|md|pdf|docx?|png|jpg|jpeg|webp|gif|bmp|svg)$/i.test((t||'').trim().split(/\s+/).slice(-1)[0] || '') ){
      const tc=topChild(d)||d; if(!seenS.has(tc)){ seenS.add(tc); els.push(tc); } return;
    }
    let hasMedia=false;
    try{ if(d.querySelectorAll('img,canvas,video').length>0) hasMedia=true; }catch{}
    if(!hasMedia){ try{ if(d.querySelector('[style*="background-image"]')) hasMedia=true; }catch{} }
    if(hasMedia){ const tc=topChild(d)||d; if(!seenS.has(tc)){ seenS.add(tc); els.push(tc); } }
  });
  return els;
}
function getDSAttachH(wrap){
  const els=getDSAttachEls(wrap); if(!els.length) return 0;
  let total=0;
  els.forEach(e=>{
    let h=0;
    try{
      const r=e.getBoundingClientRect();
      h=r.height || e.scrollHeight || 0;
      if(h===0){ h = e.querySelector('img')? 80 : 65; }
      if(e.querySelector('img,canvas,video')) h=Math.max(h, 65);
      h=Math.min(h, 160);
    }catch{ h=75; }
    total+=h+6;
  });
  const per=70, std=Math.max(total, els.length*per+8, 70);
  return Math.min(std, 260);
}
function getBaseH(wrap){
  const min=getMinH(), ah=getDSAttachH(wrap), fh=getDSFooterH(wrap);
  return ah>0? Math.max(min, ah+32+fh+8) : min;
}
function getFooterH(wrap){ return isMeta? (Number.isFinite(wrap._metaFH)?wrap._metaFH:getMetaBarH(wrap)) : getDSFooterH(wrap); }
function getAttachH(wrap){ return isDeepSeek?getDSAttachH(wrap):0; }
function getExtra(wrap){ return isDeepSeek?16:(12+(wrap&&wrap._adj||0)); }
function getEditorTargetH(wrap,tgt){ const fh=getFooterH(wrap), ah=getAttachH(wrap); const extra=getExtra(wrap); return Math.max(isDeepSeek?60:40, tgt-fh-ah-extra); }
function computeMinimalH(wrap,el){
  try{
    const cs=el?getComputedStyle(el):null; let lh=cs?parseFloat(cs.lineHeight):NaN;
    if(!lh||isNaN(lh)){ const fs=cs?parseFloat(cs.fontSize):16; lh=fs*1.5; }
    // FIX alpha-1: give Meta 2.5 lines + breathing room so bottom line is never half-clipped
    const minInput=isMeta? (lh*2.5+18) : (lh*2+14);
    let fh=0, ah=0;
    if(isMeta) fh=getMetaBarH(wrap); else{ fh=getDSFooterH(wrap); ah=getDSAttachH(wrap);}
    const pad=isMeta?28:16;
    const h=Math.ceil(minInput+fh+ah+pad);
    return Math.max(h,getMinH());
  }catch{return getMinH();}
}
function findFeed(wrap){ if(wrap._feed) return wrap._feed; if(wrap._feed===null) return null; let cur=wrap.parentElement; for(let i=0;i<12&&cur&&cur!==document.documentElement;i++){ try{ const sh=cur.scrollHeight,ch=cur.clientHeight; if(sh>ch+200&&ch>300){ const cs=getComputedStyle(cur); if(cs.overflowY==='auto'||cs.overflowY==='scroll'){ wrap._feed=cur; return cur; } } }catch{} cur=cur.parentElement; } wrap._feed=null; return null; }
function fixMetaScroll(wrap){ if(!isMeta||!wrap) return; try{ const feed=findFeed(wrap); if(feed){ feed.style.setProperty('overscroll-behavior','contain','important'); const max=feed.scrollHeight-feed.clientHeight; if(max>=0&&feed.scrollTop>max) feed.scrollTop=max; document.documentElement.style.setProperty('overflow','hidden','important'); document.body.style.setProperty('overflow','hidden','important'); } else { const maxW=Math.max(0,document.documentElement.scrollHeight-innerHeight); if(scrollY>maxW) scrollTo(0,maxW); } }catch{} }
function unfixMeta(){ try{ document.documentElement.style.removeProperty('overflow'); document.body.style.removeProperty('overflow'); }catch{} }
function isValidWrapCandidate(cur,el){ if(!cur||cur===document.body) return false; if(cur.closest?.('pre,code')) return false; const bigPre = cur.querySelector(':scope > pre, :scope > div > pre'); if(bigPre){ const rh=bigPre.getBoundingClientRect().height; if(rh>250) return false; } const r=cur.getBoundingClientRect(); if(r.width<320||r.width>950||r.height>700||r.height<40) return false; if(r.bottom < innerHeight-380) return false; try{ const cs=getComputedStyle(cur); const bg=cs.backgroundColor; const hasBg=bg&&bg!=='rgba(0, 0, 0, 0)'&&bg!=='transparent'&&bg!==''; const rad=parseFloat(cs.borderRadius)||parseFloat(cs.borderTopLeftRadius)||0; if(!hasBg||rad<=8) return false; }catch{return false;} return true; }
function getWrap(el){ if(isMeta){ let cur=el.parentElement, cands=[]; for(let i=0;i<14&&cur&&cur!==document.body;i++){ if(cur.isContentEditable||cur.getAttribute?.('contenteditable')==='true'){ cur=cur.parentElement; continue; } if(isValidWrapCandidate(cur,el)) cands.push({el:cur,area:cur.getBoundingClientRect().width*cur.getBoundingClientRect().height}); cur=cur.parentElement; } if(cands.length){ cands.sort((a,b)=>a.area-b.area); return cands[0].el; } return el.closest('form')||el.parentElement; } let cur=el.parentElement, cands=[]; for(let i=0;i<16&&cur&&cur!==document.body;i++){ if(isValidWrapCandidate(cur,el)) cands.push({el:cur,area:cur.getBoundingClientRect().width*cur.getBoundingClientRect().height}); cur=cur.parentElement; } if(cands.length){ cands.sort((a,b)=>a.area-b.area); return cands[0].el; } return el.closest('form')||el.parentElement; }
function getDirectChildWrapper(wrap, el){ let cur = el.parentElement; while(cur && cur!== wrap){ if(cur.parentElement === wrap) return cur; cur = cur.parentElement; } if(el.parentElement && el.parentElement!== wrap) return el.parentElement; return null; }
function verifyFit(wrap,el){
  if(!isMeta||!wrap||!el||wrap._animating||wrap._syncing||dragging) return;
  try{
    if(wrap.dataset.locked!=='1'||!wrap.isConnected) return;
    const wr=wrap.getBoundingClientRect(), er=el.getBoundingClientRect();
    let limit=wr.bottom-getFooterH(wrap);
    const bar=getMetaBar(wrap);
    if(bar){ const bt=bar.getBoundingClientRect().top; if(bt>er.top+20) limit=Math.min(limit,bt); }
    const over=Math.round(er.bottom-limit);
    if(over>0){ // FIX alpha-1: was >2, now >0 to catch half-line immediately
      const add=Math.max(over, 12);
      if((wrap._adj||0)<120){
        wrap._adj=Math.min(120,(wrap._adj||0)+add);
        wrap._forceExpandFix=true;
        syncSizes(wrap,el,wrap._lastH||wr.height);
      }
    }
  }catch{}
}
function syncSizes(wrap,el,target){
  if(!wrap||!el) return; if(wrap.dataset.locked!=='1') return; if(!Number.isFinite(target)) return;
  let finalT=target; const min=wrap._origMin||getMinH(), max=computeMaxH(); finalT=Math.max(min,Math.min(max,finalT));
  if(Math.abs(wrap.offsetHeight-finalT)<2 && wrap._lastH && Math.abs(wrap._lastH-finalT)<2){ const exp=getEditorTargetH(wrap,finalT); if(Math.abs(el.offsetHeight-exp)<3 && !wrap._forceExpandFix) return; }
  if(isDeepSeek){ pinDSFooter(wrap); hideDeadDS(wrap,el); }
  const fh=getFooterH(wrap), ah=getAttachH(wrap); const extra=getExtra(wrap); const eH = Math.max(isDeepSeek?60:40, finalT - fh - ah - extra);
  wrap._syncing=true;
  try{
    wrap.style.setProperty('height',`${finalT}px`,'important'); wrap.style.setProperty('min-height',`${finalT}px`,'important');
    wrap.style.setProperty('box-sizing','border-box','important'); wrap.style.setProperty('gap','0','important'); wrap.style.setProperty('row-gap','0','important');
    wrap._lastH=finalT; wrap._lastSync=Date.now();
    const tWrap = getDirectChildWrapper(wrap, el);
    if(isMeta){
      wrap._metaFH=fh;
      if(tWrap && tWrap!==el){ tWrap.style.setProperty('height',`${eH}px`,'important'); tWrap.style.setProperty('max-height',`${eH}px`,'important'); tWrap.style.setProperty('min-height','40px','important'); tWrap.style.setProperty('flex','1 1 auto','important'); tWrap.style.setProperty('display','flex','important'); tWrap.style.setProperty('flex-direction','column','important'); tWrap.style.setProperty('overflow','hidden','important'); tWrap.style.setProperty('margin','0','important'); tWrap.style.setProperty('gap','0','important'); }
      el.style.setProperty('height',`${eH}px`,'important'); el.style.setProperty('max-height',`${eH}px`,'important'); el.style.setProperty('min-height','40px','important'); el.style.setProperty('overflow-y','auto','important'); el.style.setProperty('flex','1 1 auto','important'); el.style.setProperty('margin','0','important');
    } else {
      wrap.style.setProperty('padding-bottom',`${fh+2}px`,'important');
      if(tWrap && tWrap!==wrap){ tWrap.classList.add('tuckit-ds-textarea-wrap'); tWrap.style.setProperty('height','auto','important'); tWrap.style.setProperty('max-height','none','important'); tWrap.style.setProperty('min-height','0px','important'); tWrap.style.setProperty('overflow','hidden','important'); tWrap.style.setProperty('display','flex','important'); tWrap.style.setProperty('flex-direction','column','important'); tWrap.style.setProperty('flex','1 1 auto','important'); tWrap.style.setProperty('margin','0','important'); tWrap.style.setProperty('margin-top','0','important'); tWrap.style.setProperty('gap','0','important'); let curPar = el.parentElement; while(curPar && curPar!== tWrap && curPar!== wrap){ curPar.style.setProperty('height','100%','important'); curPar.style.setProperty('min-height','0px','important'); curPar.style.setProperty('max-height','none','important'); curPar.style.setProperty('flex','1 1 auto','important'); curPar.style.setProperty('display','flex','important'); curPar.style.setProperty('flex-direction','column','important'); curPar.style.setProperty('margin','0','important'); curPar.style.setProperty('gap','0','important'); curPar = curPar.parentElement; } el.style.setProperty('height','100%','important'); el.style.setProperty('max-height','100%','important'); el.style.setProperty('min-height','0px','important'); el.style.setProperty('flex','1 1 auto','important'); el.style.setProperty('margin','0','important'); } else { el.style.setProperty('height','auto','important'); el.style.setProperty('max-height','none','important'); el.style.setProperty('min-height','0px','important'); el.style.setProperty('flex','1 1 auto','important'); } el.style.setProperty('overflow-y','auto','important'); pinDSFooter(wrap); hideDeadDS(wrap,el); }
    makeFat(el,wrap); const btn=wrap.querySelector(':scope >.tuckit-toggle'); if(btn){ updTri(btn,wrap); if(isDeepSeek){ btn.style.setProperty('right','28px','important'); } }
  }finally{
    setTimeout(()=>{ wrap._syncing=false; wrap._forceExpandFix=false; },40);
    if(isMeta&&!dragging){ clearTimeout(wrap._fitT); wrap._fitT=setTimeout(()=>verifyFit(wrap,el),120); }
  }
}
function makeFat(el,wrap){ if(!el) return; if(isDeepSeek){ el.classList.add('tuckit-fat-scroll'); if(wrap){ wrap.classList.remove('tuckit-fat-scroll'); wrap.style.setProperty('scrollbar-width','none','important'); wrap.style.setProperty('overflow','hidden','important'); wrap.style.setProperty('padding-right','7px','important'); } try{ el.style.setProperty('padding-right','41px','important'); el.style.setProperty('margin-right','7px','important'); el.style.setProperty('box-sizing','border-box','important'); el.style.setProperty('scrollbar-gutter','auto','important'); el.style.setProperty('overflow-y','auto','important'); el.style.setProperty('scrollbar-width','thin','important'); el.style.setProperty('overscroll-behavior','contain','important'); }catch{} return; } [el,wrap].forEach(c=>{ try{c.classList.add('tuckit-fat-scroll');}catch{} }); try{ el.style.setProperty('padding-right','49px','important'); el.style.setProperty('margin-right','0px','important'); el.style.setProperty('overscroll-behavior','contain','important'); if(isMeta) el.style.setProperty('padding-bottom','12px','important'); }catch{} }
function pinDSFooter(wrap){ if(!isDeepSeek||!wrap) return; const f=getDSFooter(wrap); if(!f) return; const fh=Math.ceil(f.getBoundingClientRect().height)||72; wrap.style.setProperty('position','relative','important'); wrap.style.setProperty('padding-bottom',(fh+2)+'px','important'); wrap.style.setProperty('box-sizing','border-box','important'); wrap.style.setProperty('overflow','hidden','important'); f.classList.add('tuckit-ds-footer'); f.style.setProperty('position','absolute','important'); f.style.setProperty('bottom','0','important'); f.style.setProperty('left','0','important'); f.style.setProperty('right','0','important'); f.style.setProperty('z-index','6','important'); f.style.setProperty('background','inherit','important'); }
function hideDeadDS(wrap,el){ if(!isDeepSeek||!wrap||!el) return; const footer=getDSFooter(wrap), attachSet=new Set(getDSAttachEls(wrap)); wrap.setAttribute('data-tuckit-deepseek','1'); wrap.style.setProperty('overflow','hidden','important'); wrap.style.setProperty('gap','0','important'); wrap.querySelectorAll(':scope > div').forEach(d=>{ if(d===el||d.contains(el)) { if(d!==el){ d.style.setProperty('overflow','hidden','important'); d.style.setProperty('margin','0','important'); d.style.setProperty('gap','0','important'); } return; } if(attachSet.has(d)){ d.classList.add('tuckit-ds-attach'); d.style.setProperty('margin','0','important'); d.style.setProperty('margin-bottom','8px','important'); d.style.setProperty('padding-bottom','0','important'); d.style.setProperty('overflow','visible','important'); d.style.setProperty('display','block','important'); d.style.setProperty('gap','0','important'); return; } if(d===footer) return; if(d.parentElement===wrap){ d.style.setProperty('overflow','hidden','important'); } }); const tWrap=getDirectChildWrapper(wrap,el); if(tWrap&&tWrap!==wrap){ tWrap.style.setProperty('overflow','hidden','important'); tWrap.style.setProperty('margin-top','0','important'); } }
function capInline(wrap){ return {position:wrap.style.position,left:wrap.style.left,right:wrap.style.right,width:wrap.style.width,bottom:wrap.style.bottom,margin:wrap.style.margin,transform:wrap.style.transform,overflow:wrap.style.overflow,boxSizing:wrap.style.boxSizing,zIndex:wrap.style.zIndex,height:wrap.style.height,display:wrap.style.display,flexDirection:wrap.style.flexDirection,paddingBottom:wrap.style.paddingBottom,paddingTop:wrap.style.paddingTop,gap:wrap.style.gap}; }
function restInline(wrap,o){ if(!o) return; for(const [p,v] of Object.entries(o)){ const cp=p.replace(/[A-Z]/g,m=>'-'+m.toLowerCase()); if(v) wrap.style.setProperty(cp,v); else wrap.style.removeProperty(cp); } }
function lockBottom(wrap){ if(wrap.dataset.locked==='1') return; wrap.dataset.orig=JSON.stringify(capInline(wrap)); wrap.style.setProperty('position','sticky','important'); wrap.style.setProperty('bottom','0','important'); wrap.style.setProperty('z-index','10','important'); wrap.style.setProperty('display','flex','important'); wrap.style.setProperty('flex-direction','column','important'); wrap.style.setProperty('overflow','hidden','important'); wrap.style.setProperty('box-sizing','border-box','important'); wrap.style.setProperty('padding-top','14px','important'); wrap.style.setProperty('gap','0','important'); wrap.classList.add('tuckit-wrap-fixed'); wrap.dataset.locked='1'; wrap._origMin=getMinH(); if(wrap._wasEmpty===undefined) wrap._wasEmpty=true; if(isDeepSeek) pinDSFooter(wrap); }
function unlockBottom(wrap){ if(isMeta) unfixMeta(); if(wrap.dataset.orig){ try{restInline(wrap,JSON.parse(wrap.dataset.orig));}catch{} } wrap.style.removeProperty('height'); wrap.style.removeProperty('min-height'); wrap.style.removeProperty('padding-bottom'); wrap.style.removeProperty('padding-top'); wrap.style.removeProperty('will-change'); wrap.style.removeProperty('contain'); wrap.style.removeProperty('gap'); wrap.style.removeProperty('row-gap'); wrap.classList.remove('tuckit-wrap-fixed'); delete wrap.dataset.locked; delete wrap.dataset.orig; delete wrap._origMin; delete wrap._metaFH; delete wrap._adj; if(wrap._metaObs){ wrap._metaObs.disconnect(); delete wrap._metaObs; } if(wrap._dsObs){ wrap._dsObs.disconnect(); delete wrap._dsObs; } if(wrap._resizeObs){ try{wrap._resizeObs.disconnect();}catch{} delete wrap._resizeObs; } wrap.querySelectorAll('div[contenteditable="true"],textarea').forEach(el=>{ el.style.removeProperty('height'); el.style.removeProperty('max-height'); el.style.removeProperty('min-height'); el.style.removeProperty('overflow-y'); el.style.removeProperty('flex'); el.style.removeProperty('margin'); el.style.removeProperty('padding-bottom'); el.classList.remove('tuckit-fat-scroll'); }); if(isDeepSeek){ const f=getDSFooter(wrap); if(f){ f.classList.remove('tuckit-ds-footer'); f.style.removeProperty('position'); f.style.removeProperty('bottom'); f.style.removeProperty('left'); f.style.removeProperty('right'); } wrap.querySelectorAll('.tuckit-ds-attach').forEach(a=>{ a.classList.remove('tuckit-ds-attach'); a.style.removeProperty('margin'); a.style.removeProperty('margin-bottom'); }); } }
function renderTri(btn,state){ if(!btn) return; btn.innerHTML=''; const ico=document.createElement('span'); ico.className='tuckit-ico'; const t1=document.createElement('span'),t2=document.createElement('span'); t1.className='tuckit-tri'; t2.className='tuckit-tri'; if(state==='expanded'){ t1.classList.add('down'); t2.classList.add('up'); }else{ t1.classList.add('up'); t2.classList.add('down'); } ico.appendChild(t1); ico.appendChild(t2); btn.appendChild(ico); }
function updTri(btn,wrap){ if(!btn||!wrap) return; let state='collapsed'; const max=computeMaxH(); if(isDeepSeek){ const base=getBaseH(wrap), ah=getDSAttachH(wrap); const thr=ah>0? base+30 : max*0.5; if(wrap.offsetHeight>thr) state='expanded'; } else { if(wrap.offsetHeight>max*0.5) state='expanded'; } btn.dataset.state=state; renderTri(btn,state); }
function autoMeta(el,wrap,btn,opts={}){
  if(!isMeta||!el||!wrap) return;
  if(wrap.dataset.locked!=='1') return;
  if(wrap._dragLocked && !opts.force){
    const lockedH = Number.isFinite(wrap._manual) ? wrap._manual : (wrap._origMin||getMinH());
    syncSizes(wrap,el,lockedH);
    if(isEmpty(el)) el.scrollTop=0;
    return;
  }
  if(wrap._userTucked&&!opts.force&&!opts.ignore){
    const fl=Number.isFinite(wrap._manual)?wrap._manual: getMinH();
    syncSizes(wrap,el,fl);
    if(isEmpty(el)) el.scrollTop=0;
    return;
  }
  const min=wrap._origMin||getMinH(), max=computeMaxH(), fh=wrap._metaFH||getMetaBarH(wrap);
  wrap._metaFH=fh;
  const empty=isEmpty(el), wasEmpty=wrap._wasEmpty!==false;
  let finalH;
  if(empty){
    const mf=Number.isFinite(wrap._manual)?wrap._manual:min;
    const recent=Date.now()-(wrap._lastTog||0)<3000;
    if(!wasEmpty){ wrap._manual=min; finalH=min; }
    else {
      if(!opts.ignore&&mf>min+20&&recent) finalH=Math.min(max,mf);
      else if(!opts.ignore&&mf>min+20&&!opts.force) finalH=Math.min(max,mf);
      else { wrap._manual=min; finalH=min; }
    }
    syncSizes(wrap,el,finalH);
    const b=btn||wrap.querySelector(':scope >.tuckit-toggle');
    if(b) updTri(b,wrap);
    wrap._wasEmpty=true;
    if(empty) el.scrollTop=0;
    return;
  }
  wrap._wasEmpty=false;
  const cH=Math.ceil(el.scrollHeight);
  if(!opts.force&&wrap.offsetHeight>=max&&cH+fh+24>=max){
    syncSizes(wrap,el,Math.min(max,wrap.offsetHeight));
    fixMetaScroll(wrap);
    return;
  }
  // FIX alpha-1: +32 buffer instead of +14, so last line + image fully visible
  const cTgt=Math.max(min,Math.min(max,cH+fh+32));
  const mf=opts.ignore?min: Number.isFinite(wrap._manual)?wrap._manual:min;
  finalH=Math.min(max,Math.max(mf,cTgt));
  if(!wrap._userTucked){
    finalH = Math.max(finalH, wrap._manual||lastExpanded||min);
  }
  syncSizes(wrap,el,finalH);
  fixMetaScroll(wrap);
  const b=btn||wrap.querySelector(':scope >.tuckit-toggle');
  if(b) updTri(b,wrap);
  // immediate second check for half-line
  clearTimeout(wrap._fitT2);
  wrap._fitT2=setTimeout(()=>verifyFit(wrap,el),60);
}
function autoDS(el,wrap,btn,opts={}){ if(!el||!wrap) return; if(wrap.dataset.locked!=='1') return; if(wrap._dragLocked && !opts.force && !opts.ignoreFile){ const ah=getDSAttachH(wrap); if(ah===0 || wrap._lastAttach>0){ const lockedH = Number.isFinite(wrap._manual)? wrap._manual : getBaseH(wrap); syncSizes(wrap,el,lockedH); return; } } const min=wrap._origMin||getMinH(), max=computeMaxH(), fh=getDSFooterH(wrap), ah=getDSAttachH(wrap); if(ah>0 && wrap._userTucked && !opts.force){ const need=Math.max(min, ah+32+fh+8); if(wrap.offsetHeight < need-5){ wrap._forceExpandFix=true; syncSizes(wrap,el,need); wrap._manual=need; wrap._userTucked=false; const b=btn||wrap.querySelector(':scope >.tuckit-toggle'); if(b) updTri(b,wrap); return; } } if(wrap._userTucked&&!opts.force&&ah===0){ const fl=Number.isFinite(wrap._manual)?wrap._manual:getBaseH(wrap); syncSizes(wrap,el,fl); return; } pinDSFooter(wrap); hideDeadDS(wrap,el); const empty=isEmpty(el), wasEmpty=wrap._wasEmpty!==false, base=ah>0? Math.max(min,ah+88+fh+24):min; let finalH; if(empty){ const mf=Number.isFinite(wrap._manual)?wrap._manual:min, recent=Date.now()-(wrap._lastTog||0)<3000; if(ah>0){ finalH=opts.ignore? base: Math.max(base, mf>min+20&&recent? Math.min(max,mf):base); if(!wasEmpty) wrap._manual=base; } else if(!wasEmpty){ wrap._manual=min; finalH=min; } else { if(!opts.ignore&&mf>min+20&&recent) finalH=Math.min(max,mf); else if(!opts.ignore&&mf>min+20&&!opts.force) finalH=Math.min(max,mf); else { wrap._manual=min; finalH=min; } } } else { wrap._wasEmpty=false; const cH=Math.ceil(el.scrollHeight); const cTgt=Math.max(base,Math.min(max,cH+ah+fh+24)); finalH=cTgt; if(!wrap._dragLocked){ const mf=Number.isFinite(wrap._manual)?wrap._manual:min; if(mf>cTgt && mf<=cTgt+140 && !opts.ignore){ finalH=Math.min(max,mf); } } } wrap._wasEmpty=empty; if(finalH===undefined) return; syncSizes(wrap,el,finalH); const b=wrap.querySelector(':scope >.tuckit-toggle'); if(b) updTri(b,wrap); makeFat(el,wrap); }
function qResize(el,wrap,btn,opts={}){ if(!wrap||wrap._syncing) return; if(Date.now()-(wrap._lastSync||0)<80&&!opts.force) return; if(isDeepSeek&&wrap._dragArmed&&(wrap._lastAttach||0)===0&&getDSAttachEls(wrap).length>0&&!wrap._firstAttachDone){ maybeExpandFirstAttach(wrap,el,btn); return; } if(wrap._userTucked&&!opts.force&&getDSAttachH(wrap)===0){ const fl=Number.isFinite(wrap._manual)?wrap._manual:(isDeepSeek?getBaseH(wrap):computeMinimalH(wrap,el)); syncSizes(wrap,el,fl); return; } if(wrap._dragLocked && !opts.force && !opts.ignoreFile){ const lockedH = Number.isFinite(wrap._manual)?wrap._manual:(isDeepSeek?getBaseH(wrap):computeMinimalH(wrap,el)); if(getDSAttachH(wrap)===0 || wrap._lastAttach>0){ syncSizes(wrap,el,lockedH); return; } } if(wrap._rq&&!opts.force) return; wrap._rq=true; requestAnimationFrame(()=>{ wrap._rq=false; if(wrap._syncing) return; if(wrap.dataset.locked!=='1') return; if(isMeta) autoMeta(el,wrap,btn,opts); else autoDS(el,wrap,btn,opts); }); }
function maybeExpandFirstAttach(wrap,el,btn){
  if(!isDeepSeek||!wrap||!el) return false;
  if(wrap._syncing) return false;
  if(wrap._firstAttachDone){ wrap._lastAttach=getDSAttachEls(wrap).length; wrap._lastAttachH=getDSAttachH(wrap); return false; }
  const cnt=getDSAttachEls(wrap).length, prev=wrap._lastAttach||0;
  if(!(cnt>0&&prev===0)){ wrap._lastAttach=cnt; return false; }
  if(!wrap._dragArmed&&!wrap._pasteArmed){ wrap._lastAttach=cnt; return false; }
  const ah=getDSAttachH(wrap), fh=getDSFooterH(wrap);
  let lh=24; try{ const cs=getComputedStyle(el); let line=parseFloat(cs.lineHeight); if(!line||isNaN(line)) line=parseFloat(cs.fontSize)*1.5||24; lh=line; }catch{}
  const inputLines=Math.ceil(lh*2.5+28);
  const maxH=computeMaxH();
  const base=getBaseH(wrap);
  const target=Math.min(maxH, Math.max(base, Math.floor(maxH*0.78), ah+inputLines+fh+16));
  lockBottom(wrap); wrap._manual=target; wrap._userTucked=false; wrap._forceExpandFix=true; syncSizes(wrap,el,target);
  wrap._firstAttachDone=true; wrap._dragArmed=false; wrap._pasteArmed=false; wrap._lastAttach=cnt; wrap._lastAttachH=ah;
  const b=wrap._btn||btn; if(b) updTri(b,wrap); return true;
}
function animateH(wrap,el,btn,tgt,dur=190){
  try{
    if(!wrap||!el) return; if(wrap._anim) cancelAnimationFrame(wrap._anim); wrap._anim=null;
    const startH=wrap.offsetHeight;
    if(Math.abs(startH-tgt)<2.5){ wrap._forceExpandFix=true; wrap._syncing=false; wrap._animating=false; syncSizes(wrap,el,tgt); if(btn){ updTri(btn,wrap); if(isDeepSeek){ btn.style.setProperty('right','28px','important'); } } if(wrap._wasExp){ wrap._wasExp=false; setTimeout(()=> mimicClick(wrap,el,btn),40);} return; }
    const st=performance.now(), min=wrap._origMin||getMinH(), max=computeMaxH(); tgt=Math.max(min,Math.min(max,tgt)); wrap._syncing=true; wrap._animating=true;
    const frame=now=>{ const e=now-st, p=Math.min(1,e/dur), ease=1-Math.pow(1-p,3), cur=startH+(tgt-startH)*ease;
      wrap.style.setProperty('height',`${cur}px`,'important'); wrap.style.setProperty('min-height',`${cur}px`,'important'); wrap._lastH=cur;
      const fh=getFooterH(wrap), ah=getAttachH(wrap); const extra=getExtra(wrap);
      const eh=Math.max(isDeepSeek?60:40, cur - fh - ah - extra);
      const tWrap=getDirectChildWrapper(wrap,el);
      if(tWrap){
        if(isDeepSeek){ tWrap.style.setProperty('height','auto','important'); tWrap.style.setProperty('max-height','none','important'); tWrap.style.setProperty('min-height','0px','important'); tWrap.style.setProperty('flex','1 1 auto','important'); el.style.setProperty('height','100%','important'); el.style.setProperty('min-height','0px','important'); if(btn){ btn.style.setProperty('right','28px','important'); } }
        else { tWrap.style.setProperty('height',`${eh}px`,'important'); tWrap.style.setProperty('max-height',`${eh}px`,'important'); el.style.setProperty('height',`100%`,'important'); }
      } else { el.style.setProperty('height',`${eh}px`,'important'); el.style.setProperty('max-height',`${eh}px`,'important'); }
      if(p>0.35&&p<0.85&&isDeepSeek) pinDSFooter(wrap);
      if(p<1){ wrap._anim=requestAnimationFrame(frame); }
      else { wrap._syncing=false; wrap._animating=false; wrap._anim=null; wrap._lastSync=Date.now(); wrap._forceExpandFix=true; syncSizes(wrap,el,tgt);
        if(isDeepSeek){ pinDSFooter(wrap); hideDeadDS(wrap,el); if(btn){ btn.style.setProperty('right','28px','important'); } }
        if(isMeta) fixMetaScroll(wrap); makeFat(el,wrap); if(btn) updTri(btn,wrap); if(wrap._wasExp){ wrap._wasExp=false; setTimeout(()=>mimicClick(wrap,el,btn),45); } }
    }; wrap._anim=requestAnimationFrame(frame);
  }catch{ try{wrap._forceExpandFix=true; wrap._syncing=false; wrap._animating=false; wrap._anim=null; syncSizes(wrap,el,tgt); if(isDeepSeek&&btn){ btn.style.setProperty('right','28px','important'); }}catch{} }
}
function mimicClick(wrap,el,btn){ try{ const h=wrap.querySelector('.tuckit-handle'); if(!h||!wrap||!el) return; const r=h.getBoundingClientRect(), x=r.left+r.width/2, y=r.top+r.height/2; try{ h.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,clientX:x,clientY:y,pointerId:99})); }catch{ try{h.dispatchEvent(new MouseEvent('mousedown',{bubbles:true,clientX:x,clientY:y}));}catch{} } const cur=wrap.offsetHeight; void wrap.offsetHeight; wrap._forceExpandFix=true; syncSizes(wrap,el,cur+1); setTimeout(()=>{ try{ wrap._forceExpandFix=true; syncSizes(wrap,el,cur); if(isDeepSeek){ pinDSFooter(wrap); hideDeadDS(wrap,el);} makeFat(el,wrap); try{ h.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,clientX:x,clientY:y,pointerId:99})); h.dispatchEvent(new MouseEvent('mouseup',{bubbles:true,clientX:x,clientY:y})); h.dispatchEvent(new MouseEvent('click',{bubbles:true,clientX:x,clientY:y})); }catch{} try{el.focus({preventScroll:true});}catch{try{el.focus();}catch{}} if(btn) updTri(btn,wrap);}catch{} },32); }catch{} }
function toggleNow(wrap,btn){
  if(!wrap||!btn) return;
  if(wrap._anim){ try{cancelAnimationFrame(wrap._anim);}catch{} wrap._anim=null; } wrap._animating=false; wrap._syncing=false; wrap._rq=false;
  const now=Date.now(), first=!wrap._firstExpDone, gap=first?750:300; if(now-lastToggle<gap) return;
  lastToggle=now; wrap._lastTog=Date.now();
  const input=wrap.querySelector('div[contenteditable="true"],textarea'); if(!input) return;
  saveCaret(input);
  const saved={range:_lastCaret.el===input&&_lastCaret.range?_lastCaret.range.cloneRange():null, taS:_lastCaret.el===input?_lastCaret.taS:null, taE:_lastCaret.el===input?_lastCaret.taE:null};
  const min=wrap._origMin||getMinH(), max=computeMaxH();
  const doReveal=()=>reveal(input,'caret',saved);
  let isExp=false;
  if(isDeepSeek){ const base=getBaseH(wrap), ah=getDSAttachH(wrap); const thr=ah>0? base+30 : max*0.5; isExp = (btn.dataset.state==='expanded') || (wrap.offsetHeight>thr+2); }
  else { isExp = btn.dataset.state==='expanded'||wrap.offsetHeight>max*0.52; }
  if(isExp){
    // FIX alpha-1: DeepSeek with attachment must keep base height, not collapse to 132
    let minimal;
    if(isDeepSeek){
      const ah=getDSAttachH(wrap);
      minimal = ah>0 ? getBaseH(wrap) : getMinH();
    } else {
      minimal = computeMinimalH(wrap,input);
    }
    minimal = Math.max(min, Math.min(max, minimal));
    wrap._manual=minimal; wrap._userTucked=true; wrap._dragLocked=true; wrap._wasEmpty=isEmpty(input); wrap._forceExpandFix=true; wrap._lastH=minimal;
    animateH(wrap,input,btn,minimal,isDeepSeek?190:175);
    setTimeout(()=>{ if(wrap.dataset.locked==='1' && wrap._userTucked){ wrap._forceExpandFix=true; syncSizes(wrap,input,minimal); } }, 260);
    save('compact'); requestAnimationFrame(doReveal); setTimeout(doReveal,180); clearTimeout(wrap._tuckT); wrap._tuckT=setTimeout(doReveal,2700);
  }else{
    let tgt=lastExpanded; if(!tgt){ tgt=Math.floor(max*0.66); } else if(tgt<=min+20||tgt<=max*0.5){ tgt=Math.floor(max*0.66); }
    tgt=Math.max(tgt,Math.floor(max*0.58));
    try{ if(!isEmpty(input)){ const sh=input.scrollHeight, extra=isMeta?getMetaBarH(wrap)+32:getDSFooterH(wrap)+getDSAttachH(wrap)+24, need=sh+extra; if(need>tgt) tgt=Math.min(max,Math.max(tgt,need)); }}catch{}
    tgt=Math.min(max,Math.max(min,tgt));
    wrap._manual=tgt; wrap._userTucked=false; wrap._dragLocked=true; wrap._wasEmpty=isEmpty(input); lastExpanded=tgt;
    const base=isDeepSeek?220:200, dur=!wrap._firstExpDone? Math.round(base*3):base; wrap._wasExp=true; wrap._forceExpandFix=true;
    animateH(wrap,input,btn,tgt,dur); if(!wrap._firstExpDone) wrap._firstExpDone=true; save(`custom:${tgt}`); requestAnimationFrame(doReveal); setTimeout(doReveal,180); clearTimeout(wrap._tuckT); wrap._tuckT=setTimeout(doReveal,2700);
  }
  showUI(btn);
}
function showUI(btn){ if(!btn) return; const wrap=btn.parentElement, h=wrap?.querySelector('.tuckit-handle'); btn.classList.remove('tuckit-faded'); btn.style.opacity='1'; if(h){ h.classList.remove('tuckit-faded'); h.style.opacity='1'; } clearTimeout(btn._hide); if(wrap){ clearTimeout(wrap._hideH); wrap._hideH=null; } if(isDeepSeek){ btn.style.setProperty('right','28px','important'); } }
function schedHide(btn){ if(!btn) return; clearTimeout(btn._hide); btn._hide=setTimeout(()=>{ const wrap=btn.parentElement; btn.classList.add('tuckit-faded'); btn.style.opacity='0'; const h=wrap?.querySelector('.tuckit-handle'); if(h){ h.classList.add('tuckit-faded'); h.style.opacity='0'; } hideTips(); },800); }
function hideTog(btn){ if(!btn) return; const wrap=btn.parentElement; btn.classList.add('tuckit-faded'); btn.style.opacity='0'; const h=wrap?.querySelector('.tuckit-handle'); if(h){ h.classList.add('tuckit-faded'); h.style.opacity='0'; } hideTips(); clearTimeout(btn._hide); }
function hoverLogic(e){
  document.querySelectorAll('.tuckit-wrap-fixed').forEach(wrap=>{
    const r=wrap.getBoundingClientRect(), inZone=e.clientX>=r.left-60&&e.clientX<=r.right+60&&e.clientY>=r.top-80&&e.clientY<=r.top+120; const btn=wrap.querySelector('.tuckit-toggle'); if(!btn) return;
    if(inZone){ showUI(btn); if(!wrap._ttSched){ wrap._ttSched=true; clearTimeout(wrap._offT); clearTimeout(wrap._refT); wrap._offT=setTimeout(()=>{ const k=getEl('tuckit-tip-hotkey'); hkKEl=k; k.textContent='TuckIT OFF: Ctrl + Shift + K'; placeAbove(k,wrap,0); k.classList.add('tuckit-visible'); k.style.display='block'; },1500); wrap._refT=setTimeout(()=>{ const sec=document.createElement('div'); sec.className='tuckit-tip-hotkey'; sec.textContent='If crooked, refresh (Cmd + R/Ctrl + R)'; document.body.appendChild(sec); hk2El=sec; const first=hkKEl; if(first&&first.style.display!=='none'){ const fr=first.getBoundingClientRect(); sec.style.display='block'; requestAnimationFrame(()=>{ const sw=sec.offsetWidth, sh=sec.offsetHeight; let l=fr.left+fr.width/2-sw/2; l=Math.max(8,Math.min(l,innerWidth-sw-8)); sec.style.left=l+'px'; sec.style.top=(fr.top-sh-8)+'px'; sec.classList.add('tuckit-visible'); }); } else { placeAbove(sec,wrap,30); sec.classList.add('tuckit-visible'); sec.style.display='block'; } },3000); } } else { if(wrap._ttSched){ hideTips(); wrap._ttSched=false; } const br=btn.getBoundingClientRect(), near=Math.hypot(e.clientX-(br.left+br.width/2), e.clientY-(br.top+br.height/2))<220; if(!near&&!dragging){ if(!wrap._hideH){ wrap._hideH=setTimeout(()=>{ wrap._hideH=null; btn.classList.add('tuckit-faded'); btn.style.opacity='0'; const hh=wrap.querySelector('.tuckit-handle'); if(hh){ hh.classList.add('tuckit-faded'); hh.style.opacity='0'; } hideTips(); },800); } } else { clearTimeout(wrap._hideH); wrap._hideH=null; } }
  });
  document.querySelectorAll('.tuckit-toggle').forEach(btn=>{ const r=btn.getBoundingClientRect(), d=Math.hypot(e.clientX-(r.left+r.width/2), e.clientY-(r.top+r.height/2)); if(d<220) showUI(btn); });
}
let _pmT=0;
window.addEventListener('pointermove',e=>{
  if(_wraps.length){ const n=performance.now(); if(n-_pmT>=60){ _pmT=n; hoverLogic(e); } }
  if(!dragging) return; e.preventDefault(); const d=dragging; if(!d.locked){ if(Math.abs(e.clientY-d.startY)<4) return; lockBottom(d.wrap); d.locked=true; d.feed=findFeed(d.wrap); d.startFeed=d.feed?d.feed.scrollTop:0; } const min=d.wrap._origMin||getMinH(), max=computeMaxH(), nh=Math.max(min,Math.min(max,d.startH+(d.startY-e.clientY))); if(Math.abs(nh-d.wrap.offsetHeight)<1) return; d.wrap._manual=nh; d.wrap._userTucked=nh<=max*0.5; d.wrap._dragLocked=true; d.wrap._draggedThisTurn=true; d.wrap._forceExpandFix=true; if(nh>getMinH()+20) lastExpanded=nh; syncSizes(d.wrap,d.el,nh); showUI(d.btn); updTri(d.btn,d.wrap); if(d.feed){ const inc=nh-(d.lastH??d.startH); if(Math.abs(inc)>=1){ const sc=d.feed, maxS=sc.scrollHeight-sc.clientHeight; let tgt=sc.scrollTop+inc; tgt=Math.max(0,Math.min(maxS,tgt)); sc.scrollTop=tgt; d.lastH=nh; } } d.moved=true;
},true);
window.addEventListener('pointerup',()=>{ if(!dragging) return; const d=dragging; dragging=null; if(!d.moved){ hideTips(); return; } const h=d.wrap.offsetHeight; d.wrap._manual=h; d.wrap._userTucked=h<=computeMaxH()*0.5; d.wrap._dragLocked=true; d.wrap._draggedThisTurn=true; d.wrap._forceExpandFix=true; if(h>getMinH()+20) lastExpanded=h; syncSizes(d.wrap,d.el,h); save(`custom:${h}`); hideTips(); },true);
window.addEventListener('keydown',e=>{
  if(e.ctrlKey&&e.shiftKey&&e.code==='KeyK'){ e.preventDefault(); setDisabled(!disabled); return; }
  if(e.ctrlKey&&e.shiftKey&&e.code==='KeyL'){ e.preventDefault(); if(disabled) return; if(activeWrap&&activeWrap._animating){ if(activeWrap._anim){ try{cancelAnimationFrame(activeWrap._anim);}catch{} activeWrap._anim=null; } activeWrap._animating=false; activeWrap._syncing=false; } const first=!(activeWrap&&activeWrap._firstExpDone), gap=first?750:300; if(Date.now()-lastToggle<gap) return; let w=activeWrap,b=activeBtn; if(!w||!b){ const f=document.querySelector('.tuckit-toggle'); if(f){ w=f.closest('.tuckit-wrap-fixed')||f.parentElement; b=f; } } if(!w||!b) return; toggleNow(w,b); }
},true);
function findSend(wrap){ try{ const form=wrap.closest('form'), scope=form||wrap.parentElement||wrap, cands=[]; scope.querySelectorAll('button,[role="button"]').forEach(b=>{ const aria=(b.getAttribute('aria-label')||'').toLowerCase(), ty=(b.getAttribute('type')||'').toLowerCase(); if(ty==='submit'||aria.includes('send')||aria.includes('submit')){ const r=b.getBoundingClientRect(), wr=wrap.getBoundingClientRect(); if(r.width>0&&r.bottom>=wr.bottom-100) cands.push(b);} }); if(!cands.length&&form) form.querySelectorAll('button[type="submit"]').forEach(b=>cands.push(b)); if(!cands.length) document.querySelectorAll('button[aria-label*="Send"],button[type="submit"]').forEach(b=>cands.push(b)); if(!cands.length) return null; const wr=wrap.getBoundingClientRect(); cands.sort((a,b)=>{ const ra=a.getBoundingClientRect(), rb=b.getBoundingClientRect(); return Math.hypot(wr.right-ra.right,wr.bottom-ra.bottom)-Math.hypot(wr.right-rb.right,wr.bottom-rb.bottom); }); return cands[0]; }catch{return null;} }
function afterSend(wrap,btn,el){ if(!wrap||!el) return; const min=computeMinimalH(wrap,el); try{ wrap.style.removeProperty('height'); wrap.style.removeProperty('min-height'); el.style.removeProperty('height'); el.style.removeProperty('max-height'); }catch{} wrap._manual=min; wrap._userTucked=true; wrap._dragLocked=false; wrap._draggedThisTurn=false; wrap._wasEmpty=true; wrap._wasNotEmpty=false; wrap._firstAttachDone=false; wrap._lastAttach=0; wrap._lastAttachH=0; wrap._dragArmed=false; wrap._pasteArmed=false; wrap._forceExpandFix=true; syncSizes(wrap,el,min); if(isEmpty(el)){ el.scrollTop=0; el.scrollLeft=0; } save('compact'); updTri(btn,wrap); if(el._bootT) clearTimeout(el._bootT); el._bootT=setTimeout(()=>{ try{el.scrollTop=0; const ww=el.closest('.tuckit-wrap-fixed'); if(ww) ww.scrollTop=0;}catch{} reveal(el,'first',{range:null,taS:null}); },2700); }
function hookSend(wrap,btn,el){ try{ const form=wrap.closest('form')||el.closest('form'), sBtn=findSend(wrap); if(sBtn&&!sBtn._tHook){ sBtn._tHook=true; const sched=()=>{ if(!isEmpty(el)){ wrap._wasNotEmpty=true; setTimeout(()=>{ if(isEmpty(el)) afterSend(wrap,btn,el); },120); } else afterSend(wrap,btn,el); }; sBtn.addEventListener('pointerdown',sched,true); sBtn.addEventListener('click',()=>setTimeout(()=>{ if(isEmpty(el)) afterSend(wrap,btn,el); },80),true); } if(form&&!form._tHook){ form._tHook=true; form.addEventListener('submit',()=>{ if(!isEmpty(el)) wrap._wasNotEmpty=true; setTimeout(()=>{ if(isEmpty(el)) afterSend(wrap,btn,el); },100); },true); } if(!el._tEnter){ el._tEnter=true; el.addEventListener('keydown',e=>{ if(e.key==='Enter'&&!e.shiftKey&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!e.isComposing){ if(!isEmpty(el)){ wrap._wasNotEmpty=true; setTimeout(()=>{ if(isEmpty(el)) afterSend(wrap,btn,el); },100); } } },true); } if(!el._tClear){ let last=isEmpty(el); const obs=new MutationObserver(()=>{ const now=isEmpty(el); if(!last&&now&&wrap._wasNotEmpty) afterSend(wrap,btn,el); last=now; }); obs.observe(el,{childList:true,subtree:true,characterData:true}); el._tClear=obs; } }catch{} }
function isValidInput(el){ if(!el||!isEditable(el)) return false; if(isInCode(el)) return false; if(el.closest('pre,code')) return false; const r=el.getBoundingClientRect(); if(r.width<120||r.height>600) return false; if(r.bottom < innerHeight*0.25) return false; if(el.parentElement?.closest('pre')) return false; return true; }
function inject(el){
  if(disabled) return; if(seen.has(el)) return; if(!isValidInput(el)) return;
  const wrap=getWrap(el); if(!wrap||wrap.querySelector(':scope >.tuckit-handle')){ seen.add(el); return; }
  if(wrap.closest('pre,code')){ seen.add(el); return; }
  const bigPre=wrap.querySelector('pre'); if(bigPre){ const rh=bigPre.getBoundingClientRect().height; if(rh>300 && !bigPre.contains(el) && !el.contains(bigPre)) { seen.add(el); return; } }
  seen.add(el);
  _wraps.push(wrap);
  if(getComputedStyle(wrap).position==='static') wrap.style.setProperty('position','relative','important');
  if(!el._accent){ el._accent=true; const prot=new Set(['ArrowRight','ArrowLeft','ArrowUp','ArrowDown','Home','End','PageUp','PageDown','Backspace','Delete','Enter','Tab','Escape']); el.addEventListener('keydown',e=>{ if(e.isComposing) return; if(prot.has(e.key)) return; if(e.key.length!==1) return; if(e.repeat&&!e.metaKey&&!e.ctrlKey&&!e.altKey){ try{ e.preventDefault(); e.stopPropagation(); if(el.isContentEditable){ try{document.execCommand('insertText',false,e.key);}catch{ const sel=window.getSelection(); if(sel&&sel.rangeCount){ const r=sel.getRangeAt(0); r.deleteContents(); r.insertNode(document.createTextNode(e.key)); r.collapse(false); sel.removeAllRanges(); sel.addRange(r);} } } else if(el.tagName==='TEXTAREA'){ const s=el.selectionStart, ee=el.selectionEnd, v=el.value; el.value=v.slice(0,s)+e.key+v.slice(ee); el.selectionStart=el.selectionEnd=s+1; el.dispatchEvent(new InputEvent('input',{bubbles:true})); } }catch{} } },true); }
  const handle=document.createElement('div'); handle.className='tuckit-handle tuckit-faded'; handle.style.opacity='0';
  const btn=document.createElement('button'); btn.className='tuckit-toggle tuckit-faded'; btn.type='button'; btn.dataset.state='collapsed'; btn.style.opacity='0';
  renderTri(btn,'collapsed'); if(isDeepSeek){ btn.style.setProperty('right','28px','important'); }
  btn.addEventListener('pointerenter',e=>{ showUI(btn); if(!tipEl){ tipEl=getEl('tuckit-tip'); } tipEl.textContent=btn.dataset.state==='expanded'?'TuckIT':'UnTuckIT'; tipEl.style.display='block'; tipEl.style.left=(e.clientX+12)+'px'; tipEl.style.top=(e.clientY-28)+'px'; clearTimeout(window._tipHide); window._tipHide=setTimeout(()=>{ if(tipEl) tipEl.style.display='none'; if(hkEl){ hkEl.classList.remove('tuckit-visible'); hkEl.style.display='none'; } },3500); clearTimeout(window._btn2T); window._btn2T=setTimeout(()=>{ if(!tipEl||tipEl.style.display==='none') return; if(!hkEl){ hkEl=getEl('tuckit-tip-hotkey'); } hkEl.textContent='(Ctrl+Shift+L)'; hkEl.style.display='block'; requestAnimationFrame(()=>{ const fr=tipEl.getBoundingClientRect(); hkEl.style.left=fr.left+'px'; hkEl.style.top=(fr.bottom+6)+'px'; hkEl.classList.add('tuckit-visible'); }); },1000); });
  btn.addEventListener('pointermove',e=>{ if(!tipEl) return; tipEl.style.left=(e.clientX+12)+'px'; tipEl.style.top=(e.clientY-28)+'px'; if(hkEl&&hkEl.style.display!=='none'){ const fr=tipEl.getBoundingClientRect(); hkEl.style.left=fr.left+'px'; hkEl.style.top=(fr.bottom+6)+'px'; } });
  btn.addEventListener('pointerleave',()=>{ if(tipEl) tipEl.style.display='none'; if(hkEl){ hkEl.classList.remove('tuckit-visible'); hkEl.style.display='none'; } clearTimeout(window._btn2T); schedHide(btn); });
  btn.addEventListener('click',e=>{ e.preventDefault(); e.stopPropagation(); hideTips(); if(wrap._animating){ try{cancelAnimationFrame(wrap._anim);}catch{} wrap._anim=null; wrap._animating=false; wrap._syncing=false; } const first=!wrap._firstExpDone, gap=first?750:300; if(Date.now()-lastToggle<gap) return; toggleNow(wrap,btn); });
  handle.addEventListener('pointerenter',()=>{ showUI(btn); if(!wrap._ttSched){ wrap._ttSched=true; clearTimeout(wrap._offT); clearTimeout(wrap._refT); wrap._offT=setTimeout(()=>{ const k=getEl('tuckit-tip-hotkey'); hkKEl=k; k.textContent='TuckIT OFF: Ctrl + Shift + K'; placeAbove(k,wrap,0); k.classList.add('tuckit-visible'); k.style.display='block'; },1500); wrap._refT=setTimeout(()=>{ const sec=document.createElement('div'); sec.className='tuckit-tip-hotkey'; sec.textContent='If crooked, refresh (Cmd + R/Ctrl + R)'; document.body.appendChild(sec); hk2El=sec; const first=hkKEl; if(first&&first.style.display!=='none'){ const fr=first.getBoundingClientRect(); sec.style.display='block'; requestAnimationFrame(()=>{ const sw=sec.offsetWidth, sh=sec.offsetHeight; let l=fr.left+fr.width/2-sw/2; l=Math.max(8,Math.min(l,innerWidth-sw-8)); sec.style.left=l+'px'; sec.style.top=(fr.top-sh-8)+'px'; sec.classList.add('tuckit-visible'); }); } else { placeAbove(sec,wrap,30); sec.classList.add('tuckit-visible'); sec.style.display='block'; } },3000); } });
  handle.addEventListener('pointerleave',()=> schedHide(btn));
  const startDrag=e=>{ if(e.target.closest('.tuckit-toggle')) return; e.preventDefault(); e.stopPropagation(); dragging={el,wrap,btn,startY:e.clientY,startH:wrap.offsetHeight,lastH:wrap.offsetHeight,locked:false,moved:false,feed:null,startFeed:0}; hideTips(); if(e.target.setPointerCapture) try{e.target.setPointerCapture(e.pointerId);}catch{} };
  handle.addEventListener('pointerdown',startDrag);
  wrap.addEventListener('pointerdown',e=>{ if(e.target.closest('.tuckit-toggle')||e.target.closest('.tuckit-handle')||e.target===el||el.contains(e.target)) return; const r=wrap.getBoundingClientRect(); if(e.clientY-r.top<18&&e.clientY-r.top>=0) startDrag(e); });
  wrap.addEventListener('scroll',e=>{ try{ const t=e.target; if(!t||t===el||t===document||(t.nodeType===1&&el.contains(t))) return; if(t.scrollTop||t.scrollLeft){ if(t===wrap||getComputedStyle(t).overflowY==='hidden'){ t.scrollTop=0; t.scrollLeft=0; } } }catch{} },true);
  if(isMeta){ el.addEventListener('wheel',e=>{ try{ if(wrap.dataset.locked!=='1'||e.ctrlKey) return; const max=el.scrollHeight-el.clientHeight; if(max<=0) return; let dy=e.deltaY; if(e.deltaMode===1) dy*=(parseFloat(getComputedStyle(el).lineHeight)||20); else if(e.deltaMode===2) dy*=el.clientHeight; const nt=Math.max(0,Math.min(max,el.scrollTop+dy)); e.preventDefault(); e.stopPropagation(); el.scrollTop=nt; }catch{} },{passive:false}); }
  wrap.appendChild(handle); wrap.appendChild(btn); setTimeout(()=>showUI(btn),600);
  wrap._btn=btn; wrap._wasNotEmpty=!isEmpty(el); wrap._firstAttachDone=false; wrap._lastAttach=isDeepSeek?getDSAttachEls(wrap).length:0; wrap._lastAttachH=getDSAttachH(wrap); wrap._dragArmed=false; wrap._pasteArmed=false; wrap._dragLocked=false; wrap._draggedThisTurn=false;
  if(isDeepSeek){
    const arm=()=>{ wrap._dragArmed=true; wrap._pasteArmed=true; };
    const retryAttach=()=>{ [80,200,400,800,1400,2200].forEach(ms=>setTimeout(()=>{ if(wrap.isConnected) maybeExpandFirstAttach(wrap,el,btn); },ms)); };
    ['dragenter','dragover'].forEach(ev=> wrap.addEventListener(ev,arm,true));
    wrap.addEventListener('drop',()=>{ arm(); retryAttach(); },true);
    const onFilePaste=e=>{ try{ const dt=e.clipboardData; if(!dt){ retryAttach(); return; } const hasFile=(dt.files&&dt.files.length>0)||Array.from(dt.items||[]).some(it=>it.kind==='file'||(it.type&&it.type.startsWith('image/'))); if(hasFile||(dt.types&&(dt.types.includes('Files')||dt.types.includes('image/png')||dt.types.includes('image/jpeg')))){ wrap._pasteArmed=true; wrap._dragArmed=true; retryAttach(); } }catch{ retryAttach(); } };
    el.addEventListener('paste',onFilePaste,true); wrap.addEventListener('paste',onFilePaste,true);
    document.addEventListener('change',e=>{ if(!wrap.isConnected) return; if(e.target&&e.target.matches&&e.target.matches('input[type=file]')){ arm(); retryAttach(); } },true);
    wrap.addEventListener('load',()=>{ setTimeout(()=>maybeExpandFirstAttach(wrap,el,btn),40); },true);
    if(!wrap._attachObs){
      const obs=new MutationObserver(()=>{
        if(wrap._attObsQ) return; wrap._attObsQ=true;
        requestAnimationFrame(()=>{
          wrap._attObsQ=false; if(!wrap.isConnected||wrap._syncing) return;
          const cnt=getDSAttachEls(wrap).length;
          const curAh=getDSAttachH(wrap);
          if(!wrap._firstAttachDone && cnt>0){ maybeExpandFirstAttach(wrap,el,btn); return; }
          if(cnt>0 && (wrap.offsetHeight < getBaseH(wrap)-8 || curAh > (wrap._lastAttachH||0)+25)){
            wrap._lastAttachH=curAh;
            qResize(el,wrap,btn,{force:true, ignoreFile:true});
          }
        });
      });
      obs.observe(wrap,{childList:true,subtree:true,attributes:true,attributeFilter:['src']});
      wrap._attachObs=obs;
    }
  }
  if(isMeta && !el._metaImgObs){
    const metaImgObs=new MutationObserver((muts)=>{
      let hasNew=false;
      for(const m of muts){
        for(const n of m.addedNodes){
          if(n.nodeType!==1) continue;
          if(n.tagName==='IMG' || n.querySelector?.('img,canvas')){ hasNew=true; break; }
        }
        if(hasNew) break;
      }
      if(hasNew){
        setTimeout(()=>qResize(el,wrap,btn,{force:true}),60);
        el.querySelectorAll('img').forEach(img=>{
          if(img._tuckitHooked) return;
          img._tuckitHooked=true;
          img.addEventListener('load',()=>qResize(el,wrap,btn,{force:true}),{once:true});
          img.addEventListener('error',()=>qResize(el,wrap,btn,{force:true}),{once:true});
        });
      }
    });
    metaImgObs.observe(el,{childList:true,subtree:true});
    el._metaImgObs=metaImgObs;
  }
  const stableResize=()=>{ requestAnimationFrame(()=>requestAnimationFrame(()=>{ if(!wrap.isConnected) return; if(wrap._dragLocked){ syncSizes(wrap,el,wrap._manual??computeMinimalH(wrap,el)); return; } if(wrap._userTucked&&getDSAttachH(wrap)===0){ syncSizes(wrap,el,wrap._manual??computeMinimalH(wrap,el)); } else { qResize(wrap._dragLocked?{force:false}:el,wrap,btn,{force:true,ignore:true, ignoreFile:true}); } if(el.tagName==='TEXTAREA'&&el.value.length>2000) el.scrollTop=el.scrollHeight; })); };
  el.addEventListener('input',()=>{
    saveCaret(el);
    const nowEmpty=isEmpty(el), wasNotEmpty=wrap._wasNotEmpty;
    wrap._wasNotEmpty=!nowEmpty;
    if(wasNotEmpty&&nowEmpty){ afterSend(wrap,btn,el); return; }
    hideTog(btn);
    if(wrap._dragLocked || wrap._userTucked){
      scrollCaretIntoView(el);
      // FIX alpha-1: still grow if user tucked but content overflows by >4px (Meta half-line)
      if(isMeta && el.scrollHeight > el.clientHeight + 4){
        qResize(el,wrap,btn,{force:true});
      }
      return;
    }
    if(el.scrollHeight > el.clientHeight + 4){ // was +16
      qResize(el,wrap,btn,{});
    } else {
      scrollCaretIntoView(el);
    }
  });
  el.addEventListener('paste',e=>{ saveCaret(el); wrap._wasNotEmpty=true; if(wrap._dragLocked){ try{ const dt=e.clipboardData; const isFile=dt&&((dt.files&&dt.files.length>0)||Array.from(dt.items||[]).some(it=>it.kind==='file')); if(isFile && !wrap._firstAttachDone) return; }catch{} requestAnimationFrame(()=> scrollCaretIntoView(el)); return; } try{ const dt=e.clipboardData; const isFile=dt&&((dt.files&&dt.files.length>0)||Array.from(dt.items||[]).some(it=>it.kind==='file')); if(isDeepSeek&&isFile&&!wrap._firstAttachDone) return; }catch{} stableResize(); });
  el.addEventListener('drop',()=>{ wrap._wasNotEmpty=true; if(wrap._dragLocked){ requestAnimationFrame(()=> scrollCaretIntoView(el)); return; } stableResize(); });
  el.addEventListener('cut',()=>{ saveCaret(el); scrollCaretIntoView(el); setTimeout(()=>qResize(el,wrap,btn,{force:true}),30); });
  el.addEventListener('compositionend',()=>{ saveCaret(el); if(wrap._dragLocked) { scrollCaretIntoView(el); qResize(el,wrap,btn,{force:true}); return; } if(el.scrollHeight > el.clientHeight + 4) qResize(el,wrap,btn,{}); });
  el.addEventListener('keyup',e=>{ if(e.key==='Backspace'||e.key==='Delete'){ saveCaret(el); scrollCaretIntoView(el); if(isMeta) setTimeout(()=>qResize(el,wrap,btn,{force:true}),30); }});
  el.addEventListener('focus',()=>{ activeWrap=wrap; activeBtn=btn; showUI(btn); makeFat(el,wrap); if(isDeepSeek){ pinDSFooter(wrap); hideDeadDS(wrap,el); } if(wrap._userTucked&&getDSAttachH(wrap)===0) syncSizes(wrap,el,wrap._manual??computeMinimalH(wrap,el)); else if(!wrap._dragLocked) qResize(el,wrap,btn,{}); saveCaret(el); resetAnc(el); });
  try{ localStorage.removeItem(KEY); if(hasGM) GM_setValue(KEY,'native'); }catch{}
  lockBottom(wrap); makeFat(el,wrap); if(isDeepSeek){ pinDSFooter(wrap); hideDeadDS(wrap,el); }
  const min0=getMinH(); wrap._manual=min0; wrap._wasEmpty=isEmpty(el); wrap._userTucked=false; wrap._dragLocked=false; wrap._draggedThisTurn=false;
  if(isEmpty(el)){
    const minimal=computeMinimalH(wrap,el);
    wrap._forceExpandFix=true; syncSizes(wrap,el,minimal); save('compact');
    if(el._bootT) clearTimeout(el._bootT);
    el._bootT=setTimeout(()=>{ try{el.scrollTop=0; const ww=el.closest('.tuckit-wrap-fixed'); if(ww) ww.scrollTop=0;}catch{} reveal(el,'first',{range:null}); },1000);
  } else qResize(el,wrap,btn,{});
  if(typeof ResizeObserver==='function' && !wrap._resizeObs){
    let queued=false;
    const ro=new ResizeObserver(()=>{
      if(queued||wrap._syncing) return;
      if(Date.now()-(wrap._lastSync||0)<120) return;
      queued=true;
      requestAnimationFrame(()=>{
        queued=false;
        if(!wrap.isConnected||wrap.dataset.locked!=='1') return;
        if(wrap._dragLocked){
          const fl=Number.isFinite(wrap._manual)?wrap._manual:(isDeepSeek?getBaseH(wrap):computeMinimalH(wrap,el));
          if(Math.abs(wrap.offsetHeight-fl)>3){ wrap._forceExpandFix=true; syncSizes(wrap,el,fl); }
          return;
        }
        if(wrap._userTucked&&getDSAttachH(wrap)===0){
          const fl=Number.isFinite(wrap._manual)?wrap._manual:(isDeepSeek?getBaseH(wrap):computeMinimalH(wrap,el));
          if(Math.abs(wrap.offsetHeight-fl)>3){ wrap._forceExpandFix=true; syncSizes(wrap,el,fl); }
          return;
        }
        qResize(el,wrap,btn,{});
      });
    });
    ro.observe(wrap); ro.observe(el); wrap._resizeObs=ro;
  }
  hookSend(wrap,btn,el);
}
function isNewChat(){ try{ const p=location.pathname, h=location.hostname; if(h.includes('meta.ai')){ if(/^\/(c|prompt|create)\//.test(p)) return false; return true; } if(h.includes('deepseek.com')){ if(p.includes('/a/chat/s/')) return false; if(/\/chat\//.test(p)&&p.length>10) return false; return true; } return false; }catch{return false;} }
function stopBootObs(){ if(_bootObs){ try{_bootObs.disconnect();}catch{} _bootObs=null; } if(_bootT){ clearTimeout(_bootT); _bootT=null; } }
function cleanup(){ try{ stopBootObs(); if(_metaObs){ try{_metaObs.disconnect();}catch{} _metaObs=null; } if(_metaTimer){ clearTimeout(_metaTimer); _metaTimer=null; } document.querySelectorAll('.tuckit-handle,.tuckit-toggle').forEach(n=>n.remove()); [tipEl,hkEl,hkKEl,hk2El].forEach(e=>{ if(e) e.remove(); }); tipEl=hkEl=hkKEl=hk2El=null; document.querySelectorAll('.tuckit-wrap-fixed').forEach(wrap=>{ try{ if(wrap.dataset.orig){ try{restInline(wrap,JSON.parse(wrap.dataset.orig));}catch{} } wrap.style.removeProperty('height'); wrap.style.removeProperty('min-height'); wrap.style.removeProperty('padding-bottom'); wrap.style.removeProperty('padding-top'); wrap.style.removeProperty('gap'); wrap.style.removeProperty('row-gap'); wrap.classList.remove('tuckit-wrap-fixed','tuckit-fat-scroll'); wrap.querySelectorAll('div[contenteditable="true"],textarea').forEach(el=>{ el.style.removeProperty('height'); el.style.removeProperty('max-height'); el.style.removeProperty('overflow-y'); el.style.removeProperty('flex'); el.style.removeProperty('margin'); el.style.removeProperty('padding-bottom'); el.classList.remove('tuckit-fat-scroll'); }); delete wrap.dataset.locked; delete wrap.dataset.orig; delete wrap._origMin; delete wrap._metaFH; delete wrap._adj; delete wrap._manual; delete wrap._wasEmpty; delete wrap._lastTog; delete wrap._userTucked; delete wrap._dragLocked; delete wrap._draggedThisTurn; delete wrap._firstAttachDone; delete wrap._lastAttach; delete wrap._lastAttachH; delete wrap._dragArmed; delete wrap._pasteArmed; if(wrap._metaObs){ wrap._metaObs.disconnect(); delete wrap._metaObs; } if(wrap._dsObs){ wrap._dsObs.disconnect(); delete wrap._dsObs; } if(wrap._resizeObs){ try{wrap._resizeObs.disconnect();}catch{} delete wrap._resizeObs; } if(wrap._attachObs){ try{wrap._attachObs.disconnect();}catch{} delete wrap._attachObs; } }catch{} }); if(isMeta) unfixMeta(); activeWrap=null; activeBtn=null; dragging=null; _wraps=[]; seen=new WeakSet(); }catch{} }
function setDisabled(v){ disabled=v; if(hasGM) GM_setValue('tuckit_disabled',v); else localStorage.setItem('tuckit_disabled',v?'1':'0'); if(v){ cleanup(); showToast('TuckIT OFF — Ctrl+Shift+K to turn ON'); } else { showToast('TuckIT ON — Ctrl+Shift+K to turn OFF'); setTimeout(()=>boot(),200); } }
function bootNow(allowNew=false){
  if(disabled) return; if(!allowNew&&isNewChat()) return;
  stopBootObs();
  const hasLive=()=>{ _wraps=_wraps.filter(wrap=>wrap.isConnected); return _wraps.length>0; };
  const scan=()=>{ if(disabled) return; if(!allowNew&&isNewChat()) return; if(hasLive()) return; document.querySelectorAll(SELECTORS).forEach(el=>{ if(seen.has(el)) return; const r=el.getBoundingClientRect(); if(r.width>=60&&r.height>=16&&r.bottom>innerHeight*0.3){ if(isValidInput(el)) inject(el); } }); };
  scan();
  _bootObs=new MutationObserver(()=>{ if(disabled||_bootT) return; if(hasLive()) return; _bootT=setTimeout(()=>{ _bootT=null; scan(); },350); });
  _bootObs.observe(document.documentElement,{childList:true,subtree:true});
}
function startHomeWatch(){ if(disabled) return; if(_homeWatch) clearInterval(_homeWatch); _homeTries=0; _homeWatch=setInterval(()=>{ _homeTries++; try{ if(disabled){ clearInterval(_homeWatch); _homeWatch=null; return; } if(!isNewChat()){ clearInterval(_homeWatch); _homeWatch=null; if(isMeta) bootMetaAfterResp(); else setTimeout(()=>bootNow(false),400); return; } if(_homeTries>600){ clearInterval(_homeWatch); _homeWatch=null; } }catch{ clearInterval(_homeWatch); _homeWatch=null; } },500); }
function bootMetaAfterResp(){ if(!isMeta){ bootNow(false); return; } cleanup(); if(_metaObs){ try{_metaObs.disconnect();}catch{} _metaObs=null; } if(_metaTimer) clearTimeout(_metaTimer); _metaTimer=setTimeout(()=>{ _metaTimer=null; bootNow(false); showToast('TuckIT loaded — refresh (Cmd+R/Ctrl+R) if crooked'); },8500); let seenThink=false; let thinkT=null; const hasThink=()=>{ try{ return !!Array.from(document.querySelectorAll('button')).find(b=>(b.textContent||'').trim()==='Thinking'); }catch{return false;} }; const check=()=>{ thinkT=null; if(hasThink()) seenThink=true; if(seenThink&&!hasThink()){ if(_metaObs){ try{_metaObs.disconnect();}catch{} _metaObs=null; } if(_metaTimer) clearTimeout(_metaTimer); _metaTimer=setTimeout(()=>{ _metaTimer=null; bootNow(false); },2500); } }; _metaObs=new MutationObserver(()=>{ if(thinkT) return; thinkT=setTimeout(check,250); }); try{ _metaObs.observe(document.documentElement,{childList:true,subtree:true}); }catch{} }
function boot(){ if(disabled) return; if(isNewChat()){ cleanup(); startHomeWatch(); return; } bootNow(false); }
let _lastHref=location.href;
function checkUrl(){ if(location.href===_lastHref) return; const prev=_lastHref; _lastHref=location.href; const nowNew=isNewChat(); const prevNew=(()=>{ try{ const u=new URL(prev); const p=u.pathname,h=u.hostname; if(h.includes('meta.ai')){ if(/^\/(c|prompt|create)\//.test(p)) return false; return true; } if(h.includes('facebook.com')) return p==='/'||p===''; return false; }catch{return false;} })(); if(nowNew){ cleanup(); if(_metaObs){ try{_metaObs.disconnect();}catch{} _metaObs=null; } if(_metaTimer) clearTimeout(_metaTimer); if(isMeta) unfixMeta(); startHomeWatch(); } else if(!disabled){ if(prevNew&&!nowNew){ if(isMeta) unfixMeta(); if(isMeta) bootMetaAfterResp(); else setTimeout(()=>boot(),500); } else setTimeout(()=>boot(),400); } }
(function(){ const _push=history.pushState,_rep=history.replaceState; history.pushState=function(...a){ const r=_push.apply(this,a); checkUrl(); return r; }; history.replaceState=function(...a){ const r=_rep.apply(this,a); checkUrl(); return r; }; window.addEventListener('popstate',checkUrl); setInterval(checkUrl,1000); })();
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();

