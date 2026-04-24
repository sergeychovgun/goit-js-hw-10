
import flatpickr from "flatpickr";

import "flatpickr/dist/flatpickr.min.css";


import iziToast from "izitoast";

import "izitoast/dist/css/iziToast.min.css";


let userSelectedDate = null;
let timerId = null;

const startBtn = document.querySelector("[data-start]");
const input = document.querySelector("#datetime-picker");

const daysEl = document.querySelector("[data-days]");
const hoursEl = document.querySelector("[data-hours]");
const minutesEl = document.querySelector("[data-minutes]");
const secondsEl = document.querySelector("[data-seconds]");

startBtn.disabled = true;

flatpickr(input, {
  enableTime: true,
  time_24hr: true,
  defaultDate: Date.now(),
  minuteIncrement: 1,

  onClose(selectedDates) {
    const chosenDate = selectedDates[0];
    const now = Date.now();

    if (chosenDate <= now) {
      startBtn.disabled = true;

      iziToast.error({
        title: "Error",
        message: "Please choose a date in the future",
        position: "topRight",
      });

      return;
    }

    userSelectedDate = chosenDate;
    startBtn.disabled = false;
  },
});


startBtn.addEventListener("click", () => {
  startBtn.disabled = true;
  input.disabled = true;

  timerId = setInterval(() => {
    const now = Date.now();
    const diff = userSelectedDate - now;

    if (diff <= 0) {
      clearInterval(timerId);
      updateTimer(0);

      input.disabled = false;
      return;
    }

    updateTimer(diff);
  }, 1000);
});

function updateTimer(ms) {
  const { days, hours, minutes, seconds } = convertMs(ms);

  daysEl.textContent = addLeadingZero(days);
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}


function addLeadingZero(value) {
  return String(value).padStart(2, "0");
}


function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor((ms % hour) / minute);
  const seconds = Math.floor((ms % minute) / second);

  return { days, hours, minutes, seconds };
}