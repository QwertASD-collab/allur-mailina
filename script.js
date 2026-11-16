document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");

  const syncHeader = () => {
    if (header) {
      header.classList.toggle("header--scrolled", window.scrollY > 10);
    }
  };
  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });

  if (burger && nav) {
    burger.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Category filter
  const filterBtns = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".service-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");
      filterBtns.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      cards.forEach((card) => {
        const match = filter === "all" || card.getAttribute("data-cat") === filter;
        card.classList.toggle("is-hidden", !match);
      });
    });
  });

  // Pre-fill service when clicking card link
  const serviceSelect = document.getElementById("clientService");
  document.querySelectorAll(".service-link").forEach((link) => {
    link.addEventListener("click", () => {
      const val = link.getAttribute("data-service");
      if (!serviceSelect || !val) return;
      const exists = Array.from(serviceSelect.options).some((opt) => opt.value === val);
      if (!exists) {
        const opt = document.createElement("option");
        opt.value = val;
        opt.textContent = val;
        serviceSelect.prepend(opt);
      }
      serviceSelect.value = val;
    });
  });

  // Scroll reveal
  const revealTargets = document.querySelectorAll(
    ".section__head, .service-card, .promo-card, .brand-chip, .review-card, .booking-info, .booking-form"
  );
  revealTargets.forEach((el) => el.classList.add("reveal"));

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          if (el.classList.contains("service-card") || el.classList.contains("review-card")) {
            const idx = Array.from(el.parentElement.children).indexOf(el);
            el.style.transitionDelay = `${Math.min(idx * 60, 260)}ms`;
          }
          el.classList.add("is-visible");
          obs.unobserve(el);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -20px 0px" }
    );
    revealTargets.forEach((el) => observer.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }

  // WhatsApp booking
  const bookingForm = document.getElementById("bookingForm");
  if (bookingForm) {
    bookingForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = document.getElementById("clientName").value.trim();
      const phone = document.getElementById("clientPhone").value.trim();
      const car = document.getElementById("clientCar").value.trim();
      const service = document.getElementById("clientService").value;

      const lines = [
        "Здравствуйте! Хочу записаться на сервис в Allur Mailina.",
        `Имя: ${name}`,
        `Телефон: ${phone}`,
        `Автомобиль: ${car}`,
        `Услуга: ${service}`,
      ];

      const whatsappUrl = `https://wa.me/77750964845?text=${encodeURIComponent(lines.join("\n"))}`;
      window.open(whatsappUrl, "_blank", "noopener");
    });
  }
});
