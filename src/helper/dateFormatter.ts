export function dateFormater(date: Date) {
  if (!date) return "-";
  return date.toLocaleString("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  });
}
