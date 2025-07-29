# redactory

A privacy-first JavaScript package that redacts Personally Identifiable Information (PII) such as names, emails, dates, and locations using spaCy — powered by WebAssembly and Pyodide, running entirely in the browser.

---

## ✨ Features

- 🔍 Entity detection via spaCy (`en_core_web_sm`)
- 🧠 No server required — fully client-side using WebAssembly (via Pyodide)
- 🚫 Redacts PII by replacing it with `[REDACTED]`
- ⚡ Optimized for asynchronous use (lazy initialization and worker threads)
- 📦 Publishable as an npm package

---

## 🚀 Installation

```bash
npm install @redactory/core
```
## 🚀 Installation (Pro Tier)

```bash
npm install @redactory/pro
```

## 🚀 Usage

```javascript
import { init, redact } from "@redactory/core";

await init(); // load spaCy via Pyodide
const result = await redact("My name is John Doe and my email is john@example.com.");

console.log(result);
// Output: "My name is [REDACTED] and my email is [REDACTED]."
```


