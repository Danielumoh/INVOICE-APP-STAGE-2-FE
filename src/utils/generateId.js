// Generates invoice IDs like "RT3080", "XM9141"
// 2 random uppercase letters + 4 random digits
// This matches the Frontend Mentor design exactly

export function generateId() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomLetters =
    letters[Math.floor(Math.random() * 26)] +
    letters[Math.floor(Math.random() * 26)];
  const randomNumbers = Math.floor(1000 + Math.random() * 9000);
  return `${randomLetters}${randomNumbers}`;
}
