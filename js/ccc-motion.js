(function () {
  "use strict";

  var root = document.querySelector(".dpod-redesign-case-page");
  if (!root) return;

  var items = Array.prototype.slice.call(root.querySelectorAll(".ccc-motion"));
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    items.forEach(function (item) { item.classList.add("is-in"); });
    return;
  }

  document.documentElement.classList.add("ccc-motion-enabled");

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.18,
    rootMargin: "0px 0px -8% 0px"
  });

  items.forEach(function (item) { observer.observe(item); });

  var parallaxItems = Array.prototype.slice.call(root.querySelectorAll("[data-parallax='true']"));
  if (!parallaxItems.length || window.matchMedia("(max-width: 800px)").matches) return;

  var ticking = false;
  function updateParallax() {
    parallaxItems.forEach(function (item) {
      var rect = item.getBoundingClientRect();
      var viewportCenter = window.innerHeight / 2;
      var itemCenter = rect.top + rect.height / 2;
      var offset = Math.max(-16, Math.min(16, (viewportCenter - itemCenter) * 0.035));
      item.style.setProperty("--ccc-parallax-y", offset.toFixed(2) + "px");
    });
    ticking = false;
  }

  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateParallax);
  }, { passive: true });

  updateParallax();
})();
