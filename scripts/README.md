# Pipeline de media

Los 111 assets del portafolio vienen de las 5 galerías de Behance de
`behance.net/mestizo_xd`. El pipeline es reproducible en tres pasos:

```bash
node scripts/behance-scrape.mjs ./out    # descarga página + assets por galería
node scripts/behance-upgrade.mjs         # re-descarga cada asset en max_1200_webp
node scripts/prep-media.mjs              # optimiza a public/work + genera lib/media.ts
```

Notas:

- Behance responde 403 con un JS challenge. `behance-scrape.mjs` lo resuelve leyendo
  la cookie `js_challenge_value` del cuerpo del 403 y reintentando con ella.
- Las variantes `max_3840_webp` / `max_1200_webp` responden 302: hay que seguir el
  redirect (`redirect: 'follow'`). La variante `source` trae el original sin comprimir
  (hasta ~18 MB), demasiado pesada para web.
- Algunos archivos servidos bajo `_webp` son en realidad JPEG; `prep-media.mjs` no
  depende de la extensión porque sharp detecta el formato real.
- Los masters sin optimizar quedan fuera de `web/` en `../media-masters/`.

## Video

Las galerías de Behance embeben sus clips con el player de Adobe (CCV,
`www-ccv.adobe.io/v1/player/ccv/<id>/embed`). Las URLs del MP4/HLS vienen
firmadas (`hdnts=...exp=`) y caducan en ~3 días, así que no se pueden enlazar
directo: los renditions de 720p y su poster se bajaron a
`../media-masters/<slug>/video/vNN-<ccvId>.mp4` (+ `-poster.jpg`) y se sirven
desde el sitio.

```bash
node scripts/prep-video.mjs   # ffmpeg → public/work/<slug>/vNN.mp4 + poster.webp, genera lib/video.ts
```

Requiere `ffmpeg`/`ffprobe` en el PATH. Salida: H.264 high, CRF 27, lado largo
≤1280, `faststart`, AAC 96k. El player carga con `preload="none"`: no baja nada
hasta que el usuario toca play.

| Caso | CCV id | Clip |
| --- | --- | --- |
| yum | `VszoiNdjo6R` | v01 · 16:9 · 0:52 |
| la-tdc | `372VS45Kn5c` | v01 · 16:9 · 1:54 |
| la-tdc | `NKoJjX7Zzch` | v02 · 9:16 · 0:33 |
| deporte | `-CK_8akCxjZ` | v01 · 16:9 · 0:24 |
| kevin-florez | `VhGFxEX2uPN` | v01 · 16:9 · 1:36 |
