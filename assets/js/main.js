/* =====================================================================
   Sahayya case study — interactions
   - Image placeholder fallback for /images assets not yet exported
   - Scroll-spy: highlight the active section in the sidebar
   - Fade-in on scroll for sections
   ===================================================================== */

(function () {
  "use strict";

  /* ---------- 1. Asset-slot fallback ------------------------------- */
  // If an exported image is missing, flag its slot so CSS shows a
  // labelled placeholder instead of a broken-image icon.
  document.querySelectorAll(".asset-slot").forEach(function (slot) {
    var img = slot.querySelector("img");
    if (!img) return;

    function markMissing() { slot.classList.add("is-missing"); }

    if (img.complete) {
      // Already resolved (from cache) — naturalWidth 0 means it failed.
      if (img.naturalWidth === 0) markMissing();
    }
    img.addEventListener("error", markMissing);
  });

  /* ---------- 2. Fade-in on scroll -------------------------------- */
  var faders = document.querySelectorAll(".section, .persona, .ui-card, .error-card");
  faders.forEach(function (el) { el.classList.add("fade-in"); });

  if ("IntersectionObserver" in window) {
    var fadeObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    faders.forEach(function (el) { fadeObserver.observe(el); });
  } else {
    faders.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- 3. Scroll-spy for the sidebar ----------------------- */
  var links = Array.prototype.slice.call(
    document.querySelectorAll(".section-nav__link")
  );
  var sections = links
    .map(function (link) {
      var id = link.getAttribute("href");
      return id && id.charAt(0) === "#" ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  function setActive(id) {
    links.forEach(function (link) {
      link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
    });
  }

  if ("IntersectionObserver" in window && sections.length) {
    var visible = {};
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          visible[entry.target.id] = entry.isIntersecting
            ? entry.intersectionRatio
            : 0;
        });
        // Pick the section with the greatest visible ratio.
        var bestId = null;
        var bestRatio = 0;
        Object.keys(visible).forEach(function (id) {
          if (visible[id] > bestRatio) { bestRatio = visible[id]; bestId = id; }
        });
        if (bestId) setActive(bestId);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    sections.forEach(function (sec) { spy.observe(sec); });
  }

  /* ---------- 4. Smooth-scroll for in-page links ------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var targetId = link.getAttribute("href");
      if (targetId.length < 2) return; // bare "#"
      var target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", targetId);
    });
  });
})();
