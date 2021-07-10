const convertUTCToLocalTime = (date) => {
  // TODO 수정 예정.
  date.setHours(date.getHours() + 9);
  return date;
};

module.exports = { convertUTCToLocalTime };
