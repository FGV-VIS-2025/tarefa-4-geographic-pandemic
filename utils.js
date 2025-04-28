function weekYearToDate(yearWeek) {
  const [yearStr, weekStr] = yearWeek.split("-");
  const year = parseInt(yearStr);
  const week = parseInt(weekStr);
  const jan4 = new Date(year, 0, 4);
  const dayOfWeek = jan4.getDay();
  const ISOweekStart = new Date(jan4);
  ISOweekStart.setDate(
    jan4.getDate() - (dayOfWeek <= 4 ? dayOfWeek - 1 : dayOfWeek - 8)
  );
  const result = new Date(ISOweekStart);
  result.setDate(result.getDate() + (week - 1) * 7);
  return result;
}

function formatDateDisplay(ym) {
  if (!ym) return "Todos os dados";
  const [year, month] = ym.split("-");
  const monthNames = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];
  return `${monthNames[parseInt(month) - 1]} ${year}`;
}
