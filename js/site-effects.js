(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  // Reading progress — useful across long case studies, subtle on short pages.
  var progress = document.createElement("div");
  progress.className = "site-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.appendChild(progress);

  function updateProgress() {
    var doc = document.documentElement;
    var max = Math.max(1, doc.scrollHeight - doc.clientHeight);
    progress.style.transform = "scaleX(" + Math.min(1, Math.max(0, doc.scrollTop / max)) + ")";
  }
  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);

  // Custom coral cursor. It is disabled for touch, reduced motion, controls and text-heavy areas.
  if (finePointer && !reduceMotion) {
    root.classList.add("has-fx-cursor");
    var cursor = document.createElement("div");
    cursor.className = "fx-cursor is-hidden";
    cursor.setAttribute("aria-hidden", "true");
    document.body.appendChild(cursor);

    var mouseX = -100, mouseY = -100, currentX = -100, currentY = -100;
    var projectMode = false;
    var raf = 0;
    function renderCursor() {
      // The project label trails the pointer and sits just to its lower-right.
      var targetX = mouseX + (projectMode ? 92 : 0);
      var targetY = mouseY + (projectMode ? 30 : 0);
      var ease = projectMode ? 0.14 : 0.2;
      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;
      cursor.style.transform = "translate3d(" + currentX + "px," + currentY + "px,0) translate(-50%,-50%)";
      raf = requestAnimationFrame(renderCursor);
    }
    window.addEventListener("mousemove", function (event) {
      mouseX = event.clientX;
      mouseY = event.clientY;
      cursor.classList.remove("is-hidden");
    }, { passive: true });
    document.addEventListener("mouseleave", function () { cursor.classList.add("is-hidden"); });
    document.addEventListener("mouseover", function (event) {
      var target = event.target;
      var project = target && target.closest(".home-redesign .project-row");
      var interactive = target && target.closest("a, button, [role='button'], .project-row, .capability-card");
      var native = target && target.closest("input, textarea, select, video, [contenteditable='true']");
      projectMode = !!project && !native;
      cursor.classList.toggle("is-project", projectMode);
      cursor.classList.toggle("is-hover", !!interactive && !native);
      cursor.classList.toggle("is-native", !!native);
    });
    raf = requestAnimationFrame(renderCursor);
  }

  if (reduceMotion) return;

  // Slow the marquee without changing its animation duration. Adjusting the
  // duration mid-animation recalculates progress and makes the copy jump.
  var marquee = document.querySelector(".portfolio-marquee");
  var marqueeTrack = marquee && marquee.querySelector(".marquee-track");
  if (marquee && marqueeTrack) {
    function setMarqueeRate(rate) {
      marqueeTrack.getAnimations().forEach(function (animation) {
        animation.updatePlaybackRate(rate);
      });
    }
    marquee.addEventListener("mouseenter", function () { setMarqueeRate(0.72); });
    marquee.addEventListener("mouseleave", function () { setMarqueeRate(1); });
  }

  // Home hero line-mask reveal.
  document.querySelectorAll(".home-redesign .hero-line").forEach(function (line, index) {
    line.classList.add("fx-line");
    line.style.setProperty("--fx-delay", (100 + index * 140) + "ms");
    window.setTimeout(function () { line.classList.add("is-in"); }, 80);
  });

  // About hero uses the same line-by-line motion language as the homepage.
  var portrait = document.querySelector(".about-redesign .about-portrait");
  if (portrait) {
    portrait.classList.add("fx-portrait-reveal");
    requestAnimationFrame(function () { portrait.classList.add("is-in"); });
  }

  // Home project image parallax and kinetic hover.
  document.querySelectorAll(".home-redesign .project-row").forEach(function (row) {
    var media = row.querySelector(".project-media");
    var visual = media && media.querySelector("img, video");
    if (!media || !visual || !finePointer) return;
    row.addEventListener("mousemove", function (event) {
      var rect = row.getBoundingClientRect();
      var x = (event.clientX - rect.left) / rect.width - 0.5;
      var y = (event.clientY - rect.top) / rect.height - 0.5;
      visual.style.setProperty("--pointer-x", (x * 12).toFixed(2) + "px");
      visual.style.setProperty("--pointer-y", (y * 10).toFixed(2) + "px");
    }, { passive: true });
    row.addEventListener("mouseleave", function () {
      visual.style.setProperty("--pointer-x", "0px");
      visual.style.setProperty("--pointer-y", "0px");
    });
  });

  // Project hero image: one restrained parallax treatment only.
  var cover = document.querySelector(".unified-case-page:not(.dpod-redesign-case-page) .case-header-section-container > img");
  if (cover) {
    cover.classList.add("fx-case-cover");
    var coverWrap = cover.parentElement;
    function updateCover() {
      var rect = coverWrap.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      var amount = Math.max(-1, Math.min(1, (window.innerHeight / 2 - (rect.top + rect.height / 2)) / window.innerHeight));
      cover.style.setProperty("--case-parallax", (amount * 18).toFixed(1) + "px");
    }
    updateCover();
    window.addEventListener("scroll", updateCover, { passive: true });
  }
})();
