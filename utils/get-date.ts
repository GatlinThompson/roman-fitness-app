export const getDate = (dateStr: string | undefined | null) => {
  if (!dateStr) {
    return "";
  }
  const [year, month, day] = dateStr.split(/[-/]/).map(Number);
  const dateObj = new Date(year, month - 1, day);
  return dateObj.toLocaleString("default", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const getWeekDay = (dateStr: string | undefined | null) => {
  if (!dateStr) {
    return "";
  }
  const [year, month, day] = dateStr.split(/[-/]/).map(Number);
  const dateObj = new Date(year, month - 1, day);
  return dateObj.toLocaleString("default", {
    weekday: "long",
  });
};
