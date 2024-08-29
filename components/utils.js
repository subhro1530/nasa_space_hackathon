// utils.js
export const toSeconds = (value, unit) => {
  const unitsInSeconds = {
    days: 86400, // seconds in a day
    years: 31557600, // seconds in a year
  };
  return value * unitsInSeconds[unit];
};
