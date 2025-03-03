export function packageExists(name: string) {
  try {
    require.resolve(name);
    return true;
  } catch {
    return false;
  }
}
