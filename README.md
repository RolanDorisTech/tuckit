# TuckIT - Sticky AI Chat Input Fix | Keep AI Chat Context Visible

> **Meta AI input covers your conversation? DeepSeek chat box too big?** 
> TuckIT keeps the AI chat input sticky at the bottom so it never covers your messages. Drag to resize, click to tuck. Free, open-source, by RDT.

[[Install on GreasyFork](https://img.shields.io/badge/Install-GreasyFork-black?logo=tampermonkey)](https://greasyfork.org/en/scripts/YOUR_ID_HERE)
[[Firefox](https://img.shields.io/badge/Firefox-Add--on-orange?logo=firefox)](https://addons.mozilla.org/en-US/firefox/addon/YOUR_ID_HERE)
[[Chrome](https://img.shields.io/badge/Chrome-Extension-blue?logo=googlechrome)](https://chrome.google.com/webstore/detail/YOUR_ID_HERE)
[[YouTube - Built by RDT](https://img.shields.io/badge/Built_on_YouTube-RDT-red?logo=youtube)](https://youtube.com/@RolanDorisTech)
[[License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

### 🎬 Demo - Built Live on YouTube by RDT

[[TuckIT Demo - Fix Meta AI & DeepSeek Chat Input](https://img.youtube.com/vi/YOUR_VIDEO_ID_HERE/0.jpg)](https://youtube.com/@RolanDorisTech)

**Watch the build breakdown:** Does Meta AI hide your conversation? Does DeepSeek's input get huge and cover messages? This is TuckIT by RDT - I built a fix live.

---

## The Problem We Fix

If you use Meta AI or DeepSeek, you know this pain:

- `meta ai input covers chat`
- `deepseek chat box too big`
- `chat input covers messages`
- `can't see chat history while typing`
- `AI textarea covers messages`
- `chat input box too big`

The chat box grows as you type, covers the conversation, and you lose context. You scroll up, it covers again. Frustrating when you're trying to reference what the AI just said.

## The Solution: TuckIT

TuckIT pins the input to the bottom and gives you full control:

- **Sticky by default** - Input stays at bottom, never covers messages
- **Drag to resize** - Teal handle at top of input, drag up/down to set your perfect height
- **Click to Tuck** - Triangle button collapses to minimal, click again to restore
- **No flicker paste** - Paste large text/files without jumping
- **Smart auto-tuck** - Auto-tucks after send

## ⚠️ Quirks, Intended Behavior & Pro Tips - READ THIS

I built TuckIT to be minimal and fast, but Meta and DeepSeek use heavy React editors (Lexical/ProseMirror) that fight back. Most of these are intentional.

**1. Drag Bar = Smooth, Triangle Button = Can Glitch**
If you drag the edge of the text box using the teal drag bar to expand the chat box, it's buttery smooth and less laggy. Using the UnTuckIT triangle button to expand sometimes results in visual bugs - the textarea stays small with a big empty gray area, or the scrollbar jumps to the far right.

**Pro tip:** Always drag to expand if you want zero lag. The button is fastest for collapsing, drag is best for expanding.

**If you see the glitch:** Hit `Cmd + R / Ctrl + R` to refresh. That's the universal fix.

**2. Intentional: Doesn't Activate on First Message**
TuckIT intentionally does NOT activate for the very first message in a new chat. It waits until the second turn of a conversation. 

Why? On a brand new chat, Meta AI and DeepSeek show welcome screens, suggested prompts, and do heavy initial layout. If I pinned the input immediately, it would fight their welcome layout and cause flicker. So TuckIT waits - you send one message, get one response, then on the second turn it kicks in and stays sticky for the rest of the conversation. This is by design, not a bug.

**3. Intentional: Stays Tucked While You Type**
When your chat box is in the minimum tucked position, it intentionally does NOT auto-expand when you start typing. It stays tucked to maintain the best visibility of your chat history while you're responding.

If you want more room while typing, drag the teal bar up or hit `Ctrl+Shift+L` to untuck. I did this on purpose - auto-expanding would defeat the whole point of keeping context visible.

**4. Keyboard Shortcuts Save You**
- `Ctrl + Shift + L` = Toggle Tuck / UnTuck - your main toggle, same as clicking triangle
- `Ctrl + Shift + K` = Turn TuckIT ON / OFF completely - kill switch if a site update breaks layout and you need to disable fast without uninstalling

**5. When in doubt, refresh**
If anything looks crooked: `If crooked, refresh (Cmd + R / Ctrl + R)`. Fixes 99% of quirks.

## ✨ Features

- 🟦 **Teal drag bar** - Top edge of input, ns-resize cursor, drag up/down
- 🔺 **Triangle toggle** - [TuckIT / UnTuckIT] - fast collapse
- 📋 **Caret stays** - Your cursor stays where you left it
- ⌨️ **Two hotkeys** - L for toggle, K for kill switch
- 🎯 **No scroll hijack** - Feed scroll stays natural
- 💾 **Remembers height** - Last expanded height saved

## 📦 Install - Detailed Per Browser

### Chrome - Mac & Windows

Chrome 138+ now blocks userscripts by default. You MUST do this extra step or it silently fails:

1. Go to Chrome Web Store -> Search `Tampermonkey` -> Install Tampermonkey extension
2. Go to `chrome://extensions/` in address bar
3. Find Tampermonkey -> Click **Details**
4. Scroll down -> Toggle **Allow User Scripts** to ON (This is the critical step Chrome hides)
5. Make sure Developer Mode is ON if prompted
6. Now click Tampermonkey icon in toolbar -> Dashboard -> Create new script -> Delete everything -> Paste entire `tuckit.user.js` -> File -> Save (Ctrl+S / Cmd+S)
7. Go to `meta.ai` or `deepseek.com` -> Refresh `Cmd+R / Ctrl+R` -> teal bar appears

### Firefox - Macintosh

1. Install TamperMonkey as an extension from Firefox Add-ons Store
2. Pin TamperMonkey to toolbar: Puzzle icon in toolbar -> Gear next to Tampermonkey -> Pin to Toolbar
3. Click TamperMonkey icon to enable it
4. Dashboard -> + Create a new script
5. Copy and paste entire `tuckit.user.js`
6. File -> Save, Enabled toggle ON
7. Go to `meta.ai` -> Refresh -> Done

Firefox is most lenient, no extra permissions.

### Safari - Mac

Safari doesn't support Tampermonkey free, so use free Userscripts app:

1. Mac App Store -> Search `Userscripts` -> Download free app **Userscripts** by quoid
2. Open Userscripts app -> Enable in Safari -> Settings -> Extensions -> Check **Userscripts**
3. Log on to `meta.ai` and `deepseek.com` once so they appear in permissions
4. Safari -> Settings -> Websites -> Userscripts -> Set `meta.ai` and `deepseek.com` to **Allow**
5. Left side of address bar, click two arrows `<< >>` -> Click `</>` Userscripts icon
6. Add `tuckit.user.js` file - it activates
7. Reload page -> teal bar appears

If toolbar icon missing: Safari -> View -> Customize Toolbar -> Drag `</>` icon.

Alternative: Tampermonkey for Safari ($1.99) works same as Chrome.

### Stores

- Firefox: TuckIT - Keep AI Chat Context Visible
- Chrome: TuckIT - Sticky AI Chat Input Fix

## 🎮 How to Use

**Best practice:**
- **To collapse fast:** Click triangle or `Ctrl+Shift+L`
- **To expand smooth:** DRAG teal bar up - less laggy, avoids visual bug
- **Bar disappeared?** Hover near top edge of input

## ⌨️ Keyboard Shortcuts

- **`Ctrl + Shift + L`** - **Tuck / UnTuck Toggle** - Daily driver for tucking and untucking.
- **`Ctrl + Shift + K`** - **Kill Switch - ON/OFF** - Turn TuckIT on and off completely. Use when site update breaks layout.

Both use Ctrl+Shift on Mac too.

## 🌐 Supported Sites

**v0.1.0 - Stable - Verified:**
- ✅ `meta.ai/*`
- ✅ `facebook.com/ai/*`
- ✅ `deepseek.com/*`

**Roadmap v0.2.0+:**
- 🔜 ChatGPT, Claude, Gemini

## ❓ FAQ

**Q: Screenshots - do I need them for GitHub?**
A: Yes, most extension READMEs have 1-2 screenshots or a GIF - it triples install rate. But you can ship v0.1.0 without them and add later. If you add: show Before/After, close-up of teal drag bar, and triangle button. No need for complex screenshots.

**Q: Why doesn't it work on first message of new chat?**
A: Intentional. TuckIT waits until second turn to avoid fighting welcome screens and initial layout. Send one message, get one response, then it activates and stays for rest of chat.

**Q: I type while tucked and it doesn't expand - bug?**
A: Intentional. When tucked to minimum, it stays tucked while you type to keep chat context maximally visible. Drag bar up or press `Ctrl+Shift+L` to expand when you need more room.

**Q: Triangle expand is laggy / empty gray space?**
A: Known quirk. Drag bar is smooth, button can glitch. Fix: Drag instead, or refresh `Cmd+R / Ctrl+R`.

**Q: Input looks crooked?**
A: `If crooked, refresh (Cmd + R / Ctrl + R)`.

**Q: Chrome Allow User Scripts where?**
A: `chrome://extensions/` -> Tampermonkey -> Details -> Allow User Scripts ON.

**Q: Why two files?**
A: `tuckit.user.js` = live auto-update. Versioned file = archive.

## 🛠️ Tech Notes

- Vanilla JS, @run-at document-idle
- Dynamic debounce 750ms first / 300ms normal + _tuckitAnimating gate
- Footer detection fix: excludes wrapper, only 20-140px footers

## 🗺️ Roadmap

- v0.1.0 - Meta + DeepSeek stable
- v0.2.0 - Adapter pattern, ChatGPT/Claude/Gemini
- v0.3.0 - Native MV3

## 👤 Built by RDT

YouTube: @RolanDorisTech
GitHub: RolanDorisTech

Star the repo if it saves you time.

## 📄 License

Apache 2.0

---
Keywords: sticky ai chat input fix, meta ai chat input covers conversation, deepseek chat box too big, keep chat context visible
