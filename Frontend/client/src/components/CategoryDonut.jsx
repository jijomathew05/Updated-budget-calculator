import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Label
} from 'recharts';

// Curated colour palette — one per category (shared with ExpenseChart for consistency)
const COLORS = [
  '#6366f1', '#f59e0b', '#10b981', '#ef4444', '#3b82f6',
  '#ec4899', '#14b8a6', '#f97316', '#8b5cf6', '#84cc16',
  '#06b6d4', '#a78bfa', '#fb7185', '#fbbf24', '#34d399'
];

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

// Compact currency for the donut center ($2,150 — no cents when whole)
const formatCenter = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD',
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip__label">{name}</p>
        <p className="chart-tooltip__value">{formatCurrency(value)}</p>
      </div>
    );
  }
  return null;
};

/**
 * Donut chart of expense categories with the total shown in the center hole.
 *
 * Props:
 *  - data:   [{ name, value }]  (expense totals per category)
 *  - total:  number             (sum shown in the center; usually total expenses)
 */
const CategoryDonut = ({ data, total = 0 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="donut-empty">
        <span className="donut-empty__icon">🍩</span>
        <p>No expenses to chart for this month.</p>
      </div>
    );
  }

  return (
    <div className="category-donut">
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={75}
            outerRadius={110}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
            {/* Center total */}
            <Label
              position="center"
              content={() => (
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="donut-center__total"
                >
                  {formatCenter(total)}
                </text>
              )}
            />
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryDonut;
