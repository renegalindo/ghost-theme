(function () {
  document.querySelectorAll('a').forEach(function (e) {
    if (!e.href || e.href.startsWith(window.origin)) {
      return;
    }

    e.target="_blank";
    e.rel='noopener noreferrer';
  });
})();