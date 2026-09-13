# TU DIGITAL .MX — Tu Landing Page lista para vender

## 1. Configura tu número de WhatsApp (importante)

Abre `js/main.js` y busca esta línea:

```js
var WHATSAPP_NUMBER = "5219600000000";
```

Cámbiala por tu número real en formato internacional:

```
52 + código de área (ej. 961) + tu número = 13 dígitos
```

**Ejemplo:** si tu número es `961 123 4567`, el valor es:
```js
var WHATSAPP_NUMBER = "5219611234567";
```

---

## 2. Publicar gratis en GitHub Pages

### a) Crea una cuenta (si no tienes)
1. Ve a **github.com** y crea una cuenta gratis.

### b) Sube el proyecto
1. Crea un nuevo **Repository** en GitHub.
2. Nombre del repo: `tuusuario.github.io`
   *(ejemplo: si tu usuario es `josechi`, el repo es `josechi.github.io`)*
3. Sube todos los archivos del proyecto a ese repo:
   - `index.html`
   - `css/style.css`
   - `js/main.js`

### c) Activa GitHub Pages
1. En tu repo, ve a **Settings → Pages** (sección de la izquierda).
2. En **Source**, selecciona la rama **main** y carpeta `/ (root)**.
3. Dale click en **Save**.

**En 2 minutos tu página estará en:**
```
https://tuusuario.github.io
```

> Si quieres un dominio `.com` o `.mx` más adelante, puedes comprarlo en [Neubox](https://neubox.com) (~$150 MXN el primer año) y apuntarlo a GitHub Pages.

---

## 3. Presentación para clientes (copy listo)

Copia esto y envíalo por WhatsApp/Messenger a negocios locales:

---

**Opción para Messenger (Facebook):**

> Hola [Nombre del negocio], vi su página de Facebook y me pareció muy buena. Soy ingeniero de sistemas y ayudo a negocios locales a tener una página web profesional que capta clientes por WhatsApp 24/7.
>
> Se lo hago todo incluido: diseño web, WhatsApp Business automatizado y optimización de su Facebook.
>
> La inversión es de $2,499–$3,499 MXN según lo que necesite, con pago en dos partes.
>
> ¿Tiene 10 minutos para que le muestre un ejemplo? Se lo puedo mostrar por video o en persona.

---

**Opción para WhatsApp Business (DIRECTO):**

> Hola [Nombre], soy [Tu nombre], ingeniero en sistemas. Vi que su negocio tiene mucho potencial pero no tiene página web donde los clientes lo encuentren 24/7.
>
> Creo páginas que responden automáticamente por WhatsApp. Se lo hago todo incluido: web + WhatsApp Business + Facebook.
>
> Tengo disponibilidad esta semana para mostrarle cómo funciona. ¿Cuál es su nombre de negocio para enviarle un ejemplo?

---

## 4. Calendario de los primeros 30 días

| Semana | Acción | Meta |
|--------|--------|------|
| **1** | Construir tu portfolio (esta página) + enviar 20 mensajes diarios | 3 reuniones agendadas |
| **2** | Cerrar primer cliente, entregar, cobrar 1ra parte | 1 cliente activo |
| **3** | Segundo lote de mensajes + entregar al primer cliente | 2-3 clientes activos |
| **4** | Cerrar clientes restantes + cobrar todo | 5 clientes → $12,500+ MXN |

---

## 5. Scripts de WhatsApp (respuestas automáticas)

### Configurar respuestas en WhatsApp Business

1. Descarga **WhatsApp Business** (gratuita, con el número del cliente o uno nuevo).
2. Ve a **Configuración → Herramientas de empresa → Mensajes fuera de horario**.
3. Actívalo y pega esto:

```
¡Hola! Gracias por escribirnos 🙌
Nuestro horario es de L-S de 8am a 6pm.
Te responderemos lo antes posible.
Si es urgente, favor de llamar al [NÚMERO].
```

4. En **Saludos de presentación**, usa:

```
¡Bienvenido! 👋
¿En qué te puedo ayudar?
Escríbenos tu duda y te atendemos enseguida.
```

---

## 6. Checklist del cliente (para entregar)

Al entregar el trabajo, verifica:

- [ ] Página web en línea y funcionando
- [ ] Botón de WhatsApp en la página funciona correctamente
- [ ] WhatsApp Business configurado (saludo automático + fuera de horario)
- [ ] Catálogo con al menos 5 productos/servicios del negocio
- [ ] Perfil de Facebook optimizado (foto, portada, horarios)
- [ ] Perfil de Google Maps creado o verificado
- [ ] Enseñar al cliente a responder en WhatsApp Business (15 min)

---

## Archivos del proyecto

```
├── index.html       ← Página principal (modifica textos según el cliente)
├── css/style.css    ← Estilos (no tocar salvo que sepas)
├── js/main.js       ← Lógica + configuración de WhatsApp
└── README.md        ← Este archivo
```

---

## Plantilla para crear páginas de clientes

1. Copia esta carpeta completa para un nuevo proyecto.
2. Cambia en `index.html`:
   - Todos los textos genéricos por los del negocio real (nombre, servicios, dirección, teléfono).
   - La meta tag `<title>` con el nombre del negocio.
   - En `js/main.js`, cambia `WHATSAPP_NUMBER` por el del cliente.
3. Despliega en GitHub Pages con un repo nuevo: `nombre-del-negocio.github.io`.
4. Entrega en 72 horas cobrando el 50% por adelantado.
