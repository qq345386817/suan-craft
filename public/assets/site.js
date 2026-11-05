const language = document.querySelector('#language');
language?.addEventListener('change', () => {
  const target = new URL(language.value, location.origin);
  target.hash = location.hash;
  location.assign(target.href);
});
const contents = [...document.querySelectorAll('.contents a')];
if (contents.length && 'IntersectionObserver' in window) {
 const observer = new IntersectionObserver(entries => {
  const visible = entries.filter(entry => entry.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top);
  if (!visible.length) return;
  for (const link of contents) link.classList.toggle('is-current', link.hash === '#' + visible[0].target.id);
 }, {rootMargin:'-5% 0px -55% 0px'});
 document.querySelectorAll('article section').forEach(section => observer.observe(section));
}
