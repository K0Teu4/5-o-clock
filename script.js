/* Five o'clock — финальное издание.
   Коллекция заморожена 13.09.2026: восемь открыток, четыре фазы суток, один чай.
   Ниже — рабочий механизм серии. */

/* PREVIEW = null → фазы меняются автоматически по лондонскому времени;
   PREVIEW = 'morning' | 'day' | 'evening' | 'night' → застыть в одной фазе для проверки */
const PREVIEW = null;
const WORDS = {morning: 'утро', day: 'день', evening: 'вечер', night: 'ночь'};
const phaseOf = h => PREVIEW || (h >= 5 && h < 12 ? 'morning' : h < 17 ? 'day' : h < 22 ? 'evening' : 'night');

const rot = (id, a) => document.getElementById(id).setAttribute('transform', `rotate(${a})`);
const fmt = tz => new Intl.DateTimeFormat('en-GB',
  {timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false}).format(new Date());

function tick(){
  const p = new Intl.DateTimeFormat('en-GB', {timeZone: 'Europe/London',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false}).formatToParts(new Date());
  const g = t => +p.find(x => x.type === t).value;
  const h = g('hour'), m = g('minute'), s = g('second');
  const ma = (m + s / 60) * 6, ha = ((h % 12) + m / 60) * 30;
  rot('hL', ha); rot('mL', ma); rot('hR', ha); rot('mR', ma);

  const ph = phaseOf(h);
  document.documentElement.dataset.phase = ph;
  document.getElementById('phase').textContent = WORDS[ph];

  const str = String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0');
  document.getElementById('ldn').textContent  = str;
  document.getElementById('ldn2').textContent = str;
  document.getElementById('tLn').textContent  = fmt('Europe/London');
  document.getElementById('tPr').textContent  = fmt('Europe/Paris');
  document.getElementById('tTk').textContent  = fmt('Asia/Tokyo');
  document.getElementById('tMs').textContent  = fmt('Europe/Moscow');
  document.getElementById('tBj').textContent  = fmt('Asia/Shanghai');
  document.getElementById('tNy').textContent  = fmt('America/New_York');
  document.getElementById('tRm').textContent  = fmt('Europe/Rome');
  document.getElementById('tIs').textContent  = fmt('Europe/Istanbul');
  document.body.classList.toggle('tea', h === 17 && m === 0);
}
setInterval(tick, 1000); tick();

/* почта без mailto: копирование в буфер */
const MAIL = 'unhappykin@gmail.com';
const mailBtn  = document.getElementById('mailBtn');
const mailHint = document.getElementById('mailHint');
const HINT = '— нажмите, чтобы скопировать';
mailBtn.onclick = async () => {
  try {
    await navigator.clipboard.writeText(MAIL);
    mailHint.textContent = '— скопировано ✓';
  } catch (e) {
    prompt('Скопируйте адрес вручную:', MAIL);
    return;
  }
  setTimeout(() => { mailHint.textContent = HINT; }, 2500);
};

/* плавное появление открыток при прокрутке */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  });
}, {threshold: 0.15});
document.querySelectorAll('.postcard.fade-in').forEach(el => io.observe(el));