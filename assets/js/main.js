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

  /* ---------- 1b. Hero video (autoplay muted, play once, custom controls) ------ */
  // - falls back to the still image (or the labelled placeholder) if the file is missing
  // - reduced-motion visitors get just the poster until they press play
  // - pauses while off-screen and resumes (unless the visitor paused it themselves)
  // - custom bar: play/pause/replay, timeline, time, mute/unmute
  document.querySelectorAll(".asset-slot video").forEach(function (video) {
    var slot = video.closest(".asset-slot");
    var bar = slot.querySelector(".vc");
    function noop() {}
    function tryPlay() { var p = video.play(); if (p && p.catch) p.catch(noop); }

    function markMissing() {
      if (bar) bar.hidden = true;
      var fb = slot.querySelector(".hero__fallback");
      if (fb) { fb.hidden = false; video.hidden = true; slot.classList.add("has-fallback"); return; }
      slot.classList.add("is-missing");
    }
    var sources = video.querySelectorAll("source");
    if (sources.length) sources[sources.length - 1].addEventListener("error", markMissing);
    video.addEventListener("error", markMissing);
    // The failure can happen before this script runs (so the event is missed):
    // NETWORK_NO_SOURCE (3) means no source could be loaded.
    function checkSource() { if (video.networkState === 3) markMissing(); }
    checkSource();
    window.addEventListener("load", checkSource);

    var userPaused = false;   // visitor pressed pause: don't auto-resume
    var autoPaused = false;   // we paused it because it scrolled off-screen
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { video.removeAttribute("autoplay"); video.pause(); }

    if (bar) {
      video.removeAttribute("controls");   // native controls were the no-JS fallback
      bar.hidden = slot.classList.contains("is-missing");
      var playBtn = bar.querySelector(".vc__play");
      var muteBtn = bar.querySelector(".vc__mute");
      var seek = bar.querySelector(".vc__seek");
      var timeEl = bar.querySelector(".vc__time");
      var seeking = false;

      var fmt = function (t) {
        if (!isFinite(t) || t < 0) t = 0;
        var m = Math.floor(t / 60), s = Math.floor(t % 60);
        return m + ":" + (s < 10 ? "0" : "") + s;
      };
      function syncState() {
        var state = video.ended ? "ended" : (video.paused ? "paused" : "playing");
        bar.setAttribute("data-state", state);
        playBtn.setAttribute("aria-label", state === "playing" ? "Pause" : (state === "ended" ? "Replay" : "Play"));
      }
      function syncMute() {
        bar.setAttribute("data-muted", video.muted ? "true" : "false");
        muteBtn.setAttribute("aria-label", video.muted ? "Unmute" : "Mute");
      }
      function syncTime() {
        var d = video.duration, t = video.currentTime;
        var ratio = isFinite(d) && d > 0 ? t / d : 0;
        if (!seeking) seek.value = Math.round(ratio * 1000);
        seek.style.setProperty("--p", (ratio * 100).toFixed(2) + "%");
        var label = fmt(t) + " / " + fmt(d);
        if (timeEl.textContent !== label) {
          timeEl.textContent = label;
          seek.setAttribute("aria-valuetext", fmt(t) + " of " + fmt(d));
        }
      }
      function toggle() {
        if (video.ended) { video.currentTime = 0; userPaused = false; tryPlay(); }
        else if (video.paused) { userPaused = false; autoPaused = false; tryPlay(); }
        else { userPaused = true; video.pause(); }
      }

      ["play", "playing", "pause", "ended", "seeked"].forEach(function (ev) { video.addEventListener(ev, syncState); });
      ["timeupdate", "loadedmetadata", "durationchange", "seeked"].forEach(function (ev) { video.addEventListener(ev, syncTime); });
      video.addEventListener("volumechange", syncMute);
      playBtn.addEventListener("click", toggle);
      video.addEventListener("click", toggle);
      muteBtn.addEventListener("click", function () { video.muted = !video.muted; });
      seek.addEventListener("pointerdown", function () { seeking = true; });
      seek.addEventListener("pointerup", function () { seeking = false; });
      seek.addEventListener("input", function () {
        var d = video.duration;
        if (isFinite(d) && d > 0) video.currentTime = (seek.value / 1000) * d;
        seek.style.setProperty("--p", (seek.value / 10) + "%");
      });
      syncState(); syncMute(); syncTime();
    }

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            if (autoPaused && !userPaused && !video.ended) tryPlay();
            autoPaused = false;
          } else if (!video.paused && !video.ended) {
            autoPaused = true;
            video.pause();
          }
        });
      }, { threshold: 0.1 }).observe(video);
    }
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

  /* ---------- 4. Mobile nav dropdown ------------------------------ */
  var navToggle = document.querySelector(".site-nav__toggle");
  var navMenu = document.getElementById("nav-menu");

  if (navToggle && navMenu) {
    function closeNav() {
      navMenu.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
    function openNav() {
      navMenu.classList.add("is-open");
      navToggle.setAttribute("aria-expanded", "true");
    }

    navToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      if (navMenu.classList.contains("is-open")) { closeNav(); } else { openNav(); }
    });

    // Dismiss on outside click, Escape, or choosing a link.
    document.addEventListener("click", function (e) {
      if (!navMenu.contains(e.target) && e.target !== navToggle) closeNav();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
    navMenu.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav();
    });
  }

  /* ---------- 5. Smooth-scroll for in-page links ------------------ */
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
