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
    ".case-study-section-info-container > *:not(.large-spacing):not(.paragraph-spacing):not(.ccc-motion):not(.ccc-workflow-gallery)",
    ".case-study-section-info-container-image-below > *:not(.large-spacing):not(.paragraph-spacing):not(.ccc-motion):not(.ccc-workflow-gallery)",
    ".hmw-inner > *",
    ".project-cta-inner > *",
    ".other-projects-section .case-study-card",
    ".home-redesign .hero > *",
    ".home-redesign .section-heading-row",
    ".home-redesign .project-row",
    ".about-redesign .about-hero > *",
    ".about-redesign .about-bio > *",
    ".about-redesign .about-capabilities > *",
    ".about-redesign .about-philosophy-inner > *"
  ];

  var items = Array.prototype.slice.call(document.querySelectorAll(selectors.join(",")));

  // Give every content image in the two newest DPoD case studies a clear upward reveal.
  var caseImages = Array.prototype.slice.call(document.querySelectorAll(
    ".quorum-case-page .case-study-section-info-container img, " +
    ".quorum-case-page .case-study-section-info-container-image-below img, " +
    ".dpod-redesign-case-page .case-study-section-info-container img:not(.ccc-motion-asset), " +
    ".dpod-redesign-case-page .case-study-section-info-container-image-below img:not(.ccc-motion-asset)"
  ));
  caseImages.forEach(function (img) {
    img.classList.add("case-image-rise");
    if (items.indexOf(img) === -1) items.push(img);
  });

  if (!items.length) return;

  document.documentElement.classList.add("reveal-enabled");

  items.forEach(function (item, index) {
    item.classList.add("scroll-reveal");
    if (item.classList.contains("quorum-visual-wide")) {
      item.classList.add("scroll-reveal-preserve-transform");
    }
    item.style.setProperty("--reveal-delay", Math.min((index % 4) * 55, 165) + "ms");
  });

  // Make the initial HMW read as a deliberate two-step reveal.
  document.querySelectorAll(".hmw-band-initial .hmw-inner > *").forEach(function (item, index) {
    item.style.setProperty("--reveal-delay", (index * 130) + "ms");
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

  // Give What I Value its own editorial sequence instead of the generic reveal.
  var valuesSection = document.querySelector(".home-redesign .values-section");
  if (valuesSection) {
    valuesSection.classList.add("values-fx-ready");
    var valueObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        valuesSection.classList.add("is-values-visible");
        window.setTimeout(function () {
          valuesSection.classList.add("values-entry-done");
        }, 1300);
        valueObserver.unobserve(valuesSection);
      });
    }, {
      threshold: 0.22,
      rootMargin: "0px 0px -10% 0px"
    });
    valueObserver.observe(valuesSection);
  }
})();
