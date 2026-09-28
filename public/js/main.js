(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------------------------------------------------------
     Bottom fixed menu (tablet / mobile): expand / collapse
     --------------------------------------------------------- */
  const bottomMenu = document.querySelector("[data-bottom-menu]");
  const menuToggle = document.querySelector("[data-menu-toggle]");

  if (bottomMenu && menuToggle) {
    const closeMenu = () => {
      bottomMenu.removeAttribute("data-open");
      menuToggle.setAttribute("aria-expanded", "false");
    };

    const toggleMenu = () => {
      const isOpen = bottomMenu.getAttribute("data-open") === "true";
      if (isOpen) {
        closeMenu();
      } else {
        bottomMenu.setAttribute("data-open", "true");
        menuToggle.setAttribute("aria-expanded", "true");
      }
    };

    menuToggle.addEventListener("click", toggleMenu);

    bottomMenu.querySelectorAll("[data-menu-link]").forEach((link) => {
      link.addEventListener("click", () => {
        closeMenu();
      });
    });

    document.addEventListener("click", (event) => {
      if (!bottomMenu.contains(event.target)) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });
  }

  /* ---------------------------------------------------------
     Decorative dots: staggered fade-in + scale on scroll into view
     --------------------------------------------------------- */
  const dotGroups = document.querySelectorAll("[data-animate-dots]");

  if (dotGroups.length) {
    const STAGGER_MS = 30;

    dotGroups.forEach((group) => {
      const shapes = group.querySelectorAll("circle, path");
      shapes.forEach((shape, index) => {
        shape.style.setProperty("--d", `${index * STAGGER_MS}ms`);
      });
    });

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      dotGroups.forEach((group) => group.classList.add("is-visible"));
    } else {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );

      dotGroups.forEach((group) => observer.observe(group));
    }
  }

  /* ---------------------------------------------------------
     Video section: lazy-load, autoplay muted/looped on scroll
     into view, no manual controls. Skipped under reduced motion.
     --------------------------------------------------------- */
  const lazyVideos = document.querySelectorAll("[data-lazy-video]");

  if (lazyVideos.length && !prefersReducedMotion && "IntersectionObserver" in window) {
    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            if (!video.src && video.dataset.src) {
              video.src = video.dataset.src;
            }
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.35 }
    );

    lazyVideos.forEach((video) => videoObserver.observe(video));
  }
})();
