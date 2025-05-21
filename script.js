const btn = document.getElementById('convert');
const input = document.getElementById('decimal');
const tbody = document.querySelector('#steps tbody');
const binaryDiv = document.getElementById('binary');
const explanation = document.getElementById('explanation');
const btnPrinciple = document.getElementById('show-principle');
const btnExponent = document.getElementById('show-exponent');
const overlays = document.querySelectorAll('.overlay');

btn.addEventListener('click', () => {
  const n = parseInt(input.value, 10);
  if (isNaN(n) || n < 0) return;
  if (n > 1024) { alert('1024以下の数を入力してください'); return; }
  tbody.innerHTML = '';
  binaryDiv.textContent = '';
  explanation.textContent = '';
  animateConversion(n);
});
btnPrinciple.addEventListener('click', () => showOverlay('overlay-principle'));
btnExponent.addEventListener('click', () => showOverlay('overlay-exponent'));

overlays.forEach(ov => {
  ov.querySelector('.close-btn').addEventListener('click', e => {
    const id = e.target.getAttribute('data-overlay');
    document.getElementById(id).style.display = 'none';
  });
});
function showOverlay(id) {
  document.getElementById(id).style.display = 'flex';
}

function animateConversion(n) {
  const steps = [];
  let x = n;
  while (x >= 1) {
    const dividend = x;                   // 現在の割られる数を保持
    const q = Math.floor(x / 2);
    const r = x % 2;
    steps.push({ dividend, q, r });
    x = q;
  }
  let idx = 0;
  const interval = setInterval(() => {
    tbody.querySelectorAll('tr').forEach(tr => tr.classList.remove('highlight'));
    if (idx >= steps.length) {
      clearInterval(interval);
      showResult(steps, n);
      return;
    }
    const { dividend, q, r } = steps[idx];
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${dividend} ÷ 2</td>
      <td>${q}</td>
      <td>${r}</td>
    `;
    tbody.appendChild(row);
    row.classList.add('highlight');
    idx++;
  }, 1000);
}

function showResult(steps, original) {
  const bits = steps.map(s => s.r).reverse();
  tbody.querySelectorAll('tr').forEach(tr => tr.classList.remove('highlight'));
  binaryDiv.innerHTML = `${original}₁₀ = ` + bits.map((b, i) => `<span class='bit' data-index='${i}'>${b}</span>`).join('');
  explanation.innerHTML = `ビットをクリックすると、各桁の重みを説明します。`;
  document.querySelectorAll('.bit').forEach(span => {
    span.addEventListener('click', () => {
      document.querySelectorAll('.bit').forEach(el => el.classList.remove('active'));
      span.classList.add('active');
      const idx = parseInt(span.dataset.index, 10);
      const power = bits.length - 1 - idx;
      explanation.innerHTML = `<strong>${bits[idx]}</strong> × 2<sup>${power}</sup> = ${bits[idx] * (2 ** power)}`;
      tbody.querySelectorAll('tr').forEach(tr => tr.classList.remove('highlight'));
      const rows = Array.from(tbody.querySelectorAll('tr'));
      const target = rows[rows.length - 1 - idx];
      if (target) target.classList.add('highlight');
    });
  });
}