// Convert seconds to readable time format (mm:ss)
export const convertSecondsToTime = (seconds: string): string => {
  console.log(seconds);

  const parsedSeconds = parseInt(seconds, 10);
  console.log(parsedSeconds);

  if (!seconds || parsedSeconds <= 0) return "0:00";

  const minutes = Math.floor(parsedSeconds / 60);
  const remainingSeconds = parsedSeconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};
