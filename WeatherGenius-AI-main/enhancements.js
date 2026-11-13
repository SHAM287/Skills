(function () {
  "use strict";

  const shareButton = document.createElement("button");
  shareButton.id = "share-weather-btn";
  shareButton.className = "action-btn share-weather-btn";
  shareButton.type = "button";
  shareButton.innerHTML = '<i class="fa-solid fa-arrow-up-from-bracket" aria-hidden="true"></i><span>Share weather</span>';
  shareButton.setAttribute("aria-label", "Share or copy the current weather");
  shareButton.title = "Share or copy the current weather";

  const locationButton = document.getElementById("location-btn");
  if (locationButton) locationButton.insertAdjacentElement("afterend", shareButton);

  const status = document.getElementById("share-status");
  let statusTimer;

  function announce(message) {
    if (!status) return;
    status.textContent = message;
    window.clearTimeout(statusTimer);
    statusTimer = window.setTimeout(() => { status.textContent = ""; }, 3500);
  }

  function getWeatherSummary() {
    const city = document.getElementById("city-name")?.textContent?.trim();
    const country = document.getElementById("country-name")?.textContent?.trim();
    const temperature = document.getElementById("main-temp")?.textContent?.trim();
    const condition = document.getElementById("weather-condition")?.textContent?.trim();
    const feelsLike = document.getElementById("feels-like")?.textContent?.trim();
    const humidity = document.getElementById("humidity")?.textContent?.trim();
    const wind = document.getElementById("wind-speed")?.textContent?.trim();

    if (!city || !temperature || temperature.startsWith("--")) return null;

    const place = [city, country].filter(Boolean).join(", ");
    return `Weather in ${place}\n${temperature} • ${condition || ""}\nFeels like ${feelsLike || "--"} | Humidity ${humidity || "--"} | Wind ${wind || "--"}\n${window.location.href}`;
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    const copied = document.execCommand("copy");
    field.remove();
    if (!copied) throw new Error("Copy unavailable");
  }

  shareButton.addEventListener("click", async function () {
    const text = getWeatherSummary();
    if (!text) {
      announce("Load a city's weather before sharing.");
      return;
    }

    const city = document.getElementById("city-name")?.textContent?.trim() || "the weather";
    const shareData = { title: `Weather in ${city}`, text };

    try {
      if (navigator.share && (!navigator.canShare || navigator.canShare(shareData))) {
        await navigator.share(shareData);
        announce("Weather shared.");
      } else {
        await copyText(text);
        announce("Weather details copied to clipboard.");
      }
    } catch (error) {
      if (error?.name === "AbortError") return;
      try {
        await copyText(text);
        announce("Weather details copied to clipboard.");
      } catch {
        announce("Unable to share right now. Please try again.");
      }
    }
  });
})();
