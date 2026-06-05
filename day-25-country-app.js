const loading = document.getElementById("loading");
const error = document.getElementById("error");
const noResults = document.getElementById("noResults");
const container = document.getElementById("countryContainer");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");

function clearStates() {
  error.textContent = "";
  noResults.textContent = "";
  container.innerHTML = "";
}

function renderCountry(country) {
  clearStates();

  if (!country) {
    noResults.textContent = "No country found";
    return;
  }

  const card = document.createElement("div");
  card.classList.add("country-card");

  card.innerHTML = `
    <img src="${country.flags.png}" alt="Flag of ${country.name.common}" />
    <h2>${country.name.common}</h2>
    <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
    <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
    <p><strong>Region:</strong> ${country.region}</p>
  `;

  container.appendChild(card);
}

async function fetchCountry(query) {
  clearStates();
  loading.textContent = "Loading...";
  searchBtn.disabled = true;

  try {
    const res = await fetch(`https://restcountries.com/v3.1/name/${query}`);

    if (res.status === 404) {
      loading.textContent = "";
      searchBtn.disabled = false;
      noResults.textContent = "Country not found";
      return;
    }

    if (!res.ok) {
      throw new Error("Network error");
    }

    const data = await res.json();

    loading.textContent = "";
    searchBtn.disabled = false;

    if (!data || data.length === 0) {
      noResults.textContent = "Country not found";
      return;
    }

    renderCountry(data[0]);

  } catch (err) {
    loading.textContent = "";
    searchBtn.disabled = false;
    error.textContent = "Something went wrong";
  }
}

searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();

  if (!query) {
    error.textContent = "Please enter a country name";
    return;
  }

  fetchCountry(query);
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});
