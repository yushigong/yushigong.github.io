(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !("IntersectionObserver" in window)) {
    document.documentElement.classList.add("reveal-disabled");
    return;
  }

  var selectors = [
    ".case-header-section-container > *",
    ".case-meta-item",
    ".case-study-section-info-container > *:not(.large-spacing):not(.paragraph-spacing)",
    ".case-study-section-info-container-image-below > *:not(.large-spacing):not(.paragraph-spacing)",
    ".hmw-inner > *",
    ".project-cta-inner > *",
    ".other-projects-section .case-study-card",
    ".home-redesign .hero > *",
    ".home-redesign .section-heading-row",
    ".home-redesign .project-row",
    ".home-redesign .values-inner > *",
    ".about-redesign .about-hero > *",
    ".about-redesign .about-bio > *",
    ".about-redesign .about-capabilities > *",
    ".about-redesign .about-philosophy-inner > *"
  ];

  var items = Array.prototype.slice.call(document.querySelectorAll(selectors.join(",")));
  if (!items.length) return;

  document.documentElement.classList.add("reveal-enabled");

  items.forEach(function (item, index) {
    item.classList.add("scroll-reveal");
    if (item.classList.contains("quorum-visual-wide")) {
      item.classList.add("scroll-reveal-preserve-transform");
    }
    item.style.setProperty("--reveal-delay", Math.min((index % 4) * 55, 165) + "ms");
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-revealed");
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -8% 0px"
  });

  items.forEach(function (item) {
    observer.observe(item);
  });
})();
