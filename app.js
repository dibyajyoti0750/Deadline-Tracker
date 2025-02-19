let start = document.querySelector("#start");
let end = document.querySelector("#end");
let trackingMsg = document.querySelector(".tracking-msg");
let errorMsg = document.querySelector(".error-msg");
let daysOver = document.querySelector(".days-over");
let daysRemaining = document.querySelector(".days-remaining");

let dotsWrapper = document.querySelector(".dots-wrapper");

let progressBar = document.querySelector(".progress-bar");

let startDate;
let endDate;

start.addEventListener("change", function () {
  startDate = new Date(this.value);
  localStorage.setItem("startDate", this.value);
  calculateDays();
});

end.addEventListener("change", function () {
  endDate = new Date(this.value);
  endDate.setHours(23, 59, 59, 999);
  localStorage.setItem("endDate", this.value);
  calculateDays();
});

window.addEventListener("DOMContentLoaded", function () {
  const savedStartDate = localStorage.getItem("startDate");
  const savedEndDate = localStorage.getItem("endDate");

  if (savedStartDate && savedEndDate) {
    start.value = savedStartDate;
    end.value = savedEndDate;

    startDate = new Date(savedStartDate);
    endDate = new Date(savedEndDate);
    endDate.setHours(23, 59, 59, 999);

    calculateDays();
  }
});

function calculateDays() {
  if (startDate && endDate) {
    const now = new Date();

    // Days passed since the startDate
    const daysPassed = Math.max(
      0,
      Math.floor((now - startDate) / (1000 * 60 * 60 * 24))
    );

    // Days left until the endDate
    const daysLeft = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));

    // Total days from startDate to endDate
    const timeDifference = endDate - startDate;
    const daysBetween = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    if (daysBetween < 0) {
      errorMsg.innerHTML = "End date should be after start date!";
      daysOver.innerText = "-";
      daysRemaining.innerText = "-";
      return;
    }

    daysOver.innerText = daysPassed;
    daysRemaining.innerText = daysLeft;
    trackingMsg.innerText = daysBetween;

    // Clearing existing dots to prevent duplication
    dotsWrapper.innerHTML = "";

    for (let i = 1; i <= daysBetween; i++) {
      generateDots();
    }

    changeColor(daysPassed);

    updatePercentage(daysPassed, daysBetween);
  }
}

function generateDots() {
  let dot = document.createElement("div");
  dot.classList.add("dot");
  dotsWrapper.appendChild(dot);
}

function changeColor(daysPassed) {
  let dots = document.querySelectorAll(".dot");

  for (let i = 0; i < daysPassed; i++) {
    dots[i].classList.add("black-bg");
  }
}

function updatePercentage(part, whole) {
  if (whole === 0) {
    progressBar.setAttribute("style", `width: 100%`);
    progressBar.innerHTML = `100%`;
    return;
  }

  let percentage = Math.round((part / whole) * 100);
  progressBar.setAttribute("style", `width: ${percentage}%`);
  progressBar.innerHTML = `${percentage}%`;
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then(() => console.log("Service Worker Registered"));
  });
}

let deferredPrompt;

window.addEventListener("beforeinstallprompt", (event) => {
  // Prevent the default prompt
  event.preventDefault();
  // Save the event for later use
  deferredPrompt = event;

  // Check if the install button exists in the DOM
  const installButton = document.getElementById("install-button");
  if (installButton) {
    installButton.style.display = "block";

    installButton.addEventListener("click", () => {
      // Show the prompt
      deferredPrompt.prompt();

      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the A2HS prompt");
        } else {
          console.log("User dismissed the A2HS prompt");
        }
        deferredPrompt = null;
      });
    });
  }
});
