(function () {
  var root = document.documentElement;
  var media = window.matchMedia('(prefers-color-scheme: dark)');
  var preference = null;
  try { preference = localStorage.getItem('ikcalc-theme'); } catch (e) {}
  if (preference !== 'dark' && preference !== 'light') preference = null;
  function apply() {
    var dark = preference ? preference === 'dark' : media.matches;
    root.dataset.theme = dark ? 'dark' : 'light';
    var button = document.getElementById('themeToggle');
    if (button) button.setAttribute('aria-pressed', String(dark));
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', dark ? '#111923' : '#173b63');
  }
  apply();
  document.addEventListener('DOMContentLoaded', function () {
    apply();
    document.getElementById('themeToggle').addEventListener('click', function () {
      preference = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('ikcalc-theme', preference); } catch (e) {}
      apply();
    });
  });
  if (media.addEventListener) media.addEventListener('change', apply);
  else media.addListener(apply);
})();
