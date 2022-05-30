export function env(key: string): string {
  const value = process.env[key];
  if (value === undefined) {
    // eslint-disable-next-line no-throw-literal
    throw `${key} is undefined`;
  }
  return value;
}
