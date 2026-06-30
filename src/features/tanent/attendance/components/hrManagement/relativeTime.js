import { formatDistanceToNowStrict } from "date-fns";

export function relativeTime(isoString) {
  if (!isoString) return "--";
  try {
    return formatDistanceToNowStrict(new Date(isoString), { addSuffix: true });
  } catch {
    return "--";
  }
}
