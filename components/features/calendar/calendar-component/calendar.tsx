import { StyleSheet, View } from "react-native";
import CalendarGrid from "../calendar-component/calendar-grid";

//month
//days
//events down the road

type CalendarProps = {
  //props to come
  month: Date;
  days?: Array<string>;
  events?: Array<any>;
};

export default function Calendar({ month, days, events }: CalendarProps) {
  return (
    <View style={styles.container}>
      <CalendarGrid month={month} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});
