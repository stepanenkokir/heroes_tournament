const ARTICLES = new Set(["a", "an", "the", "of", "el", "la", "los", "las", "de", "del"]);

const VOWELS = new Set("aeiouyаеёиоуыэюя");

function fold(char: string): string {
  return char.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

function isVowel(char: string): boolean {
  return VOWELS.has(fold(char));
}

function letters(token: string): string {
  return [...token].filter((char) => /\p{L}/u.test(char)).join("");
}

/** Initials of the name as shown: two words, or one word skipping the first vowel. */
export function heroMonogram(name: string): string {
  const words = name
    .trim()
    .split(/[\s-]+/)
    .flatMap((token) => token.split(/['’]/).map(letters).filter((part) => part.length > 0))
    .filter((word) => !ARTICLES.has(fold(word)));

  const firstWord = words[0];
  if (!firstWord) {
    return "";
  }

  const secondWord = words[1];
  if (secondWord) {
    return (firstWord[0]! + secondWord[0]!).toUpperCase();
  }

  const chars = [...firstWord];
  const first = chars[0]!;
  const second = chars.slice(1).find((char) => !isVowel(char)) ?? chars[1] ?? first;
  return (first + second).toUpperCase();
}
