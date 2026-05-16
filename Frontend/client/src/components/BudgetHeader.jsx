import React from 'react';

const formatNumber = (num, tType) => {
  if (num === null || num === undefined) return '0.00';
  num = Math.abs(num).toFixed(2);
  let [int, dec] = num.split('.');
  if (int.length > 3) {
    int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, int.length);
  }
  return (tType === 'income' ? '+ ' : '- ') + int + '.' + dec;
};

const BudgetHeader = ({ budget, totalIncome, totalExpense, percentage, selectedMonth, selectedYear }) => {
  const monthName = new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long' });
  const displayDate = `${monthName} ${selectedYear}`;

  return (
    <div className="top">
      <div className="budget">
        <div className="budget__title">
          Available Budget in <span className="budget__title--month">{displayDate}</span>:
        </div>
        <div className="budget__value">
          {budget >= 0 ? formatNumber(budget, 'income') : formatNumber(budget, 'expense')}
        </div>
        
        <div className="budget__income clearfix">
          <div className="budget__income--text">Income</div>
          <div className="right">
            <div className="budget__income--value">{formatNumber(totalIncome, 'income')}</div>
            <div className="budget__income--percentage">&nbsp;</div>
          </div>
        </div>
        
        <div className="budget__expenses clearfix">
          <div className="budget__expenses--text">Expenses</div>
          <div className="right clearfix">
            <div className="budget__expenses--value">{formatNumber(totalExpense, 'expense')}</div>
            <div className="budget__expenses--percentage">
              {percentage > 0 ? `${percentage}%` : '---'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetHeader;
