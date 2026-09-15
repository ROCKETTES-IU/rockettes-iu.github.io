# Demos por prospecto — SolucionesTech Chiapas

20 páginas **premium personalizadas** generadas automáticamente desde `demos/templates/generar.ps1`.
Cada demo incluye: nombre del negocio, dirección/colonia, menú o servicios con precios, paleta de colores del rubro y **reserva en línea** (calendario → día/hora → WhatsApp).

## URLs cuando subas la carpeta `demos`

Galeria: `https://rockettes-iu.github.io/demos/prospectos/`

| # | Prospecto | Rubro | URL |
|---|---|---|---|
| 1 | Restaurant Gin Seng | Restaurante | `/demos/prospectos/gin-seng/` |
| 2 | Hamb. y Hot Dogs HODAH | Comida rápida | `/demos/prospectos/hodah/` |
| 3 | Cenaduría El Tizoncito | Cenaduría | `/demos/prospectos/tizoncito/` |
| 4 | Taco Chito | Taquería | `/demos/prospectos/taco-chito/` |
| 5 | Pollos Asados Farrera | Pollos asados | `/demos/prospectos/pollos-farrera/` |
| 6 | Los Chuncos | Comida familiar | `/demos/prospectos/los-chuncos/` |
| 7 | Disfruta Natural | Comida saludable | `/demos/prospectos/disfruta-natural/` |
| 8 | Dra. Jessica Cordero | Clínica dental | `/demos/prospectos/dra-jessica-cordero/` |
| 9 | EsmeralDent | Clínica dental | `/demos/prospectos/esmeraldent/` |
| 10 | Dental Berrio | Clínica dental | `/demos/prospectos/dental-berrio/` |
| 11 | Dr. Diego Vitte | Clínica dental | `/demos/prospectos/dr-diego-vitte/` |
| 12 | Consultorio Dental Centro | Clínica dental | `/demos/prospectos/consultorio-dental-centro/` |
| 13 | Renidet | Rayos X dentales | `/demos/prospectos/renidet/` |
| 14 | Veterinaria Don Pepe | Veterinaria | `/demos/prospectos/veterinaria-don-pepe/` |
| 15 | Terrier | Veterinaria | `/demos/prospectos/terrier/` |
| 16 | Dra. Yazmín Abarca | Médico | `/demos/prospectos/dra-yazmin-abarca/` |
| 17 | Daniell Center | Vida saludable | `/demos/prospectos/daniell-center/` |
| 18 | Quiropr. Gerardo Vaquerizo | Quiropráctica | `/demos/prospectos/quiro-vaquerizo/` |
| 19 | Ginecología y Obstetricia | Ginecología | `/demos/prospectos/ginecologia-obstetricia/` |
| 20 | Notaría Pública No. 107 | Notaría | `/demos/prospectos/notaria-107/` |

## Personalización ya incluida
- Nombre del negocio en logo, título, footer, mensajes y botón de WhatsApp de la cita.
- Dirección y colonia reales + enlace a Google Maps.
- Menú o servicios con **6 precios reales** (estilo local).
- Paleta según el rubro: comida (naranja/rojo/verde), dental (teal/cian), veterinaria (esmeralda/ámbar), médica (azul/violeta), notaría (azul noche/dorado).
- Horario del negocio y si atiende domingo (los domingos se activan/desactivan en el calendario).

## Cómo subir todo a GitHub (una sola vez)
1. `github.com/ROCKETTES-IU/rockettes-iu.github.io`
2. **Add file → Upload files**
3. Arrastra la carpeta `demos` completa (o si ya subiste parte, sube solo `prospectos` dentro de `demos`).
4. Commit → en 1 minuto quedan activas las 20.

## ⚠️ Antes de enviar mensajes
- **Número de WhatsApp en demos: `529601427950` (tuyo).** Cuando agendan, el "cliente" te llega a ti. Al vender se sustituye por el del cliente.
- Algunos **teléfonos mostrados** vienen del directorio público (p. ej. Disfruta Natural). Verifícalos en WhatsApp Business antes de contactar; si están mal, quítalos del demo (línea `.tel` en el generador).
- Precios y horarios son de **referencia**: confírmalos con el dueño antes de la presentación.

## Cómo re-generar si cambias algo
Edita los datos en `demos/templates/generar.ps1` y corre:
```
powershell -NoProfile -ExecutionPolicy Bypass -File demos\templates\generar.ps1
```
Recrea SOLO la carpeta `demos/prospectos` (no toca las demos sueltas dental/vet ni la landing).