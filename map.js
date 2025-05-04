const width = 960;
const height = 600;
const svg = d3.select("#map").attr("width", width).attr("height", height);
const g = svg.append("g");
const tooltip = d3.select("#tooltip");

const projection = d3
  .geoMercator()
  .scale(150)
  .translate([width / 2, height / 1.5]);
const path = d3.geoPath().projection(projection);

const colorScale = d3.scaleSequential(d3.interpolateYlOrRd).domain([1, 10000]);

function formatK(value) {
  return value >= 1000
    ? (value / 1000).toFixed(1).replace(/\.0$/, "") + "k"
    : value;
}

function updateMap(selectedDate = null) {
  const covidByCountry = {};

  covidData.forEach((d) => {
    if (d.indicator === currentIndicator && d.year_week) {
      const date = weekYearToDate(d.year_week);
      if (date.getFullYear() >= 2020) {
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        const yearMonth = `${year}-${month}`;

        const matchDate = selectedDate ? yearMonth === selectedDate : true;

        if (matchDate) {
          if (!covidByCountry[d.country_code]) {
            covidByCountry[d.country_code] = 0;
          }
          covidByCountry[d.country_code] += +d.weekly_count;
        }
      }
    }
  });

  const maxCount = d3.max(Object.values(covidByCountry)) || 10000;
  colorScale.domain([1, maxCount]);

  const countries = g.selectAll("path").data(worldData.features, (d) => d.id);

  countries
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", "#ccc")
    .attr("stroke", "#fff")
    .attr("stroke-width", 0.5)
    .merge(countries)
    .on("mouseover", function (event, d) {
      const code = d.id;
      const countryName = d.properties.name;
      const cases = covidByCountry[code] || 0;
      tooltip
        .style("opacity", 1)
        .html(
          `<strong>${countryName}</strong><br/>${
            currentIndicator === "cases" ? "Casos" : "Mortes"
          }: ${cases}`
        )
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 28 + "px");

      d3.select(this).attr("stroke", "#000").attr("stroke-width", 2);
    })
    .on("mouseout", function () {
      tooltip.style("opacity", 0);
      d3.select(this).attr("stroke", "#fff").attr("stroke-width", 0.5);
    })
    .on("click", function (event, d) {
      const code = d.id;
      const [x, y] = d3.pointer(event, svg.node());
      drawCountryChart(code, x, y);
    })
    .transition()
    .duration(750)
    .attr("fill", (d) => {
      const code = d.id;
      const cases = covidByCountry[code];
      return cases ? colorScale(cases) : "#ccc";
    });

  countries.exit().remove();

  const legendLabels = d3.select(".legend-labels");
  if (!legendLabels.empty()) {
    const min = 0;
    const max = Math.round(maxCount);
    legendLabels.selectAll("span").remove();
    legendLabels
      .selectAll("span")
      .data([min, Math.round(max / 2), max])
      .enter()
      .append("span")
      .text((d) => formatK(d));
  }
}

function drawCountryChart(countryCode, clickX, clickY) {
  const filtered = covidData.filter(
    (d) => d.country_code === countryCode && d.indicator === currentIndicator
  );

  const data = filtered
    .filter((d) => d.year_week && !isNaN(+d.weekly_count))
    .map((d) => ({
      date: weekYearToDate(d.year_week),
      value: +d.weekly_count,
    }))
    .sort((a, b) => a.date - b.date);

  const container = d3.select("#countryChart");
  container.html("");

  const chartBox = d3.select("#countryChartContainer");
  chartBox.classed("hidden", false);
  chartBox.style("left", `${clickX + 40}px`);
  chartBox.style("top", `${clickY}px`);

  const title = d3.select("#countryChartTitle");
  const countryName =
    worldData.features.find((f) => f.id === countryCode)?.properties.name || "";
  title.text(
    `Série temporal de ${
      currentIndicator === "cases" ? "casos" : "mortes"
    } – ${countryName}`
  );

  const margin = { top: 20, right: 20, bottom: 30, left: 50 },
    width = 360 - margin.left - margin.right,
    height = 240 - margin.top - margin.bottom;

  const svgChart = container
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => d.date))
    .range([0, width]);
  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.value)])
    .nice()
    .range([height, 0]);

  svgChart
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).ticks(4));
  svgChart.append("g").call(d3.axisLeft(y));

  svgChart
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "#6c9ecf")
    .attr("stroke-width", 2)
    .attr(
      "d",
      d3
        .line()
        .x((d) => x(d.date))
        .y((d) => y(d.value))
    );
}

svg.call(
  d3
    .zoom()
    .scaleExtent([1, 8])
    .on("zoom", (event) => {
      g.attr("transform", event.transform);
    })
);
