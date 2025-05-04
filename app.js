let worldData, covidData;
let allDates = [];
let currentIndicator = "cases";

const dateSlider = d3.select("#dateSlider");
const currentDateText = d3.select("#currentDate");

const toggleButton = d3.select("#toggleButton");
const casesOption = d3.select("#casesOption");
const deathsOption = d3.select("#deathsOption");

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
        if (date.getFullYear() >= 2020) {
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = date.getFullYear();
          dateSet.add(`${year}-${month}`);
        }
      }
    });

    allDates = Array.from(dateSet).sort();

    dateSlider.attr("max", allDates.length - 1).on("input", function () {
      const index = +this.value;
      const selectedDate = allDates[index];
      currentDateText.text(formatDateDisplay(selectedDate));
      updateMap(selectedDate);
    });

    renderMonthLabels(); // ✅ Chamada da função para exibir rótulos de meses

    updateMap();
    currentDateText.text("Todos os dados");
  })
  .catch((error) => {
    console.error("Erro ao carregar dados:", error);
  });

toggleButton.on("click", function () {
  currentIndicator = currentIndicator === "cases" ? "deaths" : "cases";

  casesOption.classed("active", currentIndicator === "cases");
  deathsOption.classed("active", currentIndicator === "deaths");

  const index = +dateSlider.node().value;
  const selectedDate = allDates[index];
  currentDateText.text(
    selectedDate ? formatDateDisplay(selectedDate) : "Todos os dados"
  );
  updateMap(selectedDate);
});

d3.select("#resetButton").on("click", function () {
  dateSlider.node().value = 0;
  currentDateText.text("Todos os dados");
  updateMap();
});

function renderMonthLabels() {
  const container = d3.select("#monthLabels");
  container.html("");

  allDates.forEach((dateStr, i) => {
    const [year, month] = dateStr.split("-");
    const label = document.createElement("span");
    const date = new Date(`${dateStr}-01`);
    label.textContent = date.toLocaleString("default", { month: "short" });
    label.title = `${month}/${year}`;
    label.className = "month-label";
    label.style.left = `${(i / (allDates.length - 1)) * 100}%`;
    container.node().appendChild(label);
  });
}

d3.select("#closeChart").on("click", function () {
  d3.select("#countryChartContainer").classed("hidden", true);
});
