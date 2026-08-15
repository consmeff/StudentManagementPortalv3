const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

/**
 * English ordinal suffix: 1st, 2nd, 3rd, 4th … with the 11/12/13 exceptions.
 */
function ordinalSuffix(day: number): string {
  if (day % 100 >= 11 && day % 100 <= 13) {
    return 'th';
  }

  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

/**
 * Formats an ISO-8601 date as `July 21st 2026`, matching the news card design.
 *
 * Angular's `DatePipe` has no ordinal token, hence the hand-rolled version.
 * Date-only strings are parsed as local time to avoid the off-by-one day that
 * `new Date('2026-07-21')` produces in negative-offset time zones.
 *
 * @returns The formatted date, or the original string if it cannot be parsed.
 */
export function formatLongDateWithOrdinal(isoDate: string): string {
  const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  const date = dateOnlyMatch
    ? new Date(Number(dateOnlyMatch[1]), Number(dateOnlyMatch[2]) - 1, Number(dateOnlyMatch[3]))
    : new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }

  const day = date.getDate();
  return `${MONTHS[date.getMonth()]} ${day}${ordinalSuffix(day)} ${date.getFullYear()}`;
}
