/* ============================================================
   PET & VET CENTRO — Demo completa (Web + WhatsApp + PDV + Citas)
   Fluent / Windows 11 · ES5-friendly · localStorage para demo
   ============================================================ */
(function () {
  "use strict";

  var APP = window.APP || { negocio: "Pet & Vet Centro", whatsapp: "529601427950", direccion: "Centro · Berriozábal" };
  var WHATSAPP = APP.whatsapp;
  var BUSINESS = APP.negocio;

  var $ = function (sel) { return document.querySelector(sel); };
  var $$ = function (sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); };
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function money(n) { return "$" + n.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function fmtFecha(iso) {
    var p = iso.split("-");
    return p[2] + "/" + p[1] + "/" + p[0];
  }
  function hoyISO() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function toast(msg) {
    var t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._id);
    t._id = setTimeout(function () { t.classList.remove("show"); }, 2600);
  }

  /* ============================================================
     DATOS DEMO
     ============================================================ */
  var SERVICIOS = [
    { n: "Consulta general", p: "$250" },
    { n: "Vacunación", p: "$180" },
    { n: "Desparasitación", p: "$120" },
    { n: "Baño y corte", p: "desde $200" },
    { n: "Esterilización", p: "desde $600" },
    { n: "Urgencias", p: "$350" }
  ];

  var PRODUCTOS = [
    { id: "p1", cat: "alimento", e: "🦴", n: "Croquetas perro 3 kg", d: "Adulto raza mediana", pr: 289 },
    { id: "p2", cat: "alimento", e: "🐱", n: "Croquetas gato 1.5 kg", d: "Mantenimiento", pr: 199 },
    { id: "p3", cat: "alimento", e: "🦴", n: "Snacks premium", d: "Premios suaves", pr: 59 },
    { id: "p4", cat: "alimento", e: "🥫", n: "Alimento húmedo", d: "Sobre 100 g", pr: 35 },
    { id: "p5", cat: "cuidado", e: "🩹", n: "Antipulgas y garrapatas", d: "3 pipetas", pr: 149 },
    { id: "p6", cat: "cuidado", e: "🧴", n: "Shampoo hipoalergénico", d: "250 ml", pr: 89 },
    { id: "p7", cat: "cuidado", e: "💊", n: "Vitaminas + omega", d: "60 tabletas", pr: 129 },
    { id: "p8", cat: "cuidado", e: "🪣", n: "Arena para gato", d: "Absorbente 5 kg", pr: 95 },
    { id: "p9", cat: "accesorios", e: "🦮", n: "Collar + correa", d: "Talla M, regulable", pr: 119 },
    { id: "p10", cat: "accesorios", e: "🛏️", n: "Camita suave", d: "Mediana, lavable", pr: 349 },
    { id: "p11", cat: "accesorios", e: "🍽️", n: "Comedero doble", d: "Acero inoxidable", pr: 89 },
    { id: "p12", cat: "accesorios", e: "🧸", n: "Juguete interactivo", d: "Con sonido", pr: 45 }
  ];

  var ESTADOS = ["Pendiente", "Confirmada", "Completada", "Cancelada"];

  /* ============================================================
     TEMA (claro / oscuro)
     ============================================================ */
  var themeBtn = $("#themeToggle");
  function applyTheme(dark) {
    document.body.classList.toggle("dark", dark);
    $("#icoMoon").innerHTML = dark
      ? '<circle cx="12" cy="12" r="4.4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'
      : '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>';
  }
  applyTheme(store.get("pvc_theme", false));
  themeBtn.addEventListener("click", function () {
    var dark = !document.body.classList.contains("dark");
    store.set("pvc_theme", dark);
    applyTheme(dark);
  });

  /* ============================================================
     ROUTER DE VISTAS
     ============================================================ */
  var current = "home";
  function go(view) {
    current = view;
    $$(".view").forEach(function (v) { v.classList.toggle("active", v.id === "view-" + view); });
    $$("[data-nav]").forEach(function (el) {
      el.classList.toggle("active", el.getAttribute("data-nav") === view);
    });
    if (!$("#bottomNav").classList.contains("hidden")) window.scrollTo({ top: 0, behavior: "smooth" });
  }
  $$("[data-nav]").forEach(function (el) {
    el.addEventListener("click", function () { go(el.getAttribute("data-nav")); });
  });

  // Topbar con sombra
  var topbar = $("#topbar");
  window.addEventListener("scroll", function () {
    topbar.classList.toggle("scrolled", window.scrollY > 10);
  }, { passive: true });

  /* ============================================================
     PRECIOS
     ============================================================ */
  function renderPrecios() {
    $("#priceTable").innerHTML = SERVICIOS.map(function (s) {
      return '<div class="price-row"><div class="price-info"><span class="price-name">' + esc(s.n) +
        '</span></div><div class="price-amt"><button class="price-cta" data-nav="citas">Agendar</button><span class="price-val">' +
        esc(s.p) + "</span></div></div>";
    }).join("");
  }
  $("#priceTable").addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-nav]");
    if (b) go(b.getAttribute("data-nav"));
  });

  /* ============================================================
     TIENDA / PUNTO DE VENTA
     ============================================================ */
  var cart = store.get("pvc_cart", []);

  function renderShop(cat) {
    var list = cat === "todos" ? PRODUCTOS : PRODUCTOS.filter(function (p) { return p.cat === cat; });
    $("#productGrid").innerHTML = list.map(function (p) {
      return '<article class="card product"><div class="product-top"><span class="product-emoji">' + p.e +
        '</span><span class="cat">' + esc(p.cat) + "</span></div><h4>" + esc(p.n) + '</h4><p class="price">' +
        money(p.pr) + '</p><button class="btn btn-accent btn-sm add-btn" data-add="' + p.id + '">+ Agregar</button></article>';
    }).join("");
  }

  $("#productGrid").addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-add]");
    if (!b) return;
    addToCart(b.getAttribute("data-add"));
  });

  $("#filters").addEventListener("click", function (ev) {
    var c = ev.target.closest("[data-cat]");
    if (!c) return;
    $$("#filters .chip").forEach(function (x) { x.classList.toggle("active", x === c); });
    renderShop(c.getAttribute("data-cat"));
  });

  function cartItem(id) { return cart.filter(function (i) { return i.id === id; })[0]; }
  function addToCart(id, q) {
    var it = cartItem(id);
    if (it) it.q += (q || 1);
    else cart.push({ id: id, q: q || 1 });
    store.set("pvc_cart", cart);
    renderCart();
    toast("Agregado al carrito 🛒");
  }
  function setQty(id, q) {
    var it = cartItem(id);
    if (!it) return;
    if (q <= 0) cart = cart.filter(function (i) { return i.id !== id; });
    else it.q = q;
    store.set("pvc_cart", cart);
    renderCart();
  }

  function prod(id) { return PRODUCTOS.filter(function (p) { return p.id === id; })[0]; }

  function cartTotals() {
    var sub = cart.reduce(function (a, i) { return a + (prod(i.id) ? prod(i.id).pr * i.q : 0); }, 0);
    var iva = sub * 0.16;
    var full = sub + iva;
    var shipping = sub >= 500 ? 0 : 40;
    var total = full + shipping;
    return { sub, iva, full, shipping, total };
  }

  function renderCart() {
    var totalQty = cart.reduce(function (a, i) { return a + i.q; }, 0);
    var fabC = $("#fabCount");
    fabC.textContent = totalQty;
    fabC.classList.toggle("zero", totalQty === 0);
    $("#cartCountLabel").textContent = totalQty ? "(" + totalQty + ")" : "";

    if (!cart.length) {
      $("#cartItems").innerHTML = '<div class="cart-empty"><span class="emoji">🛒</span>Tu carrito está vacío.<br>Agrega productos de la tienda.</div>';
      $("#cartFoot").style.display = "none";
      return;
    }
    $("#cartFoot").style.display = "";
    $("#cartItems").innerHTML = cart.map(function (i) {
      var p = prod(i.id);
      return '<div class="cart-item"><span class="emoji">' + p.e + '</span><div class="info"><span class="nm">' + esc(p.n) +
        '</span><span class="pr">' + money(p.pr) + "</span></div>" +
        '<div class="qty"><button data-q="-1" data-id="' + i.id + '">−</button><span>' + i.q + '</span><button data-q="1" data-id="' + i.id + '">+</button></div></div>';
    }).join("");

    var t = cartTotals();
    $("#cartTotals").innerHTML =
      "<div><span>Subtotal</span><span>" + money(t.sub) + "</span></div>" +
      "<div><span>IVA (16%)</span><span>" + money(t.iva) + "</span></div>" +
      "<div><span>Envío</span><span class='" + (t.shipping === 0 ? "free" : "") + "'>" + (t.shipping === 0 ? "GRATIS 🎉" : money(t.shipping)) + "</span></div>" +
      '<div class="grand"><span>Total</span><span>' + money(t.total) + "</span></div>";
  }

  function openCart() { $("#cart").classList.add("open"); $("#cartOverlay").classList.add("show"); document.body.classList.add("lock"); }
  function closeCart() { $("#cart").classList.remove("open"); $("#cartOverlay").classList.remove("show"); document.body.classList.remove("lock"); }
  $("#openCartBtn").addEventListener("click", openCart);
  $("#fabCart").addEventListener("click", openCart);
  $("#closeCart").addEventListener("click", closeCart);
  $("#cartOverlay").addEventListener("click", closeCart);

  $("#cartItems").addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-q]");
    if (!b) return;
    setQty(b.getAttribute("data-id"), parseInt(b.getAttribute("data-q"), 10));
  });

  $("#checkoutBtn").addEventListener("click", function () {
    if (!cart.length) { toast("Tu carrito está vacío"); return; }
    var t = cartTotals();
    var lineas = cart.map(function (i) {
      var p = prod(i.id);
      return "• " + p.n + " × " + i.q + " = " + money(p.pr * i.q);
    }).join("\n");
    var texto =
      "Hola, quiero hacer un pedido en " + BUSINESS + ". 🛒\n\n" +
      lineas +
      "\n\nSubtotal: " + money(t.sub) +
      "\nIVA (16%): " + money(t.iva) +
      "\nEnv\u00edo: " + (t.shipping === 0 ? "GRATIS" : money(t.shipping)) +
      "\n*TOTAL: " + money(t.total) + "*" +
      "\n\nNombre: ___" +
      "\nDirecci\u00f3n: ___" +
      "\n\n¿Me confirman el pedido?";
    window.open("https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(texto), "_blank", "noopener");
    toast("Pedido enviado a WhatsApp 📲");
  });

  /* ============================================================
     CITAS (registro)
     ============================================================ */
  var dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  var MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  var HORAS = [];
  for (var h = 9; h <= 18; h++) HORAS.push(String(h).padStart(2, "0") + ":00");

  var citaActual = null;

  (function initForm() {
    $("#cServicio").innerHTML = SERVICIOS.map(function (s) { return '<option value="' + esc(s.n) + '">' + esc(s.n) + " (" + esc(s.p) + ")</option>"; }).join("");
    $("#cHora").innerHTML = HORAS.map(function (t) { return '<option value="' + t + '">' + t + "</option>"; }).join("");
    var f = $("#cFecha");
    f.min = hoyISO();
    if (!f.value) f.value = hoyISO();
  })();

  function fechaLegible(iso) {
    var p = iso.split("-");
    var d = new Date(p[0], p[1] - 1, p[2]);
    return dias[d.getDay()] + " " + p[2] + " de " + MESES[d.getMonth()] + " de " + p[0];
  }

  $("#citaForm").addEventListener("submit", function (ev) {
    ev.preventDefault();
    var servicio = $("#cServicio").value;
    var fecha = $("#cFecha").value;
    var hora = $("#cHora").value;
    var nombre = $("#cNombre").value.trim();
    var mascota = $("#cMascota").value.trim();
    var tel = $("#cTel").value.replace(/\D/g, "");

    var serv = SERVICIOS.filter(function (s) { return s.n === servicio; })[0] || { n: servicio, p: "" };

    if (!nombre || !mascota || tel.length < 10) { toast("Completa todos los campos (WhatsApp de 10 dígitos)"); return; }

    var cita = {
      id: Date.now(),
      ts: new Date().toISOString(),
      servicio: servicio,
      precio: serv.p,
      fecha: fecha,
      hora: hora,
      nombre: nombre,
      mascota: mascota,
      tel: "52" + tel,
      estado: "Pendiente"
    };
    var citas = store.get("pvc_citas", []);
    citas.push(cita);
    store.set("pvc_citas", citas);
    citaActual = cita;

    renderAgenda();
    renderStats();
    $("#sendWaCita").disabled = false;
    toast("Cita registrada 🙌");
    ev.target.reset();
    $("#cFecha").value = hoyISO();
  });

  $("#sendWaCita").addEventListener("click", function () {
    var c = citaActual;
    if (!c) { toast("Primero guarda tu cita"); return; }
    var texto =
      "Hola, quiero confirmar mi cita en " + BUSINESS + ". 📅\n\n" +
      "• Servicio: " + c.servicio + " (" + c.precio + ")" +
      "\n• Fecha: " + fechaLegible(c.fecha) +
      "\n• Hora: " + c.hora +
      "\n• Cliente: " + c.nombre +
      "\n• Mascota: " + c.mascota +
      "\n\n¿Me confirman?";
    window.open("https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(texto), "_blank", "noopener");
  });

  /* ============================================================
     AGENDA / SEGUIMIENTO
     ============================================================ */
  function getCitas() { return store.get("pvc_citas", []); }

  function renderStats() {
    var citas = getCitas();
    var today = hoyISO();
    var pend = citas.filter(function (c) { return c.estado === "Pendiente"; }).length;
    var hoy = citas.filter(function (c) { return c.fecha === today && c.estado !== "Cancelada"; }).length;
    var done = citas.filter(function (c) { return c.estado === "Completada"; }).length;
    $("#agendaStats").innerHTML =
      '<div class="stat-card"><span class="n">' + citas.length + '</span><span class="l">Total de citas</span></div>' +
      '<div class="stat-card accent"><span class="n">' + pend + '</span><span class="l">Pendientes</span></div>' +
      '<div class="stat-card"><span class="n">' + hoy + '</span><span class="l">Para hoy</span></div>' +
      '<div class="stat-card"><span class="n">' + done + '</span><span class="l">Completadas</span></div>';
  }

  var filtro = "todos";
  $("#agendaFilters").addEventListener("click", function (ev) {
    var c = ev.target.closest("[data-estado]");
    if (!c) return;
    $$("#agendaFilters .chip").forEach(function (x) { x.classList.toggle("active", x === c); });
    filtro = c.getAttribute("data-estado");
    renderAgenda();
  });

  function setEstado(id, estado) {
    var citas = getCitas();
    var c = citas.filter(function (x) { return x.id === id; })[0];
    if (!c) return;
    c.estado = estado;
    store.set("pvc_citas", citas);
    renderAgenda();
    renderStats();
  }

  function eliminar(id) {
    store.set("pvc_citas", getCitas().filter(function (x) { return x.id !== id; }));
    renderAgenda();
    renderStats();
    toast("Cita eliminada");
  }

  function waCliente(c) {
    window.open("https://wa.me/" + c.tel + "?text=" + encodeURIComponent("Hola " + c.nombre + ", te recordamos tu cita en " + BUSINESS + " el " + fechaLegible(c.fecha) + " a las " + c.hora + " (" + c.servicio + "). ¡Te esperamos!"), "_blank", "noopener");
  }

  function badges() { return { Pendiente: 'class="badge pending"', Confirmada: 'class="badge confirmed"', Completada: 'class="badge done"', Cancelada: 'class="badge cancelled"' }; }

  function renderAgenda() {
    var citas = getCitas().filter(function (c) { return filtro === "todos" || c.estado === filtro; })
      .sort(function (a, b) { return (a.fecha + a.hora) < (b.fecha + b.hora) ? -1 : 1; });

    if (!citas.length) {
      $("#agendaList").innerHTML = '<div class="agenda-empty"><span class="emoji">🗓️</span>' + (getCitas().length ? "No hay citas en este filtro." : "Aún no hay citas registradas.<br>Registra una en la pestaña Citas.") + "</div>";
      return;
    }

    var bd = badges();
    $("#agendaList").innerHTML = citas.map(function (c) {
      return '<div class="cita"><div class="cita-main"><h4>' + esc(c.servicio) +
        ' <span ' + bd[c.estado] + '>' + esc(c.estado) + "</span></h4>" +
        '<div class="cita-meta">🗓️ ' + fmtFecha(c.fecha) + " · " + esc(c.hora) + " — " + esc(c.nombre) + " · " + esc(c.mascota) +
        " · 📱 " + esc(c.tel.slice(2)) + "</div></div>" +
        '<div class="mini-actions cita-actions">' +
        (c.estado !== "Confirmada" ? '<button title="Confirmar" data-id="' + c.id + '" data-go="Confirmada">✓</button>' : "") +
        (c.estado !== "Completada" ? '<button title="Completar" data-id="' + c.id + '" data-go="Completada">✔</button>' : "") +
        (c.estado !== "Cancelada" ? '<button title="Cancelar" data-id="' + c.id + '" data-go="Cancelada">✕</button>' : "") +
        '<button title="WhatsApp al cliente" data-wa="' + c.id + '">💬</button>' +
        '<button title="Eliminar" data-del="' + c.id + '">🗑</button>' +
        "</div></div>";
    }).join("");
  }

  $("#agendaList").addEventListener("click", function (ev) {
    var b = ev.target.closest("button");
    if (!b) return;
    var id = parseInt(b.getAttribute("data-id"), 10) || 0;
    if (b.hasAttribute("data-go")) setEstado(id, b.getAttribute("data-go"));
    else if (b.hasAttribute("data-wa")) {
      var ce = getCitas().filter(function (x) { return x.id === id; })[0];
      if (ce) waCliente(ce);
    }
    else if (b.hasAttribute("data-del")) eliminar(id);
  });

  /* ============================================================
     DEMO SEED (primeras citas de ejemplo)
     ============================================================ */
  (function seed() {
    if (localStorage.getItem("pvc_citas") !== null) return;
    var t = hoyISO();
    var seedCitas = [
      { id: 1, ts: new Date().toISOString(), servicio: "Consulta general", precio: "$250", fecha: t, hora: "10:00", nombre: "Laura Gómez", mascota: "Firulais", tel: "529611234567", estado: "Pendiente" },
      { id: 2, ts: new Date().toISOString(), servicio: "Baño y corte", precio: "desde $200", fecha: t, hora: "12:00", nombre: "Pedro Díaz", mascota: "Luna", tel: "529617654321", estado: "Confirmada" },
      { id: 3, ts: new Date().toISOString(), servicio: "Vacunación", precio: "$180", fecha: t, hora: "16:00", nombre: "Ana Ruiz", mascota: "Milo", tel: "529618001122", estado: "Pendiente" }
    ];
    store.set("pvc_citas", seedCitas);
  })();

  /* ============================================================
     INIT
     ============================================================ */
  renderPrecios();
  renderShop("todos");
  renderCart();
  renderAgenda();
  renderStats();

  // Reseteo de cita por WhatsApp al recargar
  var ultima = store.get("pvc_citas", []);
  citaActual = ultima.length ? ultima[ultima.length - 1] : null;
  if (citaActual) $("#sendWaCita").disabled = false;
})();