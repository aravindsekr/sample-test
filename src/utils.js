export const checkDateDiff = (date1, date2) => {
  const t2 = new Date(date2).getTime();
  const t1 = new Date(date1).getTime();
  return parseInt((t2 - t1) / (24 * 3600 * 1000), 10);
};

export const checkDateDiffisOne = (date1, date2) => {
  return checkDateDiff(date1, date2) === 1;
};
