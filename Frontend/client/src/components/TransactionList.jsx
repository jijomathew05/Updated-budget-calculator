import TransactionItem from './TransactionItem';

const TransactionList = ({ transactions, totalIncome, onDelete, onEdit }) => {
  if (transactions.length === 0) {
    return (
      <div className="container" style={{ width: '100%' }}>
        <p className="empty-list" style={{ textAlign: 'center' }}>No transactions this month.</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ width: '100%', margin: '0' }}>
      <div className="unified-list" style={{ width: '100%' }}>
        {transactions.map(item => (
          <div key={item._id} className={item.type === 'income' ? 'income' : 'expenses'} style={{ width: '100%' }}>
            <TransactionItem
              item={item}
              totalIncome={totalIncome}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;
