const capitalizeString = (str) => {
  return str.split('')
    .map((letter, index) => {
      return index === 0 ? letter.toUpperCase() : letter;
    })
    .join('');
};

const transformStringToCamelCase = (str, strPartsSeparator = '-') => {
  const words = str.split(strPartsSeparator);
  const [firstWord, ...restWords] = words;

  const capitalizedWords = restWords
    .map(capitalizeString)
    .join('');

  return `${firstWord}${capitalizedWords}`;
};

module.exports = transformStringToCamelCase;
