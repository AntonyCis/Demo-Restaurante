# Sabor Quiteño — Landing page

Landing page de una sola página para un restaurante de cocina contemporánea
ecuatoriana en Quito. Static site: HTML, CSS y JavaScript sin framework de UI.

> **Demo comercial** · Precio de referencia **$80 USD** · Entrega **2 semanas**.
> El contenido, las fotografías y el número de WhatsApp son de muestra.

---

## Qué incluye

| Sección | Contenido |
| --- | --- |
| `#territorio` | Manifiesto de marca sobre una franja de color oliva |
| `#menu` | Carta con precios y etiquetas dietéticas |
| `#espacio` | Bloque fotográfico a sangre con texto sobre cacao |
| `#visitanos` | Ubicación, horarios y formulario de reserva |

### Funcionalidades

- **Navegación responsive** con menú hamburguesa a pantalla completa
  (abrir/cerrar, `Escape`, foco gestionado, scroll bloqueado, `aria-expanded`).
- **Cabecera de dos estados**: transparente sobre el hero y sólida al hacer scroll,
  con cambio de color sincronizado (enlace, tagline y botón).
- **Scroll suave** con Lenis, con barra de progreso superior.
- **Animaciones de entrada** con GSAP + ScrollTrigger: hero y revelados al hacer scroll.
- **Preloader** con contador, saltado si faltan las librerías.
- **Cursor personalizado** en escritorio, desactivado en táctil.
- **Formulario de reserva** que compone un enlace de WhatsApp con los datos del
  comensal, sin backend ni base de datos.
- **Degradación progresiva**: sin JavaScript el contenido se lee igual; sin GSAP o sin
  Lenis la página sigue siendo navegable con el scroll nativo del navegador.

---

## Arquitectura

El JavaScript está organizado en capas, donde cada feature depende de
contratos (puertos) y nunca de una librería concreta:

```
index.html
css/
  style.css            entry point (solo imports, en capas)
  tokens.css           paleta y tokens semánticos
  base.css             reset, tipografía, utilidades
  components/
    header.css         cabecera, tema, panel móvil
    preloader.css
js/
  main.js              raíz de composición: solo cablea dependencias
  config/settings.js   configuración centralizada
  core/dom.js          primitivas null-safe para el DOM
  contracts/           motion.js · scroll-engine.js   ← puertos (JSDoc)
  infrastructure/
    lenis-scroll-engine.js     implementación con Lenis
    native-scroll-engine.js    implementación de respaldo
    ticker.js                  bucle rAF compartido
    gsap-motion.js             adaptador de GSAP
  features/            9 módulos, una responsabilidad cada uno
    preloader · hero-intro · mobile-navigation · header-theme
    anchor-navigation · scroll-progress · scroll-reveal · cursor · reservation-form
```

Consecuencias prácticas:

- Ninguna feature importa `Lenis` o `gsap` directamente.
- Cambiar el motor de scroll es escribir una clase y registrarla; nada más se toca.
- Añadir una animación nueva no obliga a editar código existente.
- `settings.js` concentra lo ajustable (offsets, duraciones, selectores) sin
  repetir valores por los módulos.

**Volumen:** 18 módulos JS (25 KB), 5 hojas CSS (9 KB), 1 HTML (29 KB).

---

## Accesibilidad

Verificado por código, no de forma aproximada:

- **Contraste AA** en toda la interfaz. La paleta se ajustó para cumplirlo:
  el terracota pasó de `#9C6B4F` a `#8F5F44`, y los textos secundarios elevate
  su opacidad. La cabecera necesitas un scrim degradado: blanco sobre crema
  daba 1.05:1, ahora supera 5:1 en su estado más desfavorable.
- **`prefers-reduced-motion` respetado**: sin preloader, sin scroll suave, sin
  cursor, sin contenido recortado.
- **Teclado**: enlace de salto, foco visible, ciclo de tabulación atrapado dentro
  del panel abierto y devuelto al botón al cerrar.
- **Formulario** con `<label>` en cada campo, validación nativa y nombres `name`
  correctos.
- Landmarks y jerarquía de encabezados semánticos.

---

## Puesta en marcha

```bash
npm install     # solo necesario para el servidor de desarrollo
npm run dev     # http://localhost:5173
npm run build   # genera dist/
npm run preview # sirve dist/ para revisión
```

> El proyecto usa **módulos ES nativos**, que el navegador bloquea por CORS al
> abrir el archivo directamente (`file://`). Siempre ábrelo por HTTP: `npm run dev`,
> `npm run preview`, o cualquier servidor.
>
> `npm install` no es necesario para publicar: el sitio es estático.

## Despliegue

**Opción A — Netlify, sin build.** El repositorio ya está configurado en
`netlify.toml`. Arrastra la carpeta del proyecto a
[app.netlify.com/drop](https://app.netlify.com/drop) y queda publicado.
Requiere que el sitio se sirva por HTTPS (las plataformas lo hacen por defecto).

**Opción B — cualquier hosting estático** (Vercel, Cloudflare Pages, GitHub Pages,
S3). Define `dist/` como directorio de publicación y `npm run build` como comando
de compilación.

---

## Antes de producción

Lista de cambios necesarios para pasar de demo a sitio real:

1. **Contenido real**: textos, carta y precios definitivos.
2. **Fotografías propias**: las actuales son de Unsplash y hay que sustituirlas
   (además mejora el peso y el SEO de imágenes).
3. **WhatsApp y datos de contacto**: el número es de muestra.
4. **Dominio y correo** corporativos.
5. **Comprobación social**: URLs de Open Graph para que el enlace se vea bien al
   compartirlo en WhatsApp y redes (actualmente no incluidas).
6. **Tailwind como paso de compilación**: hoy se usa el CDN de desarrollo, que
   genera el CSS en el navegador. Instalarlo como dependencia compila el CSS en
   build: más rápido de cargar y menos trabajo para el visitante. Es el cambio con
   mayor retorno de rendimiento.

---

## Compatibilidad

Chrome, Edge, Firefox y Safari (escritorio y móvil). El sitio usa
`IntersectionObserver` y módulos ES, con degradación para el resto. El scrim de
la cabecera es un degradado CSS puro, no un `backdrop-filter`, de modo que la
legibilidad del navbar no depende de esa propiedad. Los dos desenfoques de la
página (etiqueta del hero y barra de reserva móvil) son puramente cosméticos: si
el navegador no los soporta, se conserva su color de fondo.

## Notas

- Las tres librerías de terceros (Tailwind, Lenis, GSAP) se cargan por CDN con
  versiones fijadas. Para un lanzamiento con SLA conviene alojarlas localmente y
  cachearlas.
- No incluye analítica, cookies ni backend: es una landing estática por diseño.
- `netlify.toml` incluye cabeceras de seguridad y de caché ya configuradas.

---

*Landing demo para Sabor Quiteño. HTML, CSS y JavaScript sin frameworks de UI.*