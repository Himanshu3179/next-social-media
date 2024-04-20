import TimeAgo from "javascript-time-ago";

// English.
import en from "javascript-time-ago/locale/en";

TimeAgo.addDefaultLocale(en);

// Create formatter (English).
const timeAgo = new TimeAgo("en-US");

export function formatTimeAgo(date: Date | number | string) {
  return timeAgo.format(new Date(date));
}

export default timeAgo;
