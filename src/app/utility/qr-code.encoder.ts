import {
  QR_CODE_CONFIG,
  QR_CODE_DEFAULTS,
  QR_PAD_CODEWORDS,
  QR_VERSION_SPECIFICATIONS
} from '../constants/qr-code.constants';
import { QrBlockSpecification, QrCodeMatrix, QrErrorCorrectionLevel } from '../constants/qr-code.types';
import { buildQrMatrix } from './qr-code-matrix';
import { computeErrorCorrectionCodewords } from './qr-code-reed-solomon';

type QrCodeBlocks = {
  dataBlocks: Uint8Array[];
  errorCorrectionBlocks: Uint8Array[];
};

export function encodeQrCode(
  value: string,
  errorCorrectionLevel: QrErrorCorrectionLevel = QR_CODE_DEFAULTS.errorCorrectionLevel
): QrCodeMatrix | null {
  const trimmedValue = value.trim();
  if (trimmedValue.length === 0) {
    return null;
  }

  const dataBytes = new TextEncoder().encode(trimmedValue);
  const version = selectSmallestFittingVersion(dataBytes.length, errorCorrectionLevel);
  if (version === null) {
    return null;
  }

  const specification = QR_VERSION_SPECIFICATIONS[version - 1][errorCorrectionLevel];
  const dataCodewords = buildDataCodewords(dataBytes, version, specification);
  const finalCodewords = interleaveCodewords(splitIntoBlocks(dataCodewords, specification), specification);

  return buildQrMatrix(finalCodewords, version, errorCorrectionLevel);
}

function selectSmallestFittingVersion(
  dataByteLength: number,
  errorCorrectionLevel: QrErrorCorrectionLevel
): number | null {
  for (
    let version = QR_CODE_CONFIG.lowestSupportedVersion;
    version <= QR_CODE_CONFIG.highestSupportedVersion;
    version += 1
  ) {
    const specification = QR_VERSION_SPECIFICATIONS[version - 1][errorCorrectionLevel];
    const requiredBits = QR_CODE_CONFIG.byteModeIndicatorBits
      + characterCountBits(version)
      + dataByteLength * QR_CODE_CONFIG.bitsPerCodeword;

    if (requiredBits <= countDataCodewords(specification) * QR_CODE_CONFIG.bitsPerCodeword) {
      return version;
    }
  }

  return null;
}

function characterCountBits(version: number): number {
  return version < QR_CODE_CONFIG.firstVersionWithLongCharacterCount
    ? QR_CODE_CONFIG.characterCountBitsBelowVersionTen
    : QR_CODE_CONFIG.characterCountBitsFromVersionTen;
}

function countDataCodewords(specification: QrBlockSpecification): number {
  return specification.firstGroupBlockCount * specification.firstGroupDataCodewords
    + specification.secondGroupBlockCount * specification.secondGroupDataCodewords;
}

function buildDataCodewords(
  dataBytes: Uint8Array,
  version: number,
  specification: QrBlockSpecification
): Uint8Array {
  const totalDataCodewords = countDataCodewords(specification);
  const capacityBits = totalDataCodewords * QR_CODE_CONFIG.bitsPerCodeword;
  const bits: number[] = [];

  appendBits(bits, QR_CODE_CONFIG.byteModeIndicator, QR_CODE_CONFIG.byteModeIndicatorBits);
  appendBits(bits, dataBytes.length, characterCountBits(version));
  for (const dataByte of dataBytes) {
    appendBits(bits, dataByte, QR_CODE_CONFIG.bitsPerCodeword);
  }

  appendBits(bits, 0, Math.min(QR_CODE_CONFIG.terminatorBits, capacityBits - bits.length));
  appendBits(bits, 0, (QR_CODE_CONFIG.bitsPerCodeword - (bits.length % QR_CODE_CONFIG.bitsPerCodeword))
    % QR_CODE_CONFIG.bitsPerCodeword);

  return padDataCodewords(packBitsIntoCodewords(bits), totalDataCodewords);
}

function appendBits(bits: number[], value: number, bitCount: number): void {
  for (let position = bitCount - 1; position >= 0; position -= 1) {
    bits.push((value >>> position) & 1);
  }
}

function packBitsIntoCodewords(bits: ReadonlyArray<number>): Uint8Array {
  const codewords = new Uint8Array(bits.length / QR_CODE_CONFIG.bitsPerCodeword);

  for (let bitIndex = 0; bitIndex < bits.length; bitIndex += 1) {
    const codewordIndex = Math.floor(bitIndex / QR_CODE_CONFIG.bitsPerCodeword);
    const bitPosition = QR_CODE_CONFIG.bitsPerCodeword - 1 - (bitIndex % QR_CODE_CONFIG.bitsPerCodeword);
    codewords[codewordIndex] |= bits[bitIndex] << bitPosition;
  }

  return codewords;
}

function padDataCodewords(codewords: Uint8Array, totalDataCodewords: number): Uint8Array {
  const paddedCodewords = new Uint8Array(totalDataCodewords);
  paddedCodewords.set(codewords.subarray(0, totalDataCodewords));

  for (let index = codewords.length; index < totalDataCodewords; index += 1) {
    paddedCodewords[index] = QR_PAD_CODEWORDS[(index - codewords.length) % QR_PAD_CODEWORDS.length];
  }

  return paddedCodewords;
}

function splitIntoBlocks(dataCodewords: Uint8Array, specification: QrBlockSpecification): QrCodeBlocks {
  const dataBlocks: Uint8Array[] = [];
  const errorCorrectionBlocks: Uint8Array[] = [];
  let readOffset = 0;

  const groups: ReadonlyArray<readonly [number, number]> = [
    [specification.firstGroupBlockCount, specification.firstGroupDataCodewords],
    [specification.secondGroupBlockCount, specification.secondGroupDataCodewords]
  ];

  for (const [blockCount, blockDataCodewords] of groups) {
    for (let blockIndex = 0; blockIndex < blockCount; blockIndex += 1) {
      const block = dataCodewords.subarray(readOffset, readOffset + blockDataCodewords);
      readOffset += blockDataCodewords;
      dataBlocks.push(block);
      errorCorrectionBlocks.push(
        computeErrorCorrectionCodewords(block, specification.errorCorrectionCodewordsPerBlock)
      );
    }
  }

  return { dataBlocks, errorCorrectionBlocks };
}

function interleaveCodewords(blocks: QrCodeBlocks, specification: QrBlockSpecification): Uint8Array {
  const longestDataBlockLength = Math.max(
    specification.firstGroupDataCodewords,
    specification.secondGroupDataCodewords
  );
  const interleavedCodewords: number[] = [];

  for (let codewordIndex = 0; codewordIndex < longestDataBlockLength; codewordIndex += 1) {
    collectCodewordsAtIndex(blocks.dataBlocks, codewordIndex, interleavedCodewords);
  }

  for (
    let codewordIndex = 0;
    codewordIndex < specification.errorCorrectionCodewordsPerBlock;
    codewordIndex += 1
  ) {
    collectCodewordsAtIndex(blocks.errorCorrectionBlocks, codewordIndex, interleavedCodewords);
  }

  return Uint8Array.from(interleavedCodewords);
}

function collectCodewordsAtIndex(
  blocks: ReadonlyArray<Uint8Array>,
  codewordIndex: number,
  target: number[]
): void {
  for (const block of blocks) {
    if (codewordIndex < block.length) {
      target.push(block[codewordIndex]);
    }
  }
}
