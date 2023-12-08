import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import weekOfYear from "dayjs/plugin/weekOfYear";
dayjs.extend(duration);
dayjs.extend(weekOfYear);
export function timeDuration(time: number) {
  const d = dayjs.duration(time, "milliseconds");
  const f =
    time < 10 * 1000
      ? "s 秒"
      : time < 60 * 1000
      ? "ss 秒"
      : time < 10 * 60 * 1000
      ? "m 分 ss 秒"
      : time < 60 * 60 * 1000
      ? "mm 分 ss 秒"
      : "hh 小时 mm 分 ss 秒";
  return d.format(f);
}

export type Filter = "day" | "week" | "month" | "year" | "alltime";

export function deteRangeByFilter(filter: unknown) {
  let dateRange;
  switch (filter) {
    case "day":
      dateRange = [
        dayjs().startOf("day").format(),
        dayjs().endOf("day").format(),
      ];
      break;
    case "week":
      dateRange = [
        dayjs().startOf("week").format(),
        dayjs().endOf("week").format(),
      ];
      break;

    case "month":
      dateRange = [
        dayjs().startOf("month").format(),
        dayjs().endOf("month").format(),
      ];
      break;
    case "year":
      dateRange = [
        dayjs().startOf("year").format(),
        dayjs().endOf("year").format(),
      ];
      break;
    default:
      break;
  }
  return dateRange;
}

export function getDateRange(filter: unknown) {
  let dateRange;
  switch (filter) {
    case "day":
      dateRange = [
        dayjs().startOf("day").format("YYYY-MM-DD HH:00:00"),
        dayjs().endOf("day").format("YYYY-MM-DD HH:00:00"),
      ];
      break;
    case "week":
      dateRange = [
        dayjs().startOf("week").format("YYYY-MM-DD HH:00:00"),
        dayjs().endOf("week").format("YYYY-MM-DD HH:00:00"),
      ];
      break;

    case "month":
      dateRange = [
        dayjs().startOf("month").format("YYYY-MM-DD HH:00:00"),
        dayjs().endOf("month").format("YYYY-MM-DD HH:00:00"),
      ];
      break;
    case "year":
      dateRange = [
        dayjs().startOf("year").format("YYYY-MM-DD HH:00:00"),
        dayjs().endOf("year").format("YYYY-MM-DD HH:00:00"),
      ];
      break;
    default:
      break;
  }
  return dateRange;
}

export { dayjs };
