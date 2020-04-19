export const isWhitespace = (string) => {
  return string.match(/[\s\uFEFF\xA0]/) !== null;
};
