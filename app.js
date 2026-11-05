// ================== STATE ==================
let transactions = JSON.parse(localStorage.getItem('expenses_v1') || '[]');

// ================== DOM ==================
const form = document.getElementById('form');
const descInput = document.getElementById('desc');
const amountInput = document.getElementById('amount');
const typeSelect = document.getElementById('type');
const list = document.getElementById('list');
const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expenseEl = document.getElementById('expense');

// ================== STORAGE ==================
function save() {
  localStorage.setItem('expenses_v1', JSON.stringify(transactions));
}

// ================== ACTIONS ==================
function addTransaction(e) {
  e.preventDefault();
  const desc = descInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const type = typeSelect.value;

  if (!desc || !amount || amount <= 0) return;

  transactions.unshift({
    id: Date.now(),
    desc,
    amount,
    type,
    date: new Date().toISOString()
  });

  save();
  render();

  descInput.value = '';
  amountInput.value = '';
  descInput.focus();
}

function deleteTransaction(id) {
  if (!confirm('O\'chirishni tasdiqlaysizmi?')) return;
  transactions = transactions.filter(t => t.id !== id);
  save();
  render();
}

// ================== FORMAT ==================
function formatMoney(n) {
  return n.toLocaleString('uz-UZ') + " so'm";
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString('uz-UZ', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ================== RENDER ==================
function render() {
  const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = income - expense;

  incomeEl.textContent = '+' + formatMoney(income);
  expenseEl.textContent = '-' + formatMoney(expense);
  balanceEl.textContent = formatMoney(balance);
  balanceEl.style.color = balance >= 0 ? '#fff' : '#ffd2d2';

  if (transactions.length === 0) {
    list.innerHTML = '<li class="empty">📭 Tranzaksiyalar yo\'q</li>';
    return;
  }

  list.innerHTML = transactions.map(t => `
    <li class="${t.type}" data-id="${t.id}">
      <div class="info">
        <div class="desc">${escapeHtml(t.desc)}</div>
        <div class="date">${formatDate(t.date)}</div>
      </div>
      <div class="amount">${t.type === 'income' ? '+' : '-'}${formatMoney(t.amount)}</div>
      <button class="delete" title="O'chirish">🗑</button>
    </li>
  `).join('');
}

// ================== EVENTS ==================
form.addEventListener('submit', addTransaction);

list.addEventListener('click', e => {
  if (e.target.classList.contains('delete')) {
    const item = e.target.closest('li');
    deleteTransaction(Number(item.dataset.id));
  }
});

// ================== INIT ==================
render();