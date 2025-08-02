# Redactory

[![npm version](https://img.shields.io/npm/v/redactory.svg)](https://www.npmjs.com/package/redactory)
[![Apache-2.0 License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)

**Redactory** is a privacy‑first utility for detecting and removing personally identifiable information (PII) from text files. It transforms documentation into AI-ready web content without exposing PII or export-controlled data. All processing happens on your machine unless you set the `AZURE_BLOB_SAS_URL` environment variable, in which case scrubbed files are uploaded to Azure Blob Storage.

## Features

- Detects common PII types (EMAIL, PHONE, SSN and ICD10 codes) using regular expressions
- Policy‑driven actions to `MASK`, `REDACT` or `ALLOW` detected entities
- Streaming transform for processing large files
- Command line interface with `scrub`, `preview`, `ingest` and `policy validate`
- Optional upload of scrubbed files to Azure Blob Storage
- Converts documentation into AI-ready web content without exposing PII or export-controlled data

## Installation

```bash
npm install redactory
```

## Quick Start

Create a policy file describing which entity types to detect and how they should be handled. An example policy is included in this repository:

```yaml
version: 1
entityTypes:
  - EMAIL
  - PHONE
  - SSN
  - ICD10
actions:
  EMAIL: MASK
  PHONE: MASK
  SSN: REDACT
  ICD10: ALLOW
thresholds:
  default: 0.7
  SSN: 0.9
mask:
  char: "*"
  keepLast: 4
fallback: BLOCK
```

### CLI usage

Build the project and run the CLI with `npx`:

```bash
npm run build
npx redactory scrub synthetic-data/sample.txt
```

Available commands:

- `scrub <file>` – redact a file in place
- `preview <file>` – show a diff of changes without modifying the file
- `ingest <dir>` – scrub all `.txt`, `.html` and `.json` files in a directory
- `policy validate <file>` – verify a policy file is valid

If the `AZURE_BLOB_SAS_URL` environment variable is set, scrubbed files will automatically be uploaded to Azure Blob Storage and the resulting blob URL will be printed.

### Programmatic API

You can also use Redactory from your own Node.js code:

```javascript
import { Scrubber, loadPolicy } from 'redactory';

const policy = loadPolicy('policy.yaml');
const scrubber = new Scrubber(policy);

const { result } = scrubber.scrub('Contact me at jane@example.com');
console.log(result);
```

### Using an ONNX NER model

Redactory can optionally load an [ONNX](https://onnx.ai/) model to detect entities
using machine learning. After installing `onnxruntime-node` and obtaining a
vocabulary mapping of tokens to IDs, provide the model path and vocabulary when
constructing the `Scrubber`:

```javascript
import fs from 'fs';
import { Scrubber, loadPolicy } from 'redactory';

const policy = loadPolicy('policy.yaml');
const vocab = JSON.parse(fs.readFileSync('vocab.json', 'utf8'));

const scrubber = new Scrubber(policy, {
  ner: { modelPath: 'ner-model.onnx', vocab }
});

const { result, entities } = scrubber.scrub('Alice met Bob.');
console.log(result, entities);
```

### Streaming API

Redactory can scrub data from Node.js streams using the `scrubStream` helper:

```javascript
import { Scrubber, loadPolicy, scrubStream } from 'redactory';
import { Readable } from 'stream';

const policy = loadPolicy('policy.yaml');
const scrubber = new Scrubber(policy);
const input = Readable.from(['Contact me at jane@example.com']);

// pipe the redacted output elsewhere
const redacted = scrubStream(input, scrubber);
redacted.on('data', chunk => process.stdout.write(chunk));
```

This makes it easy to pipe the redacted output into other streams such as file
writes or network uploads.

### Synthetic Test Data

A sample file containing fabricated sensitive data lives in `synthetic-data/sample.txt`. Try scrubbing it with the CLI to see the output.

## Development

Compile the TypeScript sources and run the test suite:

```bash
npm run build
npm test
```

## License

This project is licensed under the Apache 2.0 License. See the [LICENSE](LICENSE) file for details.

## Contributing

We welcome community contributions! Feel free to open an issue or submit a pull request on GitHub if you discover problems or have improvements to share.

