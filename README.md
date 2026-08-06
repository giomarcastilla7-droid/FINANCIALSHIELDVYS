# VYS Abogados — Landing de Insolvencia de Persona Natural

Landing page estática (HTML + CSS + JS puro, sin frameworks ni build step) diseñada
para un solo objetivo: que el visitante inicie una consulta **gratis por WhatsApp**.

## Cómo verla localmente

No requiere instalación. Sirve la carpeta con cualquier servidor estático, por ejemplo:

```bash
python3 -m http.server 8080
# abrir http://localhost:8080
```

## ⚠️ Placeholders que DEBEN reemplazarse antes de publicar

Por instrucción explícita del brief, no se inventó ningún dato de la firma
(número, nombre del abogado, fotos, testimonios, cifras). Búscalos y reemplázalos:

| Placeholder | Dónde | Qué va |
|---|---|---|
| `WHATSAPP_NUMBER` | `assets/js/main.js` (constante al inicio), `index.html` footer y JSON-LD | Número real de WhatsApp Business, formato internacional solo dígitos (ej. `573001234567`) |
| `[NOMBRE_ABOGADO_O_FIRMA]`, `[FOTO_ABOGADO]`, `[ESPECIALIDAD / TARJETA PROFESIONAL N.° XXXXX]`, `[AÑOS_EXPERIENCIA]`, `[ÁREA_DE_DERECHO]`, `[CIUDAD]` | sección `#confianza` | Datos reales y verificables del abogado o la firma |
| `[COBERTURA_NACIONAL_SI_APLICA]` | sección `#confianza` y FAQ | Confirmar si realmente hay cobertura nacional |
| `[NÚMERO_DE_CASOS_SI_ES_VERIFICABLE]`, `[ASOCIACIONES_PROFESIONALES_SI_APLICA]` | sección `#confianza` | Solo si son datos comprobables |
| `[TESTIMONIO REAL AQUÍ]`, `[NOMBRE_CLIENTE_REAL]`, `[CIUDAD_REAL]` | sección `#testimonios` | Testimonios reales en formato Problema → Proceso → Resultado. Si hay video, priorizarlo. |
| `[NOMBRE_LEGAL_COMPLETO]`, `[NIT_EMPRESA]`, `[EMAIL_ADDRESS]`, `[DIRECCION_OFICINA_SI_APLICA]`, `[CIUDAD_SEDE]` | footer | Datos legales y de contacto reales |
| `og-cover.jpg` (referenciada en meta OpenGraph) | `assets/img/` | Imagen 1200×630 real para previsualizaciones al compartir el link |
| Enlaces de Política de privacidad / Tratamiento de datos / Términos | footer | Crear esas páginas o enlazarlas a las existentes |

## Requisitos legales del proceso de insolvencia

El texto de la sección "¿Qué es la insolvencia de persona natural?" y del FAQ usa
lenguaje deliberadamente general (sin citar artículos, decretos ni plazos específicos)
porque la normativa colombiana debe ser **verificada por el abogado responsable** antes
de publicar. Revisar y ajustar esos textos con la información jurídica vigente.

## Analítica (GTM / GA4)

Todos los clics a WhatsApp, apertura de FAQ y profundidad de scroll se envían a
`window.dataLayer`. Eventos disponibles:

- `whatsapp_hero_click`, `whatsapp_problem_click`, `whatsapp_solution_click`,
  `whatsapp_benefits_click`, `whatsapp_eligibility_click`,
  `whatsapp_testimonial_click`, `whatsapp_faq_click`, `whatsapp_sticky_click`,
  `whatsapp_final_click`, `whatsapp_header_click`, `whatsapp_footer_click`, `whatsapp_floating_click`
- `whatsapp_click` (genérico, con `cta_section` en el payload — útil para reportes agregados)
- `eligibility_quiz_completed` (con `quiz_yes_count`)
- `faq_open` (con `faq_question`)
- `scroll_50`, `scroll_90`

Solo falta instalar el contenedor de GTM (o gtag.js) en `<head>`; el `dataLayer` ya
está preparado para recibir estos eventos sin cambios adicionales.

## Arquitectura para A/B testing

Los elementos más propensos a testear están aislados y son fáciles de intercambiar:

- H1 y CTA principal del hero: `index.html` dentro de `#hero`.
- Texto de los botones WhatsApp: atributo `data-message` de cada `.js-wa-cta`.
- Presencia/ausencia de la barra sticky mobile: clase `.wa-sticky-mobile` en `styles.css`.
- Orden de testimonios: bloques `.testimonial-card` independientes en `#testimonios`.

## Rendimiento

- Cero dependencias externas (sin fuentes de Google Fonts, sin librerías JS/CSS).
- Tipografía del sistema (`-apple-system`, `Segoe UI`, etc.) para evitar requests
  adicionales y parpadeo de fuente.
- Iconografía en SVG inline (sin ícono-fuentes).
- Un solo archivo CSS y un solo archivo JS, ambos `defer`/cargados una vez.
