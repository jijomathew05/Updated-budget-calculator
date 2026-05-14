import React from 'react';
import TransactionItem from './TransactionItem';

const TransactionList = ({ transactions, totalIncome, onDelete, onUpdate }) => {
  const incomes  = transactions.filter(t => t.type === 'income');
  const expenses = transactions.filter(t => t.type === 'expense');

  const emptyMsg = (label) => (
    <p className="empty-list">No {label} transactions this month.</p>
  );

  return (
    <div className="container clearfix">
      <div className="income">
        <h2 className="icome__title">Income</h2>
        <div className="income__list">
          {incomes.length === 0
            ? emptyMsg('income')
            : incomes.map(item => (
                <TransactionItem
                  key={item._id}
                  item={item}
                  totalIncome={totalIncome}
                  onDelete={onDelete}
                  onUpdate={onUpdate}
                />
              ))
          }
        </div>
      </div>

      <div className="expenses">
        <h2 className="expenses__title">Expenses</h2>
        <div className="expenses__list">
          {expenses.length === 0
            ? emptyMsg('expense')
            : expenses.map(item => (
                <TransactionItem
                  key={item._id}
                  item={item}
                  totalIncome={totalIncome}
                  onDelete={onDelete}
                  onUpdate={onUpdate}
                />
              ))
          }
        </div>
      </div>
    </div>
  );
};

export default TransactionList;
