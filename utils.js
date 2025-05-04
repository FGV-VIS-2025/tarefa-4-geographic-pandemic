function weekYearToDate(weekYear) {
  const [year, week] = weekYear.split("-W").map(Number);
  const simple = new Date(year, 0, 1 + (week - 1) * 7);
  const dow = simple.getDay();
  const ISOweekStart = simple;
  if (dow <= 4) ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  else ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
  return ISOweekStart;
}

function formatDateDisplay(dateStr) {
  const [year, month] = dateStr.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1); // corrigido para mês correto
  return `${date.toLocaleString("default", { month: "short" })} ${year}`;
}
