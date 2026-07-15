const formatNumber = (num, tType) => {
  num = Math.abs(num).toFixed(2);
  let [int, dec] = num.split('.');
  if (int.length > 3) {
    int = int.slice(0, int.length - 3) + ',' + int.slice(int.length - 3);
  }
  return (tType === 'income' ? '+ ' : '- ') + int + '.' + dec;
};

const TransactionItem = ({ item, totalIncome, onDelete, onEdit }) => {
  const isExpense = item.type === 'expense';
  const percentage = isExpense && totalIncome > 0
    ? Math.round((item.value / totalIncome) * 100)
    : -1;

  return (
    <div className="item clearfix" id={`${item.type}-${item._id}`}>
      <div className="item__description">
        {item.description}
        {item.category && (
          <span className="item__category-badge">{item.category}</span>
        )}
        <div className="item__date-label">
          {new Date(item.date).toLocaleDateString(undefined, {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
      <div className="right clearfix">
        <div className="item__value">
          {formatNumber(item.value, item.type)}
        </div>
        {isExpense && (
          <div className="item__percentage">
            {percentage > 0 ? `${percentage}%` : '---'}
          </div>
        )}
        <div className="item__actions">
          <button
            className="item__edit--btn"
            onClick={() => onEdit(item)}
            aria-label={`Edit ${item.description}`}
          >
            ✎
          </button>
          <button
            className="item__delete--btn"
            onClick={() => onDelete(item._id)}
            aria-label={`Delete ${item.description}`}
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;
