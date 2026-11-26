const LOWERCASE_CHARS = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBER_CHARS = "0123456789";
const SYMBOL_CHARS = "!@#$%^&*()_+-=[]{}|;':\"<>,.?/\\";

export function generatePassword(size, uppercase, numbers, symbols) {
  let chars = LOWERCASE_CHARS;
  if (uppercase) chars += UPPERCASE_CHARS;
  if (numbers) chars += NUMBER_CHARS;
  if (symbols) chars += SYMBOL_CHARS;

  const sample = new Uint32Array(1);
  const limit = 2 ** 32 - (2 ** 32 % chars.length);
  let password = "";
  for (let i = 0; i < size; i++) {
    do {
      crypto.getRandomValues(sample);
    } while (sample[0] >= limit);
    password += chars[sample[0] % chars.length];
  }
  return password;
}