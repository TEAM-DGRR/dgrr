export const parseDate = (date: string) => {
  const dateArray = date.split(/-|T|:|\.|(?<=\.\d{3})\B/g) as unknown as Array<number>;
  console.log(dateArray);
  return new Date(
    dateArray[0],
    dateArray[1] - 1,
    dateArray[2],
    dateArray[3],
    dateArray[4],
    dateArray[5],
    dateArray[6] / 1000000
  );
};

export const timeRemaining = (date: string) => {
  const time = 3000 - (new Date().getTime() - parseDate(date).getTime());
  console.log("남은 시간 : " + time);
  return time;
};
