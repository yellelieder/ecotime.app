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

  const geoButton = document.createElement("button");
  geoButton.innerText = "Allow location access";
  geoButton.id = "fallback-button";

  const explanation = document.getElementById("explanation");
  explanation.appendChild(geoButton);

  geoButton.addEventListener("click", async () => {
    try {
      navigator.geolocation.getCurrentPosition(success, error, options);
    } catch (err) {
      showFallback();
      console.error(err);
    }
  });
});
function updateScale({ min, max, intensity, country }) {
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

  explanation.innerHTML = `<code>${country}s</code> current carbon intensity is <code>${intensity} gCO2e/kWh</code>, which is ${conclusion}. 
  For the last 24h,  the best-case was ${Math.round(
    min
  )} and the worst-case ${Math.round(max)} gCO2e/kWh.`;

  document.getElementById("scale-container").appendChild(intensityIndicator);
}

function showFallback() {
  const explanation = document.getElementById("explanation");
  explanation.innerHTML =
    "This service requires your browser's location to function. Please <code>allow location access</code> in your browser settings and refresh the page.";

  const instructions = document.createElement("p");
  instructions.innerHTML =
    "To enable location tracking:<br>1. Open your browser settings.<br>2. Navigate to the Privacy or Location section.<br>3. Enable location access for this website.<br>4. Refresh the page.<br><br> Or select your country from the drop-down:";

  explanation.appendChild(instructions);
  createCountryDropdown();
}

function createCountryDropdown() {
  const explanation = document.getElementById("explanation");

  const select = document.createElement("select");
  select.id = "country-select";
  select.innerHTML = "<option value=''>Select your location</option>";

  const countries = [
    { name: "Austria", lat: 47.5162, lon: 14.5501 },
    { name: "Belgium", lat: 50.8503, lon: 4.3517 },
    { name: "Czech Republic", lat: 49.8175, lon: 15.4724 },
    { name: "Denmark", lat: 56.2639, lon: 9.5018 },
    { name: "Estonia", lat: 58.5953, lon: 25.0136 },
    { name: "Finland", lat: 61.9241, lon: 25.7482 },
    { name: "France", lat: 46.6034, lon: 1.8883 },
    { name: "Germany", lat: 51.1657, lon: 10.4515 },
    { name: "Greece", lat: 39.0742, lon: 21.8243 },
    { name: "Hungary", lat: 47.1625, lon: 19.5033 },
    { name: "Ireland", lat: 53.1424, lon: -7.6921 },
    { name: "Italy", lat: 41.8719, lon: 12.5675 },
    { name: "Latvia", lat: 56.8796, lon: 24.6032 },
    { name: "Lithuania", lat: 55.1694, lon: 23.8813 },
    { name: "Netherlands", lat: 52.1326, lon: 5.2913 },
    { name: "Poland", lat: 51.9194, lon: 19.1451 },
    { name: "Portugal", lat: 38.7223, lon: -9.1393 },
    { name: "Spain", lat: 40.4637, lon: -3.7492 },
    { name: "Sweden", lat: 60.1282, lon: 18.6435 },
  ];
  for (const country of countries) {
    const option = document.createElement("option");
    option.value = JSON.stringify(country);
    option.text = country.name;
    select.appendChild(option);
  }

  select.addEventListener("change", async (event) => {
    const country = JSON.parse(event.target.value);
    if (country) {
      const response = await fetch(
        `https://yel.li/ecotime/?lat=${country.lat}&lon=${country.lon}`
      );
      const data = await response.json();
      updateScale(data);
    }
  });

  explanation.appendChild(select);

  const explanationText = document.createElement("p");
  explanationText.innerText =
    "Dropdown selection is less accurate, as energy grids are segmented in many countries. Therefore the CO2 intensity is not the same everywhere in many countries. It is therefore recommended to use the geo-localization of the browser, as it is much more precise based on exact coordinates. Usually, consent to share location has to be given only once.";
  explanation.appendChild(explanationText);
}
