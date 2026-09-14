# Demo Premium — Veterinaria (con precios + calendario)

## Qué incluye
- Tema claro y elegante (blanco + esmeralda + ámbar, cálido para mascotas)
- Lista de precios por servicio
- **Calendario de citas funcional:**
  1. Elige el servicio
  2. Elige el día (se deshabilitan domingos y días pasados)
  3. Elige la hora (09:00–18:00, 10 opciones)
  4. Resumen de la cita + botón "Confirmar por WhatsApp"
- El mensaje de WhatsApp llega con SERVICIO, PRECIO, FECHA y HORA ya escritos
- Diseño 100% responsive

## Cómo subirla a GitHub
1. En `github.com/ROCKETTES-IU/rockettes-iu.github.io` → **Add file → Upload files**
2. Arrastra desde la carpeta `demos` la subcarpeta `vet-premium` (o toda `demos` si aún no subiste nada)
3. Commit

**URL:** `https://rockettes-iu.github.io/demos/vet-premium/`

## IMPORTANTE: número y personalización por cliente

En `js/main.js` línea 8:
```js
var WHATSAPP_NUMBER = "529601427950";
```

- **En la demo (para prospectos):** déjalo así, los leads te llegan a TI (529601427950).
- **Cuando el cliente compre:** cámbialo por el número de la veterinaria, actualiza en `index.html` el nombre "Vet Patas", dirección, horario y precios, re-subes y listo.

## Precios de ejemplo (cámbialos según la veterinaria)
| Servicio | Precio demo |
|---|---|
| Consulta general | $250 |
| Vacunas | $180 |
| Desparasitación | $120 |
| Baño y corte | desde $200 |
| Esterilización | desde $600 |
| Urgencia | $350 |

Los precios se editan en la tabla de precios (`#precios`) y en los chips del calendario (`#serviceGrid`).