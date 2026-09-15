﻿$ErrorActionPreference = 'Stop'
$scriptDir   = Split-Path -Parent $MyInvocation.MyCommand.Path
$demosDir    = Split-Path -Parent $scriptDir
$outDir      = Join-Path $demosDir 'prospectos'

$cssSrc      = Join-Path $demosDir 'dental-premium\css\style.css'
$jsSrc       = Join-Path $scriptDir 'main.js'

if (Test-Path $outDir) { Remove-Item $outDir -Recurse -Force }
New-Item -ItemType Directory -Path $outDir -Force | Out-Null

# ================= PALETAS =================
$pal = @{
  dental = @{ bg='#f4f9fb'; surface='#ffffff'; soft='#eef6f9'; line='#dfeaf0'; ink='#12314b'; muted='#5c7186'; accent='#0f9d8e'; dark='#0c7d70'; glow='rgba(15,157,142,0.13)'; gs='rgba(15,157,142,0.42)'; accent2='#2bc5e3'; grad='linear-gradient(120deg,#0f9d8e,#2bc5e3)'; heroA='rgba(43,197,227,0.22)'; heroB='rgba(15,157,142,0.18)' }
  veterinaria = @{ bg='#f4f9f6'; surface='#ffffff'; soft='#eaf4ef'; line='#dcebe3'; ink='#16342b'; muted='#5f7c70'; accent='#12996e'; dark='#0c7d57'; glow='rgba(18,153,110,0.13)'; gs='rgba(18,153,110,0.42)'; accent2='#e8a33d'; grad='linear-gradient(120deg,#12996e,#e8a33d)'; heroA='rgba(232,163,61,0.20)'; heroB='rgba(18,153,110,0.16)' }
  comida = @{ bg='#fbf4ee'; surface='#ffffff'; soft='#f8e9dc'; line='#f0dfce'; ink='#45291c'; muted='#8a6a4f'; accent='#e2602c'; dark='#c14a1c'; glow='rgba(226,96,44,0.13)'; gs='rgba(226,96,44,0.42)'; accent2='#e8b23a'; grad='linear-gradient(120deg,#e2602c,#e8b23a)'; heroA='rgba(232,178,58,0.22)'; heroB='rgba(226,96,44,0.16)' }
  rojo = @{ bg='#fbf3f1'; surface='#ffffff'; soft='#f9e6e2'; line='#f2d4cd'; ink='#45211e'; muted='#8a5a52'; accent='#d6453f'; dark='#b3342f'; glow='rgba(214,69,63,0.13)'; gs='rgba(214,69,63,0.42)'; accent2='#e98a3f'; grad='linear-gradient(120deg,#d6453f,#e98a3f)'; heroA='rgba(233,138,63,0.20)'; heroB='rgba(214,69,63,0.15)' }
  verde = @{ bg='#f2f8f2'; surface='#ffffff'; soft='#e7f2e7'; line='#d8eadb'; ink='#1f3c27'; muted='#5f7c67'; accent='#2f9e44'; dark='#23833a'; glow='rgba(47,158,68,0.13)'; gs='rgba(47,158,68,0.40)'; accent2='#7cc24b'; grad='linear-gradient(120deg,#2f9e44,#7cc24b)'; heroA='rgba(124,194,75,0.20)'; heroB='rgba(47,158,68,0.16)' }
  medica = @{ bg='#f2f7fb'; surface='#ffffff'; soft='#e7f1f9'; line='#d8e7f2'; ink='#12344f'; muted='#5b7286'; accent='#1e7fc4'; dark='#16609b'; glow='rgba(30,127,196,0.13)'; gs='rgba(30,127,196,0.40)'; accent2='#53b8e8'; grad='linear-gradient(120deg,#1e7fc4,#53b8e8)'; heroA='rgba(83,184,232,0.20)'; heroB='rgba(30,127,196,0.15)' }
  violeta = @{ bg='#f6f5fb'; surface='#ffffff'; soft='#efedf8'; line='#e2def0'; ink='#2a2450'; muted='#6b648f'; accent='#6d5bd0'; dark='#5443b3'; glow='rgba(109,91,208,0.14)'; gs='rgba(109,91,208,0.40)'; accent2='#a78bfa'; grad='linear-gradient(120deg,#6d5bd0,#a78bfa)'; heroA='rgba(167,139,250,0.20)'; heroB='rgba(109,91,208,0.15)' }
  notaria = @{ bg='#f6f5f1'; surface='#ffffff'; soft='#eeede7'; line='#e0ddd2'; ink='#22304a'; muted='#66718a'; accent='#9a7423'; dark='#7c5c18'; glow='rgba(154,116,35,0.13)'; gs='rgba(154,116,35,0.42)'; accent2='#d6b656'; grad='linear-gradient(120deg,#9a7423,#d6b656)'; heroA='rgba(214,182,86,0.20)'; heroB='rgba(154,116,35,0.14)' }
}

# ================= TIPOS (contenido base por rubro) =================
$T = @{
  comida = @{ nav1='Menú'; nav2='Precios'; nav3='Pedir ahora'; proposito='hacer un pedido en'; itemLabel='Pedido'; cta2='Pedir'; cta='Hacer mi pedido'; bookTitle='Pide en un minuto'; bookDesc='Arma tu pedido, elige día y hora. Te confirmamos por WhatsApp.'; step1='Elige tus platillos'; step1d='Marca lo que quieras del menú.'; step2='Confirma día y hora'; step2d='Elige en el calendario cuándo lo necesitas.'; step3='Pedido por WhatsApp'; step3d='Nos llega tu pedido listo y te confirmamos al momento.'; secServTag='Menú'; secServTitle='Nuestro menú'; secServDesc='Platillos hechos al momento, con ingredientes frescos.'; secPriTag='Precios'; secPriTitle='Nuestros precios'; secPriDesc='Precios claros para que pidas sin sorpresas.'; priceNote='Recoge en el local o pregunta por tu domicilio.'; bookStep1='1 · Elige tus platillos'; bookHint='Al confirmar se abre WhatsApp con tu pedido listo.'; summaryDef='Selecciona platillos, día y hora para armar tu pedido.'; stats=@(@('15+','platillos caseros'),@('4.9','preferidos'),@('1,000+','pedidos atendidos')) }
  dental = @{ nav1='Tratamientos'; nav2='Precios'; nav3='Agendar cita'; proposito='agendar una cita en'; itemLabel='Servicio'; cta2='Agendar'; cta='Agendar mi cita'; bookTitle='Agenda tu cita en un minuto'; bookDesc='Elige tu tratamiento, el día y la hora. Confirmamos por WhatsApp.'; step1='Elige tu tratamiento'; step1d='Consulta, limpieza, ortodoncia…'; step2='Confirma día y hora'; step2d='Elige en el calendario la fecha que mejor te acomode.'; step3='Te confirmamos por WhatsApp'; step3d='Recibes tu cita confirmada en minutos.'; secServTag='Tratamientos'; secServTitle='Tu sonrisa, en las mejores manos'; secServDesc='Tratamientos completos con tecnología y trato familiar.'; secPriTag='Precios'; secPriTitle='Precios claros y accesibles'; secPriDesc='Precios de referencia; tu valoración confirma todo sin costo adicional.'; priceNote='Pago en efectivo, tarjeta o transferencia · Sin costo de valoración extra'; bookStep1='1 · Elige tu tratamiento'; bookHint='Al confirmar se abre WhatsApp con tus datos listos.'; summaryDef='Selecciona servicio, día y hora para confirmar tu cita.'; stats=@(@('15+','años de experiencia'),@('4,000+','pacientes'),@('4.9★','calificación')) }
  veterinaria = @{ nav1='Servicios'; nav2='Precios'; nav3='Agendar cita'; proposito='agendar una cita en'; itemLabel='Servicio'; cta2='Agendar'; cta='Agendar consulta'; bookTitle='Agenda en un minuto'; bookDesc='Elige el servicio para tu mascota, el día y la hora.'; step1='Elige el servicio'; step1d='Consulta, vacuna, estética…'; step2='Confirma día y hora'; step2d='Elige en el calendario el mejor momento.'; step3='Agendamos a tu mascota'; step3d='Confirmamos tu cita por WhatsApp.'; secServTag='Servicios'; secServTitle='El mejor cuidado para tu mascota'; secServDesc='Atención médica y estética con cariño.'; secPriTag='Precios'; secPriTitle='Precios claros y accesibles'; secPriDesc='Precios de referencia por servicio.'; priceNote='Pago en efectivo, tarjeta o transferencia'; bookStep1='1 · Elige el servicio'; bookHint='Al confirmar se abre WhatsApp con tus datos listos.'; summaryDef='Selecciona servicio, día y hora para confirmar la cita.'; stats=@(@('10+','años de experiencia'),@('3,000+','mascotas atendidas'),@('4.9★','calificación')) }
  medica = @{ nav1='Servicios'; nav2='Precios'; nav3='Agendar cita'; proposito='agendar una cita en'; itemLabel='Consulta'; cta2='Agendar'; cta='Agendar mi cita'; bookTitle='Agenda tu cita en un minuto'; bookDesc='Elige el servicio, el día y la hora. Confirmamos por WhatsApp.'; step1='Elige tu consulta'; step1d='Consulta, chequeo, control…'; step2='Confirma día y hora'; step2d='Elige en el calendario la fecha ideal.'; step3='Te confirmamos por WhatsApp'; step3d='Recibes confirmación en minutos.'; secServTag='Servicios'; secServTitle='Cuidamos tu salud'; secServDesc='Consultas y servicios médicos con atención cercana.'; secPriTag='Precios'; secPriTitle='Precios claros y accesibles'; secPriDesc='Precios de referencia; se confirman en consulta.'; priceNote='Pago en efectivo, tarjeta o transferencia'; bookStep1='1 · Elige el servicio'; bookHint='Al confirmar se abre WhatsApp con tus datos listos.'; summaryDef='Selecciona servicio, día y hora para confirmar tu cita.'; stats=@(@('12+','años de experiencia'),@('2,500+','pacientes'),@('4.9★','calificación')) }
  notaria = @{ nav1='Trámites'; nav2='Tarifas'; nav3='Agendar cita'; proposito='solicitar información para un trámite en'; itemLabel='Trámite'; cta2='Solicitar'; cta='Agendar mi trámite'; bookTitle='Agenda tu cita en un minuto'; bookDesc='Elige el trámite, el día y la hora. Te recibimos en la notaría.'; step1='Elige tu trámite'; step1d='Testamento, poder, compraventa…'; step2='Agenda día y hora'; step2d='Elige en el calendario el momento ideal.'; step3='Te recibimos en la notaría'; step3d='Confirmamos por WhatsApp y te atendemos.'; secServTag='Trámites'; secServTitle='Trámites seguros y con transparencia'; secServDesc='Te acompañamos paso a paso en cada trámite notarial.'; secPriTag='Tarifas'; secPriTitle='Tarifas claras'; secPriDesc='Tarifas de referencia; cotización exacta según tu caso.'; priceNote='Consulta inicial sin costo'; bookStep1='1 · Elige el trámite'; bookHint='Al confirmar se abre WhatsApp con tus datos listos.'; summaryDef='Selecciona trámite, día y hora para agendar.'; stats=@(@('15+','años de servicio'),@('5,000+','trámites'),@('100%','seguridad jurídica')) }
}

# ================= TEMPLATE HTML =================
$tpl = @'
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="@@DESC@@">
  <title>@@TITLE@@</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
  <style>
@@PALETTE@@
  </style>
</head>
<body>

  <!-- NAV -->
  <header class="nav" id="nav">
    <div class="container nav-inner">
      <a href="#inicio" class="logo" aria-label="@@NOMBRE@@">
        <span class="logo-badge">@@BADGE@@</span>
        <span class="logo-text">@@LOGA@@<span class="logo-accent">@@LOGB@@</span></span>
      </a>
      <button class="nav-toggle" id="navToggle" aria-label="Abrir menú" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
      <ul class="nav-menu" id="navMenu">
        <li><a href="#servicios" class="nav-link">@@NAV1@@</a></li>
        <li><a href="#precios" class="nav-link">@@NAV2@@</a></li>
        <li><a href="#citas" class="nav-link">@@NAV3@@</a></li>
        <li><a href="#citas" class="btn btn-primary btn-sm">@@CTA@@</a></li>
      </ul>
    </div>
  </header>

  <!-- HERO -->
  <section class="hero" id="inicio">
    <div class="container">
      <div class="hero-badge">@@HERO_BADGE@@</div>
      <h1 class="hero-title">@@H1A@@<br><span class="gradient-text">@@H1B@@</span></h1>
      <p class="hero-subtitle">@@SUB@@</p>
      <div class="hero-actions">
        <a href="#citas" class="btn btn-primary btn-lg">@@CTA@@</a>
        <a href="#precios" class="btn btn-outline btn-lg">Ver @@NAV2_LOWER@@</a>
      </div>
      <div class="hero-stats">
        @@STATS@@
      </div>
    </div>
  </section>

  <!-- SERVICIOS / MENÚ -->
  <section class="section" id="servicios">
    <div class="container">
      <div class="section-head">
        <span class="section-tag">@@SEC_SERV_TAG@@</span>
        <h2 class="section-title">@@SEC_SERV_TITLE@@</h2>
        <p class="section-desc">@@SEC_SERV_DESC@@</p>
      </div>
      <div class="grid-3">
        @@CARDS@@
      </div>
    </div>
  </section>

  <!-- PRECIOS -->
  <section class="section section-alt" id="precios">
    <div class="container">
      <div class="section-head">
        <span class="section-tag">@@SEC_PRI_TAG@@</span>
        <h2 class="section-title">@@SEC_PRI_TITLE@@</h2>
        <p class="section-desc">@@SEC_PRI_DESC@@</p>
      </div>
      <div class="price-table">
        @@PRICE_ROWS@@
      </div>
      <p class="price-note">@@PRICE_NOTE@@</p>
    </div>
  </section>

  <!-- CÓMO FUNCIONA -->
  <section class="section">
    <div class="container">
      <div class="section-head">
        <span class="section-tag">Proceso</span>
        <h2 class="section-title">@@STEP_TITLE@@</h2>
      </div>
      <div class="steps">
        @@STEPS@@
      </div>
    </div>
  </section>

  <!-- RESERVAR / CITAS -->
  <section class="section section-alt" id="citas">
    <div class="container">
      <div class="section-head">
        <span class="section-tag">Reserva en línea</span>
        <h2 class="section-title">@@BOOK_TITLE@@</h2>
        <p class="section-desc">@@BOOK_DESC@@</p>
      </div>

      <div class="book-wrap">
        <div class="book-widget" role="group">
          <div class="book-step">
            <h4 class="book-title">@@BOOK_STEP1@@</h4>
            <div class="service-grid" id="serviceGrid">
              @@CHIPS@@
            </div>
          </div>

          <div class="book-step">
            <h4 class="book-title">2 · Elige el día</h4>
            <div class="cal-head">
              <button class="cal-nav" id="calPrev" aria-label="Mes anterior">‹</button>
              <span class="cal-title" id="calTitle"></span>
              <button class="cal-nav" id="calNext" aria-label="Mes siguiente">›</button>
            </div>
            <div class="cal-week"><span>D</span><span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span></div>
            <div class="cal-grid" id="calGrid"></div>
          </div>

          <div class="book-step">
            <h4 class="book-title">3 · Elige la hora</h4>
            <div class="slots" id="slots"></div>
          </div>

          <div class="book-summary" id="summary">@@SUMMARY_DEF@@</div>

          <button class="btn btn-primary btn-block btn-lg" id="confirmBtn" disabled>@@CTA@@</button>
          <p class="book-hint">@@BOOK_HINT@@</p>
        </div>

        <aside class="book-info">
          <h3 class="book-info-title">Horario y ubicación</h3>
          <ul class="info-list">
            @@INFO_LI@@
          </ul>
          <a id="directWhatsApp" href="@@DIRECT_WA@@" target="_blank" rel="noopener" class="btn btn-whatsapp btn-block">💬 Hablar por WhatsApp</a>
        </aside>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="footer">
    <div class="container footer-inner">
      <span class="logo"><span class="logo-badge">@@BADGE@@</span><span class="logo-text">@@LOGA@@<span class="logo-accent">@@LOGB@@</span></span></span>
      <p class="footer-note">@@RUBRO@@ · Berriozábal, Chiapas · © @@NOMBRE@@</p>
      <a id="footerWhatsApp" href="@@DIRECT_WA@@" target="_blank" rel="noopener" class="footer-link">WhatsApp</a>
    </div>
  </footer>

  <a id="floatingWhatsApp" href="@@DIRECT_WA@@" target="_blank" rel="noopener" class="wa-float" aria-label="Hablar por WhatsApp">
    <svg viewBox="0 0 32 32" width="30" height="30" fill="currentColor" aria-hidden="true">
      <path d="M16 3a13 13 0 0 0-11.2 19.5L3 29l6.8-1.8A13 13 0 1 0 16 3z" fill="#fff"/>
      <path d="M16 4.6c6 0 10.9 4.9 10.9 10.9 0 6-4.9 10.9-10.9 10.9-2 0-3.9-.5-5.5-1.5l-.3-.2-3.2.8.9-3-.2-.4A10.7 10.7 0 0 1 5.1 15.5c0-6 4.9-10.9 10.9-10.9z" fill="#25D366"/>
      <path d="M12.3 10.5c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9 0 1.7 1.2 3.4 1.4 3.6.2.2 2.4 4.1 6.1 5.1 3.6 1 3.6.7 4.2.6.7-.1 2.1-.9 2.4-1.7.3-.8.3-1.5.2-1.7-.1-.1-.3-.2-.7-.4-.3-.1-2.1-1-2.4-1.2-.3-.1-.6-.1-.8.2-.2.3-.9 1.1-1.1 1.3-.2.2-.4.3-.8.1-.3-.2-1.5-.7-2.8-1.7-1-.8-1.8-1.9-2-2.2-.2-.3 0-.5.1-.7l.5-.6c.2-.2.3-.4.4-.6.1-.2.1-.4 0-.6-.1-.2-.8-2-1.1-2.7-.3-.7-.6-.6-.8-.6z" fill="#fff"/>
    </svg>
  </a>

  <script>
    window.BOOK = @@BOOKJS@@;
  </script>
  <script src="js/main.js"></script>
</body>
</html>
'@

function Esc($s) { return [uri]::EscapeDataString($s) }

# ================= PROSPECTOS =================
$prospects = @()

$prospects += @{ slug='gin-seng'; tipo='comida'; pal='rojo'; nombre='Restaurant Gin Seng'; loga='Gin'; logb='Seng'; badge='🍛'; rubro='Restaurante'; h1a='El mejor sabor oriental'; h1b='en Berriozábal'; sub='Comida china y cantonesa preparada al momento, con ingredientes frescos. Pide fácil desde tu celular y recoge cuando quieras.'; zona='Col. San Sebastián'; dir='2a. Norte Oriente s/n, cerca de la iglesia'; horario='Todos los días · 10:00 am – 6:00 pm'; tel='961 608 4822'; allowSunday=$true; waText='Hola, quiero información sobre su menú y precios.'; services=@(
  @{e='🍚';n='Arroz frito de la casa';d='Salteado con verduras y pollo, receta cantonesa.';p='$90'},
  @{e='🌯';n='Rollos de primavera';d='Rellenos de verdura con salsa agridulce.';p='$70'},
  @{e='🍊';n='Pollo a la naranja';d='En salsa agridulce, porción generosa.';p='$160'},
  @{e='🍤';n='Camarones a la plancha';d='Acompañados de arroz y verduras.';p='$220'},
  @{e='🥘';n='Plato familiar (2–3 pers.)';d='Arroz, rollitos, pollo y carne.';p='$350'},
  @{e='🍛';n='Menú del día';d='Sopa, plato fuerte y bebida.';p='$120'} ) }

$prospects += @{ slug='hodah'; tipo='comida'; pal='comida'; nombre='Hamburguesas y Hot Dogs HODAH'; loga='HODAH'; logb='Burgers'; badge='🍔'; rubro='Comida rápida'; h1a='La hamburguesa que te encanta,'; h1b='hecha al momento'; sub='Hamburguesas y hot dogs con carne al carbón y salsas de la casa. Pide por WhatsApp y recoge en pocos minutos.'; zona='Col. San Marcos'; dir='6a. Poniente Pte. #208'; horario='Todos los días · 12:00 pm – 9:00 pm'; tel='961 124 9362'; allowSunday=$true; waText='Hola, quiero información de sus hamburguesas.'; services=@(
  @{e='🍔';n='Hamburguesa clásica';d='Carne al carbón, queso y salsa de la casa.';p='$80'},
  @{e='🍟';n='Hamburguesa con papas';d='Incluye orden de papas de acompañamiento.';p='$100'},
  @{e='🌭';n='Hot dog sencillo';d='Con cebolla, tomate y salsa.';p='$45'},
  @{e='🌮';n='Hot dog especial';d='Tocino, queso y papas al interior.';p='$60'},
  @{e='🍗';n='Orden de papas';d='Con salsa tártara o catsup.';p='$45'},
  @{e='🍱';n='Combo familiar';d='4 combos medianos + papas grandes.';p='$250'} ) }

$prospects += @{ slug='tizoncito'; tipo='comida'; pal='comida'; nombre='Cenaduría El Tizoncito'; loga='El'; logb='Tizoncito'; badge='🌮'; rubro='Cenaduría'; h1a='Las noches saben mejor'; h1b='con sazón de cenaduría'; sub='Tostadas, pambazos, sopes y más, como los de antaño. Aparta tu orden por WhatsApp y llévala al momento.'; zona='Col. San Marcos'; dir='Av. Central Poniente'; horario='Lunes a sábado · 5:00 pm – 11:00 pm'; tel=''; allowSunday=$false; waText='Hola, quiero información de su menú de cenaduría.'; services=@(
  @{e='🫓';n='Tostadas';d='De pollo o pata, con crema y queso.';p='$30'},
  @{e='🥪';n='Pambazo';d='Con papa, chorizo y queso gratinado.';p='$45'},
  @{e='🫔';n='Sopes';d='Con frijoles, queso y salsa.';p='$25'},
  @{e='🌮';n='Tacos dorados';d='Orden de 3 con ensalada y crema.';p='$40'},
  @{e='🍲';n='Caldito de fiesta';d='Al estilo cenaduría (domingos).';p='$60'},
  @{e='☕';n='Café de olla';d='Preparado con piloncillo y canela.';p='$20'} ) }

$prospects += @{ slug='taco-chito'; tipo='comida'; pal='rojo'; nombre='Taco Chito'; loga='Taco'; logb='Chito'; badge='🌮'; rubro='Taquería'; h1a='Tacos al carbón'; h1b='para toda la noche'; sub='Bistec, pastor, volcanes y gringas con salsas hechas en casa. Haz tu pedido por WhatsApp y pasa a recogerlo.'; zona='Centro'; dir='2a. Norte Poniente s/n, frente al parque'; horario='Todos los días · 5:00 pm – 12:00 am'; tel=''; allowSunday=$true; waText='Hola, quiero información de sus tacos.'; services=@(
  @{e='🥩';n='Taco de bistec';d='Al carbón con salsa verde o roja.';p='$20'},
  @{e='🌮';n='Taco al pastor';d='Con piña y cebolla.';p='$20'},
  @{e='🌯';n='Volcán';d='Tortilla con queso fundido y garnacha.';p='$30'},
  @{e='🌄';n='Gringa';d='Pastor extra, queso y guacamole.';p='$45'},
  @{e='🍲';n='Consomé';d='De res, con cilantro y cebolla.';p='$40'},
  @{e='🍽️';n='Combo 8 tacos';d='Bistec o pastor + consomé.';p='$140'} ) }

$prospects += @{ slug='pollos-farrera'; tipo='comida'; pal='comida'; nombre='Pollos Asados Farrera'; loga='Pollos'; logb='Farrera'; badge='🍗'; rubro='Pollos asados'; h1a='Pollo asado al carbón,'; h1b='sabor de casa'; sub='Pollo entero o por piezas con adobo propio y salsas. Encarga por WhatsApp y recoge sin filas.'; zona='Col. San Sebastián'; dir='Calle 3 Sur entre 6 Ote.'; horario='Todos los días · 9:00 am – 3:00 pm'; tel=''; allowSunday=$true; waText='Hola, quiero encargar un pollo asado.'; services=@(
  @{e='🍗';n='Pollo asado entero';d='Al carbón con adobo de la casa.';p='$220'},
  @{e='🍴';n='Medio pollo';d='Con ensalada u opción de frijoles.';p='$130'},
  @{e='🥔';n='Cuarto de pollo';d='Opción práctica para uno.';p='$70'},
  @{e='🍟';n='Orden de papas';d='Con salsa especial.';p='$40'},
  @{e='🌶️';n='Salsa de la casa';d='Extra con chile de árbol.';p='$25'},
  @{e='🍽️';n='Combo pollo + papas';d='Entero con papas y salsas.';p='$250'} ) }

$prospects += @{ slug='los-chuncos'; tipo='comida'; pal='comida'; nombre='Los Chuncos'; loga='Los'; logb='Chuncos'; badge='🍲'; rubro='Comida familiar'; h1a='Comida casera'; h1b='para la familia'; sub='Mole, caldos y menú familiar como en casa. Reserva tu orden por WhatsApp para el día que la necesites.'; zona='Fracc. Pedregal Bugambilias'; dir='Fracc. Pedregal Bugambilias'; horario='Domingo a viernes · 8:00 am – 6:00 pm'; tel=''; allowSunday=$true; waText='Hola, quiero información de su menú del día.'; services=@(
  @{e='🍲';n='Mole de pollo';d='Receta casera, con arroz y frijoles.';p='$120'},
  @{e='🥣';n='Sopa de tortilla';d='Con totopos, crema y queso.';p='$55'},
  @{e='🧀';n='Quesadillas';d='De carne, pollo o queso.';p='$45'},
  @{e='🥩';n='Caldo de res';d='De fin de semana, con verduras.';p='$90'},
  @{e='🍹';n='Aguas de sabor';d='Jamaica, horchata y tamarindo.';p='$25'},
  @{e='👨‍👩‍👧';n='Menú familiar';d='Para 4 personas + bebidas.';p='$380'} ) }

$prospects += @{ slug='disfruta-natural'; tipo='comida'; pal='verde'; nombre='Disfruta Natural'; loga='Disfruta'; logb='Natural'; badge='🥗'; rubro='Comida saludable'; h1a='Sabor que cuida'; h1b='de tu cuerpo'; sub='Jugos, licuados y desayunos saludables con ingredientes frescos. Arma tu orden por WhatsApp en un minuto.'; zona='Col. San Sebastián'; dir='Av. Central Oriente 240'; horario='Lunes a sábado · 7:30 am – 3:00 pm'; tel=''; allowSunday=$false; waText='Hola, quiero información de sus jugos y desayunos.'; services=@(
  @{e='🥤';n='Jugo verde detox';d='Espinaca, piña y manzana.';p='$45'},
  @{e='🍌';n='Licuado de plátano';d='Con leche y avena.';p='$40'},
  @{e='🥗';n='Desayuno saludable';d='Fruta, granola y yogur.';p='$70'},
  @{e='🥙';n='Ensalada del chef';d='Pollo, queso y aderezo ligero.';p='$85'},
  @{e='🥪';n='Sándwich integral';d='De pollo o vegetariano.';p='$60'},
  @{e='🍱';n='Combo completa';d='Jugo + sándwich + fruta.';p='$120'} ) }

$prospects += @{ slug='dra-jessica-cordero'; tipo='dental'; pal='dental'; nombre='Consultorio Dental Dra. Jessica Cordero'; loga='Dra.'; logb='Cordero'; badge='🦷'; rubro='Clínica dental'; h1a='Sonríe con confianza y'; h1b='cuida tu salud bucal'; sub='Ortodoncia, endodoncia, carillas y más, con tecnología moderna. Agenda tu cita en línea: elige día y hora en menos de un minuto.'; zona='Col. San Miguel'; dir='Central San Miguel 160'; horario='Lunes a sábado · 8:00 am – 6:00 pm'; tel=''; allowSunday=$false; waText='Hola, quiero agendar una cita dental.'; services=@(
  @{e='🦷';n='Consulta general';d='Diagnóstico y plan de tratamiento claros.';p='$300'},
  @{e='🪥';n='Limpieza / profilaxis';d='Con pulido y revisión de encías.';p='$450'},
  @{e='😬';n='Ortodoncia';d='Brackets y alineadores para todas las edades.';p='desde $4,500'},
  @{e='✨';n='Carillas';d='Diseño de sonrisa pieza por pieza.';p='desde $3,000'},
  @{e='🩺';n='Endodoncia';d='Con control de dolor y técnica actual.';p='$2,500'},
  @{e='🚨';n='Urgencias';d='Te orientamos al momento.';p='$350'} ) }

$prospects += @{ slug='esmeraldent'; tipo='dental'; pal='dental'; nombre='EsmeralDent'; loga='Esmeral'; logb='Dent'; badge='🦷'; rubro='Clínica dental'; h1a='Un consultorio dental'; h1b='cercano y profesional'; sub='Limpieza, blanqueamiento, odontopediatría y cirugía oral. Agenda tu cita en línea desde tu celular.'; zona='Col. San Marcos'; dir='4a. Poniente Nte. #331'; horario='Lunes a sábado · 8:00 am – 6:00 pm'; tel=''; allowSunday=$false; waText='Hola, quiero agendar una cita dental.'; services=@(
  @{e='🦷';n='Consulta general';d='Valoración con radiografía de control.';p='$250'},
  @{e='🪥';n='Limpieza dental';d='Profilaxis completa con pulido.';p='$400'},
  @{e='✨';n='Blanqueamiento';d='Resultados visibles en 2 sesiones.';p='$2,000'},
  @{e='🧒';n='Odontopediatría';d='Atención dental para niños.';p='$350'},
  @{e='🏥';n='Cirugía oral';d='Extracciones y cirugía menor.';p='$1,800'},
  @{e='🚨';n='Urgencias';d='Horario flexible para dolor.';p='$300'} ) }

$prospects += @{ slug='dental-berrio'; tipo='dental'; pal='dental'; nombre='Dental Berrio'; loga='Dental'; logb='Berrio'; badge='🦷'; rubro='Clínica dental'; h1a='Tu clínica dental'; h1b='en el centro de Berriozábal'; sub='Consulta, limpieza, resinas y ortodoncia. Agenda tu cita en línea rápido y sin llamadas.'; zona='Centro'; dir='Av. Central, entre central y 1a. Poniente'; horario='Lunes a sábado · 8:00 am – 6:00 pm'; tel=''; allowSunday=$false; waText='Hola, quiero agendar una cita dental.'; services=@(
  @{e='🦷';n='Consulta general';d='Diagnóstico y chequeo completo.';p='$250'},
  @{e='🪥';n='Limpieza';d='Profilaxis y pulido profesional.';p='$400'},
  @{e='🦷';n='Extracciones';d='Simples o complejas, con anestesia.';p='$500'},
  @{e='🦷';n='Resinas';d='Restauraciones estéticas.';p='$600'},
  @{e='😬';n='Ortodoncia';d='Plan completo con revisiones incluidas.';p='desde $4,500'},
  @{e='🚨';n='Urgencias';d='Te vemos el mismo día.';p='$300'} ) }

$prospects += @{ slug='dr-diego-vitte'; tipo='dental'; pal='dental'; nombre='Consultorio Dental Dr. Diego Vitte'; loga='Dr.'; logb='Vitte'; badge='🦷'; rubro='Clínica dental'; h1a='Tratamientos dentales'; h1b='hechos con precisión'; sub='Endodoncia, blanqueamiento, coronas y rehabilitación. Agenda tu cita en línea sin esperas.'; zona='Col. San Sebastián'; dir='1ra. Oriente Sur'; horario='Lunes a sábado · 8:00 am – 6:00 pm'; tel=''; allowSunday=$false; waText='Hola, quiero agendar una cita dental.'; services=@(
  @{e='🦷';n='Consulta general';d='Con plan de tratamiento personalizado.';p='$300'},
  @{e='🪥';n='Limpieza dental';d='Profilaxis completa con pulido.';p='$450'},
  @{e='✨';n='Blanqueamiento';d='Técnica profesional en 2 sesiones.';p='$2,200'},
  @{e='🩺';n='Endodoncia';d='Con control de dolor.';p='$2,500'},
  @{e='👑';n='Postes y coronas';d='Rehabilitación de piezas dentales.';p='$2,000'},
  @{e='🚨';n='Urgencias';d='¿Dolor? Escríbenos hoy.';p='$350'} ) }

$prospects += @{ slug='consultorio-dental-centro'; tipo='dental'; pal='dental'; nombre='Consultorio Dental Centro'; loga='Dental'; logb='Centro'; badge='🦷'; rubro='Clínica dental'; h1a='Dentistas de confianza'; h1b='a un paso de ti'; sub='Resinas, extracción, endodoncia y urgencias. Agenda tu cita en línea y ahorra tiempo.'; zona='Centro'; dir='2a. Poniente Nte., a una cuadra del parque'; horario='Lunes a sábado · 8:00 am – 6:00 pm'; tel='961 223 7908'; allowSunday=$false; waText='Hola, quiero agendar una cita dental.'; services=@(
  @{e='🦷';n='Consulta general';d='Diagnóstico real y claro.';p='$250'},
  @{e='🪥';n='Limpieza';d='Profilaxis con pulido.';p='$400'},
  @{e='✨';n='Resinas';d='Restauraciones estéticas.';p='$650'},
  @{e='🦷';n='Extracción';d='Con anestesia incluida.';p='$500'},
  @{e='🩺';n='Endodoncia';d='Tratamiento de conducto.';p='$2,400'},
  @{e='🚨';n='Urgencias';d='Te atendemos rápido.';p='$300'} ) }

$prospects += @{ slug='renidet'; tipo='medica'; pal='medica'; nombre='Renidet'; loga='Ren'; logb='Idet'; badge='📸'; rubro='Estudios radiográficos'; h1a='Radiografías dentales'; h1b='con precisión y rapidez'; sub='Rayos X dentales, panorámicas y tomografías para clínicas y pacientes. Agenda tu estudio en línea.'; zona='Col. Santa Cruz'; dir='Av. Prolongación Central Nte.'; horario='Lunes a sábado · 8:00 am – 5:00 pm'; tel=''; allowSunday=$false; waText='Hola, quiero información de sus estudios radiográficos.'; services=@(
  @{e='🦷';n='Radiografía periapical';d='Revisión de una pieza dental.';p='$150'},
  @{e='🖼️';n='Panorámica';d='Vista completa de ambas arcadas.';p='$450'},
  @{e='📐';n='Cefalométrica';d='Para estudio de ortodoncia.';p='$400'},
  @{e='🔬';n='Tomografía';d='Imagen 3D para casos complejos.';p='$1,500'},
  @{e='🦷';n='Impresión dental';d='Modelos para diagnóstico.';p='$600'},
  @{e='⚡';n='Urgencia de laboratorio';d='Para emergencias clínicas.';p='$250'} ) }

$prospects += @{ slug='veterinaria-don-pepe'; tipo='veterinaria'; pal='veterinaria'; nombre='Veterinaria Don Pepe'; loga='Don'; logb='Pepe'; badge='🐾'; rubro='Veterinaria'; h1a='Tu mascota'; h1b='en las mejores manos'; sub='Consulta, vacunas, estética y urgencias. Agenda la cita de tu mascota en línea en un minuto.'; zona='Centro'; dir='Av. Central Poniente s/n'; horario='Lunes a sábado · 9:00 am – 6:00 pm'; tel='961 175 8340'; allowSunday=$true; waText='Hola, quiero una cita para mi mascota.'; services=@(
  @{e='🩺';n='Consulta general';d='Valoración completa de tu mascota.';p='$250'},
  @{e='💉';n='Vacunas';d='Esquema completo y avalado.';p='$180'},
  @{e='🪱';n='Desparasitación';d='Control y programa de prevención.';p='$120'},
  @{e='✂️';n='Baño y corte';d='Razas con estética incluida.';p='desde $200'},
  @{e='🩹';n='Esterilización';d='Con cita programada.';p='desde $600'},
  @{e='🚨';n='Urgencias';d='Revisión inmediata.';p='$350'} ) }

$prospects += @{ slug='terrier'; tipo='veterinaria'; pal='veterinaria'; nombre='Terrier'; loga='Ter'; logb='Rier'; badge='🐶'; rubro='Veterinaria'; h1a='Cuidado para tus mascotas'; h1b='con amor y experiencia'; sub='Consulta, vacunación, estética canina y hospitalización. Agenda la cita de tu mascota desde tu celular.'; zona='Col. San Sebastián'; dir='Av. Central Norte'; horario='Lunes a sábado · 9:00 am – 6:00 pm'; tel='961 138 3274'; allowSunday=$true; waText='Hola, quiero una cita para mi mascota.'; services=@(
  @{e='🩺';n='Consulta general';d='Chequeo integral de tu mascota.';p='$250'},
  @{e='💉';n='Vacunación';d='Esquemas para cachorros y adultos.';p='$180'},
  @{e='✂️';n='Estética canina';d='Baño, corte y limpieza de oídos.';p='desde $200'},
  @{e='🏥';n='Hospitalización';d='Observación y cuidados por día.';p='$800'},
  @{e='🔪';n='Cirugía';d='Desde esterilización hasta cirugías.';p='desde $900'},
  @{e='🚨';n='Urgencias';d='Atención inmediata.';p='$350'} ) }

$prospects += @{ slug='dra-yazmin-abarca'; tipo='medica'; pal='medica'; nombre='Dra. Yazmín Abarca Vázquez'; loga='Dra.'; logb='Abarca'; badge='🩺'; rubro='Consultorio médico'; h1a='Tu salud'; h1b='en consulta confiable'; sub='Consulta general, chequeos preventivos y control de enfermedades crónicas. Agenda tu cita en línea.'; zona='Col. La Amistad'; dir='Carretera Suchiapa–Tuxtla'; horario='Lunes a sábado · 9:00 am – 5:00 pm'; tel='961 656 2499'; allowSunday=$false; waText='Hola, quiero agendar una consulta médica.'; services=@(
  @{e='🩺';n='Consulta general';d='Valoración completa y orientación.';p='$350'},
  @{e='🩸';n='Laboratorio clínico';d='Exámenes con resultados rápidos.';p='$300'},
  @{e='🛡️';n='Chequeo preventivo';d='Paquete básico de salud.';p='$600'},
  @{e='💉';n='Vacunación y control';d='Para todas las edades.';p='$150'},
  @{e='📋';n='Control crónico';d='Hipertensión, diabetes y más.';p='$400'},
  @{e='🚨';n='Urgencias';d='Valoración el mismo día.';p='$400'} ) }

$prospects += @{ slug='daniell-center'; tipo='medica'; pal='violeta'; nombre='Daniell Center'; loga='Daniell'; logb='Center'; badge='🌿'; rubro='Clínica de vida saludable'; h1a='Vive mejor,'; h1b='vive saludable'; sub='Nutrición, chequeos y planes de vida saludable con atención cercana. Agenda tu cita en línea hoy mismo.'; zona='Col. Linda Vista'; dir='11a. Oriente Sur'; horario='Lunes a sábado · 9:00 am – 5:00 pm'; tel='961 294 0665'; allowSunday=$false; waText='Hola, quiero agendar una consulta.'; services=@(
  @{e='🥗';n='Nutrición';d='Plan alimenticio personalizado.';p='$400'},
  @{e='🩺';n='Chequeo general';d='Presión, glucosa, peso y más.';p='$550'},
  @{e='🧬';n='Análisis laboratorio';d='Con resultados en 24 h.';p='$350'},
  @{e='🏃';n='Consulta deportiva';d='Rendimiento y lesiones.';p='$450'},
  @{e='🌿';n='Plan de vida saludable';d='Programa integral de 1 mes.';p='desde $1,200'},
  @{e='📞';n='Orientación a domicilio';d='Valoración en tu casa.';p='$500'} ) }

$prospects += @{ slug='quiro-vaquerizo'; tipo='medica'; pal='violeta'; nombre='Quiropráctico Gerardo Vaquerizo'; loga='Quiro'; logb='Vaquerizo'; badge='🦴'; rubro='Quiropráctica'; h1a='Alivia el dolor'; h1b='y recupera tu movilidad'; sub='Quiropráctica, rehabilitación y valoración postural. Agenda tu sesión en línea sin esperas.'; zona='Col. Guadalupe Poniente'; dir='8a. Poniente Sur #1088'; horario='Lunes a sábado · 9:00 am – 5:00 pm'; tel=''; allowSunday=$false; waText='Hola, quiero agendar una sesión quiropráctica.'; services=@(
  @{e='🦴';n='Valoración postural';d='Diagnóstico de tu columna.';p='$250'},
  @{e='💆';n='Consulta y ajuste';d='Primera sesión completa.';p='$300'},
  @{e='🤲';n='Sesión quiropráctica';d='Ajuste y alivio del dolor.';p='$350'},
  @{e='📦';n='Paquete 6 sesiones';d='Plan de rehabilitación.';p='$1,800'},
  @{e='🏋️';n='Rehabilitación';d='Ejercicios y terapia guiada.';p='desde $400'},
  @{e='🚨';n='Dolor agudo';d='Te atendemos por urgencia.';p='$350'} ) }

$prospects += @{ slug='ginecologia-obstetricia'; tipo='medica'; pal='medica'; nombre='Consultorio de Ginecología y Obstetricia'; loga='Gineco'; logb='Con'; badge='🤰'; rubro='Ginecología · Obstetricia'; h1a='Acompañamiento ginecológico'; h1b='y cuidado del embarazo'; sub='Consulta ginecológica, ultrasonidos y control prenatal con confianza y calidez. Agenda tu cita en línea.'; zona='Centro'; dir='Berriozábal, Chiapas'; horario='Lunes a viernes · 9:00 am – 5:00 pm'; tel='961 375 9585'; allowSunday=$false; waText='Hola, quiero agendar una consulta.'; services=@(
  @{e='🩺';n='Consulta ginecológica';d='Historial y valoración integral.';p='$400'},
  @{e='🤰';n='Primera consulta embarazo';d='Control inicial y resolución de dudas.';p='$500'},
  @{e='🫄';n='Ultrasonido obstétrico';d='Imagen y reporte completo.';p='$550'},
  @{e='🧪';n='Papanicolaou';d='Toma de muestra y resultado.';p='$350'},
  @{e='👶';n='Control prenatal';d='Seguimiento mes a mes.';p='desde $600'},
  @{e='📞';n='Urgencias y dudas';d='Te orientamos de inmediato.';p='desde $500'} ) }

$prospects += @{ slug='notaria-107'; tipo='notaria'; pal='notaria'; nombre='Notaría Pública No. 107'; loga='Notaría'; logb='107'; badge='⚖️'; rubro='Notaría'; h1a='Tus trámites notariales'; h1b='con total certeza'; sub='Testamentos, poderes, compraventas y actas. Agenda tu cita en la notaría desde tu celular.'; zona='Centro'; dir='7a. Ave. Norte Oriente #390'; horario='Lunes a viernes · 9:00 am – 3:00 pm'; tel=''; allowSunday=$false; waText='Hola, quiero información sobre un trámite notarial.'; services=@(
  @{e='📜';n='Testamento';d='Elaboración y protocolización.';p='$1,500'},
  @{e='🖋️';n='Poder notarial';d='General o especial.';p='desde $800'},
  @{e='🏠';n='Compraventa';d='Contrato y protocolización.';p='desde $2,500'},
  @{e='🏢';n='Actas constitutivas';d='Constitución de empresas.';p='desde $4,000'},
  @{e='✍️';n='Certificaciones';d='De firmas y documentos.';p='$500'},
  @{e='💬';n='Consulta gratuita';d='Te orientamos antes del trámite.';p='Gratis'} ) }

# ================= GENERACIÓN =================
foreach ($p in $prospects) {
  $tt = $T[$p.tipo]
  $pp = $pal[$p.pal]

  $dir = Join-Path $outDir $p.slug
  New-Item -ItemType Directory -Path (Join-Path $dir 'css') -Force | Out-Null
  New-Item -ItemType Directory -Path (Join-Path $dir 'js') -Force | Out-Null
  Copy-Item $cssSrc (Join-Path $dir 'css\style.css') -Force
  Copy-Item $jsSrc  (Join-Path $dir 'js\main.js') -Force

  # --- Palette CSS ---
  $palette = ":root{" +
    "--bg:$($pp.bg);--surface:$($pp.surface);--surface-soft:$($pp.soft);--line:$($pp.line);" +
    "--ink:$($pp.ink);--muted:$($pp.muted);--teal:$($pp.accent);--teal-dark:$($pp.dark);" +
    "--teal-glow:$($pp.glow);--cyan:$($pp.accent2);--gradient:$($pp.grad);}" +
    ".btn-primary{background:linear-gradient(135deg,var(--teal),var(--teal-dark));box-shadow:0 12px 30px -10px var(--teal-glow);}" +
    ".btn-primary:hover{transform:translateY(-2px);box-shadow:0 16px 38px -10px var(--teal-glow);}" +
    ".hero{background:radial-gradient(620px 340px at 88% -8%,$($pp.heroA),transparent 62%),radial-gradient(560px 340px at 2% 108%,$($pp.heroB),transparent 62%),var(--bg);}" +
    ".logo-badge{box-shadow:0 8px 20px -8px var(--teal-glow);}" +
    ".section-tag{border-color:var(--teal-glow);}" +
    ".card:hover{border-color:var(--teal-glow);}" +
    ".price-cta{border-color:var(--teal-glow);}"

  # --- STATS ---
  $statsHtml = ($tt.stats | ForEach-Object { '<div class="stat"><span class="stat-number">' + $_[0] + '</span><span class="stat-label">' + $_[1] + '</span></div>' }) -join "`n        "

  # --- CARDS ---
  $cards = ($p.services | ForEach-Object {
    '<article class="card"><div class="card-icon">' + $_.e + '</div><h3>' + $_.n + '</h3><p>' + $_.d + '</p></article>'
  }) -join "`n        "

  # --- PRICE ROWS ---
  $rows = ($p.services | ForEach-Object {
    '<div class="price-row"><div class="price-info"><span class="price-name">' + $_.n + '</span><span class="price-desc">' + $_.d + '</span></div><div class="price-amt"><a class="price-cta" href="#citas">' + $tt.cta2 + '</a><span class="price-val">' + $_.p + '</span></div></div>'
  }) -join "`n        "

  # --- CHIPS ---
  $chips = ($p.services | ForEach-Object {
    '<button class="service-chip" data-service="' + $_.n + '" data-price="' + $_.p + '">' + $_.n + '<br><small>' + $_.p + '</small></button>'
  }) -join "`n              "

  # --- STEPS ---
  $steps = '<div class="step"><div class="step-num">01</div><h3>' + $tt.step1 + '</h3><p>' + $tt.step1d + '</p></div>' +
           '<div class="step"><div class="step-num">02</div><h3>' + $tt.step2 + '</h3><p>' + $tt.step2d + '</p></div>' +
           '<div class="step"><div class="step-num">03</div><h3>' + $tt.step3 + '</h3><p>' + $tt.step3d + '</p></div>'

  # --- INFO LI ---
  $mapUrl = 'https://www.google.com/maps/search/?api=1&query=' + (Esc ($p.zona + ', Berriozábal, Chiapas'))
  $info = '<li><span class="info-ic">📅</span><div><strong>Horario</strong><br>' + $p.horario + '</div></li>' +
          '<li><span class="info-ic">📍</span><div><strong>' + $p.zona + '</strong><br>' + $p.dir + '<br><em><a href="' + $mapUrl + '" target="_blank" rel="noopener">Abrir en Google Maps</a></em></div></li>'
  if ($p.tel) { $info += '<li><span class="info-ic">☎</span><div><strong>Teléfono</strong><br>' + $p.tel + '</div></li>' }
  $info += '<li><span class="info-ic">⚡</span><div><strong>Respuesta rápida</strong><br>Confirmación en menos de 1 hora</div></li>'

  # --- DIRECT WA LINK ---
  $waBase = 'https://wa.me/529601427950?text=' + (Esc $p.waText)

  # --- BOOK JS ---
  $bookJs = "{ business: '$($p.nombre)', proposito: '$($tt.proposito)', cta: '$($tt.cta)', hint: '$($tt.bookHint)', allowSunday: $($p.allowSunday), itemLabel: '$($tt.itemLabel)' }"

  # --- Título / descripción ---
  $title = $p.nombre + ' · ' + $p.rubro + ' · Berriozábal, Chiapas'
  $desc  = $p.sub

  # --- Reemplazo de tokens ---
  $html = $tpl
  $html = $html.Replace('@@NOMBRE@@', $p.nombre)
  $html = $html.Replace('@@TITLE@@', $title)
  $html = $html.Replace('@@DESC@@', $desc)
  $html = $html.Replace('@@BADGE@@', $p.badge)
  $html = $html.Replace('@@LOGA@@', $p.loga)
  $html = $html.Replace('@@LOGB@@', $p.logb)
  $html = $html.Replace('@@NAV1@@', $tt.nav1)
  $html = $html.Replace('@@NAV2@@', $tt.nav2)
  $html = $html.Replace('@@NAV2_LOWER@@', $tt.nav2.ToLower())
  $html = $html.Replace('@@NAV3@@', $tt.nav3)
  $html = $html.Replace('@@CTA@@', $tt.cta)
  $html = $html.Replace('@@HERO_BADGE@@', $p.rubro + ' · Berriozábal, Chiapas')
  $html = $html.Replace('@@H1A@@', $p.h1a)
  $html = $html.Replace('@@H1B@@', $p.h1b)
  $html = $html.Replace('@@SUB@@', $p.sub)
  $html = $html.Replace('@@STATS@@', $statsHtml)
  $html = $html.Replace('@@SEC_SERV_TAG@@', $tt.secServTag)
  $html = $html.Replace('@@SEC_SERV_TITLE@@', $tt.secServTitle)
  $html = $html.Replace('@@SEC_SERV_DESC@@', $tt.secServDesc)
  $html = $html.Replace('@@CARDS@@', $cards)
  $html = $html.Replace('@@SEC_PRI_TAG@@', $tt.secPriTag)
  $html = $html.Replace('@@SEC_PRI_TITLE@@', $tt.secPriTitle)
  $html = $html.Replace('@@SEC_PRI_DESC@@', $tt.secPriDesc)
  $html = $html.Replace('@@PRICE_ROWS@@', $rows)
  $html = $html.Replace('@@PRICE_NOTE@@', $tt.priceNote)
  $html = $html.Replace('@@STEP_TITLE@@', 'Reserva en 3 pasos')
  $html = $html.Replace('@@STEPS@@', $steps)
  $html = $html.Replace('@@BOOK_TITLE@@', $tt.bookTitle)
  $html = $html.Replace('@@BOOK_DESC@@', $tt.bookDesc)
  $html = $html.Replace('@@BOOK_STEP1@@', $tt.bookStep1)
  $html = $html.Replace('@@CHIPS@@', $chips)
  $html = $html.Replace('@@SUMMARY_DEF@@', $tt.summaryDef)
  $html = $html.Replace('@@BOOK_HINT@@', $tt.bookHint)
  $html = $html.Replace('@@INFO_LI@@', $info)
  $html = $html.Replace('@@DIRECT_WA@@', $waBase)
  $html = $html.Replace('@@BOOKJS@@', $bookJs)
  $html = $html.Replace('@@PALETTE@@', $palette)
  $html = $html.Replace('@@RUBRO@@', $p.rubro)

  [System.IO.File]::WriteAllText((Join-Path $dir 'index.html'), $html, (New-Object System.Text.UTF8Encoding($false)))
  Write-Output ('OK ' + $p.slug)
}

Write-Output ('Generados: ' + $prospects.Count + ' demos en ' + $outDir)