/* ============================================================
   TU DIGITAL .MX — Interacciones
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Config: pon aquí tu número real ----------
     Formato: 52 + código de área + número (10 dígitos), sin espacios.
     Ejemplo Chiapas: "5219611234567"  ->  wa.me/5219611234567
  */
  var WHATSAPP_NUMBER = "529601427950";
  var WA_HOME = "https://wa.me/" + WHATSAPP_NUMBER;

  /* ---------- Navbar scroll ---------- */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (window.scrollY > 30) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Menú móvil ---------- */
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("navMenu");

  function closeMenu() {
    toggle.classList.remove("active");
    menu.classList.remove("open");
    document.body.classList.remove("lock");
    toggle.setAttribute("aria-expanded", "false");
  }
  function openMenu() {
    toggle.classList.add("active");
    menu.classList.add("open");
    document.body.classList.add("lock");
    toggle.setAttribute("aria-expanded", "true");
  }

  toggle.addEventListener("click", function () {
    if (menu.classList.contains("open")) closeMenu();
    else openMenu();
  });

  menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  /* ---------- Link activo al hacer scroll ---------- */
  var sections = document.querySelectorAll("section[id]");
  var navLinks = document.querySelectorAll(".nav-link");

  var spy = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.getAttribute("id");
        navLinks.forEach(function (link) {
          link.classList.toggle("active", link.getAttribute("href") === "#" + id);
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );

  sections.forEach(function (section) { spy.observe(section); });

  /* ---------- Animaciones al hacer scroll ---------- */
  var revealItems = document.querySelectorAll(".reveal");

  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach(function (item) { revealObserver.observe(item); });

  /* ---------- URLs de WhatsApp ---------- */
  var direct = document.getElementById("directWhatsApp");
  var footer = document.getElementById("footerWhatsApp");
  var floating = document.getElementById("floatingWhatsApp");

  if (direct) direct.setAttribute("href", WA_HOME + "?text=" + encodeURIComponent("Hola, quiero una página web para mi negocio."));
  if (footer) footer.setAttribute("href", WA_HOME);
  if (floating) floating.setAttribute("href", WA_HOME + "?text=" + encodeURIComponent("Hola, vi tu página y quiero cotizar una web para mi negocio."));

  /* ---------- Números de teléfono solo dígitos ---------- */
  var telInput = document.getElementById("whatsapp");
  if (telInput) {
    telInput.addEventListener("input", function () {
      this.value = this.value.replace(/[^\d]/g, "").slice(0, 10);
    });
  }

  /* ---------- Formulario -> WhatsApp ---------- */
  var form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var nombre = form.querySelector("#nombre").value.trim();
      var negocio = form.querySelector("#negocio").value.trim();
      var whatsapp = form.querySelector("#whatsapp").value.trim();
      var mensaje = form.querySelector("#mensaje").value.trim();

      var ok = true;
      if (!nombre) { markInvalid("nombre"); ok = false; } else { clearInvalid("nombre"); }
      if (!whatsapp || whatsapp.length < 10) { markInvalid("whatsapp"); ok = false; } else { clearInvalid("whatsapp"); }
      if (!ok) return;

      var texto =
        "Hola, soy *" + nombre + "*" +
        (negocio ? ", de *" + negocio + "*" : "") +
        ".\n" +
        "Te escribo desde tu página web porque quiero una página para mi negocio.\n" +
        "Mi WhatsApp es: *" + whatsapp + "*" +
        (mensaje ? "\n\nDetalle: " + mensaje : "") +
        "\n\n¿Podemos agendar una consulta?";

      form.querySelector("button[type='submit']").disabled = true;
      var oldText = form.querySelector("button[type='submit']").innerHTML;
      form.querySelector("button[type='submit']").innerHTML = "Abriendo WhatsApp...";

      var url = WA_HOME + "?text=" + encodeURIComponent(texto);
      setTimeout(function () {
        window.open(url, "_blank", "noopener");
        form.querySelector("button[type='submit']").disabled = false;
        form.querySelector("button[type='submit']").innerHTML = oldText;
        form.reset();
      }, 400);
    });

    function markInvalid(id) {
      var g = form.querySelector("#" + id).closest(".form-group");
      g && g.classList.add("invalid");
    }
    function clearInvalid(id) {
      var g = form.querySelector("#" + id).closest(".form-group");
      g && g.classList.remove("invalid");
    }
  }
})();