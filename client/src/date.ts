export function getDate(stringDate: string) {
  const originalDate = new Date(stringDate);
  const isToday = originalDate.toDateString() === new Date().toDateString();

  const date = isToday
    ? ""
    : originalDate.toLocaleString([], { dateStyle: "medium" }) + ", ";

  const time = originalDate.toLocaleString([], {
    timeStyle: "short",
    hour12: false,
  });

  const fullDate = `${date}${time}`;
  return fullDate;
}
