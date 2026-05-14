import { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:5000/api/transactions';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [type, setType] = useState('income');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setTransactions(data))
      .catch(err => console.error("Error fetching transactions:", err));
  }, []);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.value, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.value, 0);

  const budget = totalIncome - totalExpense;
  const percentage = totalIncome > 0 ? Math.round((totalExpense / totalIncome) * 100) : -1;

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!description || !value) return;

    const newTx = { type, description, value: parseFloat(value) };
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTx)
      });
      const data = await res.json();
      setTransactions([...transactions, data]);
      setDescription('');
      setValue('');
    } catch (err) {
      console.error("Error adding transaction:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setTransactions(transactions.filter(t => t._id !== id));
    } catch (err) {
      console.error("Error deleting transaction:", err);
    }
  };

  const formatNumber = (num, tType) => {
    num = Math.abs(num).toFixed(2);
    let [int, dec] = num.split('.');
    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, int.length);
    }
    return (tType === 'income' ? '+ ' : '- ') + int + '.' + dec;
  };

  const currentDate = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="app-container">
      <div className="top">
        <div className="budget">
          <div className="budget__title">
            Available Budget in <span className="budget__title--month">{currentDate}</span>:
          </div>
          <div className="budget__value">{budget >= 0 ? formatNumber(budget, 'income') : formatNumber(budget, 'expense')}</div>
          
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
              <div className="budget__expenses--percentage">{percentage > 0 ? `${percentage}%` : '---'}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bottom">
        <div className="add">
          <form className="add__container" onSubmit={handleAdd}>
            <select className="add__type" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="income">+</option>
              <option value="expense">-</option>
            </select>
            <input 
              type="text" 
              className="add__description" 
              placeholder="Add description" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input 
              type="number" 
              className="add__value" 
              placeholder="Value" 
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <button type="submit" className="add__btn">✓</button>
          </form>
        </div>
        
        <div className="container clearfix">
          <div className="income">
            <h2 className="icome__title">Income</h2>
            <div className="income__list">
              {transactions.filter(t => t.type === 'income').map(item => (
                <div className="item clearfix" key={item._id}>
                  <div className="item__description">{item.description}</div>
                  <div className="right clearfix">
                    <div className="item__value">{formatNumber(item.value, 'income')}</div>
                    <div className="item__delete">
                      <button className="item__delete--btn" onClick={() => handleDelete(item._id)}>x</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="expenses">
            <h2 className="expenses__title">Expenses</h2>
            <div className="expenses__list">
              {transactions.filter(t => t.type === 'expense').map(item => {
                const itemPercentage = totalIncome > 0 ? Math.round((item.value / totalIncome) * 100) : -1;
                return (
                  <div className="item clearfix" key={item._id}>
                    <div className="item__description">{item.description}</div>
                    <div className="right clearfix">
                      <div className="item__value">{formatNumber(item.value, 'expense')}</div>
                      <div className="item__percentage">{itemPercentage > 0 ? `${itemPercentage}%` : '---'}</div>
                      <div className="item__delete">
                        <button className="item__delete--btn" onClick={() => handleDelete(item._id)}>x</button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
