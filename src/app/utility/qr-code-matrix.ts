import {
  QR_ALIGNMENT_PATTERN_CENTERS,
  QR_CODE_CONFIG,
  QR_ERROR_CORRECTION_INDICATORS,
  QR_FORMAT_INFORMATION,
  QR_MASK_PENALTY,
  QR_VERSION_INFORMATION
} from '../constants/qr-code.constants';
import { QrCodeMatrix, QrErrorCorrectionLevel } from '../constants/qr-code.types';

type MutableMatrix = boolean[][];

const FINDER_CENTER_OFFSET = 3;
const FINDER_LIGHT_RING_DISTANCE = 2;
const ALIGNMENT_DARK_DISTANCES = [0, 2];
const FINDER_LIKE_SEQUENCE = [true, false, true, true, true, false, true, false, false, false, false];
const FORMAT_INFORMATION_INDEX = 8;

export function buildQrMatrix(
  codewords: Uint8Array,
  version: number,
  errorCorrectionLevel: QrErrorCorrectionLevel
): QrCodeMatrix {
  const size = version * QR_CODE_CONFIG.modulesPerVersionStep + QR_CODE_CONFIG.baseModuleCount;
  const modules = createEmptyMatrix(size);
  const reservedModules = createEmptyMatrix(size);

  drawFinderPatterns(modules, reservedModules, size);
  drawAlignmentPatterns(modules, reservedModules, version, size);
  drawTimingPatterns(modules, reservedModules, size);
  reserveFormatInformationArea(reservedModules, size);
  drawVersionInformation(modules, reservedModules, version, size);
  placeDataModules(modules, reservedModules, codewords, size);

  return selectBestMaskedMatrix(modules, reservedModules, errorCorrectionLevel, size);
}

function createEmptyMatrix(size: number): MutableMatrix {
  return Array.from({ length: size }, () => new Array<boolean>(size).fill(false));
}

function cloneMatrix(matrix: MutableMatrix): MutableMatrix {
  return matrix.map((row) => row.slice());
}

function readBit(value: number, position: number): boolean {
  return ((value >>> position) & 1) === 1;
}

function isWithinMatrix(row: number, column: number, size: number): boolean {
  return row >= 0 && row < size && column >= 0 && column < size;
}

function drawFinderPatterns(modules: MutableMatrix, reservedModules: MutableMatrix, size: number): void {
  const patternSize = QR_CODE_CONFIG.finderPatternSize;
  const origins: ReadonlyArray<readonly [number, number]> = [
    [0, 0],
    [0, size - patternSize],
    [size - patternSize, 0]
  ];

  for (const [originRow, originColumn] of origins) {
    drawFinderPattern(modules, reservedModules, originRow, originColumn, size);
  }
}

function drawFinderPattern(
  modules: MutableMatrix,
  reservedModules: MutableMatrix,
  originRow: number,
  originColumn: number,
  size: number
): void {
  for (let rowOffset = -1; rowOffset <= QR_CODE_CONFIG.finderPatternSize; rowOffset += 1) {
    for (let columnOffset = -1; columnOffset <= QR_CODE_CONFIG.finderPatternSize; columnOffset += 1) {
      const row = originRow + rowOffset;
      const column = originColumn + columnOffset;
      if (!isWithinMatrix(row, column, size)) {
        continue;
      }

      const distanceFromCenter = Math.max(
        Math.abs(rowOffset - FINDER_CENTER_OFFSET),
        Math.abs(columnOffset - FINDER_CENTER_OFFSET)
      );
      modules[row][column] = distanceFromCenter !== FINDER_LIGHT_RING_DISTANCE
        && distanceFromCenter <= FINDER_CENTER_OFFSET;
      reservedModules[row][column] = true;
    }
  }
}

function drawAlignmentPatterns(
  modules: MutableMatrix,
  reservedModules: MutableMatrix,
  version: number,
  size: number
): void {
  const centers = QR_ALIGNMENT_PATTERN_CENTERS[version - 1];

  for (const centerRow of centers) {
    for (const centerColumn of centers) {
      if (overlapsFinderPattern(centerRow, centerColumn, centers)) {
        continue;
      }
      drawAlignmentPattern(modules, reservedModules, centerRow, centerColumn, size);
    }
  }
}

function overlapsFinderPattern(
  centerRow: number,
  centerColumn: number,
  centers: ReadonlyArray<number>
): boolean {
  const firstCenter = centers[0];
  const lastCenter = centers[centers.length - 1];

  return (centerRow === firstCenter && centerColumn === firstCenter)
    || (centerRow === firstCenter && centerColumn === lastCenter)
    || (centerRow === lastCenter && centerColumn === firstCenter);
}

function drawAlignmentPattern(
  modules: MutableMatrix,
  reservedModules: MutableMatrix,
  centerRow: number,
  centerColumn: number,
  size: number
): void {
  const radius = QR_CODE_CONFIG.alignmentPatternRadius;

  for (let rowOffset = -radius; rowOffset <= radius; rowOffset += 1) {
    for (let columnOffset = -radius; columnOffset <= radius; columnOffset += 1) {
      const row = centerRow + rowOffset;
      const column = centerColumn + columnOffset;
      if (!isWithinMatrix(row, column, size)) {
        continue;
      }

      const distanceFromCenter = Math.max(Math.abs(rowOffset), Math.abs(columnOffset));
      modules[row][column] = ALIGNMENT_DARK_DISTANCES.includes(distanceFromCenter);
      reservedModules[row][column] = true;
    }
  }
}

function drawTimingPatterns(modules: MutableMatrix, reservedModules: MutableMatrix, size: number): void {
  const timingIndex = QR_CODE_CONFIG.timingPatternIndex;

  for (let position = 0; position < size; position += 1) {
    const isDarkModule = position % 2 === 0;

    if (!reservedModules[timingIndex][position]) {
      modules[timingIndex][position] = isDarkModule;
      reservedModules[timingIndex][position] = true;
    }

    if (!reservedModules[position][timingIndex]) {
      modules[position][timingIndex] = isDarkModule;
      reservedModules[position][timingIndex] = true;
    }
  }
}

function reserveFormatInformationArea(reservedModules: MutableMatrix, size: number): void {
  for (let position = 0; position <= FORMAT_INFORMATION_INDEX; position += 1) {
    reservedModules[FORMAT_INFORMATION_INDEX][position] = true;
    reservedModules[position][FORMAT_INFORMATION_INDEX] = true;
  }

  for (let position = size - FORMAT_INFORMATION_INDEX; position < size; position += 1) {
    reservedModules[FORMAT_INFORMATION_INDEX][position] = true;
    reservedModules[position][FORMAT_INFORMATION_INDEX] = true;
  }
}

function drawVersionInformation(
  modules: MutableMatrix,
  reservedModules: MutableMatrix,
  version: number,
  size: number
): void {
  if (version < QR_CODE_CONFIG.firstVersionWithVersionInformation) {
    return;
  }

  const versionBits = buildVersionInformationBits(version);

  for (let bitIndex = 0; bitIndex < QR_CODE_CONFIG.versionInformationBitCount; bitIndex += 1) {
    const bit = readBit(versionBits, bitIndex);
    const farPosition = size - 11 + (bitIndex % 3);
    const nearPosition = Math.floor(bitIndex / 3);

    modules[farPosition][nearPosition] = bit;
    reservedModules[farPosition][nearPosition] = true;
    modules[nearPosition][farPosition] = bit;
    reservedModules[nearPosition][farPosition] = true;
  }
}

function buildVersionInformationBits(version: number): number {
  let remainder = version;

  for (let step = 0; step < QR_VERSION_INFORMATION.generatorDegree; step += 1) {
    const overflowBit = remainder >>> (QR_VERSION_INFORMATION.generatorDegree - 1);
    remainder = (remainder << 1) ^ (overflowBit * QR_VERSION_INFORMATION.generatorPolynomial);
  }

  return (version << QR_VERSION_INFORMATION.generatorDegree) | remainder;
}

function placeDataModules(
  modules: MutableMatrix,
  reservedModules: MutableMatrix,
  codewords: Uint8Array,
  size: number
): void {
  const totalBits = codewords.length * QR_CODE_CONFIG.bitsPerCodeword;
  let bitIndex = 0;
  let rightColumn = size - 1;

  while (rightColumn >= 1) {
    const columnPair = rightColumn === QR_CODE_CONFIG.timingPatternIndex ? rightColumn - 1 : rightColumn;
    const movesUpward = ((columnPair + 1) & 2) === 0;

    for (let step = 0; step < size; step += 1) {
      const row = movesUpward ? size - 1 - step : step;

      for (let columnOffset = 0; columnOffset < 2; columnOffset += 1) {
        const column = columnPair - columnOffset;
        if (reservedModules[row][column]) {
          continue;
        }

        modules[row][column] = bitIndex < totalBits && readCodewordBit(codewords, bitIndex);
        bitIndex += 1;
      }
    }

    rightColumn = columnPair - 2;
  }
}

function readCodewordBit(codewords: Uint8Array, bitIndex: number): boolean {
  const codeword = codewords[Math.floor(bitIndex / QR_CODE_CONFIG.bitsPerCodeword)];
  const bitPosition = QR_CODE_CONFIG.bitsPerCodeword - 1 - (bitIndex % QR_CODE_CONFIG.bitsPerCodeword);
  return readBit(codeword, bitPosition);
}

function selectBestMaskedMatrix(
  modules: MutableMatrix,
  reservedModules: MutableMatrix,
  errorCorrectionLevel: QrErrorCorrectionLevel,
  size: number
): QrCodeMatrix {
  let bestMatrix = modules;
  let bestPenalty = Number.POSITIVE_INFINITY;

  for (let maskPattern = 0; maskPattern < QR_CODE_CONFIG.maskPatternCount; maskPattern += 1) {
    const candidate = cloneMatrix(modules);
    applyMaskPattern(candidate, reservedModules, maskPattern, size);
    drawFormatInformation(candidate, errorCorrectionLevel, maskPattern, size);

    const penalty = scoreMatrix(candidate, size);
    if (penalty < bestPenalty) {
      bestPenalty = penalty;
      bestMatrix = candidate;
    }
  }

  return bestMatrix;
}

function applyMaskPattern(
  modules: MutableMatrix,
  reservedModules: MutableMatrix,
  maskPattern: number,
  size: number
): void {
  for (let row = 0; row < size; row += 1) {
    for (let column = 0; column < size; column += 1) {
      if (reservedModules[row][column]) {
        continue;
      }
      if (isMaskedModule(maskPattern, row, column)) {
        modules[row][column] = !modules[row][column];
      }
    }
  }
}

function isMaskedModule(maskPattern: number, row: number, column: number): boolean {
  switch (maskPattern) {
    case 0:
      return (row + column) % 2 === 0;
    case 1:
      return row % 2 === 0;
    case 2:
      return column % 3 === 0;
    case 3:
      return (row + column) % 3 === 0;
    case 4:
      return (Math.floor(row / 2) + Math.floor(column / 3)) % 2 === 0;
    case 5:
      return ((row * column) % 2) + ((row * column) % 3) === 0;
    case 6:
      return (((row * column) % 2) + ((row * column) % 3)) % 2 === 0;
    default:
      return (((row + column) % 2) + ((row * column) % 3)) % 2 === 0;
  }
}

function drawFormatInformation(
  modules: MutableMatrix,
  errorCorrectionLevel: QrErrorCorrectionLevel,
  maskPattern: number,
  size: number
): void {
  const formatBits = buildFormatInformationBits(errorCorrectionLevel, maskPattern);

  for (let bitIndex = 0; bitIndex <= 5; bitIndex += 1) {
    modules[bitIndex][FORMAT_INFORMATION_INDEX] = readBit(formatBits, bitIndex);
  }
  modules[7][FORMAT_INFORMATION_INDEX] = readBit(formatBits, 6);
  modules[FORMAT_INFORMATION_INDEX][FORMAT_INFORMATION_INDEX] = readBit(formatBits, 7);
  modules[FORMAT_INFORMATION_INDEX][7] = readBit(formatBits, 8);
  for (let bitIndex = 9; bitIndex < QR_CODE_CONFIG.formatInformationBitCount; bitIndex += 1) {
    modules[FORMAT_INFORMATION_INDEX][14 - bitIndex] = readBit(formatBits, bitIndex);
  }

  for (let bitIndex = 0; bitIndex < FORMAT_INFORMATION_INDEX; bitIndex += 1) {
    modules[FORMAT_INFORMATION_INDEX][size - 1 - bitIndex] = readBit(formatBits, bitIndex);
  }
  for (let bitIndex = FORMAT_INFORMATION_INDEX; bitIndex < QR_CODE_CONFIG.formatInformationBitCount; bitIndex += 1) {
    modules[size - QR_CODE_CONFIG.formatInformationBitCount + bitIndex][FORMAT_INFORMATION_INDEX] =
      readBit(formatBits, bitIndex);
  }

  modules[size - FORMAT_INFORMATION_INDEX][FORMAT_INFORMATION_INDEX] = true;
}

function buildFormatInformationBits(errorCorrectionLevel: QrErrorCorrectionLevel, maskPattern: number): number {
  const formatData = (QR_ERROR_CORRECTION_INDICATORS[errorCorrectionLevel] << 3) | maskPattern;
  let remainder = formatData;

  for (let step = 0; step < QR_FORMAT_INFORMATION.generatorDegree; step += 1) {
    const overflowBit = remainder >>> (QR_FORMAT_INFORMATION.generatorDegree - 1);
    remainder = (remainder << 1) ^ (overflowBit * QR_FORMAT_INFORMATION.generatorPolynomial);
  }

  return ((formatData << QR_FORMAT_INFORMATION.generatorDegree) | remainder) ^ QR_FORMAT_INFORMATION.mask;
}

function scoreMatrix(modules: MutableMatrix, size: number): number {
  return scoreAdjacentRuns(modules, size)
    + scoreUniformBlocks(modules, size)
    + scoreFinderLikePatterns(modules, size)
    + scoreDarkModuleRatio(modules, size);
}

function scoreAdjacentRuns(modules: MutableMatrix, size: number): number {
  let penalty = 0;

  for (let index = 0; index < size; index += 1) {
    penalty += scoreLineRuns(modules[index]);
    penalty += scoreLineRuns(readColumn(modules, index, size));
  }

  return penalty;
}

function scoreLineRuns(line: ReadonlyArray<boolean>): number {
  let penalty = 0;
  let runLength = 1;

  for (let index = 1; index < line.length; index += 1) {
    if (line[index] === line[index - 1]) {
      runLength += 1;
      continue;
    }

    penalty += runPenalty(runLength);
    runLength = 1;
  }

  return penalty + runPenalty(runLength);
}

function runPenalty(runLength: number): number {
  if (runLength < QR_MASK_PENALTY.adjacentRunLength) {
    return 0;
  }

  return QR_MASK_PENALTY.adjacentRunScore + (runLength - QR_MASK_PENALTY.adjacentRunLength);
}

function scoreUniformBlocks(modules: MutableMatrix, size: number): number {
  let penalty = 0;

  for (let row = 0; row < size - 1; row += 1) {
    for (let column = 0; column < size - 1; column += 1) {
      const isUniformBlock = modules[row][column] === modules[row][column + 1]
        && modules[row][column] === modules[row + 1][column]
        && modules[row][column] === modules[row + 1][column + 1];

      if (isUniformBlock) {
        penalty += QR_MASK_PENALTY.blockScore;
      }
    }
  }

  return penalty;
}

function scoreFinderLikePatterns(modules: MutableMatrix, size: number): number {
  let penalty = 0;

  for (let index = 0; index < size; index += 1) {
    penalty += countFinderLikeSequences(modules[index]) * QR_MASK_PENALTY.finderLikeScore;
    penalty += countFinderLikeSequences(readColumn(modules, index, size)) * QR_MASK_PENALTY.finderLikeScore;
  }

  return penalty;
}

function countFinderLikeSequences(line: ReadonlyArray<boolean>): number {
  let matches = 0;

  for (let start = 0; start + FINDER_LIKE_SEQUENCE.length <= line.length; start += 1) {
    if (matchesFinderLikeSequence(line, start, false) || matchesFinderLikeSequence(line, start, true)) {
      matches += 1;
    }
  }

  return matches;
}

function matchesFinderLikeSequence(line: ReadonlyArray<boolean>, start: number, reversed: boolean): boolean {
  for (let offset = 0; offset < FINDER_LIKE_SEQUENCE.length; offset += 1) {
    const expected = reversed
      ? FINDER_LIKE_SEQUENCE[FINDER_LIKE_SEQUENCE.length - 1 - offset]
      : FINDER_LIKE_SEQUENCE[offset];

    if (line[start + offset] !== expected) {
      return false;
    }
  }

  return true;
}

function scoreDarkModuleRatio(modules: MutableMatrix, size: number): number {
  let darkModuleCount = 0;

  for (const row of modules) {
    for (const isDarkModule of row) {
      darkModuleCount += isDarkModule ? 1 : 0;
    }
  }

  const darkPercent = (darkModuleCount * 100) / (size * size);
  const deviationSteps = Math.floor(
    Math.abs(darkPercent - QR_MASK_PENALTY.balancedDarkPercent) / QR_MASK_PENALTY.darkRatioStepPercent
  );

  return deviationSteps * QR_MASK_PENALTY.darkRatioStepScore;
}

function readColumn(modules: MutableMatrix, columnIndex: number, size: number): ReadonlyArray<boolean> {
  const column = new Array<boolean>(size);

  for (let rowIndex = 0; rowIndex < size; rowIndex += 1) {
    column[rowIndex] = modules[rowIndex][columnIndex];
  }

  return column;
}
