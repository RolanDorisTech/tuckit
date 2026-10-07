// ==UserScript==
// @name         Drag to Resize, Click to Tuck, Made for AI Chats (TuckIT by RDT)
// @namespace    https://github.com/RolanDorisTech/tuckit
// @version      0.1.1-rc.2
// @description  Does Meta AI input cover your chat? Does DeepSeek box get too big? TuckIT pins input to bottom so it NEVER covers messages. Drag teal bar to resize (smooth), triangle to tuck, trash to clear all. For Meta AI & DeepSeek. By RDT - @RolanDorisTech
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
// @grant        unsafeWindow
// @grant        GM_addElement
// @sandbox      MAIN_WORLD
// @run-at       document-idle
// @license      Apache-2.0
// ==/UserScript==
(() => {
'use strict';
if (window.top !== window.self) return;
const host=location.hostname,isMeta=/meta\.ai|facebook/i.test(host),isDeepSeek=/deepseek\.com/i.test(host);
if(!isMeta&&!isDeepSeek)return;
if(/facebook\.com/i.test(host)&&!location.href.toLowerCase().includes('/ai'))return;
const PW=(typeof unsafeWindow!=='undefined')?unsafeWindow:window;
const SELECTORS=isMeta?'div[data-lexical-editor="true"],div[contenteditable="true"][role="textbox"]':'textarea[placeholder="Message DeepSeek"],#prompt-textarea,textarea[name="prompt"],div[data-lexical-editor="true"],div[contenteditable="true"][role="textbox"]';
const KEY=`tuckit_mode_${host}`,hasGM=typeof GM_getValue==='function';
const save=m=>hasGM?GM_setValue(KEY,m):localStorage.setItem(KEY,m);
if(typeof GM_addStyle!=='function')window.GM_addStyle=c=>{const s=document.createElement('style');s.textContent=c;document.head.appendChild(s);};
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
.tuckit-wrap-fixed{transform:none!important;overflow:hidden!important;box-sizing:border-box!important;padding-top:14px!important;gap:0!important;row-gap:0!important;column-gap:0!important;display:flex!important;flex-direction:column!important}
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
.tuckit-tip-hotkey,.tuckit-tip-hint{position:fixed!important;z-index:2147483647!important;background:#1a1a1a!important;color:#8a8a8a!important;padding:3px 6px!important;border-radius:4px!important;font-size:9px!important;pointer-events:none!important;white-space:nowrap!important;display:none;border:1px solid rgba(255,255,255,.08)!important;font-family:ui-monospace,monospace!important;letter-spacing:.2px!important;opacity:0!important;transition:opacity .22s!important}
.tuckit-tip-hotkey.tuckit-visible,.tuckit-tip-hint.tuckit-visible{opacity:1!important}
#tuckit-toast{position:fixed!important;bottom:22px!important;left:50%!important;transform:translateX(-50%)!important;background:#111!important;color:#FFEE8C!important;padding:8px 14px!important;border-radius:8px!important;z-index:2147483649!important;font-size:12px!important;border:1px solid rgba(255,238,140,.4)!important;display:none;box-shadow:0 4px 12px rgba(0,0,0,.4)!important}
.tuckit-wrap-fixed [data-thumb="true"],.tuckit-wrap-fixed [data-track="true"],.tuckit-wrap-fixed [data-scrollbar-thumb],.tuckit-wrap-fixed [data-scrollbar-track]{display:none!important;visibility:hidden!important;width:0!important;height:0!important}
.tuckit-ds-footer{position:absolute!important;bottom:0!important;left:0!important;right:0!important;z-index:6!important;background:inherit!important;margin:0!important;flex-shrink:0!important;overflow:hidden!important}
.tuckit-ds-textarea-wrap{overflow:hidden!important;display:flex!important;flex-direction:column!important;flex:1 1 auto!important;scrollbar-width:none!important;max-height:100%!important;margin:0!important;margin-top:0!important;padding-top:0!important;gap:0!important}
.tuckit-ds-attach{flex-shrink:0!important;overflow:visible!important;min-height:0!important;max-height:none!important;overflow-y:visible!important;scrollbar-width:none!important;display:block!important;margin:0!important;margin-bottom:8px!important;padding-bottom:0!important;gap:0!important}
.tuckit-wrap-fixed[data-tuckit-deepseek] [class*="scroll-area__"]:not(textarea):not(:has(textarea)):not(:has([contenteditable="true"])),.tuckit-wrap-fixed[data-tuckit-deepseek] [class*="gutter"]:not(textarea):not(:has(textarea)):not(:has([contenteditable="true"])),.tuckit-wrap-fixed[data-tuckit-deepseek] [class*="scrollbar"]:not(textarea):not(:has(textarea)):not(:has([contenteditable="true"])),.tuckit-wrap-fixed[data-tuckit-deepseek] [class*="__thumb"]:not(:has(textarea)),.tuckit-wrap-fixed[data-tuckit-deepseek] [class*="__track"]:not(:has(textarea)),.tuckit-wrap-fixed[data-tuckit-deepseek] [role="scrollbar"]{display:none!important;visibility:hidden!important;pointer-events:none!important}
[data-tk-xbar]{display:none!important;visibility:hidden!important;pointer-events:none!important}
.tuckit-wrap-fixed[data-tuckit-deepseek]{overflow:hidden!important;scrollbar-width:none!important;gap:0!important}
.tuckit-wrap-fixed[data-tuckit-deepseek="1"]{padding-right:7px!important}
.tuckit-wrap-fixed[data-tuckit-deepseek="1"] .tuckit-toggle{right:28px!important}
.tuckit-clear{position:absolute!important;top:44px!important;right:47px!important;width:28px!important;height:28px!important;border-radius:8px!important;background:#083c48!important;border:1px solid rgba(29,203,242,.55)!important;z-index:2147483647!important;cursor:pointer!important;box-shadow:0 1px 5px rgba(0,0,0,.18)!important;display:flex!important;align-items:center!important;justify-content:center!important;user-select:none!important;opacity:1!important;padding:0!important;line-height:0!important;transition:opacity .3s,background .2s,border-color .2s!important}
.tuckit-clear:hover{background:#0a4e5e!important;border-color:rgba(29,203,242,.95)!important}
.tuckit-clear svg{pointer-events:none!important;display:block!important}
.tuckit-clear.tuckit-faded{opacity:0!important;pointer-events:none!important}
.tuckit-clear.tuckit-clear-armed{background:#d6455d!important;border-color:rgba(255,238,140,.8)!important;animation:tuckit-pulse 1s ease-in-out infinite!important}
.tuckit-clear.tuckit-clear-armed:hover{background:#e0566d!important}
@keyframes tuckit-pulse{0%,100%{box-shadow:0 0 0 0 rgba(214,69,93,.55)}50%{box-shadow:0 0 0 5px rgba(214,69,93,0)}}
.tuckit-wrap-fixed[data-tuckit-deepseek="1"] .tuckit-clear{right:28px!important}
/* ---- Single-scrollbar enforcer (rc.1a2): any scroller inside the box other than the editor gets silenced ---- */
.tuckit-wrap-fixed [data-tk-ns][data-tk-ns]{scrollbar-width:none!important;-ms-overflow-style:none!important}
.tuckit-wrap-fixed [data-tk-ns][data-tk-ns]::-webkit-scrollbar{width:0!important;height:0!important;display:none!important;background:transparent!important}
.tuckit-wrap-fixed [data-tk-ns="clip"][data-tk-ns]{overflow-y:hidden!important}
.tuckit-wrap-fixed [data-tk-ns="nest"][data-tk-ns]{overflow-y:hidden!important;height:auto!important;max-height:none!important;min-height:0!important;padding-right:0!important;margin:0!important;flex:0 0 auto!important}
`);
let disabled=hasGM?GM_getValue('tuckit_disabled',false):localStorage.getItem('tuckit_disabled')==='1';
let dragging=null,activeWrap=null,activeBtn=null,tipEl=null,hkEl=null,_tt=[],lastToggle=0,lastExpanded=0;
let seen=new WeakSet(),_lastCaret={el:null,range:null,taS:null,taE:null,time:0};
let _metaObs=null,_metaTimer=null,_homeWatch=null,_homeTries=0,_bootObs=null,_bootT=null,_wraps=[],_clrWrap=null;
const isEditable=el=>el&&(el.tagName==='TEXTAREA'||el.isContentEditable||el.getAttribute?.('contenteditable')==='true');
const isInCode=el=>{try{return !!el.closest('pre,code,.ds-markdown-code-block,[class*="code-block"],[class*="hljs"],[class*="shiki"],[class*="markdown"] code');}catch{return false;}};
const isEmpty=el=>{if(!el)return true;if(el.tagName==='TEXTAREA')return !el.value.trim();const t=(el.innerText||el.textContent||'').trim();if(t)return false;return !(el.innerHTML||'').replace(/<br\s*\/?>/gi,'').replace(/<p[^>]*>(\s|&nbsp;)*?<\/p>/gi,'').trim();};
function sp(e,o){for(const k in o)e.style.setProperty(k,o[k],'important');}
/* ---- Scroll keeper: restores scroll position if a TuckIT layout op yanks the page to the top ---- */
const _scrollReg=new Map();let _lastOpAt=0,_userScrollAt=0,_userScrolling=false,_lastRestoreAt=0,_rc=0,_rcT=0,_md=false,_mdX=0,_mdY=0;
const markOp=()=>{_lastOpAt=Date.now();};
const _isDocT=t=>t===document||t===document.documentElement||t===document.body||t===document.scrollingElement;
const scrollTopOf=t=>_isDocT(t)?(window.scrollY||document.documentElement.scrollTop||0):t.scrollTop;
const setScrollTop=(t,v)=>{try{if(_isDocT(t))window.scrollTo({top:v,left:window.scrollX,behavior:'instant'});else t.scrollTo({top:v,behavior:'instant'});}catch{if(_isDocT(t))window.scrollTo(window.scrollX,v);else t.scrollTop=v;}};
const snapScroll=()=>{const m=new Map();_scrollReg.forEach((top,t)=>{if(top>0&&(t===document||t.isConnected))m.set(t,top);});return m;};
const restoreScroll=m=>{if(!m)return;m.forEach((top,t)=>{try{if(t!==document&&!t.isConnected)return;if(scrollTopOf(t)<top-2)setScrollTop(t,top);}catch{}});};
const keepScroll=m=>{const t0=Date.now(),r=()=>{if(_userScrollAt>t0||_userScrolling)return;restoreScroll(m);};r();requestAnimationFrame(r);setTimeout(r,150);setTimeout(r,600);};
window.addEventListener('scroll',e=>{try{let t=e.target;if(!t||_isDocT(t))t=document;const top=scrollTopOf(t),prev=_scrollReg.get(t),now=Date.now();if(prev!==undefined&&prev>200&&top<=40&&!_userScrolling&&now-_userScrollAt>600&&now-_lastRestoreAt>40){if(now-_rcT>1000){_rcT=now;_rc=0;}if(_rc++<6){_lastRestoreAt=now;setScrollTop(t,prev);return;}}_scrollReg.set(t,top);if(_scrollReg.size>16)_scrollReg.delete(_scrollReg.keys().next().value);}catch{}},true);
['wheel','touchmove'].forEach(ev=>window.addEventListener(ev,()=>{_userScrollAt=Date.now();},{capture:true,passive:true}));
window.addEventListener('mousedown',e=>{_md=true;_mdX=e.clientX;_mdY=e.clientY;const t=e.target;if(!t||!t.getBoundingClientRect)return;const de=document.documentElement,isDoc=t===de||t===document.body,r=isDoc?{left:0,top:0}:t.getBoundingClientRect(),cw=isDoc?de.clientWidth:t.clientWidth,ch=isDoc?de.clientHeight:t.clientHeight;if(e.clientX>=r.left+cw+2||e.clientY>=r.top+ch+2){_userScrolling=true;_userScrollAt=Date.now();}},true);
window.addEventListener('mousemove',e=>{if(_md&&!_userScrolling&&(Math.abs(e.clientX-_mdX)>3||Math.abs(e.clientY-_mdY)>3)){_userScrolling=true;_userScrollAt=Date.now();}},true);
window.addEventListener('mouseup',()=>{_md=false;if(_userScrolling){_userScrolling=false;_userScrollAt=Date.now();}},true);
/* ---- Meta resize intent: Meta height only changes on paste/drop/image/drag/tuck/send/init ---- */
function metaIntent(w){if(!isMeta||!w)return;w._metaResizeRequested=true;w._metaIntentAt=Date.now();clearTimeout(w._metaIntentT);w._metaIntentT=setTimeout(()=>{w._metaResizeRequested=false;},1500);}
function saveCaret(el){try{if(!el)return;if(el.tagName==='TEXTAREA'){_lastCaret={el,taS:el.selectionStart,taE:el.selectionEnd,range:null,time:Date.now()};return;}const sel=window.getSelection();if(sel&&sel.rangeCount){const r=sel.getRangeAt(0);if(el.contains(r.commonAncestorContainer)||el===r.commonAncestorContainer||el.contains(r.startContainer))_lastCaret={el,range:r.cloneRange(),taS:null,taE:null,time:Date.now()};}}catch{}}
document.addEventListener('selectionchange',()=>{try{const ae=document.activeElement;if(!ae||!isEditable(ae))return;saveCaret(ae.tagName==='TEXTAREA'?ae:(ae.closest?.('div[data-lexical-editor="true"],div[contenteditable="true"][role="textbox"]')||ae));}catch{}});
['keyup','focusin'].forEach(ev=>document.addEventListener(ev,e=>{if(isEditable(e.target))saveCaret(e.target);}));
document.addEventListener('mouseup',e=>{if(isEditable(e.target))setTimeout(()=>saveCaret(e.target),10);});
function resetAnc(ed){try{const w=ed.closest('.tuckit-wrap-fixed');if(!w)return;let c=ed.parentElement;while(c&&c!==document.body){if(c.scrollTop)c.scrollTop=0;if(c.scrollLeft)c.scrollLeft=0;if(c===w)break;c=c.parentElement;}}catch{}}
function scrollTAIntoView(ta,mode){try{if(mode==='first'){resetAnc(ta);ta.scrollTop=0;return;}if(ta.value.length>2000){ta.scrollTop=ta.scrollHeight;return;}const pos=ta.selectionEnd;if(pos==null)return;const cs=getComputedStyle(ta),lh=parseFloat(cs.lineHeight)||20,cpl=Math.max(1,Math.floor(ta.clientWidth/(parseFloat(cs.fontSize)*0.6||8)));let wl=0;ta.value.slice(0,pos).split('\n').forEach(l=>{wl+=Math.max(1,Math.ceil(l.length/cpl));});ta.scrollTop=Math.min(Math.max(0,ta.scrollHeight-ta.clientHeight),Math.max(0,wl*lh-ta.clientHeight/2));}catch{}}
function scrollCaretIntoView(el){try{if(!el)return;if(el.tagName==='TEXTAREA'){scrollTAIntoView(el,'caret');return;}const sel=window.getSelection();if(!sel||!sel.rangeCount)return;const rect=sel.getRangeAt(0).cloneRange().getBoundingClientRect();if(!rect||(rect.top===0&&rect.bottom===0))return;const er=el.getBoundingClientRect();if(rect.bottom>er.bottom-8)el.scrollTop+=rect.bottom-er.bottom+22;else if(rect.top<er.top+8)el.scrollTop-=er.top-rect.top+22;}catch{}}
function scrollEdIntoView(ed,mode){try{if(mode==='first'){resetAnc(ed);ed.scrollTop=0;return;}scrollCaretIntoView(ed);resetAnc(ed);}catch{}}
function reveal(el,mode,saved){if(!el)return;const foc=()=>{try{el.focus({preventScroll:true});}catch{try{el.focus();}catch{}}};foc();if(el.tagName==='TEXTAREA'){if(saved?.taS!=null){try{el.setSelectionRange(saved.taS,saved.taE??saved.taS);}catch{}}scrollTAIntoView(el,mode==='first'?'first':'caret');}else{if(saved?.range){const sel=window.getSelection();try{sel.removeAllRanges();sel.addRange(saved.range.cloneRange());}catch{}}scrollEdIntoView(el,mode);}foc();}
function getEl(cls){let e=document.querySelector('.'+cls);if(!e){e=document.createElement('div');e.className=cls;document.body.appendChild(e);}return e;}
function showToast(m){let t=document.getElementById('tuckit-toast');if(!t){t=document.createElement('div');t.id='tuckit-toast';document.body.appendChild(t);}t.textContent=m;t.style.display='block';if(t._h)clearTimeout(t._h);t._h=setTimeout(()=>{t.style.display='none';},2500);}
function placeAbove(tip,wrap,extra=0){if(!wrap||!tip)return;const r=wrap.getBoundingClientRect();tip.style.display='block';requestAnimationFrame(()=>{const w=tip.offsetWidth,h=tip.offsetHeight;let l=Math.max(8,Math.min(r.left+r.width/2-w/2,innerWidth-w-8)),tp=r.top-h-10-extra;if(tp<8)tp=8;tip.style.left=l+'px';tip.style.top=tp+'px';});}
/* ---- Hints ("TuckIT OFF..." / "If crooked..."): two dedicated persistent elements, shown once per hover, auto-hide after ~3s ---- */
function hideHints(){_tt.forEach(clearTimeout);_tt=[];document.querySelectorAll('.tuckit-tip-hint').forEach(e=>{e.classList.remove('tuckit-visible');e.style.display='none';});}
function hideTips(){[tipEl,hkEl].forEach(x=>{if(!x)return;x.classList?.remove('tuckit-visible');x.style.display='none';});hideHints();clearTimeout(window._btn2T);}
function hideTipHK(){if(tipEl)tipEl.style.display='none';if(hkEl){hkEl.classList.remove('tuckit-visible');hkEl.style.display='none';}}
function hkBelow(){const fr=tipEl.getBoundingClientRect();hkEl.style.left=fr.left+'px';hkEl.style.top=(fr.bottom+6)+'px';}
function getMinH(){return 132;}
function computeMaxH(){return Math.max(Math.floor(innerHeight*(isDeepSeek?0.78:0.85)),getMinH()*2+20);}
function getMetaBar(wrap){try{const r=wrap.getBoundingClientRect();let btn=Array.from(wrap.querySelectorAll('button')).find(b=>(b.textContent||'').trim()==='Thinking');if(btn){let cur=btn;for(let i=0;i<6&&cur&&cur!==wrap;i++){const cr=cur.getBoundingClientRect();if(cr.height>28&&cr.height<110&&cr.bottom>=r.bottom-40&&cur.querySelectorAll('button').length>=1)return cur;cur=cur.parentElement;}}const c=Array.from(wrap.querySelectorAll('div')).filter(d=>{const cr=d.getBoundingClientRect();return cr.height>28&&cr.height<110&&cr.bottom>=r.bottom-30&&d.querySelectorAll('button').length>=2;});c.sort((a,b)=>b.getBoundingClientRect().bottom-a.getBoundingClientRect().bottom);return c[0]||null;}catch{return null;}}
function getMetaBarH(wrap){const el=getMetaBar(wrap);return el?el.offsetHeight:52;}
function findDSFooter(wrap){try{let el=wrap.querySelector('.ec4f5d61');if(el&&el!==wrap){const h=el.getBoundingClientRect().height;if(h>0&&h<140)return el;}const small=Array.from(wrap.querySelectorAll('div')).filter(d=>d!==wrap).filter(d=>{const r=d.getBoundingClientRect();return r.height>20&&r.height<140&&r.width>100;});for(let i=small.length-1;i>=0;i--){const d=small[i];if((d.textContent||'').includes('DeepThink')&&d.querySelector('button'))return d;}const c=small.filter(d=>{const n=d.querySelectorAll('button').length;return n>=2&&n<=5;});if(c.length){c.sort((a,b)=>b.getBoundingClientRect().bottom-a.getBoundingClientRect().bottom);return c[0];}}catch{}return null;}
function getDSFooter(wrap){try{const c=wrap._dsFc;if(c&&c.isConnected&&wrap.contains(c)&&Date.now()-(wrap._dsFcT||0)<1500)return c;}catch{}const f=findDSFooter(wrap);wrap._dsFc=f;wrap._dsFcT=Date.now();return f;}
function getDSFooterH(wrap){try{const f=getDSFooter(wrap);if(!f||f===wrap)return 72;const h=Math.ceil(f.getBoundingClientRect().height);return(h>0&&h<140)?h:72;}catch{return 72;}}
function getDSAttachEls(wrap){if(!wrap)return[];const els=[],seenS=new Set(),editor=wrap.querySelector('textarea, div[data-lexical-editor="true"], div[contenteditable="true"][role="textbox"]'),footer=getDSFooter(wrap);
const topChild=n=>{if(!n)return null;let c=n;while(c&&c.parentElement!==wrap&&c.parentElement)c=c.parentElement;return(c&&c.parentElement===wrap)?c:null;};
const isEd=n=>!n||n===wrap||(editor&&(n===editor||(n.contains&&n.contains(editor))||(editor.contains&&editor.contains(n))));
const isFoot=n=>!!footer&&(n===footer||n.contains(footer)||footer.contains(n));
const add=d=>{const tc=topChild(d)||d;if(!seenS.has(tc)){seenS.add(tc);els.push(tc);}};
Array.from(wrap.children).filter(c=>c.tagName==='DIV').forEach(d=>{if(isEd(d)||isFoot(d))return;const t=d.textContent||'';if(t.includes('Paste original')){add(d);return;}if(d.querySelector('button')&&/\.(txt|html|js|py|json|md|pdf|docx?|png|jpg|jpeg|webp|gif|bmp|svg)$/i.test(t.trim().split(/\s+/).slice(-1)[0]||'')){add(d);return;}let m=false;try{m=d.querySelectorAll('img,canvas,video').length>0||!!d.querySelector('[style*="background-image"]');}catch{}if(m)add(d);});return els;}
function getMetaAttach(wrap,el,force){const c=wrap._maC,n=performance.now();if(!force&&c&&n-c.t<400)return c;const o={els:[],h:0,t:n};try{const er=el.getBoundingClientRect(),bar=getMetaBar(wrap);wrap.querySelectorAll('div,ul,section').forEach(d=>{if(o.els.some(a=>a.contains(d))||d.contains(el)||el.contains(d)||d.closest('.tuckit-handle,.tuckit-toggle,.tuckit-clear')||(bar&&(bar.contains(d)||d.contains(bar))))return;const r=d.getBoundingClientRect();if(r.height<40||r.top>=er.top-4||!d.querySelector('img,canvas,video,svg,[style*="background-image"]'))return;o.els.push(d);o.h+=Math.min(320,Math.max(r.height,d.scrollHeight));});if(o.els.length)o.h=Math.min(320,o.h+8);}catch{}wrap._maC=o;return o;}
function getMetaAttachH(wrap){return isMeta&&wrap._el?getMetaAttach(wrap,wrap._el).h:0;}
function getDSAttachH(wrap){if(isMeta)return getMetaAttachH(wrap);const els=getDSAttachEls(wrap);if(!els.length)return 0;let total=0;els.forEach(e=>{let h=0;try{h=e.getBoundingClientRect().height||e.scrollHeight||0;if(h===0)h=e.querySelector('img')?80:65;if(e.querySelector('img,canvas,video'))h=Math.max(h,65);h=Math.min(h,160);}catch{h=75;}total+=h+6;});return Math.min(Math.max(total,els.length*70+8,70),260);}
function getBaseH(wrap){const min=getMinH(),ah=getDSAttachH(wrap),fh=getDSFooterH(wrap);return ah>0?Math.max(min,ah+32+fh+8):min;}
function getFooterH(wrap){return isMeta?(Number.isFinite(wrap._metaFH)?wrap._metaFH:getMetaBarH(wrap)):getDSFooterH(wrap);}
function getAttachH(wrap){return isDeepSeek?getDSAttachH(wrap):getMetaAttachH(wrap);}
function getExtra(wrap){return isDeepSeek?16:(12+(wrap&&wrap._adj||0));}
function getEditorTargetH(wrap,tgt){return Math.max(isDeepSeek?60:40,tgt-getFooterH(wrap)-getAttachH(wrap)-getExtra(wrap));}
/* Height needed to show the attachment section + footer + at least 2 lines of text. Attachments only ever expand the box up to this, never beyond. */
function needH(wrap,el){let lh=24;try{const c=getComputedStyle(el);lh=parseFloat(c.lineHeight)||parseFloat(c.fontSize)*1.5||24;}catch{}return Math.min(computeMaxH(),Math.max(getMinH(),Math.ceil(getAttachH(wrap)+getFooterH(wrap)+getExtra(wrap)+lh*2+20)));}
function attachFits(wrap,el){return getAttachH(wrap)>0&&wrap.offsetHeight>=needH(wrap,el)-2&&el.scrollHeight<=el.clientHeight+2;}
function computeMinimalH(wrap,el){try{const cs=el?getComputedStyle(el):null;let lh=cs?parseFloat(cs.lineHeight):NaN;if(!lh||isNaN(lh))lh=(cs?parseFloat(cs.fontSize):16)*1.5;const minInput=isMeta?(lh*2.5+18):(lh*2+14);let fh=0,ah=0;if(isMeta){fh=getMetaBarH(wrap);ah=getMetaAttachH(wrap);}else{fh=getDSFooterH(wrap);ah=getDSAttachH(wrap);}return Math.max(Math.ceil(minInput+fh+ah+(isMeta?28:16)),getMinH());}catch{return getMinH();}}
function findFeed(wrap){if(wrap._feed)return wrap._feed;if(wrap._feed===null)return null;let cur=wrap.parentElement;for(let i=0;i<12&&cur&&cur!==document.documentElement;i++){try{if(cur.scrollHeight>cur.clientHeight+200&&cur.clientHeight>300){const o=getComputedStyle(cur).overflowY;if(o==='auto'||o==='scroll'){wrap._feed=cur;return cur;}}}catch{}cur=cur.parentElement;}wrap._feed=null;return null;}
function fixMetaScroll(wrap){if(!isMeta||!wrap)return;try{const feed=findFeed(wrap);if(feed){feed.style.setProperty('overscroll-behavior','contain','important');const max=feed.scrollHeight-feed.clientHeight;if(max>=0&&feed.scrollTop>max)feed.scrollTop=max;sp(document.documentElement,{overflow:'hidden'});sp(document.body,{overflow:'hidden'});}else{const mw=Math.max(0,document.documentElement.scrollHeight-innerHeight);if(scrollY>mw)scrollTo(0,mw);}}catch{}}
function unfixMeta(){try{document.documentElement.style.removeProperty('overflow');document.body.style.removeProperty('overflow');}catch{}}
function isValidWrapCandidate(cur,el){if(!cur||cur===document.body)return false;if(cur.closest?.('pre,code'))return false;const bp=cur.querySelector(':scope > pre, :scope > div > pre');if(bp&&bp.getBoundingClientRect().height>250)return false;const r=cur.getBoundingClientRect();if(r.width<320||r.width>950||r.height>700||r.height<40)return false;if(r.bottom<innerHeight-380)return false;try{const cs=getComputedStyle(cur),bg=cs.backgroundColor,hasBg=bg&&bg!=='transparent'&&bg!=='rgba(0, 0, 0, 0)',rad=parseFloat(cs.borderRadius)||parseFloat(cs.borderTopLeftRadius)||0;if(!hasBg||rad<=8)return false;}catch{return false;}return true;}
function getWrap(el){let cur=el.parentElement,c=[];for(let i=0;i<(isMeta?14:16)&&cur&&cur!==document.body;i++){if(isMeta&&(cur.isContentEditable||cur.getAttribute?.('contenteditable')==='true')){cur=cur.parentElement;continue;}if(isValidWrapCandidate(cur,el)){const b=cur.getBoundingClientRect();c.push({el:cur,area:b.width*b.height});}cur=cur.parentElement;}if(c.length){c.sort((a,b)=>a.area-b.area);return c[0].el;}return el.closest('form')||el.parentElement;}
function getDirectChildWrapper(wrap,el){let cur=el.parentElement;while(cur&&cur!==wrap){if(cur.parentElement===wrap)return cur;cur=cur.parentElement;}if(el.parentElement&&el.parentElement!==wrap)return el.parentElement;return null;}
function verifyFit(wrap,el){if(!isMeta||!wrap||!el||wrap._animating||wrap._syncing||dragging)return;if(!wrap._metaResizeRequested&&Date.now()-(wrap._metaIntentAt||0)>1500)return;try{if(wrap.dataset.locked!=='1'||!wrap.isConnected)return;const wr=wrap.getBoundingClientRect(),er=el.getBoundingClientRect();let limit=wr.bottom-getFooterH(wrap);const bar=getMetaBar(wrap);if(bar){const bt=bar.getBoundingClientRect().top;if(bt>er.top+20)limit=Math.min(limit,bt);}const over=Math.round(er.bottom-limit);if(over>0&&(wrap._adj||0)<120){wrap._adj=Math.min(120,(wrap._adj||0)+Math.max(over,12));wrap._forceExpandFix=true;syncSizes(wrap,el,wrap._lastH||wr.height);}}catch{}}
function applyMetaEditorHeights(wrap,el,eH){const a=getMetaAttach(wrap,el),t=getDirectChildWrapper(wrap,el),hp=c=>(a.els.some(x=>c.contains(x))?eH+a.h:eH)+'px';
if(t&&t!==el){const px=hp(t);sp(t,{height:px,'max-height':px,'min-height':'40px',flex:'1 1 auto',display:'flex','flex-direction':'column',overflow:'hidden',margin:'0',gap:'0'});let c=el.parentElement;while(c&&c!==t&&c!==wrap){const q=hp(c);sp(c,{height:q,'max-height':q,'min-height':'0px','box-sizing':'border-box'});c=c.parentElement;}}
const px=eH+'px';sp(el,{height:px,'max-height':px,'min-height':'40px','overflow-y':'auto',flex:'1 1 auto',margin:'0'});
a.els.forEach(x=>{sp(x,{'flex-shrink':'0'});const w=getDirectChildWrapper(wrap,x);if(w&&w!==t)sp(w,{'flex-shrink':'0'});});
if(!(wrap._barW&&wrap._barW.isConnected)){const b=getMetaBar(wrap);wrap._barW=b?getDirectChildWrapper(wrap,b):null;}
if(wrap._barW&&wrap._barW!==t&&!wrap._barW.contains(el))sp(wrap._barW,{'margin-top':'auto','flex-shrink':'0'});}
function guardMeta(wrap,el){if(!isMeta||wrap._guardObs)return;let q=false,cnt=0,t0=0;const run=()=>{q=false;if(!wrap.isConnected||wrap.dataset.locked!=='1'||dragging||wrap._animating||wrap._syncing)return;if(!Number.isFinite(wrap._lastH)||!wrap.offsetHeight)return;const now=Date.now();if(now-t0>1000){t0=now;cnt=0;}if(cnt>=6)return;const exp=getEditorTargetH(wrap,wrap._lastH);if(Math.abs(wrap.offsetHeight-wrap._lastH)>3||Math.abs(el.offsetHeight-exp)>3){cnt++;wrap._forceExpandFix=true;syncSizes(wrap,el,wrap._lastH);}};const obs=new MutationObserver(()=>{if(q)return;q=true;requestAnimationFrame(run);});obs.observe(wrap,{attributes:true,attributeFilter:['style','class'],subtree:true});wrap._guardObs=obs;}
function syncSizes(wrap,el,target){markOp();if(!wrap||!el||wrap.dataset.locked!=='1'||!Number.isFinite(target))return;const min=wrap._origMin||getMinH(),max=computeMaxH();let finalT=Math.max(min,Math.min(max,target));
if(isMeta&&getMetaAttachH(wrap)>0)finalT=Math.min(max,Math.max(finalT,needH(wrap,el)));
if(Math.abs(wrap.offsetHeight-finalT)<2&&wrap._lastH&&Math.abs(wrap._lastH-finalT)<2){if(Math.abs(el.offsetHeight-getEditorTargetH(wrap,finalT))<3&&!wrap._forceExpandFix)return;}
if(isDeepSeek){pinDSFooter(wrap);hideDeadDS(wrap,el);}
const fh=getFooterH(wrap),ah=getAttachH(wrap),eH=Math.max(isDeepSeek?60:40,finalT-fh-ah-getExtra(wrap));wrap._syncing=true;
try{sp(wrap,{height:finalT+'px','min-height':finalT+'px','box-sizing':'border-box',gap:'0','row-gap':'0'});wrap._lastH=finalT;wrap._lastSync=Date.now();const tWrap=getDirectChildWrapper(wrap,el);
if(isMeta){wrap._metaFH=fh;applyMetaEditorHeights(wrap,el,eH);}
else{sp(wrap,{'padding-bottom':(fh+2)+'px'});
if(tWrap&&tWrap!==wrap){tWrap.classList.add('tuckit-ds-textarea-wrap');sp(tWrap,{height:'auto','max-height':'none','min-height':'0px',overflow:'hidden',display:'flex','flex-direction':'column',flex:'1 1 auto',margin:'0','margin-top':'0',gap:'0'});let p=el.parentElement;while(p&&p!==tWrap&&p!==wrap){sp(p,{height:'100%','min-height':'0px','max-height':'none',flex:'1 1 auto',display:'flex','flex-direction':'column',margin:'0',gap:'0',overflow:'hidden'});p=p.parentElement;}sp(el,{height:'100%','max-height':'100%','min-height':'0px',flex:'1 1 auto',margin:'0'});}
else sp(el,{height:'auto','max-height':'none','min-height':'0px',flex:'1 1 auto'});
sp(el,{'overflow-y':'auto'});pinDSFooter(wrap);hideDeadDS(wrap,el);}
makeFat(el,wrap);const btn=wrap.querySelector(':scope >.tuckit-toggle');if(btn){updTri(btn,wrap);if(isDeepSeek){btn.style.setProperty('right','28px','important');const cc=wrap.querySelector(':scope >.tuckit-clear');if(cc)cc.style.setProperty('right','28px','important');}}
}finally{setTimeout(()=>{wrap._syncing=false;wrap._forceExpandFix=false;},40);schedOne(wrap);if(isMeta&&!dragging){clearTimeout(wrap._fitT);wrap._fitT=setTimeout(()=>verifyFit(wrap,el),120);}}}
function makeFat(el,wrap){if(!el)return;if(isDeepSeek){el.classList.add('tuckit-fat-scroll');if(wrap){wrap.classList.remove('tuckit-fat-scroll');sp(wrap,{'scrollbar-width':'none',overflow:'hidden','padding-right':'7px'});}try{sp(el,{'padding-right':'41px','margin-right':'7px','box-sizing':'border-box','scrollbar-gutter':'auto','overflow-y':'auto','scrollbar-width':'thin','overscroll-behavior':'contain'});}catch{}return;}
/* rc.1a2: only the editor gets the fat scrollbar. The wrap must NEVER show one (that was the 2nd bar on Meta). */
try{el.classList.add('tuckit-fat-scroll');if(wrap){wrap.classList.remove('tuckit-fat-scroll');sp(wrap,{'scrollbar-width':'none',overflow:'hidden'});}}catch{}
try{sp(el,{'padding-right':'49px','margin-right':'0px','overscroll-behavior':'contain'});if(isMeta)sp(el,{'padding-bottom':'12px'});}catch{}}
/* ===================== SINGLE SCROLLBAR ENFORCER (rc.1a2) =====================
   The editor (wrap._el) is the ONLY element allowed to show a vertical scrollbar.
   Anything else inside the box that could scroll is tagged data-tk-ns:
     clip = ancestor of the editor that scrolls  -> overflow-y hidden + bar hidden
     nest = a nested editable inside the editor  -> overflow-y hidden, auto height, bar hidden
     hide = a sibling scroller (attachments etc) -> scrolling still works, bar hidden
   It runs after every resize, on paste/drop/file-pick bursts, when DOM nodes are added,
   when a non-editor element scrolls, and on a light 1s watchdog. */
const _tkOurs='.tuckit-handle,.tuckit-toggle,.tuckit-clear,.tuckit-tip,.tuckit-tip-hint';
const _TK_SCAN='div,section,ul,ol,form,aside,article,main,pre,textarea,[contenteditable]';
function primaryEl(wrap){let el=wrap._el;if(el&&el.isConnected&&wrap.contains(el))return el;try{el=wrap.querySelector(SELECTORS);}catch{el=null;}if(el)wrap._el=el;return el;}
function nsMode(d,el){
if(!d||d===el||d.nodeType!==1||d.hasAttribute('data-tk-ns'))return null;
if(d.closest(_tkOurs))return null;
const oy=getComputedStyle(d).overflowY,scrolly=(oy==='auto'||oy==='scroll'||oy==='overlay');
if(d.contains(el))return scrolly?'clip':null;
if(el.contains(d)){if(isEditable(d))return 'nest';return(scrolly&&d.scrollHeight>d.clientHeight+1)?'nest':null;}
return(scrolly&&d.scrollHeight>d.clientHeight+1)?'hide':null;}
function markNS(d,mode){try{d.setAttribute('data-tk-ns',mode);if(mode!=='hide'){if(d.scrollTop)d.scrollTop=0;}}catch{}}
function oneScroll(wrap,force){try{
if(!wrap||!wrap.isConnected||wrap.dataset.locked!=='1')return;
const n=performance.now();if(!force&&n-(wrap._osT||0)<120)return;wrap._osT=n;
const el=primaryEl(wrap);if(!el)return;
if(wrap.scrollTop)wrap.scrollTop=0;if(wrap.scrollLeft)wrap.scrollLeft=0;
wrap.querySelectorAll(_TK_SCAN).forEach(d=>{const m=nsMode(d,el);if(m)markNS(d,m);});}catch{}}
function schedOne(wrap){if(!wrap)return;clearTimeout(wrap._osQ);wrap._osQ=setTimeout(()=>oneScroll(wrap,true),90);}
function burstOne(wrap){[60,200,500,1000,1800,3000].forEach(ms=>setTimeout(()=>oneScroll(wrap,true),ms));}
/* ===================== /SINGLE SCROLLBAR ENFORCER ===================== */
function pinDSFooter(wrap){if(!isDeepSeek||!wrap)return;const f=getDSFooter(wrap);if(!f)return;const fh=Math.ceil(f.getBoundingClientRect().height)||72;sp(wrap,{position:'relative','padding-bottom':(fh+2)+'px','box-sizing':'border-box',overflow:'hidden'});f.classList.add('tuckit-ds-footer');sp(f,{position:'absolute',bottom:'0',left:'0',right:'0','z-index':'6',background:'inherit'});}
function hideDeadDS(wrap,el){if(!isDeepSeek||!wrap||!el)return;const footer=getDSFooter(wrap),aSet=new Set(getDSAttachEls(wrap));wrap.setAttribute('data-tuckit-deepseek','1');sp(wrap,{overflow:'hidden',gap:'0'});wrap.querySelectorAll(':scope > div').forEach(d=>{if(d===el||d.contains(el)){if(d!==el)sp(d,{overflow:'hidden',margin:'0',gap:'0'});return;}if(aSet.has(d)){d.classList.add('tuckit-ds-attach');sp(d,{margin:'0','margin-bottom':'8px','padding-bottom':'0',overflow:'visible',display:'block',gap:'0'});return;}if(d===footer)return;if(d.parentElement===wrap)sp(d,{overflow:'hidden'});});const t=getDirectChildWrapper(wrap,el);if(t&&t!==wrap)sp(t,{overflow:'hidden','margin-top':'0'});killExtraBars(wrap,el);}
function killExtraBars(wrap,el){if(!isDeepSeek||!wrap||!el||!wrap.isConnected)return;const n=performance.now();if(n-(wrap._xbT||0)<500){if(!wrap._xbQ)wrap._xbQ=setTimeout(()=>{wrap._xbQ=0;killExtraBars(wrap,el);},520);return;}wrap._xbT=n;try{const er=el.getBoundingClientRect(),wr=wrap.getBoundingClientRect();wrap.querySelectorAll('*').forEach(d=>{if(d===el||d.contains(el)||el.contains(d)||d.hasAttribute('data-tk-xbar'))return;if(/^(BUTTON|IMG|SVG|CANVAS|INPUT|TEXTAREA|VIDEO|A)$/i.test(d.tagName)||d.closest('.tuckit-handle,.tuckit-toggle,.tuckit-ds-footer,.tuckit-ds-attach,button,svg'))return;if((d.textContent||'').trim())return;const r=d.getBoundingClientRect();if(r.width>=2&&r.width<=24&&r.height>=16&&r.top>=er.top-20&&r.bottom<=er.bottom+20&&r.left>=er.right-90&&r.right<=wr.right+4)d.setAttribute('data-tk-xbar','1');});}catch{}}
const CAP=['position','left','right','width','bottom','margin','transform','overflow','boxSizing','zIndex','height','display','flexDirection','paddingBottom','paddingTop','gap'];
const capInline=w=>Object.fromEntries(CAP.map(k=>[k,w.style[k]]));
function restInline(wrap,o){if(!o)return;for(const [p,v] of Object.entries(o)){const cp=p.replace(/[A-Z]/g,m=>'-'+m.toLowerCase());if(v)wrap.style.setProperty(cp,v);else wrap.style.removeProperty(cp);}}
function lockBottom(w){if(w.dataset.locked==='1')return;w.dataset.orig=JSON.stringify(capInline(w));sp(w,{position:'sticky',bottom:'0','z-index':'10',display:'flex','flex-direction':'column',overflow:'hidden','box-sizing':'border-box','padding-top':'14px',gap:'0'});w.classList.add('tuckit-wrap-fixed');w.dataset.locked='1';w._origMin=getMinH();if(w._wasEmpty===undefined)w._wasEmpty=true;if(isDeepSeek)pinDSFooter(w);}
function renderTri(btn,state){if(!btn)return;btn.innerHTML='';const ico=document.createElement('span');ico.className='tuckit-ico';const t1=document.createElement('span'),t2=document.createElement('span');t1.className='tuckit-tri';t2.className='tuckit-tri';if(state==='expanded'){t1.classList.add('down');t2.classList.add('up');}else{t1.classList.add('up');t2.classList.add('down');}ico.appendChild(t1);ico.appendChild(t2);btn.appendChild(ico);}
function updTri(btn,wrap){if(!btn||!wrap)return;let state='collapsed';const max=computeMaxH();if(isDeepSeek){const base=getBaseH(wrap),ah=getDSAttachH(wrap);if(wrap.offsetHeight>(ah>0?base+30:max*0.5))state='expanded';}else if(wrap.offsetHeight>max*0.5)state='expanded';btn.dataset.state=state;renderTri(btn,state);}
function autoMeta(el,wrap,btn,opts={}){
if(!isMeta||!el||!wrap||wrap.dataset.locked!=='1')return;
if(wrap._dragLocked&&!opts.force){syncSizes(wrap,el,Number.isFinite(wrap._manual)?wrap._manual:(wrap._origMin||getMinH()));if(isEmpty(el))el.scrollTop=0;return;}
if(wrap._userTucked&&!opts.force&&!opts.ignore){syncSizes(wrap,el,Number.isFinite(wrap._manual)?wrap._manual:getMinH());if(isEmpty(el))el.scrollTop=0;return;}
const min=wrap._origMin||getMinH(),max=computeMaxH(),fh=wrap._metaFH||getMetaBarH(wrap);wrap._metaFH=fh;
const empty=isEmpty(el),wasEmpty=wrap._wasEmpty!==false,b=btn||wrap.querySelector(':scope >.tuckit-toggle');let finalH;
if(empty){const mf=Number.isFinite(wrap._manual)?wrap._manual:min,recent=Date.now()-(wrap._lastTog||0)<3000;
if(!wasEmpty){wrap._manual=min;finalH=min;}else if(!opts.ignore&&mf>min+20&&(recent||!opts.force))finalH=Math.min(max,mf);else{wrap._manual=min;finalH=min;}
syncSizes(wrap,el,finalH);if(b)updTri(b,wrap);wrap._wasEmpty=true;el.scrollTop=0;return;}
wrap._wasEmpty=false;const cH=Math.ceil(el.scrollHeight);
if(!opts.force&&wrap.offsetHeight>=max&&cH+fh+24>=max){syncSizes(wrap,el,Math.min(max,wrap.offsetHeight));fixMetaScroll(wrap);return;}
const cTgt=Math.max(min,Math.min(max,cH+fh+32+getMetaAttachH(wrap))),mf=opts.ignore?min:(Number.isFinite(wrap._manual)?wrap._manual:min);finalH=Math.min(max,Math.max(mf,cTgt));
if(!wrap._userTucked)finalH=Math.max(finalH,wrap._manual||lastExpanded||min);
syncSizes(wrap,el,finalH);fixMetaScroll(wrap);if(b)updTri(b,wrap);clearTimeout(wrap._fitT2);wrap._fitT2=setTimeout(()=>verifyFit(wrap,el),60);}
function autoDS(el,wrap,btn,opts={}){
if(!el||!wrap||wrap.dataset.locked!=='1')return;
if(wrap._dragLocked&&!opts.force&&!opts.ignoreFile){const ah=getDSAttachH(wrap);if(ah===0||wrap._lastAttach>0){syncSizes(wrap,el,Number.isFinite(wrap._manual)?wrap._manual:getBaseH(wrap));return;}}
const min=wrap._origMin||getMinH(),max=computeMaxH(),fh=getDSFooterH(wrap),ah=getDSAttachH(wrap);
if(ah>0&&wrap._userTucked&&!opts.force){const need=Math.max(min,ah+32+fh+8);if(wrap.offsetHeight<need-5){wrap._forceExpandFix=true;syncSizes(wrap,el,need);wrap._manual=need;wrap._userTucked=false;const b=btn||wrap.querySelector(':scope >.tuckit-toggle');if(b)updTri(b,wrap);return;}}
if(wrap._userTucked&&!opts.force&&ah===0){syncSizes(wrap,el,Number.isFinite(wrap._manual)?wrap._manual:getBaseH(wrap));return;}
pinDSFooter(wrap);hideDeadDS(wrap,el);
const empty=isEmpty(el),wasEmpty=wrap._wasEmpty!==false,base=ah>0?needH(wrap,el):min;let finalH;
if(empty){const mf=Number.isFinite(wrap._manual)?wrap._manual:min,recent=Date.now()-(wrap._lastTog||0)<3000;
if(ah>0){finalH=opts.ignore?base:Math.max(base,mf>min+20&&recent?Math.min(max,mf):base);if(!wasEmpty)wrap._manual=base;}
else if(!wasEmpty){wrap._manual=min;finalH=min;}
else if(!opts.ignore&&mf>min+20&&(recent||!opts.force))finalH=Math.min(max,mf);
else{wrap._manual=min;finalH=min;}}
else{wrap._wasEmpty=false;const cH=Math.ceil(el.scrollHeight),cTgt=Math.max(base,Math.min(max,cH+ah+fh+24));finalH=cTgt;if(!wrap._dragLocked){const mf=Number.isFinite(wrap._manual)?wrap._manual:min;if(mf>cTgt&&mf<=cTgt+140&&!opts.ignore)finalH=Math.min(max,mf);}}
wrap._wasEmpty=empty;syncSizes(wrap,el,finalH);const b=wrap.querySelector(':scope >.tuckit-toggle');if(b)updTri(b,wrap);makeFat(el,wrap);}
function qResize(el,wrap,btn,opts={}){
if(!wrap||wrap._syncing)return;
if(isMeta&&!wrap._metaResizeRequested)return;
if(Date.now()-(wrap._lastSync||0)<80&&!opts.force)return;
if(isDeepSeek&&wrap._dragArmed&&(wrap._lastAttach||0)===0&&getDSAttachEls(wrap).length>0&&!wrap._firstAttachDone){maybeExpandFirstAttach(wrap,el,btn);return;}
const fl=()=>Number.isFinite(wrap._manual)?wrap._manual:(isDeepSeek?getBaseH(wrap):computeMinimalH(wrap,el));
if(wrap._userTucked&&!opts.force&&getDSAttachH(wrap)===0){syncSizes(wrap,el,fl());return;}
if(wrap._dragLocked&&!opts.force&&!opts.ignoreFile&&(getDSAttachH(wrap)===0||wrap._lastAttach>0)){syncSizes(wrap,el,fl());return;}
if(wrap._rq&&!opts.force)return;wrap._rq=true;
requestAnimationFrame(()=>{wrap._rq=false;if(wrap._syncing||wrap.dataset.locked!=='1')return;
if(attachFits(wrap,el)){wrap._forceExpandFix=true;syncSizes(wrap,el,wrap.offsetHeight);wrap._metaResizeRequested=false;return;}
if(isMeta){autoMeta(el,wrap,btn,opts);wrap._metaResizeRequested=false;}else autoDS(el,wrap,btn,opts);});}
function maybeExpandFirstAttach(wrap,el,btn){
if(!isDeepSeek||!wrap||!el||wrap._syncing)return false;
if(wrap._firstAttachDone){wrap._lastAttach=getDSAttachEls(wrap).length;wrap._lastAttachH=getDSAttachH(wrap);return false;}
const cnt=getDSAttachEls(wrap).length,prev=wrap._lastAttach||0;
if(!(cnt>0&&prev===0)||(!wrap._dragArmed&&!wrap._pasteArmed)){wrap._lastAttach=cnt;return false;}
const ah=getDSAttachH(wrap),target=Math.max(wrap.offsetHeight,needH(wrap,el));
lockBottom(wrap);wrap._manual=target;wrap._userTucked=false;wrap._forceExpandFix=true;syncSizes(wrap,el,target);
wrap._firstAttachDone=true;wrap._dragArmed=false;wrap._pasteArmed=false;wrap._lastAttach=cnt;wrap._lastAttachH=ah;
const b=wrap._btn||btn;if(b)updTri(b,wrap);return true;}
function animateH(wrap,el,btn,tgt,dur=190){
try{if(!wrap||!el)return;if(wrap._anim)cancelAnimationFrame(wrap._anim);wrap._anim=null;const startH=wrap.offsetHeight;
const fin=()=>{if(btn&&isDeepSeek)btn.style.setProperty('right','28px','important');};
if(Math.abs(startH-tgt)<2.5){wrap._forceExpandFix=true;wrap._syncing=false;wrap._animating=false;syncSizes(wrap,el,tgt);if(btn){updTri(btn,wrap);fin();}if(wrap._wasExp){wrap._wasExp=false;if(!isMeta)setTimeout(()=>mimicClick(wrap,el,btn),40);}return;}
const st=performance.now(),min=wrap._origMin||getMinH(),max=computeMaxH();tgt=Math.max(min,Math.min(max,tgt));wrap._syncing=true;wrap._animating=true;
const frame=now=>{const p=Math.min(1,(now-st)/dur),cur=startH+(tgt-startH)*(1-Math.pow(1-p,3));sp(wrap,{height:cur+'px','min-height':cur+'px'});wrap._lastH=cur;
const eh=Math.max(isDeepSeek?60:40,cur-getFooterH(wrap)-getAttachH(wrap)-getExtra(wrap)),tWrap=getDirectChildWrapper(wrap,el);
if(isMeta)applyMetaEditorHeights(wrap,el,eh);
else if(tWrap){if(isDeepSeek){sp(tWrap,{height:'auto','max-height':'none','min-height':'0px',flex:'1 1 auto'});sp(el,{height:'100%','min-height':'0px'});fin();}else{sp(tWrap,{height:eh+'px','max-height':eh+'px'});sp(el,{height:'100%'});}}
else sp(el,{height:eh+'px','max-height':eh+'px'});
if(p>0.35&&p<0.85&&isDeepSeek)pinDSFooter(wrap);
if(p<1)wrap._anim=requestAnimationFrame(frame);
else{wrap._syncing=false;wrap._animating=false;wrap._anim=null;wrap._lastSync=Date.now();wrap._forceExpandFix=true;syncSizes(wrap,el,tgt);if(isDeepSeek){pinDSFooter(wrap);hideDeadDS(wrap,el);fin();}if(isMeta)fixMetaScroll(wrap);makeFat(el,wrap);if(btn)updTri(btn,wrap);if(wrap._wasExp){wrap._wasExp=false;if(!isMeta)setTimeout(()=>mimicClick(wrap,el,btn),45);}}};
wrap._anim=requestAnimationFrame(frame);
}catch{try{wrap._forceExpandFix=true;wrap._syncing=false;wrap._animating=false;wrap._anim=null;syncSizes(wrap,el,tgt);if(isDeepSeek&&btn)btn.style.setProperty('right','28px','important');}catch{}}}
function mimicClick(wrap,el,btn){try{const h=wrap.querySelector('.tuckit-handle');if(!h||!wrap||!el)return;const r=h.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2;try{h.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,clientX:x,clientY:y,pointerId:99}));}catch{try{h.dispatchEvent(new MouseEvent('mousedown',{bubbles:true,clientX:x,clientY:y}));}catch{}}const cur=wrap.offsetHeight;void wrap.offsetHeight;wrap._forceExpandFix=true;syncSizes(wrap,el,cur+1);setTimeout(()=>{try{wrap._forceExpandFix=true;syncSizes(wrap,el,cur);if(isDeepSeek){pinDSFooter(wrap);hideDeadDS(wrap,el);}makeFat(el,wrap);try{h.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,clientX:x,clientY:y,pointerId:99}));h.dispatchEvent(new MouseEvent('mouseup',{bubbles:true,clientX:x,clientY:y}));h.dispatchEvent(new MouseEvent('click',{bubbles:true,clientX:x,clientY:y}));}catch{}try{el.focus({preventScroll:true});}catch{try{el.focus();}catch{}}if(btn)updTri(btn,wrap);}catch{}},32);}catch{}}
function toggleNow(wrap,btn){
if(!wrap||!btn)return;
if(wrap._anim){try{cancelAnimationFrame(wrap._anim);}catch{}wrap._anim=null;}wrap._animating=false;wrap._syncing=false;wrap._rq=false;
const now=Date.now(),first=!wrap._firstExpDone,gap=first?750:300;if(now-lastToggle<gap)return;
lastToggle=now;wrap._lastTog=Date.now();metaIntent(wrap);
const input=wrap.querySelector('div[contenteditable="true"],textarea');if(!input)return;
saveCaret(input);
const saved={range:_lastCaret.el===input&&_lastCaret.range?_lastCaret.range.cloneRange():null,taS:_lastCaret.el===input?_lastCaret.taS:null,taE:_lastCaret.el===input?_lastCaret.taE:null};
const min=wrap._origMin||getMinH(),max=computeMaxH(),doReveal=()=>reveal(input,'caret',saved);let isExp=false;
if(isDeepSeek){const base=getBaseH(wrap),ah=getDSAttachH(wrap),thr=ah>0?base+30:max*0.5;isExp=(btn.dataset.state==='expanded')||(wrap.offsetHeight>thr+2);}
else isExp=btn.dataset.state==='expanded'||wrap.offsetHeight>max*0.52;
if(isExp){
let minimal=isDeepSeek?(getDSAttachH(wrap)>0?getBaseH(wrap):getMinH()):computeMinimalH(wrap,input);
minimal=Math.max(min,Math.min(max,minimal));
wrap._manual=minimal;wrap._userTucked=true;wrap._dragLocked=true;wrap._wasEmpty=isEmpty(input);wrap._forceExpandFix=true;wrap._lastH=minimal;
animateH(wrap,input,btn,minimal,isDeepSeek?190:175);
setTimeout(()=>{if(wrap.dataset.locked==='1'&&wrap._userTucked){wrap._forceExpandFix=true;syncSizes(wrap,input,minimal);}},260);
save('compact');requestAnimationFrame(doReveal);setTimeout(doReveal,180);clearTimeout(wrap._tuckT);wrap._tuckT=setTimeout(doReveal,2700);
}else{
let tgt=lastExpanded;if(!tgt||tgt<=min+20||tgt<=max*0.5)tgt=Math.floor(max*0.66);
tgt=Math.max(tgt,Math.floor(max*0.58));
try{if(!isEmpty(input)){const need=input.scrollHeight+(isMeta?getMetaBarH(wrap)+32:getDSFooterH(wrap)+getDSAttachH(wrap)+24);if(need>tgt)tgt=Math.min(max,Math.max(tgt,need));}}catch{}
tgt=Math.min(max,Math.max(min,tgt));
wrap._manual=tgt;wrap._userTucked=false;wrap._dragLocked=true;wrap._wasEmpty=isEmpty(input);lastExpanded=tgt;
const base=isDeepSeek?220:200,dur=(isMeta||wrap._firstExpDone)?base:Math.round(base*3);wrap._wasExp=true;wrap._forceExpandFix=true;
animateH(wrap,input,btn,tgt,dur);if(!wrap._firstExpDone)wrap._firstExpDone=true;save(`custom:${tgt}`);requestAnimationFrame(doReveal);setTimeout(doReveal,180);clearTimeout(wrap._tuckT);wrap._tuckT=setTimeout(doReveal,2700);}
showUI(btn);}
function setClrVis(wrap,show){try{const c=wrap&&wrap.querySelector(':scope >.tuckit-clear');if(!c)return;if(!show&&wrap._clrArmed)return;c.classList.toggle('tuckit-faded',!show);c.style.opacity=show?'1':'0';}catch{}}
function showUI(btn){if(!btn)return;const wrap=btn.parentElement,h=wrap?.querySelector('.tuckit-handle');setClrVis(wrap,true);btn.classList.remove('tuckit-faded');btn.style.opacity='1';if(h){h.classList.remove('tuckit-faded');h.style.opacity='1';}clearTimeout(btn._hide);if(wrap){clearTimeout(wrap._hideH);wrap._hideH=null;}if(isDeepSeek){btn.style.setProperty('right','28px','important');const cc=wrap&&wrap.querySelector(':scope >.tuckit-clear');if(cc)cc.style.setProperty('right','28px','important');}}
function fade(btn){const wrap=btn.parentElement;setClrVis(wrap,false);btn.classList.add('tuckit-faded');btn.style.opacity='0';const h=wrap?.querySelector('.tuckit-handle');if(h){h.classList.add('tuckit-faded');h.style.opacity='0';}hideTips();}
function schedHide(btn){if(!btn)return;clearTimeout(btn._hide);btn._hide=setTimeout(()=>fade(btn),800);}
function hideTog(btn){if(!btn)return;fade(btn);clearTimeout(btn._hide);}
/* Hints show once per hover (1.5s / 3s after entering the zone), stack above the box, then auto-hide. Re-armed only after the pointer leaves the zone. */
function hotTips(wrap){if(wrap._ttSched||dragging)return;wrap._ttSched=true;hideHints();
const show=(id,t,x)=>{let e=document.getElementById(id);if(!e){e=document.createElement('div');e.id=id;e.className='tuckit-tip-hint';document.body.appendChild(e);}e.textContent=t;placeAbove(e,wrap,x);requestAnimationFrame(()=>e.classList.add('tuckit-visible'));};
_tt=[setTimeout(()=>show('tuckit-hint-1','TuckIT OFF: Ctrl + Shift + K',0),1500),setTimeout(()=>show('tuckit-hint-2','If crooked, refresh (Cmd + R/Ctrl + R)',24),3000),setTimeout(hideHints,6500)];}
function hoverLogic(e){
document.querySelectorAll('.tuckit-wrap-fixed').forEach(wrap=>{const r=wrap.getBoundingClientRect(),inZone=e.clientX>=r.left-60&&e.clientX<=r.right+60&&e.clientY>=r.top-80&&e.clientY<=r.top+120,btn=wrap.querySelector('.tuckit-toggle');if(!btn)return;
if(inZone){showUI(btn);hotTips(wrap);}
else{if(wrap._ttSched){hideTips();wrap._ttSched=false;}const br=btn.getBoundingClientRect(),near=Math.hypot(e.clientX-(br.left+br.width/2),e.clientY-(br.top+br.height/2))<220;if(!near&&!dragging){if(!wrap._hideH)wrap._hideH=setTimeout(()=>{wrap._hideH=null;fade(btn);},800);}else{clearTimeout(wrap._hideH);wrap._hideH=null;}}});
document.querySelectorAll('.tuckit-toggle').forEach(btn=>{const r=btn.getBoundingClientRect();if(Math.hypot(e.clientX-(r.left+r.width/2),e.clientY-(r.top+r.height/2))<220)showUI(btn);});}
let _pmT=0;
window.addEventListener('pointermove',e=>{
if(_wraps.length){const n=performance.now();if(n-_pmT>=60){_pmT=n;hoverLogic(e);}}
if(!dragging)return;e.preventDefault();const d=dragging;
if(!d.locked){if(Math.abs(e.clientY-d.startY)<4)return;lockBottom(d.wrap);d.locked=true;d.feed=findFeed(d.wrap);d.startFeed=d.feed?d.feed.scrollTop:0;}
const min=d.wrap._origMin||getMinH(),max=computeMaxH(),nh=Math.max(min,Math.min(max,d.startH+(d.startY-e.clientY)));if(Math.abs(nh-d.wrap.offsetHeight)<1)return;
d.wrap._manual=nh;d.wrap._userTucked=nh<=max*0.5;d.wrap._dragLocked=true;d.wrap._draggedThisTurn=true;d.wrap._forceExpandFix=true;if(nh>getMinH()+20)lastExpanded=nh;
syncSizes(d.wrap,d.el,nh);showUI(d.btn);updTri(d.btn,d.wrap);
if(d.feed){const inc=nh-(d.lastH??d.startH);if(Math.abs(inc)>=1){const sc=d.feed,maxS=sc.scrollHeight-sc.clientHeight;sc.scrollTop=Math.max(0,Math.min(maxS,sc.scrollTop+inc));d.lastH=nh;}}
d.moved=true;},true);
window.addEventListener('pointerup',()=>{if(!dragging)return;const d=dragging;dragging=null;if(!d.moved){hideTips();return;}const h=d.wrap.offsetHeight;d.wrap._manual=h;d.wrap._userTucked=h<=computeMaxH()*0.5;d.wrap._dragLocked=true;d.wrap._draggedThisTurn=true;d.wrap._forceExpandFix=true;if(h>getMinH()+20)lastExpanded=h;metaIntent(d.wrap);syncSizes(d.wrap,d.el,h);save(`custom:${h}`);hideTips();},true);
window.addEventListener('keydown',e=>{
if(e.key==='Home'||e.key==='PageUp'||e.key==='ArrowUp'||e.key===' ')_userScrollAt=Date.now();
if(e.ctrlKey&&e.shiftKey&&e.code==='KeyK'){e.preventDefault();setDisabled(!disabled);return;}
if(e.ctrlKey&&e.shiftKey&&e.code==='KeyL'){e.preventDefault();if(disabled)return;
if(activeWrap&&activeWrap._animating){if(activeWrap._anim){try{cancelAnimationFrame(activeWrap._anim);}catch{}activeWrap._anim=null;}activeWrap._animating=false;activeWrap._syncing=false;}
const first=!(activeWrap&&activeWrap._firstExpDone),gap=first?750:300;if(Date.now()-lastToggle<gap)return;
let w=activeWrap,b=activeBtn;if(!w||!b){const f=document.querySelector('.tuckit-toggle');if(f){w=f.closest('.tuckit-wrap-fixed')||f.parentElement;b=f;}}
if(!w||!b)return;toggleNow(w,b);}},true);
function findSend(wrap){try{const form=wrap.closest('form'),scope=form||wrap.parentElement||wrap,c=[];
scope.querySelectorAll('button,[role="button"]').forEach(b=>{const aria=(b.getAttribute('aria-label')||'').toLowerCase(),ty=(b.getAttribute('type')||'').toLowerCase();if(ty==='submit'||aria.includes('send')||aria.includes('submit')){const r=b.getBoundingClientRect(),wr=wrap.getBoundingClientRect();if(r.width>0&&r.bottom>=wr.bottom-100)c.push(b);}});
if(!c.length&&form)form.querySelectorAll('button[type="submit"]').forEach(b=>c.push(b));
if(!c.length)document.querySelectorAll('button[aria-label*="Send"],button[type="submit"]').forEach(b=>c.push(b));
if(!c.length)return null;const wr=wrap.getBoundingClientRect();
c.sort((a,b)=>{const ra=a.getBoundingClientRect(),rb=b.getBoundingClientRect();return Math.hypot(wr.right-ra.right,wr.bottom-ra.bottom)-Math.hypot(wr.right-rb.right,wr.bottom-rb.bottom);});return c[0];}catch{return null;}}
function afterSend(wrap,btn,el){
if(!wrap||!el)return;const _sk=snapScroll();markOp();metaIntent(wrap);const min=computeMinimalH(wrap,el);
try{wrap.style.removeProperty('height');wrap.style.removeProperty('min-height');el.style.removeProperty('height');el.style.removeProperty('max-height');}catch{}
Object.assign(wrap,{_manual:min,_userTucked:true,_dragLocked:false,_draggedThisTurn:false,_wasEmpty:true,_wasNotEmpty:false,_firstAttachDone:false,_lastAttach:0,_lastAttachH:0,_dragArmed:false,_pasteArmed:false,_forceExpandFix:true});
syncSizes(wrap,el,min);if(isEmpty(el)){el.scrollTop=0;el.scrollLeft=0;}save('compact');updTri(btn,wrap);keepScroll(_sk);burstOne(wrap);
if(el._bootT)clearTimeout(el._bootT);
el._bootT=setTimeout(()=>{try{el.scrollTop=0;const ww=el.closest('.tuckit-wrap-fixed');if(ww)ww.scrollTop=0;}catch{}reveal(el,'first',{range:null,taS:null,taE:null});},2700);}
function hookSend(wrap,btn,el){try{
const form=wrap.closest('form')||el.closest('form'),sBtn=findSend(wrap),chk=d=>setTimeout(()=>{if(isEmpty(el))afterSend(wrap,btn,el);},d);
if(sBtn&&!sBtn._tHook){sBtn._tHook=true;sBtn.addEventListener('pointerdown',()=>{if(!isEmpty(el)){wrap._wasNotEmpty=true;chk(120);}else afterSend(wrap,btn,el);},true);sBtn.addEventListener('click',()=>chk(80),true);}
if(form&&!form._tHook){form._tHook=true;form.addEventListener('submit',()=>{if(!isEmpty(el))wrap._wasNotEmpty=true;chk(100);},true);}
if(!el._tEnter){el._tEnter=true;el.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!e.isComposing&&!isEmpty(el)){wrap._wasNotEmpty=true;chk(100);}},true);}
if(!el._tClear){let last=isEmpty(el);const obs=new MutationObserver(()=>{const now=isEmpty(el);if(!now)wrap._wasNotEmpty=true;if(!last&&now&&wrap._wasNotEmpty&&Date.now()-(wrap._delAt||0)>500){if(isMeta)setTimeout(()=>{if(wrap.isConnected&&wrap._wasNotEmpty&&isEmpty(el))afterSend(wrap,btn,el);},50);else afterSend(wrap,btn,el);}last=now;});obs.observe(el,{childList:true,subtree:true,characterData:true});el._tClear=obs;}}catch{}}
/* ===================== CLEAR ALL (DeepSeek only; Meta trash disabled) ===================== */
const CLR_TIP='Clear all',CLR_HOT=' (Esc) — including attachments',CLR_CONFIRM='Press Enter or click again to confirm',CLR_CONFIRM_HOT=' (Esc) to cancel';
function renderClr(c,armed){c.textContent='';const NS='http://www.w3.org/2000/svg',s=document.createElementNS(NS,'svg');Object.entries({viewBox:'0 0 24 24',width:16,height:16,fill:'none',stroke:'#FFEE8C','stroke-width':2.4,'stroke-linecap':'round','stroke-linejoin':'round'}).forEach(([k,v])=>s.setAttribute(k,v));(armed?['M5 12.5l4.5 4.5L19 7.5']:['M4 7h16','M9 7V4.5h6V7','M6.5 7l1 12.5h9l1-12.5','M10 11v5','M14 11v5']).forEach(d=>{const p=document.createElementNS(NS,'path');p.setAttribute('d',d);s.appendChild(p);});c.appendChild(s);}
function placeClrTips(c,primary,secondary){try{tipEl=tipEl||getEl('tuckit-tip');hkEl=hkEl||getEl('tuckit-tip-hotkey');tipEl.textContent=primary;tipEl.style.display='block';const r=c.getBoundingClientRect(),w=tipEl.offsetWidth,h=tipEl.offsetHeight;tipEl.style.left=Math.max(8,Math.min(r.left-w-10,innerWidth-w-8))+'px';tipEl.style.top=Math.max(8,Math.min(r.top+r.height/2-h/2,innerHeight-h-8))+'px';if(secondary){hkEl.textContent=secondary;hkEl.style.display='block';requestAnimationFrame(()=>{hkBelow();hkEl.classList.add('tuckit-visible');});}else{hkEl.classList.remove('tuckit-visible');hkEl.style.display='none';}}catch{}}
function disarmClr(wrap){if(!wrap)return;clearTimeout(wrap._clrT);const was=wrap._clrArmed;wrap._clrArmed=false;if(_clrWrap===wrap)_clrWrap=null;const c=wrap.querySelector(':scope >.tuckit-clear');if(c){c.classList.remove('tuckit-clear-armed');renderClr(c,false);}if(tipEl&&tipEl.textContent===CLR_CONFIRM){tipEl.style.display='none';if(hkEl){hkEl.classList.remove('tuckit-visible');hkEl.style.display='none';}}if(was&&wrap._btn)schedHide(wrap._btn);}
function armClr(wrap,c,btn){wrap._clrArmed=true;wrap._clrAt=Date.now();_clrWrap=wrap;c.classList.add('tuckit-clear-armed');renderClr(c,true);clearTimeout(window._tipHide);placeClrTips(c,CLR_CONFIRM,CLR_CONFIRM_HOT);showUI(btn);clearTimeout(wrap._clrT);wrap._clrT=setTimeout(()=>disarmClr(wrap),4500);}
function tryArmClear(){if(disabled)return false;let wrap=activeWrap;if(!wrap||!wrap.isConnected){wrap=null;for(const w of document.querySelectorAll('.tuckit-wrap-fixed')){const el=w.querySelector('div[contenteditable="true"],textarea');if(el&&(!isEmpty(el)||getAttachH(w)>0)){wrap=w;break;}}if(!wrap)wrap=document.querySelector('.tuckit-wrap-fixed');}if(!wrap)return false;const btn=wrap._btn||wrap.querySelector(':scope >.tuckit-toggle'),clr=wrap.querySelector(':scope >.tuckit-clear');if(!clr)return false;if(wrap._clrArmed)return true;armClr(wrap,clr,btn);return true;}
function clearText(el){if(!el)return false;
if(el.tagName==='TEXTAREA'){try{const d=Object.getOwnPropertyDescriptor(PW.HTMLTextAreaElement.prototype,'value');if(d&&d.set)d.set.call(el,'');else el.value='';}catch{try{el.value='';}catch{}}['input','change'].forEach(t=>{try{el.dispatchEvent(new PW.Event(t,{bubbles:true,composed:true}));}catch{try{el.dispatchEvent(new Event(t,{bubbles:true}));}catch{}}});return isEmpty(el);}
try{if(!el.hasAttribute('data-lexical-editor')){el.focus({preventScroll:true});document.execCommand('selectAll',false,null);document.execCommand('delete',false,null);return isEmpty(el);}}catch{}return false;}
function attachCtrls(wrap){const out=[];if(!wrap||!isDeepSeek)return out;const foot=getDSFooter(wrap),editor=wrap.querySelector('textarea,div[data-lexical-editor="true"],div[contenteditable="true"][role="textbox"]'),notRemove=/send|submit|upload|attach|search|think|mic|voice|stop|regenerate|copy|deepthink/i,fileish=/\.[a-z0-9]{1,5}\b|\b\d+(\.\d+)?\s?(B|KB|MB|GB)\b|Paste original/i;
const inAttachCard=ctrl=>{let lvl=ctrl.parentElement;for(let i=0;i<6&&lvl&&lvl!==wrap;i++,lvl=lvl.parentElement){if(editor&&lvl.contains(editor))return false;if(foot&&(lvl===foot||foot.contains(lvl)))return false;try{if(lvl.querySelector('img,canvas,video,[style*="background-image"]'))return true;if(fileish.test((lvl.textContent||'').slice(0,200)))return true;}catch{}}return false;};
const seenC=new Set();
wrap.querySelectorAll('svg').forEach(svg=>{const ctrl=svg.closest('button,[role="button"],[class*="icon-button"],[class*="close"],[class*="remove"],[class*="delete"]')||svg.parentElement;if(!ctrl||seenC.has(ctrl)||ctrl===wrap)return;seenC.add(ctrl);
if(foot&&(ctrl===foot||foot.contains(ctrl)))return;if(editor&&(ctrl===editor||editor.contains(ctrl)||ctrl.contains(editor)))return;if(ctrl.closest('.tuckit-toggle,.tuckit-clear,.tuckit-handle'))return;
const r=ctrl.getBoundingClientRect();if(r.width<8||r.height<8||r.width>44||r.height>44)return;
if(notRemove.test(((ctrl.getAttribute('aria-label')||'')+' '+(ctrl.getAttribute('title')||'')+' '+(ctrl.getAttribute('data-testid')||'')+' '+(ctrl.getAttribute('type')||'')).toLowerCase()))return;
let clickable=ctrl.tagName==='BUTTON'||ctrl.getAttribute('role')==='button';if(!clickable){try{clickable=getComputedStyle(ctrl).cursor==='pointer';}catch{}}
if(!clickable||!inAttachCard(ctrl))return;out.push(ctrl);});return out;}
function clearAttach(wrap,done){let n=0;const tries=new Map();
const press=(c,full)=>{try{c.click();}catch{}if(full){try{['pointerdown','mousedown','pointerup','mouseup','click'].forEach(t=>c.dispatchEvent(new(t.startsWith('pointer')?PointerEvent:MouseEvent)(t,{bubbles:true,cancelable:true,pointerId:1,isPrimary:true})));}catch{}}};
const step=()=>{if(!wrap.isConnected){if(done)done();return;}const ctrls=attachCtrls(wrap);if(ctrls.length===0||n>=40){if(done)done();return;}const c=ctrls.find(b=>(tries.get(b)||0)<3);if(!c){if(done)done();return;}const k=(tries.get(c)||0)+1;tries.set(c,k);n++;press(c,k>=2);setTimeout(step,200);};step();}
function doClear(wrap,btn){const getEd=()=>wrap.querySelector('div[data-lexical-editor="true"],div[contenteditable="true"][role="textbox"],textarea,div[contenteditable="true"]'),el=getEd();if(!el)return;
clearText(el);wrap._wasNotEmpty=false;
clearAttach(wrap,()=>{if(!wrap.isConnected)return;const cur=getEd();if(cur&&!isEmpty(cur))clearText(cur);afterSend(wrap,btn,cur||el);try{cur?.focus({preventScroll:true});}catch{}});
try{el.focus({preventScroll:true});}catch{}}
/* ===================== /CLEAR ALL ===================== */
function isValidInput(el){if(!el||!isEditable(el)||isInCode(el)||el.closest('pre,code'))return false;const r=el.getBoundingClientRect();if(r.width<120||r.height>600||r.bottom<innerHeight*0.25||el.parentElement?.closest('pre'))return false;return true;}
function inject(el){
if(disabled||seen.has(el)||!isValidInput(el))return;
const wrap=getWrap(el);if(!wrap||wrap.querySelector(':scope >.tuckit-handle')){seen.add(el);return;}
if(wrap.closest('pre,code')){seen.add(el);return;}
const bigPre=wrap.querySelector('pre');if(bigPre&&bigPre.getBoundingClientRect().height>300&&!bigPre.contains(el)&&!el.contains(bigPre)){seen.add(el);return;}
seen.add(el);const _skInj=snapScroll();markOp();_wraps.push(wrap);
if(getComputedStyle(wrap).position==='static')sp(wrap,{position:'relative'});
if(!el._accent){el._accent=true;el.addEventListener('keydown',e=>{if(e.isComposing||e.key.length!==1)return;if(e.repeat&&!e.metaKey&&!e.ctrlKey&&!e.altKey){try{e.preventDefault();e.stopPropagation();
if(el.isContentEditable){try{document.execCommand('insertText',false,e.key);}catch{const sel=window.getSelection();if(sel&&sel.rangeCount){const r=sel.getRangeAt(0);r.deleteContents();r.insertNode(document.createTextNode(e.key));r.collapse(false);sel.removeAllRanges();sel.addRange(r);}}}
else if(el.tagName==='TEXTAREA'){const s=el.selectionStart,ee=el.selectionEnd,v=el.value;el.value=v.slice(0,s)+e.key+v.slice(ee);el.selectionStart=el.selectionEnd=s+1;el.dispatchEvent(new InputEvent('input',{bubbles:true}));}}catch{}}},true);}
const handle=document.createElement('div');handle.className='tuckit-handle tuckit-faded';handle.style.opacity='0';
const btn=document.createElement('button');btn.className='tuckit-toggle tuckit-faded';btn.type='button';btn.dataset.state='collapsed';btn.style.opacity='0';renderTri(btn,'collapsed');
if(isDeepSeek)btn.style.setProperty('right','28px','important');
const tipMove=e=>{if(!tipEl)return;tipEl.style.left=(e.clientX+12)+'px';tipEl.style.top=(e.clientY-28)+'px';if(hkEl&&hkEl.style.display!=='none')hkBelow();};
btn.addEventListener('pointerenter',e=>{showUI(btn);tipEl=tipEl||getEl('tuckit-tip');tipEl.textContent=btn.dataset.state==='expanded'?'TuckIT':'UnTuckIT';tipEl.style.display='block';tipEl.style.left=(e.clientX+12)+'px';tipEl.style.top=(e.clientY-28)+'px';clearTimeout(window._tipHide);window._tipHide=setTimeout(hideTipHK,3500);clearTimeout(window._btn2T);window._btn2T=setTimeout(()=>{if(!tipEl||tipEl.style.display==='none')return;hkEl=hkEl||getEl('tuckit-tip-hotkey');hkEl.textContent='(Ctrl+Shift+L)';hkEl.style.display='block';requestAnimationFrame(()=>{hkBelow();hkEl.classList.add('tuckit-visible');});},1000);});
btn.addEventListener('pointermove',tipMove);
btn.addEventListener('pointerleave',()=>{hideTipHK();clearTimeout(window._btn2T);schedHide(btn);});
btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();hideTips();if(wrap._animating){try{cancelAnimationFrame(wrap._anim);}catch{}wrap._anim=null;wrap._animating=false;wrap._syncing=false;}if(Date.now()-lastToggle<(!wrap._firstExpDone?750:300))return;toggleNow(wrap,btn);});
handle.addEventListener('pointerenter',()=>{showUI(btn);hotTips(wrap);});
handle.addEventListener('pointerleave',()=>schedHide(btn));
const startDrag=e=>{if(e.target.closest('.tuckit-toggle')||e.target.closest('.tuckit-clear'))return;e.preventDefault();e.stopPropagation();dragging={el,wrap,btn,startY:e.clientY,startH:wrap.offsetHeight,lastH:wrap.offsetHeight,locked:false,moved:false,feed:null,startFeed:0};hideTips();if(e.target.setPointerCapture){try{e.target.setPointerCapture(e.pointerId);}catch{}}};
handle.addEventListener('pointerdown',startDrag);
wrap.addEventListener('pointerdown',e=>{if(e.target.closest('.tuckit-toggle')||e.target.closest('.tuckit-clear')||e.target.closest('.tuckit-handle')||e.target===el||el.contains(e.target))return;const r=wrap.getBoundingClientRect();if(e.clientY-r.top<18&&e.clientY-r.top>=0)startDrag(e);});
/* rc.1a2: scroll listener now also catches ANY second scroller the moment it moves and silences it */
wrap.addEventListener('scroll',e=>{try{const t=e.target;if(!t||t===el||t===document||t.nodeType!==1)return;if(t===wrap){wrap.scrollTop=0;wrap.scrollLeft=0;return;}
const m=nsMode(t,el);if(m)markNS(t,m);
if(el.contains(t))return;if((t.scrollTop||t.scrollLeft)&&getComputedStyle(t).overflowY==='hidden'){t.scrollTop=0;t.scrollLeft=0;}}catch{}},true);
if(isMeta){el.addEventListener('wheel',e=>{try{if(wrap.dataset.locked!=='1'||e.ctrlKey)return;const max=el.scrollHeight-el.clientHeight;if(max<=0)return;let dy=e.deltaY;if(e.deltaMode===1)dy*=(parseFloat(getComputedStyle(el).lineHeight)||20);else if(e.deltaMode===2)dy*=el.clientHeight;e.preventDefault();e.stopPropagation();el.scrollTop=Math.max(0,Math.min(max,el.scrollTop+dy));}catch{}},{passive:false});}
// ---- Clear-all button (DeepSeek only; Meta trashcan disabled: never attached) ----
const clr=document.createElement('button');clr.className='tuckit-clear tuckit-faded';clr.type='button';clr.style.opacity='0';clr.setAttribute('aria-label',CLR_TIP);
if(isDeepSeek)clr.style.setProperty('right','28px','important');
renderClr(clr,false);
clr.addEventListener('mousedown',e=>e.preventDefault());
clr.addEventListener('pointerenter',e=>{showUI(btn);
if(wrap._clrArmed)placeClrTips(clr,CLR_CONFIRM,CLR_CONFIRM_HOT);
else{tipEl=tipEl||getEl('tuckit-tip');tipEl.textContent=CLR_TIP;tipEl.style.display='block';tipEl.style.left=(e.clientX+12)+'px';tipEl.style.top=(e.clientY-28)+'px';clearTimeout(window._btn2T);window._btn2T=setTimeout(()=>{if(!tipEl||tipEl.style.display==='none')return;hkEl=hkEl||getEl('tuckit-tip-hotkey');hkEl.textContent=CLR_HOT;hkEl.style.display='block';requestAnimationFrame(()=>{hkBelow();hkEl.classList.add('tuckit-visible');});},300);}
clearTimeout(window._tipHide);window._tipHide=setTimeout(()=>{if(!wrap._clrArmed)hideTipHK();},3500);});
clr.addEventListener('pointermove',e=>{if(!wrap._clrArmed)tipMove(e);});
clr.addEventListener('pointerleave',()=>{if(!wrap._clrArmed){hideTipHK();schedHide(btn);}});
clr.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();if(wrap._clrArmed){if(Date.now()-(wrap._clrAt||0)<350)return;const b=wrap._btn;disarmClr(wrap);doClear(wrap,b);}else armClr(wrap,clr,btn);});
wrap.appendChild(handle);wrap.appendChild(btn);if(!isMeta)wrap.appendChild(clr);
setTimeout(()=>showUI(btn),600);
Object.assign(wrap,{_el:el,_btn:btn,_wasNotEmpty:!isEmpty(el),_firstAttachDone:false,_lastAttach:isDeepSeek?getDSAttachEls(wrap).length:0,_lastAttachH:getAttachH(wrap),_dragArmed:false,_pasteArmed:false,_dragLocked:false,_draggedThisTurn:false});
if(isDeepSeek){
const arm=()=>{wrap._dragArmed=true;wrap._pasteArmed=true;};
const retryAttach=()=>{[80,200,400,800,1400,2200].forEach(ms=>setTimeout(()=>{if(wrap.isConnected)maybeExpandFirstAttach(wrap,el,btn);},ms));};
['dragenter','dragover'].forEach(ev=>wrap.addEventListener(ev,arm,true));
wrap.addEventListener('drop',()=>{arm();retryAttach();},true);
const onFilePaste=e=>{try{const dt=e.clipboardData;if(!dt){retryAttach();return;}const hasFile=(dt.files&&dt.files.length>0)||Array.from(dt.items||[]).some(it=>it.kind==='file'||(it.type&&it.type.startsWith('image/')));if(hasFile||(dt.types&&(dt.types.includes('Files')||dt.types.includes('image/png')||dt.types.includes('image/jpeg')))){wrap._pasteArmed=true;wrap._dragArmed=true;retryAttach();}}catch{retryAttach();}};
el.addEventListener('paste',onFilePaste,true);wrap.addEventListener('paste',onFilePaste,true);
document.addEventListener('change',e=>{if(!wrap.isConnected)return;if(e.target&&e.target.matches&&e.target.matches('input[type=file]')){arm();retryAttach();}},true);
wrap.addEventListener('load',()=>{setTimeout(()=>maybeExpandFirstAttach(wrap,el,btn),40);},true);
if(!wrap._attachObs){const obs=new MutationObserver(()=>{if(wrap._attObsQ)return;wrap._attObsQ=true;requestAnimationFrame(()=>{wrap._attObsQ=false;if(!wrap.isConnected||wrap._syncing)return;const cnt=getDSAttachEls(wrap).length,curAh=getDSAttachH(wrap);
if(!wrap._firstAttachDone&&cnt>0){maybeExpandFirstAttach(wrap,el,btn);return;}
if(cnt>0&&(wrap.offsetHeight<getBaseH(wrap)-8||curAh>(wrap._lastAttachH||0)+25)){wrap._lastAttachH=curAh;qResize(el,wrap,btn,{force:true,ignoreFile:true});}});});
obs.observe(wrap,{childList:true,subtree:true,attributes:true,attributeFilter:['src']});wrap._attachObs=obs;}}
if(isMeta&&!el._metaImgObs){const o=new MutationObserver(muts=>{let hasNew=false;for(const m of muts){for(const n of m.addedNodes){if(n.nodeType!==1)continue;if(n.tagName==='IMG'||n.tagName==='CANVAS'||n.querySelector?.('img,canvas')){hasNew=true;break;}}if(hasNew)break;}
if(hasNew){metaIntent(wrap);setTimeout(()=>{if(!wrap.isConnected)return;metaIntent(wrap);qResize(el,wrap,btn,{force:true});},60);
el.querySelectorAll('img').forEach(img=>{if(img._tuckitHooked)return;img._tuckitHooked=true;const onImg=()=>{metaIntent(wrap);qResize(el,wrap,btn,{force:true});};img.addEventListener('load',onImg,{once:true});img.addEventListener('error',onImg,{once:true});});}});
o.observe(el,{childList:true,subtree:true});el._metaImgObs=o;}
const stableResize=()=>{metaIntent(wrap);requestAnimationFrame(()=>requestAnimationFrame(()=>{if(!wrap.isConnected)return;
if(wrap._dragLocked||(wrap._userTucked&&getDSAttachH(wrap)===0))syncSizes(wrap,el,wrap._manual??computeMinimalH(wrap,el));
else qResize(el,wrap,btn,{force:true,ignore:true,ignoreFile:true});
if(el.tagName==='TEXTAREA'&&el.value.length>2000)el.scrollTop=el.scrollHeight;}));};
if(isDeepSeek)el.addEventListener('scroll',()=>killExtraBars(wrap,el),{passive:true});
el.addEventListener('input',e=>{saveCaret(el);if(isDeepSeek)killExtraBars(wrap,el);const del=/^delete/.test(e.inputType||''),nowEmpty=isEmpty(el),wasNotEmpty=wrap._wasNotEmpty;wrap._wasNotEmpty=!nowEmpty;if(del)wrap._delAt=Date.now();
if(wasNotEmpty&&nowEmpty&&!del){afterSend(wrap,btn,el);return;}
hideTog(btn);scrollCaretIntoView(el);});
el.addEventListener('paste',e=>{saveCaret(el);wrap._wasNotEmpty=true;let isFile=false;try{const dt=e.clipboardData;isFile=!!dt&&((dt.files&&dt.files.length>0)||Array.from(dt.items||[]).some(it=>it.kind==='file'));}catch{}
if(wrap._dragLocked){if(isFile&&!wrap._firstAttachDone)return;requestAnimationFrame(()=>scrollCaretIntoView(el));return;}
if(isDeepSeek&&isFile&&!wrap._firstAttachDone)return;
if(isDeepSeek)setTimeout(stableResize,400);else stableResize();});
el.addEventListener('drop',()=>{wrap._wasNotEmpty=true;if(wrap._dragLocked){requestAnimationFrame(()=>scrollCaretIntoView(el));return;}stableResize();});
el.addEventListener('cut',()=>{wrap._delAt=Date.now();saveCaret(el);scrollCaretIntoView(el);});
el.addEventListener('compositionend',()=>{saveCaret(el);scrollCaretIntoView(el);});
el.addEventListener('keydown',e=>{if(e.key==='Backspace'||e.key==='Delete')wrap._delAt=Date.now();},true);
el.addEventListener('keyup',e=>{if(e.key==='Backspace'||e.key==='Delete'){saveCaret(el);scrollCaretIntoView(el);}});
el.addEventListener('focus',()=>{const _skF=snapScroll();activeWrap=wrap;activeBtn=btn;showUI(btn);makeFat(el,wrap);if(isDeepSeek){pinDSFooter(wrap);hideDeadDS(wrap,el);}
if(wrap._userTucked&&getDSAttachH(wrap)===0)syncSizes(wrap,el,wrap._manual??computeMinimalH(wrap,el));else if(!wrap._dragLocked&&!isMeta)qResize(el,wrap,btn,{});
saveCaret(el);resetAnc(el);keepScroll(_skF);schedOne(wrap);});
try{localStorage.removeItem(KEY);if(hasGM)GM_setValue(KEY,'native');}catch{}
lockBottom(wrap);makeFat(el,wrap);if(isDeepSeek){pinDSFooter(wrap);hideDeadDS(wrap,el);}
wrap._manual=getMinH();wrap._wasEmpty=isEmpty(el);wrap._userTucked=false;wrap._dragLocked=false;wrap._draggedThisTurn=false;
metaIntent(wrap);
if(isEmpty(el)){const minimal=computeMinimalH(wrap,el);wrap._forceExpandFix=true;syncSizes(wrap,el,minimal);save('compact');if(el._bootT)clearTimeout(el._bootT);
el._bootT=setTimeout(()=>{try{el.scrollTop=0;const ww=el.closest('.tuckit-wrap-fixed');if(ww)ww.scrollTop=0;}catch{}reveal(el,'first',{range:null});},1000);}
else qResize(el,wrap,btn,{});
if(typeof ResizeObserver==='function'&&!wrap._resizeObs){let queued=false;
const ro=new ResizeObserver(()=>{if(queued||wrap._syncing||Date.now()-(wrap._lastSync||0)<120||(isMeta&&!wrap._metaResizeRequested))return;queued=true;
requestAnimationFrame(()=>{queued=false;if(!wrap.isConnected||wrap.dataset.locked!=='1')return;
if(wrap._dragLocked||(wrap._userTucked&&getDSAttachH(wrap)===0)){const fl=Number.isFinite(wrap._manual)?wrap._manual:(isDeepSeek?getBaseH(wrap):computeMinimalH(wrap,el));if(Math.abs(wrap.offsetHeight-fl)>3){wrap._forceExpandFix=true;syncSizes(wrap,el,fl);}return;}
qResize(el,wrap,btn,{});});});
ro.observe(wrap);ro.observe(el);wrap._resizeObs=ro;}
if(isMeta){const chkAtt=()=>{if(!wrap.isConnected||wrap.dataset.locked!=='1'||wrap._syncing||dragging)return;const pc=wrap._attC||0,ph=wrap._attH||0,a=getMetaAttach(wrap,el,true);wrap._attC=a.els.length;wrap._attH=a.h;if(a.els.length===pc&&Math.abs(a.h-ph)<8)return;metaIntent(wrap);wrap._forceExpandFix=true;const m=computeMinimalH(wrap,el);
if(!a.els.length){if(isEmpty(el)){wrap._manual=m;wrap._userTucked=true;wrap._dragLocked=false;syncSizes(wrap,el,m);}else syncSizes(wrap,el,wrap._lastH||m);}
else{const t=Math.max(needH(wrap,el),wrap._lastH||0);wrap._manual=t;wrap._userTucked=false;wrap._dragLocked=true;syncSizes(wrap,el,t);}updTri(btn,wrap);};
const grow=()=>{if(!wrap.isConnected||wrap.dataset.locked!=='1'||wrap._syncing||dragging)return;metaIntent(wrap);const a=getMetaAttach(wrap,el,true);if(!a.els.length)return;const t=Math.max(needH(wrap,el),wrap._lastH||0);wrap._manual=t;wrap._userTucked=false;wrap._dragLocked=true;wrap._forceExpandFix=true;syncSizes(wrap,el,t);updTri(btn,wrap);};
const retry=e=>{const dt=e&&(e.clipboardData||e.dataTransfer);if(e&&e.type!=='change'&&!(dt&&dt.files&&dt.files.length))return;[0,60,200,500].forEach(ms=>setTimeout(grow,ms));[300,800,1600,3000].forEach(ms=>setTimeout(chkAtt,ms));};
wrap.addEventListener('drop',retry,true);wrap.addEventListener('paste',retry,true);document.addEventListener('change',e=>{if(wrap.isConnected&&e.target?.matches?.('input[type=file]'))retry();},true);
const o=new MutationObserver(ms=>{if(wrap._maQ||ms.every(m=>el.contains(m.target)||m.target.closest?.('.tuckit-toggle,.tuckit-handle,.tuckit-clear')))return;wrap._maQ=1;requestAnimationFrame(()=>{wrap._maQ=0;chkAtt();});});o.observe(wrap,{childList:true,subtree:true});wrap._maObs=o;setTimeout(chkAtt,700);}
/* ---- rc.1a2: single-scrollbar enforcement hooks (both Meta and DeepSeek) ---- */
if(!wrap._osObs){const mo=new MutationObserver(ms=>{try{const cur=primaryEl(wrap)||el;for(const m of ms){if(m.target.closest&&m.target.closest('.tuckit-toggle,.tuckit-handle,.tuckit-clear'))continue;if(!cur.contains(m.target)||m.target===cur){schedOne(wrap);return;}for(const n of m.addedNodes){if(n.nodeType===1&&!/^(P|SPAN|BR|B|I|U|STRONG|EM|CODE|A)$/.test(n.tagName)){schedOne(wrap);return;}}}}catch{}});mo.observe(wrap,{childList:true,subtree:true});wrap._osObs=mo;}
['drop','paste'].forEach(ev=>wrap.addEventListener(ev,()=>burstOne(wrap),true));
document.addEventListener('change',e=>{if(wrap.isConnected&&e.target?.matches?.('input[type=file]'))burstOne(wrap);},true);
wrap.addEventListener('load',()=>schedOne(wrap),true);
burstOne(wrap);
guardMeta(wrap,el);hookSend(wrap,btn,el);keepScroll(_skInj);}
function isNewChat(){try{const p=location.pathname,h=location.hostname;if(h.includes('meta.ai'))return !/^\/(c|prompt|create)\//.test(p);if(h.includes('deepseek.com')){if(p.includes('/a/chat/s/'))return false;if(/\/chat\//.test(p)&&p.length>10)return false;return true;}return false;}catch{return false;}}
function stopBootObs(){if(_bootObs){try{_bootObs.disconnect();}catch{}_bootObs=null;}if(_bootT){clearTimeout(_bootT);_bootT=null;}}
function cleanup(){const _sk=snapScroll();markOp();
try{stopBootObs();if(_metaObs){try{_metaObs.disconnect();}catch{}_metaObs=null;}if(_metaTimer){clearTimeout(_metaTimer);_metaTimer=null;}_clrWrap=null;
document.querySelectorAll('[data-tk-xbar]').forEach(x=>x.removeAttribute('data-tk-xbar'));document.querySelectorAll('[data-tk-ns]').forEach(x=>x.removeAttribute('data-tk-ns'));document.querySelectorAll('.tuckit-handle,.tuckit-toggle,.tuckit-clear').forEach(n=>n.remove());
hideHints();document.querySelectorAll('.tuckit-tip-hint').forEach(e=>e.remove());[tipEl,hkEl].forEach(e=>{if(e)e.remove();});tipEl=hkEl=null;
document.querySelectorAll('.tuckit-wrap-fixed').forEach(wrap=>{try{clearTimeout(wrap._clrT);clearTimeout(wrap._metaIntentT);clearTimeout(wrap._osQ);wrap._clrArmed=false;
if(wrap.dataset.orig){try{restInline(wrap,JSON.parse(wrap.dataset.orig));}catch{}}
['height','min-height','padding-bottom','padding-top','gap','row-gap','scrollbar-width'].forEach(p=>wrap.style.removeProperty(p));
wrap.classList.remove('tuckit-wrap-fixed','tuckit-fat-scroll');
wrap.querySelectorAll('div[contenteditable="true"],textarea').forEach(el=>{['height','max-height','overflow-y','flex','margin','padding-bottom'].forEach(p=>el.style.removeProperty(p));el.classList.remove('tuckit-fat-scroll');});
delete wrap.dataset.locked;delete wrap.dataset.orig;
['_origMin','_metaFH','_adj','_manual','_wasEmpty','_metaResizeRequested','_metaIntentAt','_lastTog','_userTucked','_dragLocked','_draggedThisTurn','_firstAttachDone','_lastAttach','_lastAttachH','_dragArmed','_pasteArmed','_maC','_attC','_attH','_barW','_delAt','_ttSched','_osT','_osQ'].forEach(k=>delete wrap[k]);
['_metaObs','_dsObs','_resizeObs','_guardObs','_attachObs','_maObs','_osObs'].forEach(k=>{if(wrap[k]){try{wrap[k].disconnect();}catch{}delete wrap[k];}});}catch{}});
if(isMeta)unfixMeta();activeWrap=null;activeBtn=null;dragging=null;_wraps=[];seen=new WeakSet();}catch{}
keepScroll(_sk);}
function setDisabled(v){disabled=v;if(hasGM)GM_setValue('tuckit_disabled',v);else localStorage.setItem('tuckit_disabled',v?'1':'0');if(v){cleanup();showToast('TuckIT OFF — Ctrl+Shift+K to turn ON');}else{showToast('TuckIT ON — Ctrl+Shift+K to turn OFF');setTimeout(()=>boot(),200);}}
function bootNow(allowNew=false){
if(disabled||(!allowNew&&isNewChat()))return;stopBootObs();
const hasLive=()=>{_wraps=_wraps.filter(w=>w.isConnected);return _wraps.length>0;};
const scan=()=>{if(disabled||(!allowNew&&isNewChat())||hasLive())return;document.querySelectorAll(SELECTORS).forEach(el=>{if(seen.has(el))return;const r=el.getBoundingClientRect();if(r.width>=60&&r.height>=16&&r.bottom>innerHeight*0.3&&isValidInput(el))inject(el);});};
scan();
_bootObs=new MutationObserver(()=>{if(disabled||_bootT||hasLive())return;_bootT=setTimeout(()=>{_bootT=null;scan();},350);});
_bootObs.observe(document.documentElement,{childList:true,subtree:true});}
function startHomeWatch(){if(disabled)return;if(_homeWatch)clearInterval(_homeWatch);_homeTries=0;
_homeWatch=setInterval(()=>{_homeTries++;try{if(disabled){clearInterval(_homeWatch);_homeWatch=null;return;}
if(!isNewChat()){clearInterval(_homeWatch);_homeWatch=null;if(isMeta)bootMetaAfterResp();else setTimeout(()=>bootNow(false),400);return;}
if(_homeTries>600){clearInterval(_homeWatch);_homeWatch=null;}}catch{clearInterval(_homeWatch);_homeWatch=null;}},500);}
function bootMetaAfterResp(){
if(!isMeta){bootNow(false);return;}
cleanup();if(_metaObs){try{_metaObs.disconnect();}catch{}_metaObs=null;}if(_metaTimer)clearTimeout(_metaTimer);
_metaTimer=setTimeout(()=>{_metaTimer=null;bootNow(false);showToast('TuckIT loaded — refresh (Cmd+R/Ctrl+R) if crooked');},8500);
let seenThink=false,thinkT=null;
const hasThink=()=>{try{return !!Array.from(document.querySelectorAll('button')).find(b=>(b.textContent||'').trim()==='Thinking');}catch{return false;}};
const check=()=>{thinkT=null;if(hasThink())seenThink=true;if(seenThink&&!hasThink()){if(_metaObs){try{_metaObs.disconnect();}catch{}_metaObs=null;}if(_metaTimer)clearTimeout(_metaTimer);_metaTimer=setTimeout(()=>{_metaTimer=null;bootNow(false);},2500);}};
_metaObs=new MutationObserver(()=>{if(thinkT)return;thinkT=setTimeout(check,250);});
try{_metaObs.observe(document.documentElement,{childList:true,subtree:true});}catch{}}
function boot(){if(disabled)return;if(isNewChat()){cleanup();startHomeWatch();return;}bootNow(false);}
let _lastHref=location.href;
function checkUrl(){
if(location.href===_lastHref)return;_scrollReg.clear();markOp();
const prev=_lastHref;_lastHref=location.href;const nowNew=isNewChat();
const prevNew=(()=>{try{const u=new URL(prev),p=u.pathname,h=u.hostname;if(h.includes('meta.ai'))return !/^\/(c|prompt|create)\//.test(p);if(h.includes('facebook.com'))return p==='/'||p==='';return false;}catch{return false;}})();
if(nowNew){cleanup();if(_metaObs){try{_metaObs.disconnect();}catch{}_metaObs=null;}if(_metaTimer)clearTimeout(_metaTimer);if(isMeta)unfixMeta();startHomeWatch();}
else if(!disabled){if(prevNew&&!nowNew){if(isMeta){unfixMeta();bootMetaAfterResp();}else setTimeout(()=>boot(),500);}else setTimeout(()=>boot(),400);}}
(function(){const _push=history.pushState,_rep=history.replaceState;
history.pushState=function(...a){const r=_push.apply(this,a);checkUrl();return r;};
history.replaceState=function(...a){const r=_rep.apply(this,a);checkUrl();return r;};
window.addEventListener('popstate',checkUrl);setInterval(checkUrl,1000);})();
// Esc = arm Clear All, Enter/click = confirm, Esc again / typing / outside click = cancel
window.addEventListener('keydown',e=>{
if(e.isComposing)return;
if(e.key==='Escape'&&!e.ctrlKey&&!e.shiftKey&&!e.altKey&&!e.metaKey){
const w=_clrWrap;if(w&&w._clrArmed){e.preventDefault();e.stopImmediatePropagation();disarmClr(w);return;}
const ae=document.activeElement,inInput=ae&&(ae.tagName==='TEXTAREA'||ae.isContentEditable||ae.closest?.('.tuckit-wrap-fixed'));
if((inInput||(activeWrap&&activeWrap.isConnected))&&tryArmClear()){e.preventDefault();e.stopImmediatePropagation();}
return;}
if(e.key==='Enter'){const w=_clrWrap;if(!w||!w._clrArmed)return;e.preventDefault();e.stopImmediatePropagation();if(Date.now()-(w._clrAt||0)>300){const b=w._btn;disarmClr(w);doClear(w,b);}return;}
if(e.key.length===1||e.key==='Backspace'||e.key==='Delete'){const w=_clrWrap;if(w&&w._clrArmed)disarmClr(w);}},true);
window.addEventListener('pointerdown',e=>{const w=_clrWrap;if(w&&w._clrArmed&&!(e.target.closest&&e.target.closest('.tuckit-clear')))disarmClr(w);},true);
/* rc.1a2 watchdog: light 1s sweep so a second scrollbar can never linger (oneScroll self-throttles) */
setInterval(()=>{try{if(disabled||dragging||!_wraps.length)return;_wraps.forEach(w=>{if(w&&w.isConnected&&!w._animating)oneScroll(w);});}catch{}},1000);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
