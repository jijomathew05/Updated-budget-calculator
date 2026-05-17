const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Build a range of years: 5 years back → current year
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 6 }, (_, i) => currentYear - 5 + i);

const MonthFilter = ({ selectedMonth, selectedYear, onMonthChange, onYearChange }) => {
  return (
    <div className="month-filter">
      <span className="month-filter__label">📅 Showing:</span>
      <select
        id="month-select"
        className="month-filter__select"
        value={selectedMonth}
        onChange={(e) => onMonthChange(Number(e.target.value))}
      >
        {MONTHS.map((name, idx) => (
          <option key={name} value={idx + 1}>{name}</option>
        ))}
      </select>
      <select
        id="year-select"
        className="month-filter__select"
        value={selectedYear}
        onChange={(e) => onYearChange(Number(e.target.value))}
      >
        {YEARS.map((yr) => (
          <option key={yr} value={yr}>{yr}</option>
        ))}
      </select>
    </div>
  );
};

export default MonthFilter;
