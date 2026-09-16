# QrCodeComponent

`<app-qr-code>` renders a QR code as inline SVG. It has no third-party dependency: the
matrix is produced in-repo by the encoder in `src/app/utility/`.

## Usage

```html
<app-qr-code
  [value]="verificationUrl()"
  [size]="168"
  [description]="'Verification QR code for payment reference ' + referenceId()"
></app-qr-code>
```

```ts
import { QrCodeComponent } from '../../shared/components/qr-code/qr-code.component';
```

## Inputs

| Input | Type | Default | Purpose |
| --- | --- | --- | --- |
| `value` | `string` | `''` | Text or URL to encode. Trimmed before encoding. |
| `size` | `number` | `QR_CODE_DEFAULTS.sizePx` | Rendered width and height in pixels. The SVG scales to its box, so the module grid stays crisp at any size. |
| `errorCorrectionLevel` | `QrErrorCorrectionLevel` | `'M'` | `'L' \| 'M' \| 'Q' \| 'H'`. Higher levels survive more print damage but need a larger symbol. |
| `quietZone` | `number` | `4` | Light margin in modules. Four is the minimum the specification allows; scanners need it. |
| `darkColor` / `lightColor` | `string` | slate / white | Module colours. Keep strong contrast — inverted or low-contrast codes fail to scan. |
| `unavailableMessage` | `string` | see constants | Shown instead of the SVG when the value cannot be encoded. |
| `description` | `string` | `''` | Becomes the SVG `aria-label`. Falls back to `QR code for {value}`. |

## Behaviour when the value cannot be encoded

The component renders `unavailableMessage` instead of throwing when `value` is empty or
too long for the supported versions. Callers do not need a `try`/`catch`.

## Capacity

Versions 1–10 are supported in byte mode, which is the practical range for URLs:

| Error correction | Maximum bytes |
| --- | --- |
| `L` | 271 |
| `M` | 213 |
| `Q` | 151 |
| `H` | 119 |

A value longer than the limit for the chosen level produces the unavailable message.
Shorten the payload (prefer a short reference URL over embedded data) or lower the
error-correction level.

## Encoder internals

| File | Responsibility |
| --- | --- |
| `utility/qr-code.encoder.ts` | Public `encodeQrCode(value, level)`. Version selection, bit stream, padding, block splitting, interleaving. |
| `utility/qr-code-matrix.ts` | Function patterns, data placement, mask selection by penalty score, format and version information. |
| `utility/qr-code-reed-solomon.ts` | GF(256) arithmetic and error-correction codewords. |
| `constants/qr-code.constants.ts` | Version/error-correction block tables, alignment centres, generator polynomials, defaults. |
| `constants/qr-code.types.ts` | `QrErrorCorrectionLevel`, `QrCodeMatrix`, block specification types. |

`encodeQrCode` returns `QrCodeMatrix | null` — a row-major grid of booleans where `true`
is a dark module, or `null` when the value does not fit.

The encoder follows ISO/IEC 18004, so the bit-level files are exempted from the
`no-bitwise`, `no-continue`, `no-param-reassign` and `no-restricted-syntax` lint rules
via a scoped override in `.eslintrc.cjs`.

## First consumer

The receipt verification page (`pages/payment-receipt/`, route `/payment-receipt-verify/?ref_id={ref_id}`) calls
the public `GET /api/v1/payments/payments/{ref_id}/verify` endpoint and encodes its own
absolute URL, `{frontend origin}/payment-receipt-verify/?ref_id={ref_id}`, which is the same URL the backend
should embed in the QR code on the generated receipt.
