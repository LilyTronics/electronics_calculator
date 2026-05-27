/* Logger function */

const DEBUG = true;

function formatDateTime(date)
{
  const pad = (n, size = 2) => n.toString().padStart(size, "0");
  return `${date.getFullYear()}-`
       + `${pad(date.getMonth() + 1)}-`
       + `${pad(date.getDate())} `
       + `${pad(date.getHours())}:`
       + `${pad(date.getMinutes())}:`
       + `${pad(date.getSeconds())}.`
       + `${pad(date.getMilliseconds(), 3)}`;
}

// Debug log function if debug is enabled
export const debugLog = DEBUG ? (...args) => console.log(formatDateTime(new Date()), ...args) : () => {};
