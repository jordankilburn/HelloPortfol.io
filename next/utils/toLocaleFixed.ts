export default (input: number, n = 2) => {
  if (input)
    return input.toLocaleString(undefined, {
      minimumFractionDigits: n,
      maximumFractionDigits: n,
    });
  else return 0;
};
