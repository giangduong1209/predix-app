/**
 * * format input only number
 * @param event InputHTML
 * @returns
 */
export const formatInputField = (event: any) => {
  const digitPeriodRegExp = new RegExp("\\d|\\.");
  if (
    event.ctrlKey || // (A)
    event.altKey || // (A)
    typeof event.key !== "string" || // (B)
    event.key.length !== 1
  ) {
    // (C)
    return;
  }

  if (!digitPeriodRegExp.test(event.key)) {
    console.log(1);
    event.preventDefault();
  }
};
