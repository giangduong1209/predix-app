export const replaceDotToComma = (text: string) => {
  return text.replace(".", ",");
};

export const toFixedEtherNumber = (num: string | number, toFixed: number) => {
  return Number(Number(num).toFixed(toFixed)).toLocaleString("en-US");
};
