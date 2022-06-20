export default (num: number) => {
  const lookup = [
    { value: 1e-2, symbol: "" },
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "B" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;

  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return Math.abs(num) >= item.value;
    });
  if (item) {
    if (item.symbol === "")
      return (num).toFixed(1).replace(rx, "$1");

    return (num / item.value).toFixed(1).replace(rx, "$1") + item.symbol;
  } else return 0;
};
