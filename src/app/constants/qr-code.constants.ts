import {
  QrBlockSpecification,
  QrErrorCorrectionLevel,
  QrVersionSpecification
} from './qr-code.types';

type QrBlockTuple = readonly [
  errorCorrectionCodewordsPerBlock: number,
  firstGroupBlockCount: number,
  firstGroupDataCodewords: number,
  secondGroupBlockCount: number,
  secondGroupDataCodewords: number
];

type QrVersionTuples = Readonly<Record<QrErrorCorrectionLevel, QrBlockTuple>>;

export const QR_CODE_CONFIG = {
  byteModeIndicator: 0b0100,
  byteModeIndicatorBits: 4,
  characterCountBitsBelowVersionTen: 8,
  characterCountBitsFromVersionTen: 16,
  terminatorBits: 4,
  bitsPerCodeword: 8,
  lowestSupportedVersion: 1,
  highestSupportedVersion: 10,
  firstVersionWithVersionInformation: 7,
  firstVersionWithLongCharacterCount: 10,
  modulesPerVersionStep: 4,
  baseModuleCount: 17,
  maskPatternCount: 8,
  finderPatternSize: 7,
  alignmentPatternRadius: 2,
  timingPatternIndex: 6,
  formatInformationBitCount: 15,
  versionInformationBitCount: 18
} as const;

export const QR_CODE_DEFAULTS = {
  errorCorrectionLevel: 'M' as QrErrorCorrectionLevel,
  sizePx: 176,
  quietZoneModules: 4,
  darkColor: '#0f172a',
  lightColor: '#ffffff',
  unavailableMessage: 'QR code unavailable for this value.'
} as const;

export const QR_GALOIS_FIELD = {
  size: 256,
  primitivePolynomial: 0x11d
} as const;

export const QR_PAD_CODEWORDS = [0xec, 0x11] as const;

export const QR_ERROR_CORRECTION_INDICATORS: Readonly<Record<QrErrorCorrectionLevel, number>> = {
  L: 0b01,
  M: 0b00,
  Q: 0b11,
  H: 0b10
};

export const QR_FORMAT_INFORMATION = {
  generatorPolynomial: 0x537,
  generatorDegree: 10,
  mask: 0x5412
} as const;

export const QR_VERSION_INFORMATION = {
  generatorPolynomial: 0x1f25,
  generatorDegree: 12
} as const;

export const QR_MASK_PENALTY = {
  adjacentRunLength: 5,
  adjacentRunScore: 3,
  blockScore: 3,
  finderLikeScore: 40,
  darkRatioStepPercent: 5,
  darkRatioStepScore: 10,
  balancedDarkPercent: 50
} as const;

export const QR_ALIGNMENT_PATTERN_CENTERS: ReadonlyArray<ReadonlyArray<number>> = [
  [],
  [6, 18],
  [6, 22],
  [6, 26],
  [6, 30],
  [6, 34],
  [6, 22, 38],
  [6, 24, 42],
  [6, 26, 46],
  [6, 28, 50]
];

const QR_VERSION_BLOCK_TUPLES: ReadonlyArray<QrVersionTuples> = [
  { L: [7, 1, 19, 0, 0], M: [10, 1, 16, 0, 0], Q: [13, 1, 13, 0, 0], H: [17, 1, 9, 0, 0] },
  { L: [10, 1, 34, 0, 0], M: [16, 1, 28, 0, 0], Q: [22, 1, 22, 0, 0], H: [28, 1, 16, 0, 0] },
  { L: [15, 1, 55, 0, 0], M: [26, 1, 44, 0, 0], Q: [18, 2, 17, 0, 0], H: [22, 2, 13, 0, 0] },
  { L: [20, 1, 80, 0, 0], M: [18, 2, 32, 0, 0], Q: [26, 2, 24, 0, 0], H: [16, 4, 9, 0, 0] },
  { L: [26, 1, 108, 0, 0], M: [24, 2, 43, 0, 0], Q: [18, 2, 15, 2, 16], H: [22, 2, 11, 2, 12] },
  { L: [18, 2, 68, 0, 0], M: [16, 4, 27, 0, 0], Q: [24, 4, 19, 0, 0], H: [28, 4, 15, 0, 0] },
  { L: [20, 2, 78, 0, 0], M: [18, 4, 31, 0, 0], Q: [18, 2, 14, 4, 15], H: [26, 4, 13, 1, 14] },
  { L: [24, 2, 97, 0, 0], M: [22, 2, 38, 2, 39], Q: [22, 4, 18, 2, 19], H: [26, 4, 14, 2, 15] },
  { L: [30, 2, 116, 0, 0], M: [22, 3, 36, 2, 37], Q: [20, 4, 16, 4, 17], H: [24, 4, 12, 4, 13] },
  { L: [18, 2, 68, 2, 69], M: [26, 4, 43, 1, 44], Q: [24, 6, 19, 2, 20], H: [28, 6, 15, 2, 16] }
];

function toBlockSpecification(tuple: QrBlockTuple): QrBlockSpecification {
  const [
    errorCorrectionCodewordsPerBlock,
    firstGroupBlockCount,
    firstGroupDataCodewords,
    secondGroupBlockCount,
    secondGroupDataCodewords
  ] = tuple;

  return {
    errorCorrectionCodewordsPerBlock,
    firstGroupBlockCount,
    firstGroupDataCodewords,
    secondGroupBlockCount,
    secondGroupDataCodewords
  };
}

function toVersionSpecification(tuples: QrVersionTuples): QrVersionSpecification {
  return {
    L: toBlockSpecification(tuples.L),
    M: toBlockSpecification(tuples.M),
    Q: toBlockSpecification(tuples.Q),
    H: toBlockSpecification(tuples.H)
  };
}

export const QR_VERSION_SPECIFICATIONS: ReadonlyArray<QrVersionSpecification> =
  QR_VERSION_BLOCK_TUPLES.map(toVersionSpecification);
