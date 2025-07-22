// backend/utils/sanitize.js
export const sanitize = (str) => str.replace(/[^a-z0-9\-_]/gi, "_");