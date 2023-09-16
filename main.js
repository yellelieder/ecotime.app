document.addEventListener("DOMContentLoaded", async () => {
  const options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
  };

  const success = async (pos) => {
    const { latitude: lat, longitude: lon } = pos.coords;
    const response = await fetch(
      `https://yel.li/ecotime/?lat=${lat}&lon=${lon}`
    );
    const data = await response.json();
    updateScale(data);
  };

  const error = (err) => {
    showFallback();
    console.error(err);
  };

  try {
    navigator.geolocation.getCurrentPosition(success, error, options);
  } catch (err) {
    showFallback();
    console.error(err);
  }
});

function updateScale({ min, max, intensity }) {
  document.getElementById("min").innerText = Math.round(min);
  document.getElementById("max").innerText = Math.round(max);

  const quarterPoint = Math.round(
    Number(min) + (Number(max) - Number(min)) / 4
  );
  const threeQuarterPoint = Math.round(
    Number(min) + (3 * (Number(max) - Number(min))) / 4
  );

  document.getElementById("mid1").innerText = quarterPoint;
  document.getElementById("mid2").innerText = threeQuarterPoint;

  const intensityIndicator = document.createElement("div");
  intensityIndicator.id = "current-intensity";
  intensityIndicator.innerHTML = `${intensity}`;

  const oldIntensityIndicator = document.getElementById("current-intensity");
  if (oldIntensityIndicator) {
    oldIntensityIndicator.remove();
  }

  const scaleFactor = 100 / (max - min);
  const intensityPos = (intensity - min) * scaleFactor;
  intensityIndicator.style.left = `calc(${intensityPos}% - 20px)`;

  const explanation = document.getElementById("explanation");

  let conclusion = "";
  if (intensity <= quarterPoint) {
    conclusion = "<code>low</code>";
  } else if (intensity <= threeQuarterPoint && intensity > quarterPoint) {
    conclusion = "<code>somewhat low</code>";
  } else if (intensity <= max && intensity > threeQuarterPoint) {
    conclusion = "<code>very high</code>";
  } else {
    conclusion = "<code>high</code>";
  }

  explanation.innerHTML = `Current carbon intensity for your region is <code>${intensity} gCO2/kWh</code>, which is ${conclusion}. For the last 24h, the worst-case was ${Math.round(
    max
  )} gCO2/kWh and the best-case ${Math.round(min)} gCO2/kWh.`;

  document.getElementById("scale-container").appendChild(intensityIndicator);
}

function showFallback() {
  const explanation = document.getElementById("explanation");
  explanation.innerHTML =
    "This service requires your browser's location to function. Please <code>allow location access</code> in your browser settings and refresh the page.";

  const instructions = document.createElement("p");
  instructions.innerHTML =
    "To enable location tracking:<br>1. Open your browser settings.<br>2. Navigate to the Privacy or Location section.<br>3. Enable location access for this website.<br>4. Refresh the page.";

  explanation.appendChild(instructions);
}


