# redactory

A privacy-first Node.js package that detects and masks sensitive information such as emails, phone numbers and SSNs. All processing happens locally with no network access.

## Features

- Detects EMAIL, PHONE, SSN and ICD10 codes using regular expressions
- Policy driven actions (MASK, REDACT, ALLOW)
- Streaming transform for large data
- CLI commands: `scrub`, `preview`, `ingest`, `policy validate`
- Optional upload of scrubbed files to Azure Blob Storage

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

## Synthetic Test Data

A sample file containing fabricated sensitive data is available at `synthetic-data/sample.txt` for quick testing.
Run the CLI to scrub the file:

```bash
npx redactory scrub synthetic-data/sample.txt
```

## Development

Build the project to compile the TypeScript source into the `dist` folder:

```bash
npm run build
```

Run the test suite using Node's test runner:

```bash
npm test
```

## CLI Usage

After building you can run the command line interface with `npx`:

```bash
npx redactory <command> [args]
```

Commands include:

- `scrub <file>` – redact a file in place
- `preview <file>` – show a diff of the proposed changes
- `ingest <dir>` – scrub all supported files within a directory
- `policy validate <file>` – verify a policy file is valid

### Azure Upload

If the environment variable `AZURE_BLOB_SAS_URL` is set, scrubbed files will be
uploaded to Azure Blob Storage using that SAS URL and the resulting signed blob
URL will be printed. This value is typically provided via your Key Vault in
production.
