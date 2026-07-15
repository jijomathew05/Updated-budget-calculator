import { useState, useEffect, useRef } from 'react';

const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other Income'];
const EXPENSE_CATEGORIES = ['Food', 'Rent', 'Transport', 'Entertainment', 'Healthcare',
  'Utilities', 'Shopping', 'Education', 'Travel', 'Other Expense'];

const todayStr = () => new Date().toISOString().split('T')[0];
const nowTimeStr = () => new Date().toTimeString().split(' ')[0].slice(0, 5);
const dateStr = (iso) => new Date(iso).toISOString().split('T')[0];
const timeStr = (iso) => new Date(iso).toTimeString().split(' ')[0].slice(0, 5);

/**
 * Inner form. Mounted fresh on every open (the outer component returns null
 * when closed), so its useState seeds act as the per-open reset — no reset
 * effect needed.
 *
 * Props:
 *  - mode: 'add' | 'edit'  (changes title + button labels + type-toggle lock)
 *  - transaction: existing tx to seed fields in edit mode
 *  - onClose, onAdd, onUpdate
 */
const TransactionForm = ({ mode = 'add', transaction, onClose, onAdd, onUpdate }) => {
  const isEdit = mode === 'edit';

  const [type, setType] = useState(isEdit ? transaction.type : 'income');
  const [description, setDescription] = useState(isEdit ? transaction.description : '');
  const [value, setValue] = useState(isEdit ? transaction.value : '');
  const [category, setCategory] = useState(isEdit ? (transaction.category || '') : 'Salary');
  const [date, setDate] = useState(isEdit ? dateStr(transaction.date) : todayStr());
  const [time, setTime] = useState(isEdit ? timeStr(transaction.date) : nowTimeStr());
  const [errors, setErrors] = useState({});

  const closeBtnRef = useRef(null);
  const modalRef = useRef(null);

  // Focus management, body scroll lock, and Escape-to-close.
  // Runs once per open (this component is mounted only while open).
  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const t = setTimeout(() => closeBtnRef.current?.focus(), 0);

    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'Tab') {
        // Simple focus trap within the modal.
        const focusables = modalRef.current
          ?.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
          ?.filter((el) => !el.disabled);
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);

    return () => {
      clearTimeout(t);
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  // When switching Income/Expense, snap the category to a valid default
  // so the selected chip always belongs to the active type.
  const handleTypeChange = (newType) => {
    setType(newType);
    setCategory(newType === 'income' ? 'Salary' : 'Food');
  };

  const validate = () => {
    const next = {};
    const trimmed = description.trim();
    const amount = parseFloat(value);

    if (!trimmed) next.description = 'Please enter a description.';
    if (!value || isNaN(amount) || amount <= 0)
      next.value = 'Amount must be greater than 0.';

    const localDate = new Date(`${date}T${time}`);
    if (isNaN(localDate.getTime())) next.date = 'Please pick a valid date and time.';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const localDate = new Date(`${date}T${time}`);
    const payload = {
      type,
      description: description.trim(),
      value: parseFloat(value),
      category,
      date: localDate.toISOString(),
    };
    if (isEdit) {
      onUpdate(transaction._id, payload);
    } else {
      onAdd(payload);
    }
    onClose();
  };

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const accentColor = type === 'income' ? '#28B9B5' : '#FF5049';
  const title = isEdit ? 'Edit Transaction' : 'Add Transaction';
  const submitLabel = isEdit
    ? 'Save Changes'
    : `Add ${type === 'income' ? 'Income' : 'Expense'}`;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="presentation"
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tx-modal-title"
        ref={modalRef}
      >
        <header className="modal__header" style={{ '--accent': accentColor }}>
          <h2 id="tx-modal-title" className="modal__title">{title}</h2>
          <button
            type="button"
            className="modal__close"
            onClick={onClose}
            aria-label="Close dialog"
            ref={closeBtnRef}
          >
            ✕
          </button>
        </header>

        <form className="modal__form" onSubmit={handleSubmit} noValidate>
          {/* Income / Expense toggle. Locked in edit mode (type is set at creation). */}
          <div className="modal__type-toggle" role="group" aria-label="Transaction type">
            <button
              type="button"
              className={`modal__type-btn ${type === 'income' ? 'is-active modal__type-btn--income' : ''}`}
              onClick={() => handleTypeChange('income')}
              aria-pressed={type === 'income'}
              disabled={isEdit}
            >
              <span className="modal__type-icon">＋</span> Income
            </button>
            <button
              type="button"
              className={`modal__type-btn ${type === 'expense' ? 'is-active modal__type-btn--expense' : ''}`}
              onClick={() => handleTypeChange('expense')}
              aria-pressed={type === 'expense'}
              disabled={isEdit}
            >
              <span className="modal__type-icon">−</span> Expense
            </button>
          </div>
          {isEdit && (
            <p className="modal__hint">
              Type can't be changed after creation. Delete and re-add to switch.
            </p>
          )}

          {/* Description */}
          <div className="modal__field">
            <label htmlFor="modal-desc" className="modal__label">Description</label>
            <input
              id="modal-desc"
              type="text"
              className="modal__input"
              placeholder="e.g. Grocery shopping"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              autoFocus
              aria-invalid={!!errors.description}
              aria-describedby={errors.description ? 'modal-desc-err' : undefined}
            />
            {errors.description && (
              <p id="modal-desc-err" className="modal__error">{errors.description}</p>
            )}
          </div>

          {/* Amount + Date + Time */}
          <div className="modal__row">
            <div className="modal__field">
              <label htmlFor="modal-value" className="modal__label">Amount</label>
              <div className="modal__amount">
                <span className="modal__amount-symbol">$</span>
                <input
                  id="modal-value"
                  type="number"
                  className="modal__input modal__input--amount"
                  placeholder="0.00"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  min="0.01"
                  step="0.01"
                  aria-invalid={!!errors.value}
                  aria-describedby={errors.value ? 'modal-value-err' : undefined}
                />
              </div>
              {errors.value && (
                <p id="modal-value-err" className="modal__error">{errors.value}</p>
              )}
            </div>

            <div className="modal__field">
              <label htmlFor="modal-date" className="modal__label">Date</label>
              <input
                id="modal-date"
                type="date"
                className="modal__input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                aria-invalid={!!errors.date}
              />
              {errors.date && <p className="modal__error">{errors.date}</p>}
            </div>

            <div className="modal__field">
              <label htmlFor="modal-time" className="modal__label">Time</label>
              <input
                id="modal-time"
                type="time"
                className="modal__input"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          {/* Category chips */}
          <div className="modal__field">
            <span className="modal__label">Category</span>
            <div className="modal__chips" role="radiogroup" aria-label="Category">
              {categories.map((cat) => {
                const selected = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    className={`modal__chip ${selected ? 'is-selected' : ''}`}
                    style={selected ? { '--chip-accent': accentColor } : undefined}
                    onClick={() => setCategory(cat)}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="modal__actions">
            <button type="button" className="modal__btn modal__btn--ghost" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="modal__btn modal__btn--primary"
              style={{ '--accent': accentColor }}
            >
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/**
 * Outer controller. Renders nothing when closed; mounts a fresh form on each
 * open. Because the subtree is conditionally rendered (null when closed),
 * React unmounts/remounts the form automatically — so its useState seeds
 * act as the per-open reset with no extra key or effect required.
 *
 * Pass `mode="edit"` plus a `transaction` to edit; otherwise defaults to add.
 */
const TransactionModal = ({
  open, onClose, onAdd, onUpdate,
  mode = 'add', transaction = null,
}) => {
  if (!open) return null;
  if (mode === 'edit' && !transaction) return null;
  // key forces a fresh mount whenever the edit target changes (e.g. editing
  // item B right after item A without the modal closing in between), so the
  // form state re-seeds from the new transaction. For 'add' the conditional
  // null-when-closed already guarantees a fresh mount each open.
  const formKey = mode === 'edit' ? `edit-${transaction._id}` : 'add';
  return (
    <TransactionForm
      key={formKey}
      mode={mode}
      transaction={transaction}
      onClose={onClose}
      onAdd={onAdd}
      onUpdate={onUpdate}
    />
  );
};

export default TransactionModal;
