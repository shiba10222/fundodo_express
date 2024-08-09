const diceOf = n => Math.floor(Math.random() * n);

const time = new Date("2024-08-04T20:00:00");

const d_min = diceOf(8) + 2;
const d_sec = diceOf(30) + 25;
time.setMinutes(time.getMinutes() + d_min);
time.setSeconds(time.getSeconds() + d_sec);


console.log(time);