let worldData, covidData;
let allDates = [];
let currentIndicator = "cases";
let isShowingAll = true;

const dateSlider = d3.select("#dateSlider");
const currentDateText = d3.select("#currentDate");
const currentIndicatorLabel = d3.select("#currentIndicatorLabel");

const toggleButton = d3.select("#toggleButton");
const casesOption = d3.select("#casesOption");
const deathsOption = d3.select("#deathsOption");

const resetButton = d3.select("#resetButton");

const countrySearch = d3.select("#countrySearch");
const searchResults = d3.select("#searchResults");

let countryNameByCode = {};

function buildSearchIndex() {
  countryNameByCode = {};
  worldData.features.forEach((feature) => {
    countryNameByCode[feature.properties.name] = feature.id;
  });
}

Promise.all([
  d3.json(
    "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
  ),
  d3.csv("files/covid_data.csv"),
])
  .then(([world, covid]) => {
    worldData = world;
    covidData = covid;

    buildSearchIndex();

    const dateSet = new Set();
    covidData.forEach((d) => {
      if (d.year_week) {
        const date = weekYearToDate(d.year_week);
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        dateSet.add(`${year}-${month}`);
      }
    });

    allDates = Array.from(dateSet).sort();

    dateSlider.attr("max", allDates.length - 1).on("input", function () {
      const index = +this.value;
      const selectedDate = allDates[index];
      currentDateText.text(formatDateDisplay(selectedDate));
      if (!isShowingAll) {
        updateMap(selectedDate);
      }
    });

    renderMonthLabels();
    updateMap();
    currentDateText.text("Todos os dados");
    currentIndicatorLabel.text("Visualizando: Casos");
    resetButton.text("Ver Dados de um Mês");
  })
  .catch((error) => {
    console.error("Erro ao carregar dados:", error);
  });

toggleButton.on("click", function () {
  currentIndicator = currentIndicator === "cases" ? "deaths" : "cases";

  casesOption.classed("active", currentIndicator === "cases");
  deathsOption.classed("active", currentIndicator === "deaths");

  currentIndicatorLabel.text(
    `Visualizando: ${currentIndicator === "cases" ? "Casos" : "Mortes"}`
  );

  const index = +dateSlider.node().value;
  const selectedDate = allDates[index];
  const finalDate = isShowingAll ? null : selectedDate;

  currentDateText.text(
    finalDate ? formatDateDisplay(finalDate) : "Todos os dados"
  );
  updateMap(finalDate);
});

resetButton.on("click", function () {
  const sliderIndex = +dateSlider.node().value;
  const selectedDate = allDates[sliderIndex];

  isShowingAll = !isShowingAll;

  if (isShowingAll) {
    updateMap(null);
    currentDateText.text("Todos os dados");
    resetButton.text("Ver Dados de um Mês");
  } else {
    updateMap(selectedDate);
    currentDateText.text(formatDateDisplay(selectedDate));
    resetButton.text("Ver Todos os Dados");
  }
});

d3.select("#closeChart").on("click", function () {
  d3.select("#countryChartContainer").classed("hidden", true);
});

function renderMonthLabels() {
  const container = d3.select("#monthLabels");
  container.html("");

  allDates.forEach((dateStr, i) => {
    const [year, month] = dateStr.split("-");
    const label = document.createElement("span");
    const date = new Date(`${dateStr}-02`);
    label.textContent = date.toLocaleString("default", { month: "short" });
    label.title = `${month}/${year}`;
    label.className = "month-label";
    label.style.left = `${(i / (allDates.length - 1)) * 100}%`;
    container.node().appendChild(label);
  });
}

countrySearch.on("input", function () {
  const term = this.value.toLowerCase();
  const matches = Object.keys(countryNameByCode)
    .filter((name) => name.toLowerCase().includes(term))
    .sort();

  searchResults.html("");
  if (term && matches.length > 0) {
    searchResults.classed("hidden", false);
    matches.forEach((name) => {
      const li = searchResults.append("li").text(name);
      li.on("click", () => {
        const code = countryNameByCode[name];
        searchResults.classed("hidden", true);
        countrySearch.property("value", name);

        const country = worldData.features.find((d) => d.id === code);
        if (country) {
          const bounds = path.bounds(country);
          const [x, y] = [
            (bounds[0][0] + bounds[1][0]) / 2,
            (bounds[0][1] + bounds[1][1]) / 2,
          ];
          drawCountryChart(code, x, y);
        }
      });
    });
  } else {
    searchResults.classed("hidden", true);
  }
});
