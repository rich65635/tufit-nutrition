(function () {
  const APP_STORE_URL = ""; // Set your App Store URL here when available

  function setupMobileNav() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".nav-links");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function setupHeaderScroll() {
    const header = document.querySelector(".site-header");
    if (!header) return;

    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function setupReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach((el) => observer.observe(el));
  }

  function setupFaq() {
    document.querySelectorAll(".faq-item").forEach((item) => {
      const btn = item.querySelector(".faq-question");
      if (!btn) return;
      btn.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");
        document.querySelectorAll(".faq-item.open").forEach((openItem) => openItem.classList.remove("open"));
        if (!isOpen) item.classList.add("open");
      });
    });
  }

  function setupAppStoreLinks() {
    document.querySelectorAll("[data-app-store]").forEach((link) => {
      if (APP_STORE_URL) {
        link.href = APP_STORE_URL;
        link.removeAttribute("aria-disabled");
        link.classList.remove("disabled");
        link.target = "_blank";
        link.rel = "noopener";
      } else {
        link.href = "#download";
        link.setAttribute("aria-disabled", "true");
        link.classList.add("disabled");
        link.textContent = "Coming to the App Store";
        link.addEventListener("click", (e) => e.preventDefault());
      }
    });
  }

  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        const id = anchor.getAttribute("href");
        if (!id || id === "#") return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    setupAppStoreLinks();
    setupMobileNav();
    setupHeaderScroll();
    setupReveal();
    setupFaq();
    setupSmoothScroll();
  });
})();
