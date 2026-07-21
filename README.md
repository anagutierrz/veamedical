# VÉA Medical — Sitio web

Sitio web estático de VÉA Medical, preparado para alojarse en GitHub Pages o cualquier hosting compatible con HTML.

## Estructura

- `index.html` — Inicio
- `nosotros.html` — Nosotros
- `por-que-vea.html` — Por qué VÉA
- `tecnologia.html` — Tecnología
- `contacto.html` — Contacto
- `assets/images/` — Imágenes del sitio
- `robots.txt` y `sitemap.xml` — Configuración SEO básica
- `.nojekyll` — Evita que GitHub Pages procese el sitio con Jekyll

## Publicar con GitHub Pages

1. Crea un repositorio nuevo en GitHub.
2. Sube todos los archivos y carpetas de este proyecto a la raíz del repositorio.
3. Abre **Settings → Pages**.
4. En **Build and deployment**, selecciona **Deploy from a branch**.
5. Elige la rama `main` y la carpeta `/ (root)`.
6. Guarda los cambios.

GitHub generará una dirección similar a:

`https://usuario.github.io/nombre-del-repositorio/`

## Dominio personalizado

Para usar `veamedical.com`, configúralo en **Settings → Pages → Custom domain** y actualiza los registros DNS con el proveedor del dominio.

## Antes de publicar

- Sustituye cualquier teléfono provisional por el número oficial.
- Comprueba el correo de recepción de los formularios.
- Verifica que todos los nombres comerciales y datos legales sean definitivos.
- Actualiza `sitemap.xml` si cambia el dominio o las rutas.

## Nota sobre formularios

El proyecto es estático. Los formularios deben conectarse a un servicio externo, CRM, endpoint propio o plataforma de formularios para almacenar y procesar los leads automáticamente.


## Actualización del inicio
El archivo `index.html` incluye una página de inicio ampliada con Método VÉA 360°, Ecosistema, VÉA Academy, acompañamiento y CTA final.
