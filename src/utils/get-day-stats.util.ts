/**
 * Returns current day info in russian text.
 */
export const getDayStats = () => {
  const timeNow = new Date();
  return {
    dayOfWeek: daysOfWeek[timeNow.getDay()],
    timeOfDay: hourToTime[timeNow.getHours()],
  }
};

const daysOfWeek = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
const hourToTime: {[key in number]: string} = {
  0: 'полночь',
  1: 'полночь',
  2: 'ночь',
  3: 'ночь',
  4: 'ночь',
  5: 'утро',
  6: 'утро',
  7: 'утро',
  8: 'утро',
  9: 'утро',
  10: 'утро',
  11: 'день',
  12: 'день',
  13: 'день',
  14: 'день',
  15: 'день',
  16: 'день',
  17: 'вечер',
  18: 'вечер',
  19: 'вечер',
  20: 'вечер',
  21: 'вечер',
  22: 'ночь',
  23: 'ночь',
}