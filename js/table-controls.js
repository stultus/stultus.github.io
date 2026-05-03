// Sort + filter for [data-table-controls] feed tables. Vanilla JS, no deps.
(function () {
  function init(root) {
    var table = root.querySelector('table.feed-table');
    if (!table) return;
    var tbody = table.tBodies[0];
    var rows = Array.from(tbody.rows);
    var search = root.querySelector('.feed-search');
    var yMin = root.querySelector('.feed-year-min');
    var yMax = root.querySelector('.feed-year-max');
    var rMin = root.querySelector('.feed-rating-min');
    var live = root.querySelector('.feed-count-live');

    function applyFilter() {
      var q = (search && search.value || '').trim().toLowerCase();
      var lo = parseInt(yMin && yMin.value, 10);
      var hi = parseInt(yMax && yMax.value, 10);
      var minR = parseFloat(rMin && rMin.value);
      var visible = 0;
      rows.forEach(function (r) {
        var title = r.dataset.title || '';
        var year = parseInt(r.dataset.year, 10);
        var rating = parseFloat(r.dataset.rating) || 0;
        var ok = true;
        if (q && title.indexOf(q) === -1) ok = false;
        if (ok && !isNaN(lo) && (isNaN(year) || year < lo)) ok = false;
        if (ok && !isNaN(hi) && (isNaN(year) || year > hi)) ok = false;
        if (ok && !isNaN(minR) && rating < minR) ok = false;
        r.classList.toggle('is-hidden', !ok);
        if (ok) visible++;
      });
      if (live) live.textContent = visible + ' / ' + rows.length;
    }

    function sortBy(th) {
      var idx = Array.from(th.parentNode.children).indexOf(th);
      var type = th.dataset.sortType || 'text';
      var asc = !th.classList.contains('sorted-asc');
      Array.from(th.parentNode.children).forEach(function (h) {
        h.classList.remove('sorted-asc', 'sorted-desc');
      });
      th.classList.add(asc ? 'sorted-asc' : 'sorted-desc');
      var sorted = rows.slice().sort(function (a, b) {
        var av = a.cells[idx].dataset.sort || a.cells[idx].textContent.trim();
        var bv = b.cells[idx].dataset.sort || b.cells[idx].textContent.trim();
        if (type === 'num') { av = parseFloat(av) || 0; bv = parseFloat(bv) || 0; }
        return av < bv ? -1 : av > bv ? 1 : 0;
      });
      if (!asc) sorted.reverse();
      sorted.forEach(function (r) { tbody.appendChild(r); });
    }

    [search, yMin, yMax, rMin].forEach(function (el) {
      if (el) el.addEventListener('input', applyFilter);
    });
    Array.from(table.tHead.rows[0].cells).forEach(function (th) {
      if (th.classList.contains('sortable')) {
        th.addEventListener('click', function () { sortBy(th); });
      }
    });
    applyFilter();
  }

  document.querySelectorAll('[data-table-controls]').forEach(init);
})();
