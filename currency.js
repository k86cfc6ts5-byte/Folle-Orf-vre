/* Display currency. Prices are set in USD; other currencies are indicative.
   Reference rates updated 3 Nov 2026 — refresh periodically. */
(() => {
  const RATES = { USD: 1, INR: 94.90, EUR: 1 / 1.1183, AED: 3.6725 };
  const ROUND = { USD: 100, INR: 10000, EUR: 100, AED: 500 };
  const FORMAT = {
    USD: n => 'US$' + n.toLocaleString('en-US'),
    INR: n => '₹' + n.toLocaleString('en-IN'),
    EUR: n => '€' + n.toLocaleString('en-IE'),
    AED: n => 'AED ' + n.toLocaleString('en-US')
  };
  const prices = document.querySelectorAll('.js-price');
  const buttons = document.querySelectorAll('.currency-switch button');
  if (!prices.length || !buttons.length) return;
  const apply = cur => {
    if (!RATES[cur]) cur = 'USD';
    prices.forEach(el => {
      const raw = Number(el.dataset.usd) * RATES[cur];
      el.textContent = FORMAT[cur](Math.round(raw / ROUND[cur]) * ROUND[cur]);
    });
    buttons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cur === cur)));
    try { localStorage.setItem('fo-currency', cur); } catch (e) {}
  };
  buttons.forEach(b => b.addEventListener('click', () => apply(b.dataset.cur)));
  let saved = 'USD';
  try { saved = localStorage.getItem('fo-currency') || 'USD'; } catch (e) {}
  apply(saved);
})();
