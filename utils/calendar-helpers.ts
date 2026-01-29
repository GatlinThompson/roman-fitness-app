export function isSameDay(date1: Date, date2: Date | null): boolean {
  if (!date2) return false;
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

export function isToday(date: Date | null): boolean {
  if (!date) return false;
  return isSameDay(new Date(), date);
}

export function getDaysInMonth(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const days = [];

  // Previous month days
  const prevMonthLastDay = new Date(year, month, 0);
  const prevMonthDays = prevMonthLastDay.getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, month - 1, prevMonthDays - i),
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    days.push({
      date: new Date(year, month, day),
      isCurrentMonth: true,
    });
  }

  // Check if we need 6 weeks (42 days) or 5 weeks (35 days)
  // If current month days extend beyond 35 cells, fill to 42
  const needsSixWeeks = days.length > 35;
  const totalCells = needsSixWeeks ? 42 : 35;

  // Next month days
  let nextMonthDay = 1;
  while (days.length < totalCells) {
    days.push({
      date: new Date(year, month + 1, nextMonthDay),
      isCurrentMonth: false,
    });
    nextMonthDay++;
  }

  return days;
}

export function getAdjacentMonths(currentMonth: Date) {
  return {
    previous: new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1,
    ),
    current: currentMonth,
    next: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
  };
}
