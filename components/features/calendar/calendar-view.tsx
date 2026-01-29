import { useCalendar } from "@/contexts/calendar-context";
import { useCalendarSwipe } from "@/hooks/use-calendar-swipe";
import {
  getAdjacentMonths,
  getDaysInMonth,
  isSameDay,
  isToday,
} from "@/utils/calendar-helpers";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import CalendarDayGrid from "./calendar-day-grid";
import CalendarDayLabels from "./calendar-day-labels";
import CalendarMonthHeader from "./calendar-month-header";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CALENDAR_WIDTH = SCREEN_WIDTH - 32;

export default function CalendarView() {
  const { selectedDate, setSelectedDate, currentMonth, setCurrentMonth } =
    useCalendar();

  const handleMonthChange = (newMonth: Date) => {
    setCurrentMonth(newMonth);

    // Check if today is in the new month
    const today = new Date();
    const isTodayInNewMonth =
      today.getMonth() === newMonth.getMonth() &&
      today.getFullYear() === newMonth.getFullYear();

    // Select today if it's in the new month, otherwise select first day
    if (isTodayInNewMonth) {
      setSelectedDate(
        new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      );
    } else {
      setSelectedDate(newMonth);
    }
  };

  const { panResponder, animatedStyle, handlePrevMonth, handleNextMonth } =
    useCalendarSwipe(currentMonth, handleMonthChange);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    if (
      date.getMonth() !== currentMonth.getMonth() ||
      date.getFullYear() !== currentMonth.getFullYear()
    ) {
      setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    }
  };

  const months = getAdjacentMonths(currentMonth);
  const monthGrids = [
    getDaysInMonth(months.previous),
    getDaysInMonth(months.current),
    getDaysInMonth(months.next),
  ];

  return (
    <View style={styles.container}>
      <CalendarMonthHeader
        currentMonth={currentMonth}
        goToPreviousMonth={handlePrevMonth}
        goToNextMonth={handleNextMonth}
      />

      <CalendarDayLabels />

      <View style={styles.carouselContainer}>
        <Animated.View
          style={[styles.carousel, animatedStyle]}
          {...panResponder.panHandlers}
        >
          {monthGrids.map((days, index) => (
            <View key={index} style={styles.monthContainer}>
              <CalendarDayGrid
                days={days}
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                isSameDay={isSameDay}
                isToday={isToday}
              />
            </View>
          ))}
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  carouselContainer: {
    overflow: "hidden",
  },
  carousel: {
    flexDirection: "row",
    width: CALENDAR_WIDTH * 3,
    marginLeft: -CALENDAR_WIDTH,
  },
  monthContainer: {
    width: CALENDAR_WIDTH,
  },
});
