const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})/;

const padDatePart = (value: number): string =>
  value.toString().padStart(2, '0');

/**
 * Formats a date as YYYY-MM-DD using local calendar values.
 *
 * Do not use toISOString() here because DOB is a calendar date,
 * not a UTC timestamp.
 */
export const formatDateOnly = (
  value: Date | string | null | undefined,
): string => {
  if (!value) {
    return '';
  }

  // Preserve an existing date-only or ISO date string.
  if (typeof value === 'string') {
    const match = value.trim().match(DATE_ONLY_PATTERN);

    if (match) {
      const [, year, month, day] = match;
      return `${year}-${month}-${day}`;
    }
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  // Use local values, not UTC values.
  const year = date.getFullYear();
  const month = padDatePart(date.getMonth() + 1);
  const day = padDatePart(date.getDate());

  return `${year}-${month}-${day}`;
};

/**
 * Parses YYYY-MM-DD as a local calendar date.
 *
 * Avoid new Date('YYYY-MM-DD') because JavaScript interprets that
 * format as UTC.
 */
export const parseDateOnly = (
  value: Date | string | null | undefined,
): Date | null => {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      return null;
    }

    return new Date(
      value.getFullYear(),
      value.getMonth(),
      value.getDate(),
    );
  }

  const match = value.trim().match(DATE_ONLY_PATTERN);

  if (match) {
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);

    const date = new Date(year, month - 1, day);

    // Prevent invalid values such as 2026-02-31.
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null;
    }

    return date;
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return new Date(
    parsedDate.getFullYear(),
    parsedDate.getMonth(),
    parsedDate.getDate(),
  );
};