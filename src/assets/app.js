// Cole's Capital Group — homepage behavior. External module (CSP: script-src 'self').
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const burger = document.getElementById('burger');
if (burger) {
  burger.addEventListener('click', () => {
    const menu = document.getElementById('menu');
    const open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
  });
}

const revealables = document.querySelectorAll('.rv');
if (reduceMotion) {
  revealables.forEach((el) => el.classList.add('in'));
} else {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.14 });
  revealables.forEach((el, i) => { el.style.transitionDelay = `${(i % 4) * 0.07}s`; io.observe(el); });
}
