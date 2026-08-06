# drjorgebarbachano.com

Sitio del **Dr. Jorge Barbachano Torres** — otorrinolaringólogo especializado en rinoseptoplastia
funcional. Cancún, México. Parte del ecosistema **Protocolo S·E·R** junto con
[dralilipadilla.com](https://dralilipadilla.com).

HTML, CSS y JS vanilla. **Sin build step**: Netlify publica el repo tal cual.

## Estructura

```
index.html          Home en español (única H1 del sitio)
riviera-sleep.html  Turismo médico, en inglés (EUA / Canadá)
privacidad.html     Aviso de privacidad LFPDPPP (noindex)
styles.css          Sistema de diseño S·E·R con acento cálido de Jorge
main.js             Nav, menú móvil, reveal on scroll, Calendly diferido
netlify.toml        Headers de seguridad y caché
_redirects          Una sola URL por página (evita duplicados en Google)
robots.txt          sitemap.xml
assets/img/         Fotografía real: consultorio, quirófano, equipo
```

## Sistema de diseño

**La fuente de verdad es el proyecto de Claude Design**
`drjorgebarbachano.com.dc.html` (proyecto `90838b01-d365-4968-9c4a-a62f7bd08f7e`), construido sobre
el *SER — Dra. Lili Padilla Design System* (`452aee4c-…`). Los `.md` de
`Protocolo SER / Sistema de Diseño SER` describen una iteración anterior con navy `#071e30`, ámbar
`#e8b84b` y Montserrat/Open Sans: **están desactualizados frente a este sitio.**

Lo que sí se implementó — la desviación cálida de Jorge:

| Rol | Valor |
|---|---|
| Fondo oscuro dominante | `--jb-carbon` `#26272a` (carbón, no navy) |
| Superficies sobre oscuro | `--jb-carbon-2` `#2f3033` · `--jb-carbon-3` `#3c3e42` |
| Acento personal | `--jb-oro` `#d9bd7a` (oro champagne) |
| Acento como **texto sobre claro** | `--jb-oro-ink` `#6b5410` |
| Grounds cálidos | `--jb-arena` `#efe7d8` · `--jb-crema` `#f7f2e8` |
| Pertenencia al ecosistema | `--ser-teal` `#00a8a8` · `--ser-teal-soft` `#7fe3e3` |
| Display | Newsreader (serif) |
| Cuerpo / UI | Figtree (sans) |

**Nunca escribas un hex suelto** — usa la variable CSS.

Las reglas que más se rompen:

1. **El oro `#d9bd7a` no es texto sobre claro** (1.9:1). Es fondo de botón y texto sobre carbón.
   Para texto de acento sobre fondo claro usa `--jb-oro-ink` `#6b5410` (7.13:1 sobre blanco).
2. **El teal `#00a8a8` no es texto sobre blanco** (2.93:1). Sobre carbón sí (5.10:1).
3. **La cursiva dorada (`.gold-em`) es la firma tipográfica del ecosistema** — una por bloque, en la
   palabra que carga el significado ("vida?", "breath", "vida."). No es decoración.

**El teal siempre aparece** — es lo que dice "esto pertenece a S·E·R".

## Cifras congeladas

Siempre **+11 años** y **+1,500 cirugías**. Nunca "15+ años" (dato viejo del sitio anterior),
nunca "más de mil".

## Destinos de CTA

No hay botón sin destino. Solo existen estos:

| Botón | Destino |
|---|---|
| Agenda tu consulta — $1,000 MXN* | `https://calendly.com/drjorgebarbachano` |
| WhatsApp directo / WhatsApp us now | `https://wa.me/529981339518` (con mensaje precargado) |
| Tarjeta Dra. Lili Padilla | `https://dralilipadilla.com` |

Todos los enlaces de Calendly llevan `utm_source=web` y un `utm_medium` que identifica el bloque,
para saber qué sección convierte.

### Calendly: un solo tipo de cita

La cuenta de Jorge está en **plan gratuito**, que admite **un único tipo de evento**. Por eso:

- Todos los botones y los dos embeds apuntan al **perfil** (`/drjorgebarbachano`), no a un evento
  específico. Con un solo evento el perfil resuelve igual.
- **No existe un evento aparte para pacientes internacionales.** La diferencia de precio
  ($1,000 MXN nacional · $2,000 MXN / ~$100 USD internacional) se comunica en el sitio junto a cada
  punto de agenda y se confirma por WhatsApp al reservar. Es la parte frágil del flujo: si alguien
  agenda sin leer, llega esperando el precio nacional.
- Si Jorge pasa a plan de pago y abre el segundo evento, hay que cambiar el `data-url` de los dos
  embeds y los `href` de los botones internacionales a la URL específica, y quitar las notas
  aclaratorias de precio que están junto a los embeds.

## SEO

- Una sola `<h1>` por página.
- Schema `Physician` + `MedicalBusiness` + `FAQPage` + `BreadcrumbList`. La entidad médica vive en
  la home con `@id`; las subpáginas la referencian en lugar de redeclararla.
- Cada página con su propio `canonical`. `_redirects` fuerza una sola URL por página.
- Imágenes con `loading="lazy"` salvo el hero, que va con `preload` + `fetchpriority="high"`.
- Calendly se inyecta al acercarse al viewport, nunca en el `<head>` — pesa y castiga el LCP.

## Desarrollo local

No hay dependencias. Abre `index.html` en el navegador, o levanta cualquier servidor estático
para que las rutas absolutas (`/riviera-sleep`, `/privacidad`) resuelvan igual que en producción.

## Pendientes antes de dar por cerrada la v1

- [x] ~~Confirmar los tipos de evento en Calendly~~ — **resuelto: un solo evento.** Plan gratuito.
      La diferencia de precio internacional se comunica en copy, no con un segundo evento.
- [ ] Verificar que la cuenta de Calendly de Jorge esté en zona horaria `America/Cancun`
      (UTC−5 todo el año, sin horario de verano).
- [ ] La cuenta de Calendly de Lili está en `America/Chicago`, que sí cambia con el horario de
      verano — en invierno los horarios se desfasan una hora. Corregir también.
- [ ] Activar `hola@drjorgebarbachano.com`.
- [ ] Fotos profesionales fuera del quirófano: entrenando, en consulta.
- [ ] Fotos antes/después con consentimiento firmado.
- [ ] Revisión legal del aviso de privacidad.
- [ ] Alta en Google Search Console + Google Business Profile.
- [ ] Enlace de vuelta desde dralilipadilla.com (backlink bidireccional).

### v2

Galería de resultados · testimonios · blog SEO de largo plazo · péptidos/wellness.
