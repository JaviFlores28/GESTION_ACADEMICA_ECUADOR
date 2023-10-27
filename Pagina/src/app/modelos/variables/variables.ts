export const variables = {
  KEY_NAME: 'USER', //no cambiar cifra todo el contenido de acceso
  URL_API: 'http://localhost:3000/api'
};

export function getFormattedToday() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const monthString = month < 10 ? `0${month}` : `${month}`;
  const dayString = day < 10 ? `0${day}` : `${day}`;
  return `${year}-${monthString}-${dayString}`;
}

export function getFormattedDate(date: Date): string {
  date = new Date(date)
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const monthString = month < 10 ? `0${month}` : `${month}`;
  const dayString = day < 10 ? `0${day}` : `${day}`;
  return `${year}-${monthString}-${dayString}`;
}