export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isValidPhone(value: string): boolean {
  const compact = value.replace(/[\s.-]/g, '');
  return /^0\d{9}$/.test(compact) || /^\+84\d{9}$/.test(compact);
}
