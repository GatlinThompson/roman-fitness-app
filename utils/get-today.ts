const getTodayString = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(
    today.getDate(),
  ).padStart(2, "0")}`;
};
export default getTodayString;

export const getDateString = (date: Date | string) => {
  const dateObj = new Date(date);
  return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}-${String(
    dateObj.getDate(),
  ).padStart(2, "0")}`;
};
