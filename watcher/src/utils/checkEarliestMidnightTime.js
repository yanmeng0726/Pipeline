function checkEarliesMidnightTime(time, n) {
  let localTime = time;
  for (let i = 0; i < n; i++) {
    // pull schedules in local midnight
    if (localTime.toISOString().includes(`06:00:0${n}.`)) {
      return true;
    }
  }
  return false;
}

export default checkEarliesMidnightTime;
