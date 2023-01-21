const LOWERCASE_CHARS = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBER_CHARS = "0123456789";
const SYMBOL_CHARS = "!@#$%^&*()_+-=[]{}|;':\"<>,.?/\\";

export function generatePassword(size, uppercase, numbers, symbols) {
  let chars = LOWERCASE_CHARS;
  if (uppercase) chars += UPPERCASE_CHARS;
  if (numbers) chars += NUMBER_CHARS;
  if (symbols) chars += SYMBOL_CHARS;

  let password = "";
  for (let i = 0; i < size; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }
  return password;
}