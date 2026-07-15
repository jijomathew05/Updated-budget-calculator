## Goal
Revamp Reports into a hybrid view: a detailed breakdown for a selected month (donut + categories) plus a compact 6-month income/expense trend for context. Independent month selector (not shared with Dashboard/Transactions).

## Data flow (decided)
- **Per-month detail** → `fetchTransactions({ month, year })` (raw txs), compute income/expense/category totals client-side. This is required because `/api/summary` only returns `{income, expense}` totals per month — no category breakdown.
- **6-month trend** → `fetchSummary(6)` (unchanged endpoint).
- Reports keeps its OWN `selectedMonth/selectedYear` state — does NOT touch BudgetContext, so the rest of the app is unaffected.

## Files

### 1. NEW `src/components/CategoryDonut.jsx`
A reusable donut chart (replaces the per-month category visualization). Built on Recharts v3 `PieChart`/`Pie`/`Cell` (same as the existing `ExpenseChart.jsx`, which I'll leave untouched for the Dashboard).
- **Props:** `data` (`[{ name, value }]`), `total` (number — shown in center), `currency` (for tooltip).
- Donut via `innerRadius`/`outerRadius`, `paddingAngle` (mirrors existing `ExpenseChart` styling for consistency).
- **Center total** via Recharts `<Label>` component as a child of `<Pie>` (confirmed available in recharts v3.8.1). Centered, large, colored `#1a2340`.
- Reuses the existing 15-color palette: `['#6366f1', '#f59e0b', '#10b981', ...]`.
- Custom tooltip (currency-formatted), same styling as current charts.
- Returns `null` + a friendly empty state when `data` is empty.

### 2. NEW `src/components/TrendBar.jsx`
Compact 6-month income-vs-expense bar chart (a slimmer version of the current Reports bar chart, kept smaller for the "trend" role).
- **Props:** `data` (`[{ month, income, expense }]`).
- Reuses `BarChart`/`Bar`/`XAxis`/etc. Smaller height (~220px), minimal margins, keeps the teal/red Income/Expense fills (`#28B9B5`/`#FF5049`).

### 3. REWRITE `src/pages/Reports.jsx`
Replaces the current fetch-once comparative view. New layout:
```
REPORTS
[Month: Jul 2026 ▼]  [Year ▼]                    ← independent MonthFilter

┌─ July 2026 ───────────────────────────────────┐
│ Income $4,200   Expenses $2,150   Net +$2,050 │  ← 3 stat cards (.stat-grid--3)
└───────────────────────────────────────────────┘

  Category Breakdown (selected month)
  ┌─────────────────┬────────────────────────┐
  │  [ DONUT with   │  Top categories list    │
  │   $2,150 center]│  Food     $620   29%    │  ← donut + ranked legend w/ % + bars
  │                 │  Rent     $800   37%    │
  │                 │  ...                    │
  └─────────────────┴────────────────────────┘

  6-Month Trend
  [ TrendBar: Feb–Jul income vs expense ]        ← compact trend, refreshes with month
```
- **State:** `selectedMonth`, `selectedYear`, `transactions`, `summary`, `isLoading`, `error`.
- **Effects:** one effect fetches `fetchTransactions({month,year})` when month/year change; one fetches `fetchSummary(6)` once on mount (kept — gives the trend anchor).
- **Derived (useMemo):** `totalIncome`, `totalExpense`, `netSavings`, `expensesByCategory` (sorted desc), `chartData`.
- **Validation/edge cases:** empty month (no txs) → show donut empty-state + "No transactions for this month" message, but keep the trend chart visible. Month/Year out of valid range handled gracefully (MonthFilter already constrains the dropdown).
- Reuses existing CSS tokens (`.page`, `.page__header`, `.stat-card`, `.chart-container`). New CSS scoped under `reports-` prefix.

### 4. `src/App.css` — append new styles
- `.reports-layout`, `.reports-breakdown` (grid: donut | legend), `.reports-legend` (category rows with mini bar + %), `.reports-trend`. Responsive collapse to single column under 860px.
- No changes to existing rules.

## What I will NOT touch
- `ExpenseChart.jsx` (still used by Dashboard) — leave as-is.
- `BudgetContext.jsx` — Reports doesn't use it.
- Backend — no API changes; existing endpoints cover everything.
- `services/api.js` — already has both needed functions (`fetchTransactions`, `fetchSummary`).

## Tradeoff notes (already accepted)
- **Independent selector** → two sources of truth for "current month" (Reports vs the rest). Accepted per your choice; means navigating to Reports won't show the same month as Dashboard unless you pick it.
- **Client-side category calc** → fetches full month's transactions to compute breakdown. Fine for personal-finance volumes; avoids a backend change.

## Verification
- `npm run build` must pass.
- `eslint` clean on all touched/new files.
- Manual: switch months → donut + legend + stat cards update; trend chart stays anchored to last 6 months.