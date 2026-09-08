import type { NextConfig } from "next";

/**
 * Kuadra OS —el panel interno— es una app aparte, con su propio repo y su
 * propio deploy (proyecto `kuadra-os` en Vercel), pero se sirve dentro de este
 * dominio bajo /os. Estas reglas hacen de puente.
 *
 * El panel está construido con `basePath: '/os'`, así que tanto sus rutas como
 * sus assets de `_next` ya vienen prefijados: por eso basta con reenviar /os y
 * todo lo que cuelgue de él, y no hay forma de que choque con el `_next` de
 * este sitio.
 */
const KUADRA_OS = "https://kuadra-os.vercel.app";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/os", destination: `${KUADRA_OS}/os` },
      { source: "/os/:path*", destination: `${KUADRA_OS}/os/:path*` },
    ];
  },
};

export default nextConfig;
