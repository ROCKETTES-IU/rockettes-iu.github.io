/* ============================================================
   APP COMPLETA — SolucionesTech
   Modo usuario (pedidos por WhatsApp + citas)
   + Modo administrador (pedidos, ventas, PDV, seguimiento citas)
   Persistencia: localStorage (funciona sin servidor)
   ============================================================ */
(function () {
  "use strict";

  /* ---------------- Helpers --------------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function fmtMon(n) { return "$" + Math.round(Number(n) || 0).toLocaleString("es-MX"); }
  function hoyISO() { var d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function fmtFecha(iso) { if (!iso) return ""; var p = String(iso).split("-"); if (p.length !== 3) return iso; var m = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]; return p[2] + " " + m[Number(p[1]) - 1] + " " + p[0]; }
  function refUniq(pre) { return pre + "-" + Date.now().toString(36).toUpperCase() + Math.floor(Math.random() * 90 + 10); }
  function diasAtras(n) { var d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().slice(0, 10); }
  function load(k, def) { try { var r = localStorage.getItem(k); return r ? JSON.parse(r) : def; } catch (e) { return def; } }
  function save(k, v) { localStorage.setItem(k, JSON.stringify(v)); }

  var K = { set: "ap_settings", prod: "ap_products", serv: "ap_servicios", cart: "ap_cart", ord: "ap_orders", cit: "ap_citas", ses: "ap_session", theme: "ap_theme", ready: "ap_ready" };
  var ESTADOS = { nuevo: "🟡 Nuevo", confirmado: "🔵 Confirmado", preparando: "🟣 En preparación", listo: "🟢 Listo", entregado: "✅ Entregado", cancelado: "❌ Cancelado" };
  var METODOS = ["Efectivo", "Tarjeta", "Transferencia", "Mixto"];
  var HORAS = (function () { var a = [], h = 9, m = 0; while (h < 18 || (h === 18 && m === 0)) { a.push(String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0")); m += 30; if (m === 60) { m = 0; h++; } } return a; })();

  /* ---------------- Datos por defecto --------------- */
  var DEFAULT_SETTINGS = {
    negocio: "Mi Negocio",
    whatsapp: "9601427950",
    direccion: "Centro · Berriozábal, Chiapas",
    horario: "Lun a Sáb · 9:00 - 18:00",
    pin: "2026",
    iva: 16,
    envioLibre: 500,
    envioCosto: 40
  };
  var DEFAULT_PRODUCTS = [
    { id: "p1", n: "Croquetas adulto 3 kg", cat: "Alimentos", pr: 320, e: "🦴", d: "Alimento balanceado para perro adulto." },
    { id: "p2", n: "Croquetas cachorro 2 kg", cat: "Alimentos", pr: 265, e: "🐟", d: "Fórmula especial para crecimiento." },
    { id: "p3", n: "Premio de pollo 400 g", cat: "Alimentos", pr: 85, e: "🍗", d: "Snack natural para premiar." },
    { id: "p4", n: "Shampoo desparasitante", cat: "Cuidado", pr: 145, e: "🧴", d: "Aseo y protección contra parásitos." },
    { id: "p5", n: "Toallitas medicinales", cat: "Cuidado", pr: 65, e: "🧼", d: "Limpieza diaria de patitas y orejas." },
    { id: "p6", n: "Pasta + cepillo dental", cat: "Cuidado", pr: 120, e: "🪥", d: "Kit de higiene dental para mascotas." },
    { id: "p7", n: "Pelota interactiva", cat: "Juguetes", pr: 75, e: "🥏", d: "Juego que estimula la actividad." },
    { id: "p8", n: "Hueso masticable", cat: "Juguetes", pr: 45, e: "🦷", d: "Ayuda a limpiar los dientes jugando." },
    { id: "p9", n: "Juguete de cuerda", cat: "Juguetes", pr: 55, e: "🎾", d: "Resistente para morder y jalar." },
    { id: "p10", n: "Correa ajustable", cat: "Accesorios", pr: 180, e: "🐾", d: "Correa cómoda y resistente." },
    { id: "p11", n: "Comedero automático", cat: "Accesorios", pr: 240, e: "🫙", d: "Controla la porción de comida." },
    { id: "p12", n: "Desparasitante oral", cat: "Farmacia", pr: 155, e: "💊", d: "Uso recomendado por el veterinario." }
  ];
  var DEFAULT_SERVICIOS = [
    { s: "Consulta general", pr: 250, d: "Revisión completa de tu mascota.", e: "🩺" },
    { s: "Baño y corte", pr: 200, d: "Estética y aseo profesional.", e: "🛁" },
    { s: "Consulta especializada", pr: 350, d: "Atención a detalle de tu mascota.", e: "🔬" },
    { s: "Vacunación", pr: 180, d: "Esquema de vacunación completo.", e: "💉" },
    { s: "Cirugía menor", pr: 900, d: "Desde $900, cotiza tu caso.", e: "🏥" },
    { s: "Estética canina", pr: 260, d: "Corte, baño, uñas y perfume.", e: "✨" }
  ];

  /* ---------------- Lectura de estado --------------- */
  function getSettings() { return Object.assign({}, DEFAULT_SETTINGS, load(K.set, DEFAULT_SETTINGS)); }
  function getProducts() { return load(K.prod, DEFAULT_PRODUCTS) || []; }
  function getServicios() { return load(K.serv, DEFAULT_SERVICIOS) || []; }
  function getCart() { return load(K.cart, {}); }
  function getOrders() { return load(K.ord, []); }
  function getCitas() { return load(K.cit, []); }
  function isAdmin() { return load(K.ses, false) === true; }
  function isReady() { return load(K.ready, false) === true; }
  function wa(num) { return "52" + String(num).replace(/\D/g, "").slice(-10); }
  function waHref(msg, num) { return "https://wa.me/" + wa(num || getSettings().whatsapp) + "?text=" + encodeURIComponent(msg); }

  var toastTimer;
  function toast(msg) {
    var t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2600);
  }

  /* ---------------- Modal genérico --------------- */
  function openModal(title, bodyHTML, footHTML) {
    $("#modalTitle").textContent = title;
    $("#modalBody").innerHTML = bodyHTML;
    $("#modalFoot").innerHTML = footHTML || "";
    $("#modalOverlay").classList.add("show");
    document.body.classList.add("lock");
    var first = $("#modalBody input, #modalBody select");
    if (first) { setTimeout(function () { first.focus(); }, 120); }
  }
  function closeModal() {
    $("#modalOverlay").classList.remove("show");
    document.body.classList.remove("lock");
    $("#modalBody").innerHTML = "";
    $("#modalFoot").innerHTML = "";
  }

  /* ---------------- Marca / WhatsApp --------------- */
  function applyBrand() {
    var S = getSettings();
    document.title = S.negocio + " — Web, Ventas y Citas";
    $("#brandName").textContent = S.negocio;
    var msg = "Hola " + S.negocio + " 👋, quiero información.";
    var href = waHref(msg);
    var a = [$("#topWa"), $("#homeWa"), $("#waFloat")];
    a.forEach(function (el) { if (el) el.setAttribute("href", href); });
  }

  /* =================================================
     ONBOARDING — primer inicio (configuración inicial)
     ================================================= */
  function showBoarding() {
    $("#boarding").classList.remove("hidden");
    document.body.classList.add("lock");
  }
  function hideBoarding() {
    $("#boarding").classList.add("hidden");
    document.body.classList.remove("lock");
  }
  function finBoarding(ev) {
    ev.preventDefault();
    var negocio = $("#boNegocio").value.trim();
    var waNum = $("#boWhatsapp").value.replace(/\D/g, "");
    var direccion = $("#boDireccion").value.trim();
    var horario = $("#boHorario").value.trim();
    var pin = $("#boPin").value.trim() || "2026";
    if (!negocio) { toast("Escribe el nombre de tu negocio 🏪"); return; }
    if (waNum.length !== 10) { toast("WhatsApp Business debe tener 10 dígitos 📱"); return; }
    var S = getSettings();
    S.negocio = negocio;
    S.whatsapp = waNum;
    S.direccion = direccion;
    S.horario = horario;
    S.pin = pin;
    save(K.set, S);
    save(K.ready, true);
    applyBrand();
    renderHome();
    renderFilters();
    renderProducts();
    renderCitaForm();
    hideBoarding();
    toast("¡Tu tienda está lista! 🚀");
    go("home");
  }

  /* =================================================
     VISTAS / NAVEGACIÓN
     ================================================= */
  var VIEWS = ["home", "tienda", "mispedidos", "citas", "admin"];
  function go(v) {
    if (VIEWS.indexOf(v) === -1) v = "home";
    $$(".view").forEach(function (el) { el.classList.toggle("active", el.id === "view-" + v); });
    $$("[data-nav]").forEach(function (el) { el.classList.toggle("active", el.getAttribute("data-nav") === v); });
    $$(".bn-item").forEach(function (el) { el.classList.toggle("active", el.getAttribute("data-nav") === v); });
    if (v === "admin") renderAdmin();
    if (v === "mispedidos") renderMisPedidos();
    if (v === "tienda") renderProducts();
    if (v === "home") renderHome();
    window.scrollTo(0, 0);
  }

  /* =================================================
     MODO USUARIO — HOME
     ================================================= */
  function renderHome() {
    var P = getProducts(), SV = getServicios();
    $("#stProductos").textContent = P.length;
    $("#stServicios").textContent = SV.length;
    var sn = [$("#homeServiciosTitulo"), $("#cfgNegocio")];
    if (sn[0]) sn[0].textContent = "";
    $("#serviciosList").innerHTML = SV.slice(0, 6).map(function (s) {
      return '<div class="card"><span class="card-icon">' + esc(s.e) + "</span><h3>" + esc(s.s) + "</h3><p>" + esc(s.d) + '</p><p class="mt" style="color:var(--accent);font-weight:700">' + fmtMon(s.pr) + '</p><button class="btn btn-outline btn-sm mt" data-nav="citas">Agendar</button></div>';
    }).join("");
    $("#priceTable").innerHTML = SV.map(function (s) {
      return '<div class="price-row"><div><span class="price-name">' + esc(s.e) + " " + esc(s.s) + '</span><span class="price-desc">' + esc(s.d) + '</span></div><div class="price-amt"><span class="price-val">' + fmtMon(s.pr) + '</span><button class="price-cta" data-nav="citas">Agendar</button></div></div>';
    }).join("");
  }

  /* =================================================
     MODO USUARIO — TIENDA / CARRITO
     ================================================= */
  var filtroActual = "Todos";
  function renderFilters() {
    var cats = ["Todos"];
    getProducts().forEach(function (p) { if (cats.indexOf(p.cat) === -1) cats.push(p.cat); });
    $("#filters").innerHTML = cats.map(function (c) {
      return '<button class="chip' + (c === filtroActual ? " active" : "") + '">' + esc(c) + "</button>";
    }).join("");
    $$("#filters .chip").forEach(function (el) {
      el.addEventListener("click", function () {
        filtroActual = el.textContent;
        renderFilters();
        renderProducts();
      });
    });
  }
  function renderProducts() {
    var P = getProducts();
    var list = filtroActual === "Todos" ? P : P.filter(function (p) { return p.cat === filtroActual; });
    $("#productGrid").innerHTML = list.map(function (p) {
      return '<div class="card product"><div class="product-top"><span class="product-emoji">' + esc(p.e) + '</span><span class="cat">' + esc(p.cat) + '</span></div><h4>' + esc(p.n) + '</h4><p class="tiny">' + esc(p.d) + '</p><div class="price">' + fmtMon(p.pr) + '</div><button class="btn btn-accent add-btn" data-add="' + p.id + '">Agregar</button></div>';
    }).join("");
    $$("#productGrid [data-add]").forEach(function (btn) {
      btn.addEventListener("click", function () { addToCart(btn.getAttribute("data-add")); });
    });
  }
  function addToCart(pid) {
    var c = getCart();
    c[pid] = (c[pid] || 0) + 1;
    save(K.cart, c);
    cartCounts();
    var p = getProducts().filter(function (x) { return x.id === pid; })[0];
    toast(p ? "Agregado: " + p.n : "Listo");
    $("#fabCount").classList.remove("zero");
  }
  function cartCounts() {
    var c = getCart(), n = 0;
    Object.keys(c).forEach(function (k) { n += c[k]; });
    $("#cartCountTop").textContent = n;
    $("#fabCount").textContent = n;
    if (n === 0) $("#fabCount").classList.add("zero");
  }
  function cartItems() {
    var c = getCart(), P = getProducts();
    return Object.keys(c).map(function (k) {
      var p = P.filter(function (x) { return x.id === k; })[0];
      return p ? { p: p, q: c[k] } : null;
    }).filter(Boolean);
  }
  function cartSubtotal() { return cartItems().reduce(function (a, i) { return a + i.p.pr * i.q; }, 0); }
  function cartFinanzas() {
    var S = getSettings();
    var sub = cartSubtotal();
    var envio = sub === 0 ? 0 : (sub >= S.envioLibre ? 0 : S.envioCosto);
    var iva = Math.round((sub + envio) * S.iva / 100);
    return { sub: sub, envio: envio, iva: iva, total: sub + envio + iva };
  }
  function renderCart() {
    var f = cartFinanzas(), items = cartItems();
    var empty = !items.length;
    $("#cartFoot").classList.toggle("hidden", empty);
    $("#cartItems").innerHTML = empty ?
      '<div class="cart-empty"><span class="emoji">🛒</span>Tu carrito está vacío.<br>Agrega productos del catálogo.</div>' :
      items.map(function (i) {
        return '<div class="cart-item"><span class="emoji">' + esc(i.p.e) + '</span><div class="info"><span class="nm">' + esc(i.p.n) + '</span><span class="pr">' + fmtMon(i.p.pr) + " c/u</span></div><div class=\"qty\"><button data-q=\"-\" data-qid=\"" + i.p.id + '">−</button><span>' + i.q + '</span><button data-q="+" data-qid="' + i.p.id + '">+</button></div><button class="close-x" data-q="x" data-qid="' + i.p.id + '">✕</button></div>';
      }).join("");
    $$("#cartItems [data-q]").forEach(function (btn) {
      btn.addEventListener("click", setQty);
    });
    $("#cartTotals").innerHTML = (empty ? "" :
      '<div><span>Subtotal</span><span>' + fmtMon(f.sub) + '</span></div>' +
      '<div><span>Envío</span><span class="' + (f.envio ? "" : "free") + '">' + (f.envio ? fmtMon(f.envio) : "GRATIS") + '</span></div>' +
      '<div><span>IVA (' + getSettings().iva + '%)</span><span>' + fmtMon(f.iva) + '</span></div>' +
      '<div class="grand"><span>TOTAL</span><span>' + fmtMon(f.total) + '</span></div>' +
      (f.envio ? '<div class="free">💡 Envío GRATIS desde ' + fmtMon(getSettings().envioLibre) + '</div>' : ''));
  }
  function setQty(ev) {
    var id = ev.currentTarget.getAttribute("data-qid");
    var a = ev.currentTarget.getAttribute("data-q");
    var c = getCart();
    if (a === "+") c[id] = (c[id] || 0) + 1;
    else if (a === "-") { c[id] = (c[id] || 0) - 1; if (c[id] <= 0) delete c[id]; }
    else delete c[id];
    save(K.cart, c);
    cartCounts();
    renderCart();
  }
  function openCart() { renderCart(); $("#cart").classList.add("open"); $("#cartOverlay").classList.add("show"); }
  function closeCartAll() { $("#cart").classList.remove("open"); $("#cartOverlay").classList.remove("show"); }

  /* --- Checkout: el carrito NO pide datos antes, solo al confirmar --- */
  function openCheckout() {
    var f = cartFinanzas();
    openModal("Confirmar pedido",
      '<p class="muted mb">Te pediremos tus datos ahora, solo para confirmar el pedido por WhatsApp. Nada de registros previos.</p>' +
      '<div class="form-grid">' +
      '<div class="field full"><label>Tu nombre</label><input id="chNombre" placeholder="Nombre completo"></div>' +
      '<div class="field"><label>WhatsApp (10 dígitos)</label><input id="chTel" inputmode="numeric" maxlength="10" placeholder="961 000 0000"></div>' +
      '<div class="field"><label>Dirección / pick up</label><input id="chDir" placeholder="Calle, referencia o “paso a recoger”"></div>' +
      '<div class="field full"><label>Nota opcional</label><input id="chNota" placeholder="Ej. llamar al llegar, preferencias"></div>' +
      "</div>" +
      '<div class="totals mt" style="margin-top:18px">' +
      "<div><span>" + cartItems().length + " producto(s)</span><span></span></div>" +
      "<div><span>Subtotal</span><span>" + fmtMon(f.sub) + "</span></div>" +
      "<div><span>Envío</span><span>" + (f.envio ? fmtMon(f.envio) : "GRATIS") + "</span></div>" +
      "<div><span>IVA (" + getSettings().iva + "%)</span><span>" + fmtMon(f.iva) + "</span></div>" +
      '<div class="grand"><span>TOTAL</span><span>' + fmtMon(f.total) + "</span></div>" +
      "</div>",
      '<button class="btn btn-wa" id="chkSend">Enviar por WhatsApp</button>');
    $("#chkSend").addEventListener("click", confirmarPedido);
  }
  function confirmarPedido() {
    var nom = $("#chNombre").value.trim();
    var tel = $("#chTel").value.replace(/\D/g, "");
    var dir = $("#chDir").value.trim();
    var nota = $("#chNota").value.trim();
    if (!nom) { toast("Escribe tu nombre 👤"); return; }
    if (tel.length !== 10) { toast("WhatsApp de 10 dígitos 📱"); return; }
    if (!dir) { toast("Indica dirección o “paso a recoger” 📍"); return; }
    var S = getSettings();
    var f = cartFinanzas();
    var items = cartItems().map(function (i) { return { n: i.p.n, pr: i.p.pr, q: i.q }; });
    var ref = refUniq("P");
    var order = {
      ref: ref, ts: new Date().toISOString(), tipo: "en línea",
      items: items, sub: f.sub, envio: f.envio, iva: f.iva, total: f.total,
      metodo: "Efectivo", estado: "nuevo", pagado: false,
      cliente: { n: nom, tel: tel, dir: dir, nota: nota }
    };
    var ords = getOrders(); ords.unshift(order); save(K.ord, ords);
    var msg = "*Nuevo pedido " + ref + " — " + S.negocio + "*\n\n" +
      items.map(function (i) { return "▪ " + i.n + " ×" + i.q + " = " + fmtMon(i.pr * i.q); }).join("\n") +
      "\n\nSubtotal: " + fmtMon(f.sub) +
      "\nEnv\u00edo: " + (f.envio ? fmtMon(f.envio) : "GRATIS") +
      "\nIVA (" + S.iva + "%): " + fmtMon(f.iva) +
      "\n*TOTAL: " + fmtMon(f.total) + "*" +
      "\n\n👤 " + nom + "\n📱 " + tel + "\n📍 " + dir +
      (nota ? "\n📝 " + nota : "");
    save(K.cart, {});
    cartCounts();
    closeModal();
    closeCartAll();
    renderCart();
    window.open(waHref(msg), "_blank");
    toast("Pedido generado ✅ Revisa “Mis pedidos”");
    setTimeout(function () { go("mispedidos"); }, 900);
  }

  /* =================================================
     MODO USUARIO — MIS PEDIDOS
     ================================================= */
  function renderMisPedidos() {
    var ords = getOrders().filter(function (o) { return o.tipo !== "pdv"; });
    if (!ords.length) {
      $("#misPedidosList").innerHTML = '<div class="void"><span class="emoji">📭</span>No has hecho pedidos aún.<br>Visita la tienda y arma el tuyo 🛍️</div>';
      return;
    }
    $("#misPedidosList").innerHTML = ords.map(function (o) {
      var badge = o.estado === "cancelado" ? "badge cancel" : (o.pagado ? "badge done" : (o.estado === "nuevo" ? "badge new" : "badge confirmed"));
      var hw = o.pagado ? "✅ Llevado a cabo" : (o.estado === "cancelado" ? "❌ Cancelado" : "Seguimiento por WhatsApp");
      return '<div class="order"><div class="order-head"><span class="ref">' + esc(o.ref) + "</span><span class=\"badge " + badge + "\">" + (o.pagado ? "Pagado" : ESTADOS[o.estado] || o.estado) + "</span></div>" +
        '<div class="order-body"><div class="order-cliente"><span class="nm">' + esc(o.cliente.n) + ' · ' + fmtMon(o.total) + "</span><span class=\"det\">" + fmtFecha(o.ts.slice(0, 10)) + " · " + (o.cliente.dir || "") + "</span></div>" +
        '<div class="order-items">' + (o.items || []).map(function (i) { return '<div class="it"><span>' + esc(i.n) + " ×" + i.q + "</span><span>" + fmtMon(i.pr * i.q) + "</span></div>"; }).join("") + "</div>" +
        '<div class="order-actions"><a class="btn btn-wa btn-sm" href="' + waHref("Hola, consulta mi pedido " + o.ref, o.pagado ? o.cliente.tel : getSettings().whatsapp) + '" target="_blank" rel="noopener">' + hw + "</a>" +
        '<button class="btn btn-danger btn-sm" data-mip="' + o.ref + '">Eliminar</button></div></div></div>';
    }).join("");
    $$("#misPedidosList [data-mip]").forEach(function (b) {
      b.addEventListener("click", function () {
        var ref = b.getAttribute("data-mip");
        if (confirm("¿Eliminar el pedido " + ref + " de este dispositivo?")) {
          save(K.ord, getOrders().filter(function (x) { return x.ref !== ref; }));
          renderMisPedidos();
        }
      });
    });
  }

  /* =================================================
     MODO USUARIO — CITAS
     ================================================= */
  function renderCitaForm() {
    var SV = getServicios();
    $("#cServicio").innerHTML = SV.map(function (s, i) {
      return '<option value="' + i + '">' + esc(s.s) + " · " + fmtMon(s.pr) + "</option>";
    }).join("");
    $("#cHora").innerHTML = HORAS.map(function (h) { return '<option value="' + h + '">' + h + "</option>"; }).join("");
    syncPrecioCita();
    var d = $("#cFecha");
    d.min = hoyISO();
    if (!d.value) d.value = hoyISO();
  }
  function syncPrecioCita() {
    var SV = getServicios();
    var i = Number($("#cServicio").value || 0);
    var s = SV[i];
    $("#cPrecio").value = s ? "$" + s.pr : "";
  }
  function enviarCita(ev) {
    ev.preventDefault();
    var SV = getServicios();
    var i = Number($("#cServicio").value || 0);
    var s = SV[i];
    var fecha = $("#cFecha").value, hora = $("#cHora").value;
    var nombre = $("#cNombre").value.trim(), tel = $("#cTel").value.replace(/\D/g, "");
    var nota = $("#cNota").value.trim();
    if (!fecha || !hora) { toast("Elige fecha y hora 📅"); return; }
    if (!nombre) { toast("Escribe tu nombre 👤"); return; }
    if (tel.length !== 10) { toast("WhatsApp de 10 dígitos 📱"); return; }
    var S = getSettings();
    var cita = { id: Date.now(), ts: new Date().toISOString(), servicio: s.s, precio: "$" + s.pr, fecha: fecha, hora: hora, nombre: nombre, mascota: "", tel: tel, nota: nota, estado: "Pendiente" };
    var citas = getCitas(); citas.unshift(cita); save(K.cit, citas);
    var msg = "*Nueva cita — " + S.negocio + "*\n\n" +
      "▪ Servicio: " + s.s + "\n▪ Fecha: " + fmtFecha(fecha) + "\n▪ Hora: " + hora + "\n▪ Precio: " + fmtMon(s.pr) +
      "\n\n👤 " + nombre + "\n📱 " + tel + (nota ? "\n📝 " + nota : "");
    $("#citaForm").reset();
    renderCitaForm();
    window.open(waHref(msg), "_blank");
    toast("Cita agendada ✅");
  }

  /* =================================================
     MODO ADMIN — LOGIN / PANEL
     ================================================= */
  function renderAdmin() {
    if (isAdmin()) { $("#adminLogin").classList.add("hidden"); $("#adminDash").classList.remove("hidden"); renderPanel(); }
    else { $("#adminDash").classList.add("hidden"); $("#adminLogin").classList.remove("hidden"); }
  }
  function doLogin() {
    var S = getSettings();
    if ($("#pinInput").value === S.pin) {
      save(K.ses, true);
      $("#pinInput").value = "";
      toast("Bienvenido, administrador 🔐");
      renderAdmin();
      showPane("pedidos");
    } else {
      toast("PIN incorrecto ❌");
      $("#pinInput").value = "";
    }
  }
  function doLogout() {
    save(K.ses, false);
    toast("Sesión cerrada");
    go("home");
  }
  var paneActual = "pedidos";
  function showPane(p) {
    paneActual = p;
    $$(".side-link[data-pane]").forEach(function (el) { el.classList.toggle("active", el.getAttribute("data-pane") === p); });
    $$(".pane").forEach(function (el) { el.classList.toggle("active", el.id === "pane-" + p); });
    if (p === "pedidos") renderPedidos();
    if (p === "ventas") renderVentas();
    if (p === "citas") renderAgenda();
    if (p === "ajustes") renderAjustes();
  }
  function renderPanel() {
    $$(".pane").forEach(function () { });
    showPane(paneActual);
    cntBadges();
  }
  function cntBadges() {
    var nPed = getOrders().length;
    var nCit = getCitas().length;
    $("#cntPedidos").textContent = nPed;
    $("#cntCitas").textContent = nCit;
  }

  /* ---------------- ADMIN: PEDIDOS ---------------- */
  var filtroPedidos = "todos";
  function renderPedidos() {
    var ords = getOrders();
    var list = filtroPedidos === "todos" ? ords : ords.filter(function (o) { return o.estado === filtroPedidos || (filtroPedidos === "pagado" ? o.pagado : false); });
    var estados = ["todos"].concat(Object.keys(ESTADOS)).concat(["pagado"]);
    $("#filtroEstado").innerHTML = estados.map(function (e) {
      var label = { todos: "Todos", pagado: "💸 Cobrados" }[e] || ESTADOS[e];
      return '<button class="' + (e === filtroPedidos ? "active" : "") + '" data-fe="' + e + '">' + label + "</button>";
    }).join("");
    $$("#filtroEstado button").forEach(function (b) {
      b.addEventListener("click", function () { filtroPedidos = b.getAttribute("data-fe"); renderPedidos(); });
    });
    $("#pedidosSub").textContent = "Hay " + ords.length + " pedido(s) · " + ords.filter(function (o) { return o.estado === "nuevo"; }).length + " nuevos, " + ords.filter(function (o) { return o.pagado; }).length + " cobrados.";
    $("#pedidosEmpty").classList.toggle("hidden", list.length > 0);
    $("#pedidosList").innerHTML = list.map(function (o) {
      var es = o.estado;
      var badgeCls = es === "cancelado" ? "badge cancel" : es === "entregado" ? "badge done" : o.pagado ? "badge done" : es === "nuevo" ? "badge new" : es === "preparando" ? "badge preparing" : es === "listo" ? "badge ready" : "badge confirmed";
      var items = (o.items || []).map(function (i) { return '<div class="it"><span>' + esc(i.n) + " ×" + i.q + "</span><span>" + fmtMon(i.pr * i.q) + "</span></div>"; }).join("");
      var origen = o.tipo === "pdv" ? "PDV · en tienda" : o.tipo === "externo" ? "WhatsApp / captura" : "Tienda en línea";
      var acciones = "";
      if (es !== "cancelado" && es !== "entregado") {
        acciones += '<button class="btn btn-accent btn-sm" data-av="' + o.ref + '">Avanzar →</button>';
      }
      acciones += (es !== "entregado" && es !== "cancelado" && !o.pagado) ? '<button class="btn btn-success btn-sm" data-cob="' + o.ref + '">💰 Cobrar</button>' : "";
      acciones += '<a class="btn btn-wa btn-sm" href="' + waHref(msgCliente(o), es === "cancelado" ? o.cliente.tel : o.cliente.tel) + '" target="_blank" rel="noopener">WhatsApp</a>';
      acciones += '<button class="btn btn-outline btn-sm" data-imp="' + o.ref + '">🧾 Imprimir</button>';
      acciones += '<button class="btn btn-danger btn-sm" data-del="' + o.ref + '">Eliminar</button>';
      return '<div class="order"><div class="order-head"><span class="ref">' + esc(o.ref) + '</span><span class="badge ' + badgeCls + '">' + (o.pagado && es !== "cancelado" ? "💸 " : "") + (ESTADOS[es] || es) + '</span><span class="order-meta">' + origen + " · " + fmtFecha(o.ts.slice(0, 10)) + " · " + (o.ts.slice(11, 16) || "") + "</span></div>" +
        '<div class="order-body"><div class="order-cliente"><span class="nm">👤 ' + esc(o.cliente ? o.cliente.n : "-") + " · " + fmtMon(o.total) + "</span>" +
        '<span class="det">📱 ' + esc(o.cliente ? o.cliente.tel : "-") + (o.cliente && o.cliente.dir ? " · 📍 " + esc(o.cliente.dir) : "") + (o.cliente && o.cliente.nota ? " · 📝 " + esc(o.cliente.nota) : "") + "</span></div>" +
        '<div class="order-items">' + items + "</div>" +
        '<div class="order-actions">' + acciones + "</div></div></div>";
    }).join("") || '<div class="void">Sin resultados 📭</div>';
    $$("#pedidosList [data-av]").forEach(function (b) {
      b.addEventListener("click", function () {
        avanzar(b.getAttribute("data-av"));
      });
    });
    $$("#pedidosList [data-cob]").forEach(function (b) {
      b.addEventListener("click", function () { openCobro(b.getAttribute("data-cob")); });
    });
    $$("#pedidosList [data-imp]").forEach(function (b) {
      b.addEventListener("click", function () { printOrder(b.getAttribute("data-imp")); });
    });
    $$("#pedidosList [data-del]").forEach(function (b) {
      b.addEventListener("click", function () {
        var ref = b.getAttribute("data-del");
        if (confirm("Eliminar este pedido?")) { save(K.ord, getOrders().filter(function (x) { return x.ref !== ref; })); renderPedidos(); cntBadges(); }
      });
    });
  }
  function msgCliente(o) {
    var S = getSettings();
    var nom = o.cliente ? o.cliente.n : "";
    var t = {
      nuevo: "Hola " + nom + " 👋, recibimos tu pedido " + o.ref + " en " + S.negocio + ". Pronto lo preparamos 🛍️",
      confirmado: "¡Hola " + nom + "! Tu pedido " + o.ref + " está confirmado ✅ Te avisamos cuando esté listo.",
      preparando: "Hola " + nom + ", tu pedido " + o.ref + " ya está en preparación 🔥",
      listo: "¡" + nom + "! Tu pedido " + o.ref + " está LISTO para recoger o entrega 🎉",
      entregado: "Gracias por tu compra " + nom + " 🙌 Te esperamos pronto en " + S.negocio + ".",
      cancelado: "Hola " + nom + ", lamentamos informarte que tu pedido " + o.ref + " fue cancelado. ¿Podemos ayudar? 💬"
    };
    return t[o.estado] || "Hola " + nom + ", información de tu pedido " + o.ref;
  }
  function avanzar(ref) {
    var ords = getOrders();
    var o = ords.filter(function (x) { return x.ref === ref; })[0];
    if (!o) return;
    var next = { nuevo: "confirmado", confirmado: "preparando", preparando: "listo", listo: "entregado" };
    if (next[o.estado]) o.estado = next[o.estado];
    save(K.ord, ords);
    renderPedidos();
    cntBadges();
    toast("Estado actualizado: " + ESTADOS[o.estado]);
  }
  function openCobro(ref) {
    var ords = getOrders();
    var o = ords.filter(function (x) { return x.ref === ref; })[0];
    if (!o) return;
    var opts = METODOS.map(function (m, i) { return '<label class="chip' + (i === 0 ? " active" : "") + '" style="cursor:pointer"><input type="radio" name="metodo" value="' + m + '"' + (i === 0 ? " checked" : "") + ' style="display:none"> ' + m + "</label>"; }).join("");
    openModal("Cobrar " + ref,
      "<p class=\"muted mb\">Registrar el cobro por <b>" + fmtMon(o.total) + "</b> del pedido de " + esc(o.cliente.n) + ".</p>" +
      '<div class="row mb">' + opts + "</div>",
      '<button class="btn btn-success" id="cobOk">💵 Confirmar cobro</button>');
    return;
  }
  function registrarVenta(ref, metodo) {
    var ords = getOrders();
    var o = ords.filter(function (x) { return x.ref === ref; })[0];
    if (!o) return;
    o.pagado = true;
    o.metodo = metodo;
    if (o.estado !== "cancelado") o.estado = "entregado";
    save(K.ord, ords);
    closeModal();
    renderPedidos();
    cntBadges();
    toast("Cobro registrado 💸");
    printOrder(ref);
  }

  /* ---------------- ADMIN: VERLTAS + PDV ---------------- */
  function renderVentas() {
    var ords = getOrders().filter(function (o) { return o.pagado && o.estado !== "cancelado"; });
    var hoy = hoyISO(), sem = diasAtras(7);
    function sum(list) { return list.reduce(function (a, o) { return a + o.total; }, 0); }
    var hoyV = ords.filter(function (o) { return (o.ts || "").slice(0, 10) === hoy; });
    var semV = ords.filter(function (o) { return (o.ts || "").slice(0, 10) >= sem; });
    $("#kpiVentas").innerHTML =
      '<div class="kpi accent"><div class="v">' + fmtMon(sum(hoyV)) + '</div><div class="l">Vendido hoy</div></div>' +
      '<div class="kpi"><div class="v">' + fmtMon(sum(semV)) + '</div><div class="l">Últimos 7 días</div></div>' +
      '<div class="kpi success"><div class="v">' + fmtMon(sum(ords)) + '</div><div class="l">Total acumulado</div></div>' +
      '<div class="kpi warn"><div class="v">' + (ords.length ? fmtMon(Math.round(sum(ords) / ords.length)) : "$0") + '</div><div class="l">Ticket promedio · ' + ords.length + " ventas</div></div>";
    $("#ventasEmpty").classList.toggle("hidden", ords.length > 0);
    $("#ventasList").innerHTML = ords.slice().reverse().map(function (o) {
      var origen = o.tipo === "pdv" ? "PDV" : o.tipo === "externo" ? "Captura" : "En línea";
      return "<tr><td><b>" + esc(o.ref) + "</b></td><td>" + fmtFecha((o.ts || "").slice(0, 10)) + "</td><td>" + esc(o.cliente ? o.cliente.n : "-") + "</td><td>" + esc(o.metodo || "—") + "</td><td>" + origen + '</td><td style="text-align:right"><b>' + fmtMon(o.total) + '</b></td><td><button class="btn btn-outline btn-sm" data-imp="' + o.ref + '">🧾</button></td></tr>';
    }).join("");
    $$("#ventasList [data-imp]").forEach(function (b) {
      b.addEventListener("click", function () { printOrder(b.getAttribute("data-imp")); });
    });
    /* Top productos */
    var agg = {};
    ords.forEach(function (o) { (o.items || []).forEach(function (i) { agg[i.n] = (agg[i.n] || 0) + i.q; }); });
    var top = Object.keys(agg).map(function (k) { return { k: k, q: agg[k] }; }).sort(function (a, b) { return b.q - a.q; }).slice(0, 8);
    $("#topProductos").innerHTML = top.length ?
      '<div class="grid-4">' + top.map(function (t, i) {
        return '<div class="card" style="padding:16px"><span class="tiny">#' + (i + 1) + "</span><h3 style=\"font-size:1rem\">" + esc(t.k) + '</h3><p><b>' + t.q + " pza(s)</b></p></div>";
      }).join("") + "</div>" :
      '<div class="void">No hay ventas para calcular 🏆</div>';
  }

  var pdv = {};
  function openPDV() {
    pdv = {};
    pdvRender();
  }
  function pdvRender() {
    var P = getProducts();
    var cats = [];
    P.forEach(function (p) { if (cats.indexOf(p.cat) === -1) cats.push(p.cat); });
    var body =
      '<div class="seg mb" id="pdvCats">' + cats.map(function (c, i) {
        return '<button class="' + (i === 0 ? "active" : "") + '" data-pc="' + esc(c) + '">' + esc(c) + "</button>";
      }).join("") + "</div>" +
      '<div class="pdv-cols"><div class="pdv-grid" id="pdvGrid">' + pdvGridHTML("") + '</div><div class="pdv-ticket"><div class="panel-head" style="margin-bottom:8px"><h3>🧾 Ticket actual</h3><button class="btn btn-outline btn-sm" id="pdvClear">Limpiar</button></div>' +
      '<div id="pdvItems"></div><div class="totals mt" id="pdvTotales"></div>' +
      '<div class="field mt"><label>Método de pago</label><select id="pdvMetodo">' + METODOS.map(function (m) { return '<option>' + m + "</option>"; }).join("") + "</select></div>" +
      '<button class="btn btn-success btn-block mt" id="pdvCobrar">💵 Cobrar en caja</button></div></div>';
    openModal("Punto de venta — caja", body, '<button class="btn btn-ghost" data-nav-close>Se cerrará</button>');
    $("#modalBox").classList.add("lg");
    $$("#pdvCats button").forEach(function (b) {
      b.addEventListener("click", function () {
        $$("#pdvCats button").forEach(function (x) { x.classList.remove("active"); });
        b.classList.add("active");
        $("#pdvGrid").innerHTML = pdvGridHTML(b.getAttribute("data-pc"));
        bindPdvGrid();
      });
    });
    bindPdvGrid();
    $("#pdvClear").addEventListener("click", function () { pdv = {}; pdvRender(); });
    $("#pdvCobrar").addEventListener("click", pdvCobrar);
    $("#modalClose").addEventListener("click", function () { $("#modalBox").classList.remove("lg"); closeModal(); });
    pdvRefresh();
  }
  function pdvGridHTML(cat) {
    var P = getProducts();
    var list = cat ? P.filter(function (p) { return p.cat === cat; }) : P;
    return list.map(function (p) {
      return '<div class="pdv-item"><span class="e">' + esc(p.e) + '</span><span class="nm">' + esc(p.n) + '</span><span class="pr">' + fmtMon(p.pr) + '</span><button class="btn btn-accent btn-sm" data-pa="' + p.id + '">＋ Agregar</button></div>';
    }).join("");
  }
  function bindPdvGrid() { $$("#pdvGrid [data-pa]").forEach(bindPdvb); }
  function bindPdvb(b) {
    b.addEventListener("click", function () {
      var P = getProducts();
      var p = P.filter(function (x) { return x.id === b.getAttribute("data-pa"); })[0];
      if (!p) return;
      pdv[p.id] = (pdv[p.id] || 0) + 1;
      pdvRefresh();
    });
  }
  function pdvFinanzas() {
    var P = getProducts();
    var S = getSettings();
    var sub = 0, items = [];
    Object.keys(pdv).forEach(function (k) {
      var p = P.filter(function (x) { return x.id === k; })[0];
      if (!p) return;
      var q = pdv[k]; sub += p.pr * q; items.push({ n: p.n, pr: p.pr, q: q });
    });
    var envio = 0;
    var iva = Math.round(sub * S.iva / 100);
    return { items: items, sub: sub, envio: envio, iva: iva, total: sub + iva };
  }
  function pdvRefresh() {
    var f = pdvFinanzas();
    $("#pdvItems").innerHTML = f.items.length ? f.items.map(function (i) {
      return '<div class="order-items" style="margin-bottom:8px"><div class="it"><span>' + esc(i.n) + " ×" + i.q + " = " + fmtMon(i.pr * i.q) + "</span>" + "</div></div>";
    }).join("") : '<div class="void" style="padding:20px">Haz clic en un producto para agregarlo 🛍️</div>';
    $("#pdvTotales").innerHTML =
      '<div><span>Subtotal</span><span>' + fmtMon(f.sub) + "</span></div>" +
      '<div><span>IVA (' + getSettings().iva + '%)</span><span>' + fmtMon(f.iva) + "</span></div>" +
      '<div class="grand"><span>TOTAL</span><span>' + fmtMon(f.total) + "</span></div>";
  }
  function pdvCobrar() {
    var f = pdvFinanzas();
    if (!f.items.length) { $("#pdvItems").innerHTML = '<div class="void" style="padding:20px">Agrega al menos un producto 🛍️</div>'; toast("Agrega productos al ticket"); return; }
    var S = getSettings();
    var metodo = $("#pdvMetodo").value;
    var ref = refUniq("T");
    var order = { ref: ref, ts: new Date().toISOString(), tipo: "pdv", items: f.items, sub: f.sub, envio: 0, iva: f.iva, total: f.total, metodo: metodo, estado: "entregado", pagado: true, cliente: { n: "Cliente en mostrador", tel: "", dir: "En tienda", nota: "" } };
    var ords = getOrders(); ords.unshift(order); save(K.ord, ords);
    closeModal();
    cntBadges();
    toast("Venta registrada 💸 " + ref);
    printOrder(ref);
  }

  /* ---------------- ADMIN: CITAS ---------------- */
  var filtroCita = "Todos";
  function renderAgenda() {
    var citas = getCitas();
    var list = filtroCita === "Todos" ? citas : citas.filter(function (c) { return c.estado === filtroCita; });
    var pend = citas.filter(function (c) { return c.estado === "Pendiente"; }).length;
    var hoy = hoyISO();
    var hoyN = citas.filter(function (c) { return c.fecha === hoy; }).length;
    var comp = citas.filter(function (c) { return c.estado === "Completada"; }).length;
    var canc = citas.filter(function (c) { return c.estado === "Cancelada"; }).length;
    $("#agendaStats").innerHTML =
      '<div class="stat-card accent"><div class="n">' + pend + '</div><div class="l">Pendientes</div></div>' +
      '<div class="stat-card"><div class="n">' + hoyN + '</div><div class="l">Para hoy</div></div>' +
      '<div class="stat-card"><div class="n">' + comp + '</div><div class="l">Completadas</div></div>' +
      '<div class="stat-card"><div class="n">' + canc + '</div><div class="l">Canceladas</div></div>';
    var filtros = ["Todos", "Pendiente", "Confirmada", "Completada", "Cancelada"];
    $("#agendaFilters").innerHTML = filtros.map(function (f) {
      return '<button class="' + (f === filtroCita ? "active" : "") + '" data-af="' + f + '">' + f + "</button>";
    }).join("");
    $$("#agendaFilters button").forEach(function (b) {
      b.addEventListener("click", function () { filtroCita = b.getAttribute("data-af"); renderAgenda(); });
    });
    $("#agendaEmpty").classList.toggle("hidden", list.length > 0);
    $("#agendaList").innerHTML = list.map(function (c) {
      var cls = c.estado === "Pendiente" ? "badge pending" : c.estado === "Confirmada" ? "badge confirmed" : c.estado === "Completada" ? "badge done" : "badge cancelled";
      var waC = c.tel ? '<a class="btn btn-wa btn-sm" href="' + waHref("Hola " + c.nombre + ", respecto a tu cita de " + c.servicio + " el " + fmtFecha(c.fecha) + " a las " + c.hora + " 🐾", c.tel) + '" target="_blank" rel="noopener">WhatsApp</a>' : "";
      return '<div class="cita"><div class="cita-main"><h4>' + esc(c.servicio) + ' <span class="badge ' + cls + '">' + c.estado + "</span></h4>" +
        '<div class="cita-meta"> 🗓️ ' + fmtFecha(c.fecha) + " · 🕐 " + c.hora + " · 👤 " + esc(c.nombre) + (c.mascota ? " · 🐾 " + esc(c.mascota) : "") + " · 💰 " + esc(c.precio) + "</div></div>" +
        '<div class="cita-actions mini-actions">' + waC +
        (c.estado === "Pendiente" ? '<button title="Confirmar" data-ca="Confirmada" data-ci="' + c.id + '">✅</button>' : "") +
        (c.estado !== "Completada" && c.estado !== "Cancelada" ? '<button title="Completada" data-ca="Completada" data-ci="' + c.id + '">✔️</button>' : "") +
        '<button title="Cancelar" data-ca="Cancelada" data-ci="' + c.id + '">✕</button>' +
        '<button title="Eliminar" data-cdel="' + c.id + '">🗑️</button>' +
        "</div></div>";
    }).join("") || '<div class="void">Sin citas con este filtro 🗓️</div>';
    $$("#agendaList [data-ca]").forEach(function (b) {
      b.addEventListener("click", function () {
        var id = Number(b.getAttribute("data-ci"));
        var st = b.getAttribute("data-ca");
        save(K.cit, getCitas().map(function (c) { return c.id === id ? Object.assign({}, c, { estado: st }) : c; }).map(function (c) { return c; }));
        renderAgenda(); cntBadges();
        toast("Cita: " + st);
      });
    });
    $$("#agendaList [data-cdel]").forEach(function (b) {
      b.addEventListener("click", function () {
        var id = Number(b.getAttribute("data-cdel"));
        if (confirm("Eliminar esta cita?")) { save(K.cit, getCitas().filter(function (c) { return c.id !== id; })); renderAgenda(); cntBadges(); }
      });
    });
  }
  function openNuevaCita() {
    var SV = getServicios();
    openModal("Registrar cita (admin)",
      '<div class="form-grid">' +
      '<div class="field full"><label>Servicio</label><select id="naServ">' + SV.map(function (s, i) { return '<option value="' + i + '">' + esc(s.s) + " · " + fmtMon(s.pr) + "</option>"; }).join("") + "</select></div>" +
      '<div class="field"><label>Fecha</label><input type="date" id="naFecha" value="' + hoyISO() + '"></div>' +
      '<div class="field"><label>Hora</label><select id="naHora">' + HORAS.map(function (h) { return '<option>' + h + "</option>"; }).join("") + "</select></div>" +
      '<div class="field"><label>Cliente</label><input id="naNombre" placeholder="Nombre"></div>' +
      '<div class="field"><label>Mascota (opcional)</label><input id="naMascota" placeholder="Nombre o tipo"></div>' +
      '<div class="field"><label>WhatsApp (10 dígitos)</label><input id="naTel" maxlength="10" inputmode="numeric"></div>' +
      "</div>",
      '<button class="btn btn-accent" id="naSave">Guardar cita</button>');
    $("#naSave").addEventListener("click", function () {
      var SV = getServicios();
      var s = SV[Number($("#naServ").value || 0)];
      var fecha = $("#naFecha").value, hora = $("#naHora").value;
      var nombre = $("#naNombre").value.trim(), mascota = $("#naMascota").value.trim(), tel = $("#naTel").value.replace(/\D/g, "");
      if (!fecha || !hora) { toast("Fecha y hora"); return; }
      if (!nombre) { toast("Nombre del cliente"); return; }
      if (tel && tel.length !== 10) { toast("WhatsApp de 10 dígitos"); return; }
      var cita = { id: Date.now(), ts: new Date().toISOString(), servicio: s.s, precio: "$" + s.pr, fecha: fecha, hora: hora, nombre: nombre, mascota: mascota, tel: tel, nota: "", estado: "Pendiente" };
      var citas = getCitas(); citas.unshift(cita); save(K.cit, citas);
      closeModal(); renderAgenda(); cntBadges();
      toast("Cita registrada ✅");
    });
  }

  /* ---------------- ADMIN: AJUSTES ---------------- */
  function renderAjustes() {
    var S = getSettings();
    $("#cfgNegocio").value = S.negocio;
    $("#cfgWhatsapp").value = S.whatsapp;
    $("#cfgDireccion").value = S.direccion;
    $("#cfgHorario").value = S.horario;
    $("#cfgPin").value = S.pin;
    $("#cfgIva").value = S.iva;
    $("#cfgEnvioLibre").value = S.envioLibre;
    $("#cfgEnvioCosto").value = S.envioCosto;
    $("#catalogList").innerHTML = getProducts().map(function (p) {
      return '<div class="order"><div class="order-body row"><span style="font-size:1.6rem">' + esc(p.e) + "</span><div class=\"grow\"><b>" + esc(p.n) + '</b><div class="tiny">' + esc(p.cat) + " · " + fmtMon(p.pr) + "</div></div>" +
        '<button class="btn btn-outline btn-sm" data-ed="' + p.id + '">Editar</button>' +
        '<button class="btn btn-danger btn-sm" data-dp="' + p.id + '">Eliminar</button></div></div>';
    }).join("");
    $$("#catalogList [data-ed]").forEach(function (b) {
      b.addEventListener("click", function () { openProducto(b.getAttribute("data-ed")); });
    });
    $$("#catalogList [data-dp]").forEach(function (b) {
      b.addEventListener("click", function () {
        var id = b.getAttribute("data-dp");
        if (confirm("Eliminar este producto?")) { save(K.prod, getProducts().filter(function (p) { return p.id !== id; })); renderAjustes(); }
      });
    });
    $("#serviciosAdmin").innerHTML = getServicios().map(function (s2, i) {
      return '<div class="order"><div class="order-body row"><span style="font-size:1.5rem">' + esc(s2.e) + "</span><div class=\"grow\"><b>" + esc(s2.s) + '</b><div class="tiny">' + esc(s2.d) + " · " + fmtMon(s2.pr) + "</div></div>" +
        '<button class="btn btn-outline btn-sm" data-es="' + i + '">Editar</button>' +
        '<button class="btn btn-danger btn-sm" data-ds="' + i + '">Eliminar</button></div></div>';
    }).join("");
    $$("#serviciosAdmin [data-es]").forEach(function (b) {
      b.addEventListener("click", function () { openServicio(Number(b.getAttribute("data-es"))); });
    });
    $$("#serviciosAdmin [data-ds]").forEach(function (b) {
      b.addEventListener("click", function () {
        var i = Number(b.getAttribute("data-ds"));
        if (confirm("Eliminar este servicio?")) { save(K.serv, getServicios().filter(function (x, j) { return j !== i; })); renderAjustes(); }
      });
    });
  }
  function saveCfg() {
    var S = getSettings();
    S.negocio = $("#cfgNegocio").value.trim() || S.negocio;
    S.whatsapp = $("#cfgWhatsapp").value.replace(/\D/g, "");
    S.direccion = $("#cfgDireccion").value.trim();
    S.horario = $("#cfgHorario").value.trim();
    S.pin = $("#cfgPin").value || S.pin;
    S.iva = Number($("#cfgIva").value) || 0;
    S.envioLibre = Number($("#cfgEnvioLibre").value) || 0;
    S.envioCosto = Number($("#cfgEnvioCosto").value) || 0;
    save(K.set, S);
    applyBrand();
    toast("Configuración guardada 💾");
  }
  function openProducto(id) {
    var P = getProducts();
    var p = P.filter(function (x) { return x.id === id; })[0] || { id: refUniq("prod").toLowerCase(), n: "", cat: "Generales", pr: 0, e: "📦", d: "" };
    openModal(id in (P.reduce(function (o, x) { o[x.id] = 1; return o; }, {})) ? "Editar producto" : "Nuevo producto",
      '<div class="form-grid">' +
      '<div class="field"><label>Emoji</label><input id="prE" maxlength="4" value="' + esc(p.e) + '"></div>' +
      '<div class="field"><label>Precio ($)</label><input id="prPr" type="number" min="0" value="' + p.pr + '"></div>' +
      '<div class="field full"><label>Nombre</label><input id="prN" value="' + esc(p.n) + '"></div>' +
      '<div class="field full"><label>Categoría</label><input id="prC" value="' + esc(p.cat) + '"></div>' +
      '<div class="field full"><label>Descripción</label><input id="prD" value="' + esc(p.d) + '"></div>' +
      "</div>",
      '<button class="btn btn-accent" id="prSave">Guardar</button>');
    $("#prSave").addEventListener("click", function () {
      var e = $("#prE").value.trim() || "📦";
      var n = $("#prN").value.trim();
      var c = $("#prC").value.trim() || "Generales";
      var pr = Number($("#prPr").value) || 0;
      var d = $("#prD").value.trim();
      if (!n) { toast("Nombre del producto"); return; }
      var P2 = getProducts();
      var exists = P2.some(function (x) { return x.id === id; });
      if (exists) { save(K.prod, P2.map(function (x) { return x.id === id ? Object.assign({}, x, { n: n, c: c, pr: pr, e: e, d: d }) : x; })); }
      else { P2.push({ id: id, n: n, cat: c, pr: pr, e: e, d: d }); save(K.prod, P2); }
      closeModal(); renderAjustes();
      toast("Producto guardado ✅");
    });
  }
  function openServicio(i) {
    var SV = getServicios();
    var s = SV[i];
    if (!s) return;
    openModal("Editar servicio",
      '<div class="form-grid">' +
      '<div class="field"><label>Emoji</label><input id="svE" maxlength="4" value="' + esc(s.e) + '"></div>' +
      '<div class="field"><label>Precio ($)</label><input id="svPr" type="number" min="0" value="' + s.pr + '"></div>' +
      '<div class="field full"><label>Nombre</label><input id="svN" value="' + esc(s.s) + '"></div>' +
      '<div class="field full"><label>Descripción</label><input id="svD" value="' + esc(s.d) + '"></div>' +
      "</div>",
      '<button class="btn btn-accent" id="svSave">Guardar</button>');
    $("#svSave").addEventListener("click", function () {
      var nn = $("#svN").value.trim();
      if (!nn) { toast("Nombre del servicio"); return; }
      var newS = { s: nn, pr: Number($("#svPr").value) || 0, d: $("#svD").value.trim(), e: $("#svE").value.trim() || "⭐" };
      var SV2 = getServicios();
      SV2[i] = newS;
      save(K.serv, SV2);
      closeModal(); renderAjustes();
      toast("Servicio guardado ✅");
    });
  }

  /* ---------------- Ticket / respaldo ---------------- */
  function printOrder(ref) {
    var ords = getOrders();
    var o = ords.filter(function (x) { return x.ref === ref; })[0];
    if (!o) return;
    var S = getSettings();
    var fecha = fmtFecha((o.ts || "").slice(0, 10)) + " " + ((o.ts || "").slice(11, 16) || "");
    var lineas = [];
    lineas.push("      " + S.negocio.toUpperCase());
    lineas.push(S.direccion);
    lineas.push("--------------------------------");
    lineas.push("Folio: " + o.ref);
    lineas.push("Fecha: " + fecha);
    lineas.push((o.cliente && o.cliente.n ? "Cliente: " + o.cliente.n : "Cliente mostrador"));
    lineas.push("--------------------------------");
    (o.items || []).forEach(function (i) {
      lineas.push(i.n.slice(0, 28) + (i.q > 1 ? " x" + i.q : ""));
      lineas.push("   " + fmtMon(i.pr * i.q));
    });
    lineas.push("--------------------------------");
    if (o.envio) lineas.push("Envío:            " + fmtMon(o.envio));
    lineas.push("IVA (" + S.iva + "%):        " + fmtMon(o.iva));
    lineas.push("*TOTAL:          " + fmtMon(o.total) + "*");
    lineas.push("Método: " + (o.metodo || "Efectivo"));
    lineas.push("--------------------------------");
    lineas.push("¡Gracias por tu compra!");
    var z = $("#printZone");
    z.style.display = "block";
    z.innerHTML = "<pre>" + esc(lineas.join("\n")) + "</pre>";
    window.print();
    setTimeout(function () { z.style.display = "none"; z.innerHTML = ""; }, 400);
  }
  function backup() {
    var data = {
      app: "solucionestech",
      fecha: new Date().toISOString(),
      settings: getSettings(), products: getProducts(), servicios: getServicios(),
      orders: getOrders(), citas: getCitas()
    };
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "negocio-respaldo-" + hoyISO() + ".json";
    document.body.appendChild(a); a.click();
    setTimeout(function () { document.body.removeChild(a); URL.revokeObjectURL(a.href); }, 400);
    toast("Respaldo descargado ⬇️");
  }
  function restore(file) {
    var r = new FileReader();
    r.onload = function () {
      try {
        var d = JSON.parse(r.result);
        if (d.app !== "solucionestech") throw new Error("archivo");
        if (d.settings) save(K.set, d.settings);
        if (d.products) save(K.prod, d.products);
        if (d.servicios) save(K.serv, d.servicios);
        if (d.orders) save(K.ord, d.orders);
        if (d.citas) save(K.cit, d.citas);
        applyBrand(); renderAjustes(); renderVentas();
        toast("Datos restaurados ✅");
      } catch (e) { toast("Archivo de respaldo inválido ❌"); }
    };
    r.readAsText(file);
  }
  function resetData() {
    if (confirm("¿Restablecer TODAS las ventas, pedidos y citas? Esta acción no se puede deshacer.")) {
      save(K.ord, []); save(K.cit, []);
      renderPanel();
      toast("Datos restablecidos 🧹");
    }
  }

  /* =================================================
     EVENTOS GLOBALES
     ================================================= */
  function bind() {
    /* Navegación — por delegación para contenido dinámico */
    document.addEventListener("click", function (e) {
      var el = e.target.closest ? e.target.closest("[data-nav]") : null;
      if (el) {
        var v = el.getAttribute("data-nav");
        if (v === "admin") renderAdmin();
        go(v);
      }
    });
    /* Sidebar admin */
    $$(".side-link[data-pane]").forEach(function (el) {
      el.addEventListener("click", function () { showPane(el.getAttribute("data-pane")); });
    });
    $("#btnLogout").addEventListener("click", doLogout);
    $("#btnLogin").addEventListener("click", doLogin);
    $("#pinInput").addEventListener("keydown", function (e) { if (e.key === "Enter") doLogin(); });

    /* Tema */
    $("#themeToggle").addEventListener("click", function () {
      document.body.classList.toggle("dark");
      var m = document.body.classList.contains("dark");
      $("#icoMoon").textContent = m ? "☀️" : "🌙";
      save(K.theme, m);
    });

    /* Topbar scroll */
    var tb = $("#topbar");
    window.addEventListener("scroll", function () {
      tb.classList.toggle("scrolled", window.scrollY > 8);
    });

    /* Carrito */
    $("#openCartBtn").addEventListener("click", openCart);
    $("#fabCart").addEventListener("click", openCart);
    $("#closeCart").addEventListener("click", closeCartAll);
    $("#cartOverlay").addEventListener("click", closeCartAll);
    $("#checkoutBtn").addEventListener("click", function () {
      if (!cartItems().length) { toast("Tu carrito está vacío"); return; }
      openCheckout();
    });

    /* Modal */
    $("#modalClose").addEventListener("click", function () {
      $("#modalBox").classList.remove("lg");
      closeModal();
    });
    $("#modalOverlay").addEventListener("click", function (e) {
      if (e.target === $("#modalOverlay")) {
        $("#modalBox").classList.remove("lg");
        closeModal();
      }
    });

    /* Citas */
    $("#citaForm").addEventListener("submit", enviarCita);
    $("#cServicio").addEventListener("change", syncPrecioCita);

    /* Panel: accesos */
    $("#btnNewOrder").addEventListener("click", openNuevoPedido);
    $("#btnAbrirPDV").addEventListener("click", openPDV);
    $("#btnNewCita").addEventListener("click", openNuevaCita);
    $("#btnBackup").addEventListener("click", backup);
    $("#btnResetData").addEventListener("click", resetData);
    $("#btnRestore").addEventListener("click", function () {
      var inp = document.createElement("input");
      inp.type = "file"; inp.accept = ".json";
      inp.onchange = function () { if (inp.files[0]) restore(inp.files[0]); };
      inp.click();
    });
    $("#btnSaveCfg").addEventListener("click", saveCfg);
    $("#btnAddProd").addEventListener("click", function () { openProducto(refUniq("p").toLowerCase()); });
    $("#btnAddServicio").addEventListener("click", function () {
      openServicioEdit();
    });
    $("#boardingForm").addEventListener("submit", finBoarding);
  }
  function openServicioEdit() {
    openModal("Nuevo servicio",
      '<div class="form-grid">' +
      '<div class="field"><label>Emoji</label><input id="svE" maxlength="4" value="⭐"></div>' +
      '<div class="field"><label>Precio ($)</label><input id="svPr" type="number" min="0" value="100"></div>' +
      '<div class="field full"><label>Nombre</label><input id="svN"></div>' +
      '<div class="field full"><label>Descripción</label><input id="svD"></div>' +
      "</div>",
      '<button class="btn btn-accent" id="svSave">Guardar</button>');
    $("#svSave").addEventListener("click", function () {
      var nn = $("#svN").value.trim();
      if (!nn) { toast("Nombre del servicio"); return; }
      var SV2 = getServicios();
      SV2.push({ s: nn, pr: Number($("#svPr").value) || 0, d: $("#svD").value.trim(), e: $("#svE").value.trim() || "⭐" });
      save(K.serv, SV2);
      closeModal(); renderAjustes();
      toast("Servicio agregado ✅");
    });
  }

  function openNuevoPedido() {
    openModal("Registrar pedido (WhatsApp)",
      '<p class="muted mb">Captura un pedido que llegó por WhatsApp, llamada o a domicilio.</p>' +
      '<div class="form-grid">' +
      '<div class="field"><label>Cliente</label><input id="npNombre" placeholder="Nombre"></div>' +
      '<div class="field"><label>WhatsApp (10 dígitos)</label><input id="npTel" inputmode="numeric" maxlength="10"></div>' +
      '<div class="field full"><label>Dirección</label><input id="npDir"></div>' +
      '<div class="field full"><label>Detalle del pedido</label><textarea id="npDet" rows="3" placeholder="Ej: 1x Croquetas 3kg, 2x premio de pollo"></textarea></div>' +
      '<div class="field"><label>Total ($)</label><input id="npTotal" type="number" min="0" placeholder="350"></div>' +
      '<div class="field"><label>Método de pago</label><select id="npMetodo">' + METODOS.map(function (m) { return "<option>" + m + "</option>"; }).join("") + "</select></div>" +
      "</div>",
      '<button class="btn btn-success" id="npCobrar">Cobrar y registrar</button><button class="btn btn-outline" id="npSolo">Solo registrar</button>');
    $("#npCobrar").addEventListener("click", function () { guardarNuevoPedido(true); });
    $("#npSolo").addEventListener("click", function () { guardarNuevoPedido(false); });
  }
  function guardarNuevoPedido(cobrar) {
    var nom = $("#npNombre").value.trim();
    var det = $("#npDet").value.trim();
    if (!nom) { toast("Nombre del cliente"); return; }
    if (!det) { toast("Detalle del pedido"); return; }
    var total = Number($("#npTotal").value) || 0;
    var ref = refUniq("E");
    var order = {
      ref: ref, ts: new Date().toISOString(), tipo: "externo",
      items: [{ n: det.slice(0, 80), pr: 0, q: 1 }], sub: total, envio: 0, iva: 0, total: total,
      metodo: $("#npMetodo").value, estado: cobrar ? "entregado" : "nuevo", pagado: cobrar || false,
      cliente: { n: nom, tel: $("#npTel").value.replace(/\D/g, ""), dir: $("#npDir").value.trim(), nota: "" }
    };
    var ords = getOrders(); ords.unshift(order); save(K.ord, ords);
    closeModal(); renderPedidos(); cntBadges();
    toast(cobrar ? "Registrado y cobrado 💸" : "Pedido registrado 📦");
  }

  /* =================================================
     COBRO (modal confirmación de método)
     ================================================= */
  /* (se abre dentro de openCobro; el evento se enlaza tras abrir) */

  /* =================================================
     INIT
     ================================================= */
  function init() {
    /* defaults */
    if (localStorage.getItem(K.prod) === null) save(K.prod, DEFAULT_PRODUCTS);
    if (localStorage.getItem(K.serv) === null) save(K.serv, DEFAULT_SERVICIOS);
    if (localStorage.getItem(K.set) === null) save(K.set, DEFAULT_SETTINGS);

    /* primer inicio */
    if (!isReady()) {
      bind();
      showBoarding();
      return;
    }

    /* theme */
    if (load(K.theme, false)) {
      document.body.classList.add("dark");
      $("#icoMoon").textContent = "☀️";
    }

    applyBrand();
    go("home");
    renderHome();
    renderFilters();
    renderProducts();
    renderCitaForm();
    cartCounts();

    bind();
    renderAdmin();
  }

  /* Enlazar cobro modal (definido después por hoisting de funciones) */
  document.addEventListener("click", function (e) {
    var el = e.target.closest("#cobOk");
    if (el) {
      var sel = $("#modalBody input[name=metodo]:checked");
      var metodo = sel ? sel.value : "Efectivo";
      var ref = $("#modalTitle").textContent.replace("Cobrar ", "").trim();
      registrarVenta(ref, metodo);
    }
  });

  init();
})();