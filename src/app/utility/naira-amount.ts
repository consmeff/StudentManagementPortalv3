const SMALL_NUMBER_WORDS = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
];

const TENS_WORDS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

const SCALE_WORDS: ReadonlyArray<readonly [number, string]> = [
  [1_000_000_000, 'Billion'],
  [1_000_000, 'Million'],
  [1_000, 'Thousand']
];

export function formatNairaAmount(value: number): string {
  const safeValue = Number.isFinite(value) ? value : 0;
  return `NGN ${safeValue.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

export function formatNairaAmountInWords(value: number): string {
  const safeValue = Number.isFinite(value) ? Math.abs(value) : 0;
  const naira = Math.floor(safeValue);
  const kobo = Math.round((safeValue - naira) * 100);

  const nairaWords = `${convertWholeNumberToWords(naira)} Naira`;
  if (kobo === 0) {
    return `${nairaWords} Only`;
  }

  return `${nairaWords}, ${convertWholeNumberToWords(kobo)} Kobo Only`;
}

function convertWholeNumberToWords(value: number): string {
  if (value === 0) {
    return 'Zero';
  }

  const parts: string[] = [];
  let remainder = value;

  for (const [scaleValue, scaleName] of SCALE_WORDS) {
    const scaleCount = Math.floor(remainder / scaleValue);
    if (scaleCount > 0) {
      parts.push(`${convertBelowThousandToWords(scaleCount)} ${scaleName}`);
      remainder %= scaleValue;
    }
  }

  if (remainder > 0) {
    parts.push(convertBelowThousandToWords(remainder));
  }

  return parts.join(' ');
}

function convertBelowThousandToWords(value: number): string {
  if (value < 20) {
    return SMALL_NUMBER_WORDS[value];
  }

  if (value < 100) {
    const tens = TENS_WORDS[Math.floor(value / 10)];
    const units = value % 10;
    return units > 0 ? `${tens} ${SMALL_NUMBER_WORDS[units]}` : tens;
  }

  const hundreds = `${SMALL_NUMBER_WORDS[Math.floor(value / 100)]} Hundred`;
  const remainder = value % 100;
  return remainder > 0 ? `${hundreds} ${convertBelowThousandToWords(remainder)}` : hundreds;
}
