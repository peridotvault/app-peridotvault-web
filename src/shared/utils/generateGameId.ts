/**
 * Generate a unique 8-character alphanumeric game ID
 * @returns A unique 8-character uppercase string
 */
export function generateGameId(): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";

  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
}
