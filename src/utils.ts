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

type Interval = "min" | "hour" | "day" | "week" | "month";

export function intervalTime(time: dayjs.ConfigType, interval: Interval) {
  switch (interval) {
    case "min":
      return dayjs(time).format("YYYY-MM-DD HH:mm");
    case "hour":
      return dayjs(time).format("YYYY-MM-DD HH");
    case "day":
      return dayjs(time).format("YYYY-MM-DD");
    case "week":
      return dayjs(time).week();
    default:
      return dayjs(time).format("YYYY-MM-DD HH:mm:ss");
  }
}

export { dayjs };
