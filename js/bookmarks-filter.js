// Filter the /bookmarks/ page by title / author / source / note as the user types.
(function () {
  var root = document.querySelector('[data-bookmarks-filter]');
  if (!root) return;
  var input = root.querySelector('.bookmarks-search');
  var count = root.querySelector('.bookmarks-count');
  var entries = Array.from(root.querySelectorAll('.bookmarks-entry'));
  var total = entries.length;

  function apply() {
    var q = (input && input.value || '').trim().toLowerCase();
    var visible = 0;
    entries.forEach(function (li) {
      var hit = !q || (li.dataset.search || '').indexOf(q) !== -1;
      li.classList.toggle('is-hidden', !hit);
      if (hit) visible++;
    });
    if (count) count.textContent = q ? visible + ' / ' + total : '';
  }

  if (input) input.addEventListener('input', apply);
  apply();
})();
