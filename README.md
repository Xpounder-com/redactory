# redactory

A privacy-first Node.js package that detects and masks sensitive information such as emails, phone numbers and SSNs. All processing happens locally with no network access.

## Features

- Detects EMAIL, PHONE, SSN and ICD10 codes using regular expressions
- Policy driven actions (MASK, REDACT, ALLOW)
- Streaming transform for large data
- CLI commands: `scrub`, `preview`, `ingest`, `policy validate`

## Installation

```
npm install redactory
```

## Usage

```javascript
import { Scrubber, loadPolicy } from 'redactory';

const policy = loadPolicy('policy.yaml');
const scrubber = new Scrubber(policy);

const { result } = scrubber.scrub('Contact me at john@example.com');
console.log(result);
```
