/* ============================================================
   BASE — Citas en línea (generador de demos por prospecto)
   Configuración por demo: window.BOOK definido en cada index.html
   ============================================================ */

(function () {
  "use strict";

  var WHATSAPP_NUMBER = "529601427950"; // LEADS DE DEMO -> SolucionesTech
  var BOOK = window.BOOK || {
    business: "Negocio",
    proposito: "agendar una cita en",
    cta: "Confirmar cita por WhatsApp",
    hint: "Al confirmar se abre WhatsApp con tus datos listos.",
    allowSunday: false
  };

  /* ---------- Navbar ---------- */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (window.scrollY > 30) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("navMenu");
  toggle.addEventListener("click", function () {
    var open = menu.classList.toggle("open");
    toggle.classList.toggle("active", open);
    document.body.classList.toggle("lock", open);
    toggle.setAttribute("aria-expanded", open);
  });
  menu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      menu.classList.remove("open");
      toggle.classList.remove("active");
      document.body.classList.remove("lock");
    });
  });

  /* ---------- Reveal ---------- */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("visible"); revealObserver.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(function (el) { revealObserver.observe(el); });

  /* ============================================================
     CALENDARIO DE CITAS / PEDIDOS
     ============================================================ */

  var MONTHS = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  var TIME_SLOTS = ["09:00", "10:00", "11:00", "12:00", "13:00",
                    "14:00", "15:00", "16:00", "17:00", "18:00"];

  var calPrev = document.getElementById("calPrev");
  var calNext = document.getElementById("calNext");
  var calTitle = document.getElementById("calTitle");
  var calGrid = document.getElementById("calGrid");
  var slotsBox = document.getElementById("slots");
  var serviceGrid = document.getElementById("serviceGrid");
  var summary = document.getElementById("summary");
  var confirmBtn = document.getElementById("confirmBtn");
  confirmBtn.textContent = BOOK.cta;

  var view = new Date();
  view.setDate(1);
  var selection = { service: null, price: null, date: null, slot: null };

  function pad(n) { return String(n).padStart(2, "0"); }
  function fmtPrice(p) {
    if (!p) return "";
    if (/^desde\s*/i.test(p)) return p;
    if (p.charAt(0) === "$") return p;
    return "$" + p;
  }

  /* ---------- Render calendario ---------- */
  function renderCalendar() {
    var y = view.getFullYear(), m = view.getMonth();
    calTitle.textContent = MONTHS[m] + " " + y;

    var today = new Date(); today.setHours(0, 0, 0, 0);
    calPrev.disabled = m <= today.getMonth() && y <= today.getFullYear();

    var first = new Date(y, m, 1);
    var offset = (first.getDay() + 6) % 7;
    var daysInMonth = new Date(y, m + 1, 0).getDate();
    var html = "";

    for (var i = 0; i < offset; i++) html += '<span class="cal-cell empty"></span>';

    for (var d = 1; d <= daysInMonth; d++) {
      var dt = new Date(y, m, d);
      var isPast = dt < today;
      var isSunday = dt.getDay() === 0;
      var disabled = isPast || (isSunday && !BOOK.allowSunday);
      var iso = y + "-" + pad(m + 1) + "-" + pad(d);
      var selected = selection.date === iso;
      var isToday = dt.getTime() === today.getTime();

      html += '<button type="button" class="cal-cell' +
        (disabled ? " disabled" : "") +
        (selected ? " selected" : "") +
        (isToday ? " today" : "") +
        '" data-date="' + iso + '"' +
        (disabled ? ' disabled' : '') + '>' + d + "</button>";
    }

    calGrid.innerHTML = html;
  }

  calGrid.addEventListener("click", function (ev) {
    var cell = ev.target.closest(".cal-cell[data-date]");
    if (!cell || cell.disabled) return;
    selection.date = cell.getAttribute("data-date");
    selection.slot = null;
    renderCalendar();
    renderSlots();
    updateSummary();
  });

  /* ---------- Render horas ---------- */
  function renderSlots() {
    var html = TIME_SLOTS.map(function (t) {
      return '<button type="button" class="slot' + (selection.slot === t ? " selected" : "") + '" data-slot="' + t + '">' + t + "</button>";
    }).join("");
    slotsBox.innerHTML = html;
  }

  slotsBox.addEventListener("click", function (ev) {
    var slot = ev.target.closest(".slot[data-slot]");
    if (!slot) return;
    selection.slot = slot.getAttribute("data-slot");
    renderSlots();
    updateSummary();
  });

  /* ---------- Elección de servicio ---------- */
  serviceGrid.addEventListener("click", function (ev) {
    var chip = ev.target.closest(".service-chip");
    if (!chip) return;
    var wasSelected = chip.classList.contains("selected");

    serviceGrid.querySelectorAll(".service-chip").forEach(function (c) {
      c.classList.remove("selected");
    });

    if (!wasSelected) {
      chip.classList.add("selected");
      selection.service = chip.getAttribute("data-service");
      selection.price = chip.getAttribute("data-price");
    } else {
      selection.service = null;
      selection.price = null;
    }
    updateSummary();
  });

  /* ---------- Resumen + botón ---------- */
  function fmtDate(iso) {
    var parts = iso.split("-");
    return parts[2] + "/" + parts[1] + "/" + parts[0];
  }

  function updateSummary() {
    var svc = selection.service, pr = selection.price;
    var dt = selection.date, tm = selection.slot;
    var done = svc && dt && tm;

    if (!done) {
      var pendientes = [];
      if (!svc) pendientes.push("servicio");
      if (!dt) pendientes.push("día");
      if (!tm) pendientes.push("hora");
      summary.textContent = "Falta: " + pendientes.join(", ") + ".";
      summary.classList.remove("filled");
      confirmBtn.disabled = true;
      return;
    }

    summary.innerHTML =
      "<strong>" + svc + "</strong> · " + fmtPrice(pr) +
      " &nbsp;→&nbsp; <strong>" + fmtDate(dt) + "</strong> a las <strong>" + tm + "</strong>";
    summary.classList.add("filled");
    confirmBtn.disabled = false;
  }

  /* ---------- Confirmar por WhatsApp ---------- */
  confirmBtn.addEventListener("click", function () {
    if (!selection.service || !selection.date || !selection.slot) return;

    var texto =
      "Hola, quiero " + BOOK.proposito + " " + BOOK.business + "." +
      "\n\n• " + (BOOK.itemLabel || "Servicio") + ": " + selection.service + " (" + fmtPrice(selection.price) + ")" +
      "\n• Fecha: " + fmtDate(selection.date) +
      "\n• Hora: " + selection.slot +
      "\n\nNombre: ___" +
      "\n\n¿Me confirman?";

    var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(texto);
    window.open(url, "_blank", "noopener");
  });

  /* ---------- Navegación de meses ---------- */
  calNext.addEventListener("click", function () {
    view.setMonth(view.getMonth() + 1);
    renderCalendar();
  });
  calPrev.addEventListener("click", function () {
    view.setMonth(view.getMonth() - 1);
    renderCalendar();
  });

  /* ---------- Init ---------- */
  renderCalendar();
  renderSlots();
  updateSummary();
})();