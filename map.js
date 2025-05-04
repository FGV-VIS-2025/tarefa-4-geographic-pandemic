const width = 960;
const height = 600;
const svg = d3.select("#map").attr("width", width).attr("height", height);
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

  const countries = svg.selectAll("path").data(worldData.features, (d) => d.id);

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
