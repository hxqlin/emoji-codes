export const isWhitespace = (string) => {
  const whitespaceRegex = /[\s\uFEFF\xA0]/;
  return whitespaceRegex.test(string);
};
