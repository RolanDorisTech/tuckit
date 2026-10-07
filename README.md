# Drag to Resize, Click to Tuck, Made for AI Chats (TuckIT by RDT)

> **Meta AI input covers your chat? DeepSeek box too big?**
> TuckIT pins the input to the bottom so it NEVER covers messages. Drag teal bar to resize (smooth), triangle to tuck, trash to clear all. Made for AI chats.

[![Install on GreasyFork](https://img.shields.io/badge/Install-GreasyFork-black?logo=tampermonkey)](https://greasyfork.org/en/scripts/597734-tuckit-drag-to-resize-click-to-tuck-made-for-ai-chats-tuckit-by-rdt)
[![Built on YouTube - RDT](https://img.shields.io/badge/Built_on_YouTube-RDT-red?logo=youtube)](https://youtube.com/@RolanDorisTech)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

### v0.1.1-rc.2 - Single-Scrollbar Fix (Best build yet)

Fixed double scrollbar on 【entity-Meta AI¦canonical_name=Meta】 - wrapper + editor both showed bar, now only editor shows
Added single-scrollbar enforcer [data-tk-ns] - any extra scroller inside box gets hidden (clip/nest/hide)
Refactored makeFat() editor-only - wrapper now scrollbar-width:none; overflow:hidden
Added hooks: after resize, afterSend, focus, scroll, drop/paste/file, MutationObserver + 1s watchdog
Carried from alpha.4: Trash Clear All (DeepSeek), Scroll Keeper, half-line fix, caret restore

---

## The Problem We Fix

If you use Meta AI or DeepSeek, you know this pain:

- `【entity-meta¦canonical_name=Meta】 ai input covers chat`
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
- **Trash to Clear All** - Trash button clears text + attachments (DeepSeek) with double-confirm
- **No flicker paste** - Paste large text/files without jumping
- **Smart auto-tuck** - Auto-tucks after send

## ⚠ Quirks, Intended Behavior & Pro Tips - READ THIS

I built TuckIT to be minimal and fast, but 【entity-Meta¦canonical_name=Meta】 and DeepSeek use heavy React editors (Lexical/ProseMirror) that fight back. Most of these are intentional.

**1. Drag Bar = Smooth, Triangle Button = Can Glitch**
If you drag the edge of the text box using the teal drag bar to expand the chat box, it's buttery smooth and less laggy. Using the UnTuckIT triangle button to expand sometimes results in visual bugs - the textarea stays small with a big empty gray area, or the scrollbar jumps to the far right.

**Pro tip:** Always drag to expand if you want zero lag. The button is fastest for collapsing, drag is best for expanding.

**If you see the glitch:** Hit `Cmd + R / Ctrl + R` to refresh, and or drag the drag bar to increase or decrease the chatbox size. Those are the universal fixes.

**2. Intentional: Doesn't Activate on First Message**
TuckIT intentionally does NOT activate for the very first message in a new chat. It waits until the second turn of a conversation.

Why? On a brand new chat, Meta AI and DeepSeek show welcome screens, suggested prompts, and do heavy initial layout. If I pinned the input immediately, it would fight their welcome layout and cause flicker. So TuckIT waits - you send one message, get one response, then on the second turn it kicks in and stays sticky for the rest of the conversation. This is by design, not a bug.

**3. Intentional: Stays Tucked While You Type**
When your chat box is in the minimum tucked position, it intentionally does NOT auto-expand when you start typing. It stays tucked to maintain the best visibility of your chat history while you're responding.

If you want more room while typing, drag the teal bar up or hit `Ctrl+Shift+L` to untuck. I did this on purpose - auto-expanding would defeat the whole point of keeping context visible.

**4. Keyboard Shortcuts Save You**
- `Ctrl + Shift + L` = Toggle Tuck / UnTuck - your main toggle, same as clicking triangle
- `Ctrl + Shift + K` = Turn TuckIT ON / OFF completely - kill switch if a site update breaks layout and you need to disable fast without uninstalling
- `Esc` then `Enter` = Clear All (DeepSeek) - Esc arms trash, Enter/click confirms, Esc again cancels

**5. When in doubt, refresh**
If anything looks crooked: `If crooked, refresh (Cmd + R / Ctrl + R)`. Fixes 99% of quirks.

**6. Clear All - How to Use Trash Button**
Trash Clear All is DeepSeek-only (Meta disabled intentionally, have not yet figured out how to make it work right. it just does not delete text...).
- Click trash OR press Esc to arm - pulses red, shows "Press Enter or click again to confirm"
- Press Enter OR click again to confirm - clears text + all attachments
- Cancel: Esc again, type, or click outside. Double-confirm prevents accidents.

## ✨ Features

- 🟦 **Teal drag bar** - Top edge of input, ns-resize cursor, drag up/down
- 🔺 **Triangle toggle** - [TuckIT / UnTuckIT] - fast collapse
- 🗑️ **Trash Clear All** - Esc to arm, Enter to confirm - clears input + attachments (DeepSeek)
- 📋 **Caret stays** - Your cursor stays where you left it
- ⌨ **Three hotkeys** - L for toggle, K for kill switch, Esc/Enter for clear
- 🎯 **No scroll hijack** - Scroll keeper prevents jump-to-top
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

## 🎮 How to Use

**Best practice:**
- **To collapse fast:** Click triangle or `Ctrl+Shift+L`
- **To expand smooth:** DRAG teal bar up - less laggy, avoids visual bug
- **To clear:** Click trash or press `Esc` then `Enter` (DeepSeek)
- **Bar disappeared?** Hover near top edge of input

## ⌨ Keyboard Shortcuts

- **`Ctrl + Shift + L`** - **Tuck / UnTuck Toggle** - Daily driver for tucking and untucking.
- **`Ctrl + Shift + K`** - **Kill Switch - ON/OFF** - Turn TuckIT on and off completely. Use when site update breaks layout.
- **`Esc` -> `Enter`** - **Clear All (DeepSeek only)** - Esc arms trash button, Enter or second click confirms. Esc again / typing / click outside cancels.

Both use Ctrl+Shift on Mac too.

## 🌐 Supported Sites

**v0.1.1-rc.2 - Single-Scrollbar Fix**
- ✅ `meta.ai/*`
- ✅ `facebook.com/ai/*`
- ✅ `deepseek.com/*`

**Roadmap v0.2.0+:**
- 🔜 ChatGPT, Claude, Gemini

## ❓ FAQ

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

**Q: What does trash button do?**
A: DeepSeek only (since alpha.4, polished in rc.2). Clears prompt + all attached files/images. Esc/click to arm (red pulse), Enter/click again to confirm, Esc/type/outside to cancel. No trash on Meta by design.

**Q: Why two files?**
A: `tuckit.user.js` = live auto-update. Versioned file = archive.

## 🛠 Tech Notes

- Vanilla JS, @run-at document-idle, MAIN_WORLD sandbox
- Scroll keeper with snapshot/restore to prevent yank-to-top
- Dynamic debounce 750ms first / 300ms normal + _tuckitAnimating gate
- Footer detection fix: excludes wrapper, only 20-140px footers
- Attachment detection + auto-expand on drop/paste/file input

## 🗺 Roadmap

- v0.1.0 - Meta + DeepSeek stable (archive)
- v0.1.1-alpha.2 - Meta full-line fix + 40% smaller DeepSeek attach
- v0.1.1-alpha.4 - Trash Clear All + Scroll Keeper + stability polish
- v0.1.1-rc.2 - Single-Scrollbar Enforcer - fixes double bar on Meta (current best)
- v0.2.0 - Adapter pattern, ChatGPT/Claude/Gemini
- v0.3.0 - Native MV3

## 👤 Built by RDT

YouTube: @RolanDorisTech
GitHub: RolanDorisTech

Star the repo if it saves you time.

## 📄 License

Apache 2.0

---
Keywords: sticky ai chat input fix, meta ai chat input covers conversation, deepseek chat box too big, keep chat context visible, drag to resize click to tuck
