const formatDateLocal = (date: Date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;
};

const getTodayString = () => {
  const today = new Date();
  return formatDateLocal(today);
};
export default getTodayString;

export const getDateString = (date: Date | string) => {
  if (date instanceof Date) {
    return formatDateLocal(date);
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }

  const dateObj = new Date(date);
  if (Number.isNaN(dateObj.getTime())) {
    return date;
  }

  return formatDateLocal(dateObj);
};
