export const addHoursHelper = (date: Date, hour: number): Date => {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours() + hour,
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds()
  )
}
