export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
};

export const formatCurrency = (amount) => {
  if (amount == null) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0
  }).format(amount);
};

export const formatNumber = (n) =>
  n == null ? '—' : new Intl.NumberFormat('en-IN').format(n);

export const calcProfit = (revenue, cost) => {
  if (revenue == null || cost == null) return null;
  return Number(revenue) - Number(cost);
};

export const truncate = (str, len = 30) =>
  str && str.length > len ? str.slice(0, len) + '...' : str;
