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

Promise.all([
  d3.json(
    "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
  ),
  d3.csv("files/covid_data.csv"),
])
  .then(([world, covid]) => {
    worldData = world;
    covidData = covid;

    const dateSet = new Set();
    covidData.forEach((d) => {
      if (d.year_week) {
        const date = weekYearToDate(d.year_week);
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        dateSet.add(`${year}-${month}`);
      }
    });
    console.log(covidData);
    console.log(dateSet);

    allDates = Array.from(dateSet).sort();
    console.log(allDates);

    dateSlider.attr("max", allDates.length - 1).on("input", function () {
      const index = +this.value;
      const selectedDate = allDates[index];
      currentDateText.text(formatDateDisplay(selectedDate));
      if (!isShowingAll) {
        updateMap(selectedDate);
      }
    });

    renderMonthLabels();

    updateMap(); // mostra todos os dados inicialmente
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
  console.log(allDates);

  allDates.forEach((dateStr, i) => {
    const [year, month] = dateStr.split("-");
    const label = document.createElement("span");
    const date = new Date(`${dateStr}-02`);
    console.log(date);
    label.textContent = date.toLocaleString("default", { month: "short" });
    label.title = `${month}/${year}`;
    label.className = "month-label";
    label.style.left = `${(i / (allDates.length - 1)) * 100}%`;
    container.node().appendChild(label);
  });
}
