(function () {
  const STORAGE_KEY = "tufit-lang";
  const APP_STORE_URL = ""; // Set your App Store URL here when available

  function detectLanguage() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "de" || stored === "en") return stored;
    const lang = navigator.language || navigator.userLanguage || "en";
    return lang.toLowerCase().startsWith("de") ? "de" : "en";
  }

  let currentLang = detectLanguage();

  function t(key) {
    return translations[currentLang][key] || translations.en[key] || key;
  }

  function applyTranslations() {
    document.documentElement.lang = currentLang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const value = t(key);
      if (el.hasAttribute("data-i18n-html")) {
        el.innerHTML = value;
      } else {
        el.textContent = value;
      }
    });

    document.title = t("meta.title");
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", t("meta.description"));

    document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
      const lang = btn.getAttribute("data-lang-btn");
      btn.classList.toggle("active", lang === currentLang);
      btn.setAttribute("aria-pressed", lang === currentLang ? "true" : "false");
    });

    document.querySelectorAll("[data-app-store]").forEach((el) => {
      const useSoon = !APP_STORE_URL;
      const key = el.getAttribute("data-i18n") || "hero.cta";
      const soonKey = key === "cta.button" ? "hero.cta.soon" : "hero.cta.soon";
      el.textContent = t(useSoon ? soonKey : key);
    });

    document.querySelectorAll(".lang-block").forEach((block) => {
      const show = block.classList.contains(`lang-${currentLang}`);
      block.hidden = !show;
    });

    document.dispatchEvent(new CustomEvent("tufit:langchange", { detail: { lang: currentLang } }));
  }

  function setLanguage(lang) {
    if (lang !== "de" && lang !== "en") return;
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    applyTranslations();
  }

  function setupLanguageToggle() {
    document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
      btn.addEventListener("click", () => setLanguage(btn.getAttribute("data-lang-btn")));
    });
  }

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
    applyTranslations();
    setupLanguageToggle();
    setupMobileNav();
    setupHeaderScroll();
    setupReveal();
    setupFaq();
    setupSmoothScroll();
  });

  window.TuFitSite = { setLanguage, t, getLanguage: () => currentLang };
})();
