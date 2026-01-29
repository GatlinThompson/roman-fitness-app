import React, { createContext, ReactNode, useContext, useState } from "react";

type CalendarContextType = {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
  goToToday: () => void;
  isToday: (date: Date | null) => boolean;
  isSameDay: (date1: Date, date2: Date | null) => boolean;
};

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined,
);

type CalendarProviderProps = {
  children: ReactNode;
};

export function CalendarProvider({ children }: CalendarProviderProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  };

  const goToToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setCurrentMonth(today);
  };

  const isSameDay = (date1: Date, date2: Date | null) => {
    if (!date2) return false;
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    return isSameDay(new Date(), date);
  };

  return (
    <CalendarContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        currentMonth,
        setCurrentMonth,
        goToPreviousMonth,
        goToNextMonth,
        goToToday,
        isToday,
        isSameDay,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }
  return context;
}
