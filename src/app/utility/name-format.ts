type StructuredNameInput = {
  firstName: string | null | undefined;
  lastName: string | null | undefined;
  middleName?: string | null | undefined;
};

export function formatStructuredName({ firstName, lastName, middleName }: StructuredNameInput): string {
  const normalizedLastName = normalizeNamePart(lastName);
  const normalizedFirstName = normalizeNamePart(firstName);
  const normalizedMiddleName = normalizeNamePart(middleName);
  const givenNames = [normalizedFirstName, normalizedMiddleName].filter(Boolean).join(' ');

  return composeDisplayName(normalizedLastName, givenNames);
}

export function normalizeDisplayName(rawName: string | null | undefined): string {
  const normalizedName = normalizeNamePart(rawName);
  if (!normalizedName) {
    return '';
  }

  if (normalizedName.includes(',')) {
    const [lastNamePart, ...remainingParts] = normalizedName.split(',');
    return composeDisplayName(normalizeNamePart(lastNamePart), normalizeNamePart(remainingParts.join(' ')));
  }

  const parts = normalizedName.split(' ').filter(Boolean);
  if (parts.length <= 1) {
    return toTitleCase(normalizedName);
  }

  return composeDisplayName(parts[parts.length - 1], parts.slice(0, -1).join(' '));
}

/**
 * Portal-wide display format: surname in uppercase, then the given names.
 * e.g. "ISHOLA, Hassan Gbadebo"
 */
function composeDisplayName(lastName: string, givenNames: string): string {
  const surname = lastName.toUpperCase();
  const otherNames = toTitleCase(givenNames);

  if (!surname) {
    return otherNames;
  }

  return otherNames ? `${surname}, ${otherNames}` : surname;
}

function toTitleCase(value: string): string {
  return value
    .toLowerCase()
    .replace(/(^|[\s\-'’.])(\p{L})/gu, (_match, separator: string, letter: string) => separator + letter.toUpperCase());
}

function normalizeNamePart(value: string | null | undefined): string {
  return (value ?? '').trim().replace(/\s+/g, ' ');
}
