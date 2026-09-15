# Demo Premium — Dentista (con precios + calendario)

## Qué incluye
- Tema claro y elegante (blanco + teal + cian, apto para consultorios)
- Lista de precios por servicio
- **Calendario de citas funcional:**
  1. Elige el servicio
  2. Elige el día (se deshabilitan domingos y días pasados)
  3. Elige la hora (09:00–17:00)
  4. Resumen de la cita + botón "Confirmar por WhatsApp"
- El mensaje de WhatsApp llega con SERVICIO, PRECIO, FECHA y HORA ya escritos
- Diseño 100% responsive

## Cómo subirla a GitHub
1. En `github.com/ROCKETTES-IU/rockettes-iu.github.io` → **Add file → Upload files**
2. Arrastra la carpeta `demos` (o solo `dental-premium` dentro de ella)
3. Commit

**URL:** `https://rockettes-iu.github.io/demos/dental-premium/`

## IMPORTANTE: número y personalización por cliente

En `js/main.js` línea 8:
```js
var WHATSAPP_NUMBER = "529601427950";
```

- **En la demo (para prospectos):** déjalo así, los leads te llegan a TI (529601427950).
- **Cuando el cliente compre:** cámbialo por el número del consultorio, actualiza en `index.html` el nombre "Sonrisa Dental", dirección, horario y precios, re-subes y listo.

## Precios de ejemplo (cámbialos según el consultorio)
| Servicio | Precio demo |
|---|---|
| Consulta general | $300 |
| Limpieza dental | $450 |
| Blanqueamiento | $2,200 |
| Ortodoncia | desde $4,500 |
| Carillas | desde $3,000 |
| Endodoncia | $2,500 |

Los precios se editan en la tabla de precios (`#precios`) y en los chips del calendario (`#serviceGrid`).