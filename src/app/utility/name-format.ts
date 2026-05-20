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

  if (!normalizedLastName) {
    return givenNames;
  }

  return givenNames ? `${normalizedLastName}, ${givenNames}` : normalizedLastName;
}

export function normalizeDisplayName(rawName: string | null | undefined): string {
  const normalizedName = normalizeNamePart(rawName);
  if (!normalizedName) {
    return '';
  }

  if (normalizedName.includes(',')) {
    const [lastNamePart, ...remainingParts] = normalizedName.split(',');
    const normalizedLastName = normalizeNamePart(lastNamePart);
    const givenNames = normalizeNamePart(remainingParts.join(' '));
    return givenNames ? `${normalizedLastName}, ${givenNames}` : normalizedLastName;
  }

  const parts = normalizedName.split(' ').filter(Boolean);
  if (parts.length <= 1) {
    return normalizedName;
  }

  const lastName = parts[parts.length - 1];
  const givenNames = parts.slice(0, -1).join(' ');
  return `${lastName}, ${givenNames}`;
}

function normalizeNamePart(value: string | null | undefined): string {
  return (value ?? '').trim().replace(/\s+/g, ' ');
}
