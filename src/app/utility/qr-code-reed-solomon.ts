import { QR_GALOIS_FIELD } from '../constants/qr-code.constants';

const exponentTable = new Uint8Array(QR_GALOIS_FIELD.size);
const logarithmTable = new Uint8Array(QR_GALOIS_FIELD.size);

buildGaloisTables();

function buildGaloisTables(): void {
  let value = 1;
  for (let exponent = 0; exponent < QR_GALOIS_FIELD.size - 1; exponent += 1) {
    exponentTable[exponent] = value;
    logarithmTable[value] = exponent;
    value <<= 1;
    if (value >= QR_GALOIS_FIELD.size) {
      value ^= QR_GALOIS_FIELD.primitivePolynomial;
    }
  }
}

function multiplyInGaloisField(left: number, right: number): number {
  if (left === 0 || right === 0) {
    return 0;
  }

  const exponent = (logarithmTable[left] + logarithmTable[right]) % (QR_GALOIS_FIELD.size - 1);
  return exponentTable[exponent];
}

function buildGeneratorPolynomial(degree: number): Uint8Array {
  let generator = Uint8Array.from([1]);

  for (let rootIndex = 0; rootIndex < degree; rootIndex += 1) {
    const root = Uint8Array.from([1, exponentTable[rootIndex]]);
    generator = multiplyPolynomials(generator, root);
  }

  return generator;
}

function multiplyPolynomials(left: Uint8Array, right: Uint8Array): Uint8Array {
  const product = new Uint8Array(left.length + right.length - 1);

  for (let leftIndex = 0; leftIndex < left.length; leftIndex += 1) {
    for (let rightIndex = 0; rightIndex < right.length; rightIndex += 1) {
      product[leftIndex + rightIndex] ^= multiplyInGaloisField(left[leftIndex], right[rightIndex]);
    }
  }

  return product;
}

export function computeErrorCorrectionCodewords(dataCodewords: Uint8Array, codewordCount: number): Uint8Array {
  const generator = buildGeneratorPolynomial(codewordCount);
  const remainder = new Uint8Array(codewordCount);

  for (const dataCodeword of dataCodewords) {
    const factor = dataCodeword ^ remainder[0];
    remainder.copyWithin(0, 1);
    remainder[codewordCount - 1] = 0;

    for (let position = 0; position < codewordCount; position += 1) {
      remainder[position] ^= multiplyInGaloisField(generator[position + 1], factor);
    }
  }

  return remainder;
}
