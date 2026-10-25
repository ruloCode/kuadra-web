/**
 * Parrillas de contenido que el cliente revisa en el sitio público: cada pieza
 * con su propuesta y su guion, y una sala de comentarios (ver lib/feedback.ts).
 *
 * En los guiones, un beat `arnold` es un espacio en blanco: ahí el cliente
 * escribe su parte, porque hay temas que sólo él sabe cómo quiere tocar.
 */

import { wa } from '@/lib/propuesta'

export type Formato = 'Reel' | 'Carrusel' | 'Video + shorts'

export type Beat = {
  /** Tiempo ('0–3 s') o número de slide ('Slide 1'). */
  t: string
  /** Lo que se ve. */
  plano: string
  /** Lo que se dice o se lee. */
  texto: string
  tipo?: 'arnold' | 'cierre'
}

export type Pieza = {
  id: string
  n: string
  /** 1–4 para la parrilla base; las adicionales se ubican al aprobarlas. */
  semana: number | null
  bloque: 'base' | 'adicional'
  formato: Formato
  titulo: string
  linea: string
  duracion: string
  propuesta: string
  gancho: string
  guion: Beat[]
  radicado: string
  locacion: string
  vestuario?: string
  /** Cifras o nombres que hay que soportar con documento antes de grabar. */
  verificar?: string
  nota?: string
}

export type Hito = { fecha: string; titulo: string; detalle: string; estado: 'hecho' | 'proximo' | 'meta' | 'pendiente' }

export type ParrillaCopy = {
  room: string
  /**
   * Comentarios y aprobaciones guardados en la base (0006). Apagado, cada pieza
   * se aprueba o se comenta por WhatsApp con el mensaje ya escrito.
   */
  comentarios: boolean
  whatsapp: string
  client: { name: string; cargo: string; fecha: string; ref: string }
  hero: { kicker: string; lines: string[]; accent: number[]; lede: string }
  resumen: { k: string; v: string }[]
  stats: { n: number; suffix?: string; l: string }[]
  sello: { n: string; t: string; d: string }[]
  semanas: { n: number; rango: string }[]
  hitos: Hito[]
  metas: { mes: string; seguidores: number | null; nota: string }[]
  prueba: { titulo: string; cifra: string; detalle: string }
  fuera: { t: string; d: string }[]
  guia: { titulo: string; items: string[] }[]
  pendientes: { quien: string; items: string[] }[]
  piezas: Pieza[]
}

const CIERRE: Beat = {
  t: 'Cierre',
  plano: 'Placa de marca sobre la paleta de precampaña: nombre pequeño arriba, apellido grande.',
  texto: '“Todos los radicados están en el enlace de la bio.”',
  tipo: 'cierre',
}

/** WhatsApp con el mensaje sobre una pieza ya escrito. */
export const waPieza = (p: Pieza, mensaje: string) => wa(`${mensaje} — pieza ${p.n} «${p.titulo}»`)

export const ARNOLD: ParrillaCopy = {
  room: 'arnold-7q2k',
  comentarios: false,
  whatsapp: wa('Hola Kuadra, estoy revisando la parrilla de noviembre.'),
  client: {
    name: 'Arnold',
    cargo: 'Precampaña · Alcaldía de Soacha',
    fecha: '25 oct 2026',
    ref: 'KDR-ARN-1125',
  },
  hero: {
    kicker: 'Parrilla de noviembre',
    lines: ['La Soacha', 'que nadie', 'muestra.'],
    accent: [2],
    lede:
      'Diecisiete piezas para salir a la conversación con carácter: crítica, con datos y con un documento radicado detrás de cada video. Organizar la indignación, no gritarla.',
  },
  resumen: [
    {
      k: 'La idea',
      v: 'Mostrar la Soacha profunda: problemas reales que nadie está contando, en un lenguaje que se entiende en el barrio. Sin venderte como el salvador y sin porno miseria.',
    },
    {
      k: 'El sello',
      v: 'Ningún video sale sin un radicado. Tocamos un tema, pedimos respuestas por escrito y mostramos el documento. Eso es lo que nadie más está haciendo.',
    },
    {
      k: 'El tono',
      v: 'Crítico, pero cuidando las palabras: decimos cuánto costó y mostramos lo que hay. Que la gente saque la conclusión. Nunca acusamos sin prueba ni señalamos grupos.',
    },
    {
      k: 'La meta',
      v: 'Que el pacto te vea y que la gente te reconozca por tu apellido: 1.000 seguidores en noviembre y 2.000 en diciembre, con comunidad real que comenta.',
    },
  ],
  stats: [
    { n: 12, l: 'piezas base' },
    { n: 5, l: 'videos adicionales' },
    { n: 100, suffix: '%', l: 'con radicado' },
    { n: 5, suffix: ' h', l: 'de grabación' },
  ],
  sello: [
    { n: '01', t: 'Radicar', d: 'Antes de grabar, la petición o denuncia ya está radicada.' },
    { n: '02', t: 'Grabar', d: 'El video cuenta el problema y muestra el documento.' },
    { n: '03', t: 'Publicar', d: 'Cierre fijo: “el radicado está en el enlace de la bio”.' },
    { n: '04', t: 'Respuesta', d: 'Cuando contesten —o no— sale la segunda parte.' },
    { n: '05', t: 'Drive público', d: 'Todos los radicados en un Drive, sin tus datos de dirección.' },
  ],
  semanas: [
    { n: 1, rango: '2 – 8 nov' },
    { n: 2, rango: '9 – 15 nov' },
    { n: 3, rango: '16 – 22 nov' },
    { n: 4, rango: '23 – 30 nov' },
  ],
  hitos: [
    { fecha: '22 oct', titulo: 'Reunión de estrategia', detalle: 'Ajustamos temas, tono, vestuario y redes.', estado: 'hecho' },
    { fecha: '27 oct', titulo: 'Reunión de Urbaser', detalle: 'Fotos espontáneas de la reunión para el carrusel y las historias.', estado: 'proximo' },
    { fecha: '28 oct', titulo: 'Día de grabación', detalle: 'Miércoles en la mañana, unas 5 horas. Tres cambios de ropa y tips de TikTok.', estado: 'proximo' },
    { fecha: '29 oct', titulo: 'Actividad con adultos mayores', detalle: 'Fotos y video corto, sin posar.', estado: 'proximo' },
    { fecha: '2 nov', titulo: 'Arranca la parrilla', detalle: 'Primera semana al aire. Revisamos todo antes y elegimos con qué video salimos.', estado: 'proximo' },
    { fecha: 'Por agendar', titulo: 'Un día con los recicladores', detalle: 'Madrugada, 3 a 4 horas. Boris convoca.', estado: 'pendiente' },
    { fecha: '30 nov', titulo: '1.000 seguidores', detalle: 'Primera meta de la cuenta.', estado: 'meta' },
    { fecha: '31 dic', titulo: '2.000 seguidores', detalle: 'Y análisis de qué funciona para la campaña.', estado: 'meta' },
  ],
  metas: [
    { mes: 'Hoy', seguidores: null, nota: 'Cuenta pasa a pública y profesional' },
    { mes: 'Nov', seguidores: 1000, nota: 'Parrilla + TikTok diario' },
    { mes: 'Dic', seguidores: 2000, nota: 'Segunda parrilla' },
    { mes: 'Ene', seguidores: null, nota: 'Se fija con los datos de dic' },
  ],
  prueba: {
    titulo: 'Sí se puede',
    cifra: '500K',
    detalle:
      'vistas orgánicas en una semana en una cuenta de 150 seguidores que manejamos. Lo que esperábamos en tres meses llegó en siete días, porque el contenido resolvía una necesidad real. Aquí la necesidad es que la gente se sienta escuchada.',
  },
  fuera: [
    { t: 'Mi historia', d: 'Mueve más al votante en campaña. La guardamos para ese momento.' },
    { t: '¿Qué le preguntaría al alcalde?', d: 'Ya lo hace el combo de Saldarriaga, con letrero y todo. Queremos marcar diferencia.' },
    { t: 'Sentarse a conversar con vecinos', d: 'Otros precandidatos lo hacen y les sale mal. Lo reemplaza el recorrido a cámara.' },
    { t: 'Jingle', d: 'Ayuda con el nombre, pero es pieza de campaña.' },
    { t: 'La Florida desde lo humano', d: 'Queda pendiente: te traemos otra forma de contarlo, sin porno miseria.' },
  ],
  guia: [
    {
      titulo: 'Vestuario',
      items: [
        'No uniformarse: nada de salir siempre con la misma camisa o el mismo saco.',
        'Pantalón bota recta y chaquetas tipo drill, casuales y limpias.',
        'Para denuncias: blazer sobre camiseta blanca, sin corbata, fondo limpio.',
        'Día de grabación: tres cambios, camisa planchada y una camioneta para cambiarse.',
        'Te enviamos referencias de outfits para que elijas antes del domingo.',
      ],
    },
    {
      titulo: 'Marca',
      items: [
        'Apellido grande y nombre pequeño en todos los cierres, para generar recordación.',
        'Logo y manual de marca básico (colores y tipografías) primero; el manual completo después.',
        'Evaluamos poner el apellido primero en el usuario de Instagram.',
        'La paleta se mantiene en precampaña. Antes de campaña revisamos qué funciona.',
      ],
    },
    {
      titulo: 'Redes',
      items: [
        'Cuenta pública en modo profesional, con historias que aporten.',
        'Crear fanpage de Facebook y enlazarla con Instagram y WhatsApp: cada video sale en las dos.',
        'TikTok: mínimo un video al día, orgánico, grabado con el celular y buen audio.',
        'Una línea aparte para lo urgente; más adelante, community manager.',
      ],
    },
    {
      titulo: 'Fotos en eventos',
      items: [
        'Fotos espontáneas, hablando con la gente. Las posadas no transmiten.',
        'Primero la gente, después tú. Cuidamos ángulos que no te favorecen.',
        'Opción A: fotógrafo por 2 horas (te enviamos cotización).',
        'Opción B: curso básico de 20 minutos con el celular para un amigo tuyo.',
      ],
    },
  ],
  pendientes: [
    {
      quien: 'Kuadra',
      items: [
        'Parrilla y guiones (esta página)',
        'Referencias de vestuario',
        'Cotización de los 5 videos adicionales',
        'Cotización del fotógrafo por 2 horas',
        'Propuesta de logo',
      ],
    },
    {
      quien: 'Arnold',
      items: [
        'Radicar las peticiones antes del 28 de octubre',
        'Llenar los espacios ✍️ de cada guion',
        'Enviar 15 a 20 fotos de trayectoria, en acción',
        'Crear la fanpage de Facebook',
        'Hablar con Boris para el día de reciclaje',
        'Confirmar con Marcela el video de educación',
      ],
    },
  ],
  piezas: [
    // ───────────────────────────── Semana 1
    {
      id: 'p01',
      n: '01',
      semana: 1,
      bloque: 'base',
      formato: 'Reel',
      titulo: 'Lo radiqué: el contrato de Urbaser',
      linea: 'Abrimos con documento en mano, no con opinión.',
      duracion: '60 – 75 s',
      propuesta:
        'Primer video del sello. Arrancamos con el tema que más mueve hoy y con la diferencia a la vista: aquí hay un proceso organizado, no un show. Otros ya salieron a hablar de Urbaser con efectismo y sólo recibieron críticas. Este video deja montada su segunda parte: la respuesta (pieza 17).',
      gancho: 'Primer plano del radicado sobre la mesa, sello visible, golpe seco de sonido. Texto: “ESTO YA ESTÁ RADICADO”.',
      guion: [
        { t: '0 – 3 s', plano: 'Primer plano del documento con el sello de radicado.', texto: '“Esto no es una opinión. Es una petición radicada.”' },
        { t: '3 – 12 s', plano: 'Plano medio, fondo limpio, mirada a cámara.', texto: '“Le pedimos a la Alcaldía que explique el contrato de aseo con Urbaser: qué se firmó, cuánto pagamos y qué se está cumpliendo.”' },
        { t: '12 – 40 s', plano: 'Plano medio con gráficos de apoyo.', texto: 'Los tres puntos del contrato que vas a cuestionar (tarifa, cobertura, cumplimiento…). Máximo 30 segundos. Pregunta y dato, sin acusar.', tipo: 'arnold' },
        { t: '40 – 52 s', plano: 'B-roll: camiones, puntos críticos de basura, recibo de aseo con la tarifa resaltada.', texto: '“Cada mes lo pagas en tu recibo. Tienes derecho a saber en qué se va.”' },
        { t: '52 – 65 s', plano: 'Vuelve a plano medio. Documento en mano.', texto: '“La respuesta tiene plazo legal. Cuando llegue, se la mostramos aquí mismo.”' },
        CIERRE,
      ],
      radicado: 'Petición a la Alcaldía sobre el contrato (ya radicada desde el Congreso) + segunda petición directa a Urbaser.',
      locacion: 'Interior con fondo limpio',
      vestuario: 'Blazer sobre camiseta blanca, sin corbata',
      verificar: 'Número y fecha de los dos radicados; cláusulas del contrato que se citen.',
    },
    {
      id: 'p02',
      n: '02',
      semana: 1,
      bloque: 'base',
      formato: 'Carrusel',
      titulo: 'No vengo de la nada',
      linea: 'Tu trayectoria en fotos, sin venderte como salvador.',
      duracion: '8 slides',
      propuesta:
        'El primer carrusel pasa a ser de fotos, como acordamos. No es “mi historia” —esa queda para campaña— sino una hoja de vida en imágenes: que quien llegue por los videos sepa quién está hablando, qué ha estudiado y qué ha liderado. Fotos de acción, nunca posadas.',
      gancho: 'Portada con una foto de acción (manifestación o junta) y el texto “No vengo de la nada. Vengo de aquí.”',
      guion: [
        { t: 'Slide 1', plano: 'Foto de acción a sangre.', texto: '“No vengo de la nada. Vengo de aquí.”' },
        { t: 'Slide 2', plano: 'Río Soacha / foto de archivo de la gestión.', texto: '“Lideré las peticiones por la subcuenca del río Soacha.” + año y qué pasó.', tipo: 'arnold' },
        { t: 'Slide 3', plano: 'La plaza de mercado.', texto: '“Crecí en la plaza. La plaza no avanzó y metieron a los vendedores sin garantías.”' },
        { t: 'Slide 4', plano: 'Foto con la junta o la comunidad.', texto: 'Trabajo comunitario: qué organizaste y con quién.', tipo: 'arnold' },
        { t: 'Slide 5', plano: 'Foto sobria, de trabajo.', texto: 'Tu formación, en una línea. La planeación de ciudad es tu fuerte.', tipo: 'arnold' },
        { t: 'Slide 6', plano: 'Documentos radicados en abanico.', texto: '“Peticiones radicadas desde el Congreso.” + las más importantes.', tipo: 'arnold' },
        { t: 'Slide 7', plano: 'Collage rápido: manifestaciones, cumbres, juntas. Primero la gente, después tú.', texto: 'Sin texto, o una sola palabra: “Aquí.”' },
        { t: 'Slide 8', plano: 'Placa de marca.', texto: '“Hice esto. Y en muchos casos no ha pasado nada. Por eso sigo.”', tipo: 'cierre' },
      ],
      radicado: 'No aplica: es trayectoria. Si una slide menciona una petición, se muestra su número.',
      locacion: 'Fotos de archivo',
      verificar: 'Necesitamos 15 a 20 fotos tuyas en acción.',
    },
    {
      id: 'p03',
      n: '03',
      semana: 1,
      bloque: 'base',
      formato: 'Reel',
      titulo: 'El video que copiaron',
      linea: 'La comparativa: copiar por números no es gobernar.',
      duracion: '45 – 60 s',
      propuesta:
        'La idea que más te gustó. Ponemos lado a lado el video de “tapar huecos” de un creador de contenido y la versión que copió la política local. No es burla: es mostrar que copiaron porque vieron números, no por la gente. Te diferencia del combo de Saldarriaga sin tener que decir “ustedes no son de acá”.',
      gancho: 'Pantalla dividida: original y copia sincronizados, cuadro a cuadro. Texto: “¿Notas algo?”',
      guion: [
        { t: '0 – 3 s', plano: 'Split screen de los dos videos.', texto: 'Texto en pantalla: “¿Notas algo?”' },
        { t: '3 – 10 s', plano: 'Formato reacción: tú en plano medio, el video en recuadro.', texto: '“Uno lo hizo un creador de contenido. El otro, un político. Adivina cuál tapó el hueco de verdad.”' },
        { t: '10 – 35 s', plano: 'Plano medio.', texto: 'Tu crítica: por qué copiar formatos para ganar vistas no es gobernar. Unos 25 segundos.', tipo: 'arnold' },
        { t: '35 – 48 s', plano: 'B-roll del hueco o la vía real, hoy, con fecha en pantalla.', texto: '“Esta vía sigue así.” (sólo si el registro es actual y verificable)' },
        { t: '48 – 60 s', plano: 'Plano medio, documento en mano.', texto: '“Hacer contenido es fácil. Arreglar la ciudad, no. Por eso pedimos cuentas sobre la malla vial.”' },
        CIERRE,
      ],
      radicado: 'Petición sobre el estado y el presupuesto de mantenimiento de la malla vial.',
      locacion: 'Interior + una vía real',
      vestuario: 'Chaqueta drill, bota recta',
      nota: 'Usamos fragmentos cortos, con fines de crítica y citando la fuente.',
    },
    // ───────────────────────────── Semana 2
    {
      id: 'p04',
      n: '04',
      semana: 2,
      bloque: 'base',
      formato: 'Reel',
      titulo: 'La personería que no se construye',
      linea: 'Recorrido a pie: el problema contado en el lugar.',
      duracion: '60 – 75 s',
      propuesta:
        'Uno de los temas que pediste priorizar. Formato de recorrido: caminas y le cuentas el problema directo a la cámara, en el sitio. La pregunta central es simple: ¿por qué no se han invertido ni ejecutado los recursos de la personería?',
      gancho: 'Entras caminando al lote o a la sede actual y señalas: “Aquí debería estar la personería de Soacha.”',
      guion: [
        { t: '0 – 3 s', plano: 'Plano en movimiento (gimbal), entrando al sitio.', texto: '“Aquí debería estar la personería de Soacha.”' },
        { t: '3 – 15 s', plano: 'Caminando hacia cámara.', texto: '“La entidad que defiende tus derechos frente a la Alcaldía no tiene cómo funcionar como debe.”' },
        { t: '15 – 40 s', plano: 'Recorrido con detalles del lugar.', texto: 'Qué se prometió, cuánto se presupuestó y qué se ejecutó. Unos 25 segundos.', tipo: 'arnold' },
        { t: '40 – 55 s', plano: 'Línea de tiempo animada: anuncio → presupuesto → hoy.', texto: '“¿Por qué no se ha invertido? Se lo preguntamos por escrito.”' },
        { t: '55 – 70 s', plano: 'Plano medio con el radicado en la mano.', texto: '“Esperamos la respuesta. Y se la vamos a mostrar.”' },
        CIERRE,
      ],
      radicado: 'Petición sobre el presupuesto asignado y ejecutado para la sede de la personería.',
      locacion: 'Sede actual o lote previsto',
      vestuario: 'Chaqueta drill, bota recta',
      verificar: 'Valores presupuestados y ejecutados, con fuente.',
    },
    {
      id: 'p05',
      n: '05',
      semana: 2,
      bloque: 'base',
      formato: 'Carrusel',
      titulo: '¿Sabías que…? Lo que nunca llegó',
      linea: 'Proyectos de Soacha que se anunciaron y se quedaron en nada.',
      duracion: '7 slides',
      propuesta:
        'El segundo carrusel, informativo. Proyectos que se anunciaron y nunca llegaron, y por qué. Es el tipo de contenido que se comenta y se comparte: construye comunidad real alrededor del tema, no seguidores vacíos.',
      gancho: 'Portada tipo titular: “¿Sabías que Soacha tenía aprobados estos proyectos?”',
      guion: [
        { t: 'Slide 1', plano: 'Titular grande sobre foto de la ciudad.', texto: '“¿Sabías que Soacha tenía aprobados estos proyectos?”' },
        { t: 'Slide 2', plano: 'Recorte de prensa del tren de cercanías.', texto: '“Tren de cercanías: anunciado y presupuestado. Hoy: nada.” + año.', tipo: 'arnold' },
        { t: 'Slide 3', plano: 'Foto de la plaza de mercado.', texto: 'Qué se prometió para la plaza y qué pasó.', tipo: 'arnold' },
        { t: 'Slide 4', plano: 'Foto del río.', texto: 'Subcuenca del río Soacha: qué se pidió y qué no se hizo.', tipo: 'arnold' },
        { t: 'Slide 5', plano: 'Foto o render.', texto: 'Un proyecto más que tú elijas.', tipo: 'arnold' },
        { t: 'Slide 6', plano: 'Radicados en abanico.', texto: '“¿Qué pasó con cada uno? Lo pedimos por escrito.”' },
        { t: 'Slide 7', plano: 'Placa de marca.', texto: '“¿Qué otro proyecto te prometieron? Cuéntanos en los comentarios.”', tipo: 'cierre' },
      ],
      radicado: 'Derechos de petición sobre cada proyecto, o uno consolidado.',
      locacion: 'Diseño + archivo de prensa',
      verificar: 'Fechas y fuentes de cada recorte.',
    },
    {
      id: 'p06',
      n: '06',
      semana: 2,
      bloque: 'base',
      formato: 'Reel',
      titulo: 'Así se arregla: el tren de cercanías',
      linea: 'Pedagogía urbana en lenguaje de barrio.',
      duracion: '75 – 90 s',
      propuesta:
        'Pediste un buen video del tren. Lo hacemos como pedagogía urbana: titulares de prensa del lanzamiento para mostrar que no era un sueño, estuvo aprobado. Es un tema con muchos intereses, así que el guion sólo pone hechos verificables y preguntas, nunca acusaciones.',
      gancho: 'Titulares de prensa que caen uno sobre otro; el último queda con un sello: “¿Y?”',
      guion: [
        { t: '0 – 4 s', plano: 'Recortes de prensa animados.', texto: 'Texto: “SOACHA TENÍA UN TREN APROBADO”.' },
        { t: '4 – 15 s', plano: 'Tú en la autopista o una estación en hora pico.', texto: '“Esto es lo que vivimos todos los días. Y no tenía por qué ser así.”' },
        { t: '15 – 35 s', plano: 'Mapa animado del trazado y los tiempos de viaje.', texto: 'Explicación sencilla: por dónde iba, cuánto nos ahorraba.' },
        { t: '35 – 60 s', plano: 'Plano medio con titulares de apoyo.', texto: 'Qué pasó: fechas y decisiones, sin acusar. Unos 25 segundos.', tipo: 'arnold' },
        { t: '60 – 75 s', plano: 'Tres pasos en pantalla.', texto: '“Así se arregla:” y tu propuesta en tres pasos.', tipo: 'arnold' },
        CIERRE,
      ],
      radicado: 'Petición sobre el estado del proyecto ante la entidad responsable.',
      locacion: 'Autopista Sur / estación',
      vestuario: 'Chaqueta drill',
      verificar: 'Titulares con fecha y medio; cifras del proyecto.',
    },
    // ───────────────────────────── Semana 3
    {
      id: 'p07',
      n: '07',
      semana: 3,
      bloque: 'base',
      formato: 'Video + shorts',
      titulo: 'Me pongo en tus zapatos: un día reciclando',
      linea: 'Madrugas con los recicladores. Une cartón, tarifa y Urbaser.',
      duracion: '90 s + versión larga',
      propuesta:
        'El video que más conecta. Madrugas y sales a reciclar con ellos. Une tres temas en uno: la crisis del cartón (hoy no se lo compran porque se trae cartón reciclado de afuera), la tarifa de aprovechamiento que todos pagamos y el contrato de Urbaser. Se graba aparte, 3 a 4 horas de madrugada; Boris convoca. Del material sale el reel y varios shorts.',
      gancho: 'Oscuro, 4:30 a. m. Te pones los guantes junto a la carreta. Texto: “4:30 a. m. Hoy trabajo con ellos.”',
      guion: [
        { t: '0 – 4 s', plano: 'Madrugada, guantes, carreta.', texto: 'Texto: “4:30 a. m. Hoy trabajo con ellos.”' },
        { t: '4 – 20 s', plano: 'Recorrido. El reciclador explica su día; tú escuchas y cargas.', texto: 'Habla él. Tú no actúas: trabajas.' },
        { t: '20 – 40 s', plano: 'En la bodega: báscula, precio del cartón.', texto: '“Hoy no le compran el cartón. ¿Sabes por qué?” + dato en pantalla.' },
        { t: '40 – 60 s', plano: 'Caminando con la carreta.', texto: 'La tarifa de aprovechamiento: la pagas en tu recibo, ¿le llega a quien recicla? Unos 20 segundos.', tipo: 'arnold' },
        { t: '60 – 80 s', plano: 'Final del día: manos, cansancio, lo que se ganó.', texto: 'Cifra del día en pantalla. Silencio.' },
        CIERRE,
      ],
      radicado: 'Petición sobre el recaudo y el giro de la tarifa de aprovechamiento a las organizaciones de recicladores.',
      locacion: 'Ruta de reciclaje + bodega',
      vestuario: 'Ropa de trabajo',
      verificar: 'Precio del cartón y valor de la tarifa.',
      nota: 'Sin porno miseria: el reciclador es el experto, no la víctima. Autorización de imagen firmada.',
    },
    {
      id: 'p08',
      n: '08',
      semana: 3,
      bloque: 'base',
      formato: 'Reel',
      titulo: '$6.000 millones en estudios. Cero movilidad.',
      linea: 'La petición y el contraste con lo real.',
      duracion: '60 s',
      propuesta:
        'Indignación con datos. Dos estudios de transporte, dos administraciones, más de 6.000 millones de pesos… y el caos vehicular sigue igual. Pedimos los estudios y los ponemos frente al trancón.',
      gancho: 'Tú, atrapado en el trancón, con dos documentos gruesos en la mano. Contador animado: “$6.000.000.000”.',
      guion: [
        { t: '0 – 3 s', plano: 'Trancón en la autopista, tú en primer plano.', texto: 'Contador: “$6.000 millones en estudios”.' },
        { t: '3 – 15 s', plano: 'Plano medio en el carro o en la acera.', texto: '“Dos estudios de movilidad. Dos administraciones. Más de seis mil millones de pesos.”' },
        { t: '15 – 35 s', plano: 'Plano medio.', texto: 'Qué decían los estudios y qué se hizo con ellos. Unos 20 segundos.', tipo: 'arnold' },
        { t: '35 – 50 s', plano: 'Gráfica: inversión en estudios vs. tiempo de viaje.', texto: '“Esto se pagó. Esto es lo que tenemos.”' },
        { t: '50 – 60 s', plano: 'Radicado en mano.', texto: '“¿Dónde están esos estudios? Ya los pedimos.”' },
        CIERRE,
      ],
      radicado: 'Petición de copia de los dos estudios, su costo y su estado de implementación.',
      locacion: 'Autopista en hora pico',
      vestuario: 'Chaqueta drill',
      verificar: 'Valor exacto de los dos contratos de estudio.',
    },
    {
      id: 'p09',
      n: '09',
      semana: 3,
      bloque: 'base',
      formato: 'Carrusel',
      titulo: 'Orgullo Soacha',
      linea: 'Datos curiosos de la gente y la cultura.',
      duracion: '7 slides',
      propuesta:
        'El tercer carrusel, más amable: datos curiosos del municipio, su gente y su cultura. A Soacha llega gente de todo el país; eso es identidad y también un reto. Equilibra la parrilla para que no todo sea denuncia.',
      gancho: 'Portada: “Cosas de Soacha que seguro no sabías.”',
      guion: [
        { t: 'Slide 1', plano: 'Foto icónica del municipio.', texto: '“Cosas de Soacha que seguro no sabías.”' },
        { t: 'Slide 2', plano: 'Archivo histórico.', texto: 'Un dato de historia que te guste.', tipo: 'arnold' },
        { t: 'Slide 3', plano: 'Retratos de vecinos.', texto: '“Aquí llega gente de todas las regiones del país.”' },
        { t: 'Slide 4', plano: 'Cultura: música, comida, fiestas.', texto: 'Una tradición suachuna.' },
        { t: 'Slide 5', plano: 'Un lugar.', texto: 'Tu lugar favorito de Soacha y por qué.', tipo: 'arnold' },
        { t: 'Slide 6', plano: 'Panorámica de crecimiento urbano.', texto: '“Crecimos rápido. Sin planeación, eso también es un problema.”' },
        { t: 'Slide 7', plano: 'Placa de marca.', texto: '“Etiqueta a alguien que sea orgullo suachuno.”', tipo: 'cierre' },
      ],
      radicado: 'No aplica: es contenido de identidad.',
      locacion: 'Diseño + fotos de archivo',
    },
    // ───────────────────────────── Semana 4
    {
      id: 'p10',
      n: '10',
      semana: 4,
      bloque: 'base',
      formato: 'Reel',
      titulo: 'La basura que nos rompe las vías',
      linea: 'Relleno sanitario: lo que cuesta a futuro.',
      duracion: '75 s',
      propuesta:
        'Vamos al punto donde se proyecta el relleno —que la administración presenta como “parque tecnológico”— y vamos más allá: cuánto nos va a costar. Compactadores destruyendo la malla vial, tráfico pesado colapsando la movilidad y otros municipios de la sabana trayendo su basura.',
      gancho: 'Un compactador pasa a centímetros de ti; corte a una grieta en el pavimento. Texto: “¿Quién paga esto?”',
      guion: [
        { t: '0 – 4 s', plano: 'Compactador pasando, corte a la vía dañada.', texto: 'Texto: “¿Quién paga esto?”' },
        { t: '4 – 20 s', plano: 'En el terreno.', texto: '“Aquí quieren hacer el relleno. Lo llaman parque tecnológico.”' },
        { t: '20 – 40 s', plano: 'Mapa animado: rutas de camiones desde otros municipios.', texto: '“Nos traen la basura de la sabana. Y los camiones pasan por nuestras calles.”' },
        { t: '40 – 60 s', plano: 'Plano medio.', texto: 'Tu proyección: cuánto cuesta reparar la malla vial y cómo afecta la movilidad. Unos 20 segundos.', tipo: 'arnold' },
        { t: '60 – 75 s', plano: 'Radicado en mano.', texto: '“Pedimos los estudios de impacto. Nadie nos ha dicho cuánto nos cuesta.”' },
        CIERRE,
      ],
      radicado: 'Petición sobre los estudios de impacto vial y el costo de mantenimiento por tráfico pesado.',
      locacion: 'Terreno del relleno + vía afectada',
      vestuario: 'Chaqueta drill, bota recta',
      verificar: 'Municipios que dispondrían en Soacha; costos de mantenimiento vial.',
    },
    {
      id: 'p11',
      n: '11',
      semana: 4,
      bloque: 'base',
      formato: 'Reel',
      titulo: 'soysoachuno.com: $3.000 millones',
      linea: 'La crítica y una propuesta que no suena a candidato.',
      duracion: '60 s',
      propuesta:
        'Una página web de 3.000 millones para “rescatar la identidad”. La mostramos tal cual está hoy y, en vez de quedarnos en la crítica, lanzas una propuesta: que los 8.000 bachilleres que se gradúan cada año hagan cultura ciudadana.',
      gancho: 'Grabación de pantalla navegando la web mientras un contador sube a “$3.000.000.000”.',
      guion: [
        { t: '0 – 4 s', plano: 'Scroll por la web + contador.', texto: 'Texto: “Esta página costó $3.000 millones.”' },
        { t: '4 – 20 s', plano: 'Tú frente al computador.', texto: '“Se hizo para rescatar la identidad suachuna. Mírenla.”' },
        { t: '20 – 35 s', plano: 'Plano medio.', texto: 'Tu lectura de lo que se ve, sin acusar. Unos 15 segundos.', tipo: 'arnold' },
        { t: '35 – 55 s', plano: 'Gráfica: 8.000 puntos que se encienden.', texto: '“¿Y si los 8.000 bachilleres que salen cada año hicieran cultura ciudadana? Eso sí es identidad.”' },
        { t: '55 – 60 s', plano: 'Radicado.', texto: '“Pedimos el contrato y lo que se entregó.”' },
        CIERRE,
      ],
      radicado: 'Petición sobre el contrato, valor, entregables y métricas de uso de soysoachuno.com.',
      locacion: 'Interior',
      vestuario: 'Camiseta + chaqueta',
      verificar: 'Valor del contrato y número de bachilleres al año.',
    },
    {
      id: 'p12',
      n: '12',
      semana: 4,
      bloque: 'base',
      formato: 'Reel',
      titulo: '¿Cuánto vale la Navidad?',
      linea: '“Valió tanto. Vea lo que es.”',
      duracion: '45 – 60 s',
      propuesta:
        'Como el caso que recordaste: no decimos que se robaron nada. Mostramos el alumbrado y decimos cuánto costó; la gente saca su conclusión. Se publica cuando el alumbrado ya esté instalado, a finales de noviembre.',
      gancho: 'Plano amplio de un árbol con pocas luces, en silencio. Aparece la cifra: “$3.000 millones”.',
      guion: [
        { t: '0 – 4 s', plano: 'Árbol de Navidad, plano fijo, silencio.', texto: 'Texto: “$3.000 millones.”' },
        { t: '4 – 15 s', plano: 'Tú junto al alumbrado.', texto: '“El presupuesto de alumbrado de este año es de 5.000 millones. Ya se gastaron 3.000 en esto.”' },
        { t: '15 – 30 s', plano: 'Recorrido por los puntos de alumbrado.', texto: 'Sin comentarios: que se vea.' },
        { t: '30 – 45 s', plano: 'Plano medio.', texto: '“¿Y lo que se compró el año pasado, dónde está?” + lo que quieras agregar.', tipo: 'arnold' },
        CIERRE,
      ],
      radicado: 'Petición sobre los contratos de alumbrado navideño y el paradero de los elementos comprados el año anterior.',
      locacion: 'Parque principal, de noche',
      vestuario: 'Chaqueta',
      verificar: 'Cifras de 3.000 y 5.000 millones, con documento.',
    },
    // ───────────────────────────── Adicionales
    {
      id: 'p13',
      n: '13',
      semana: null,
      bloque: 'adicional',
      formato: 'Reel',
      titulo: 'Tres días en casa',
      linea: 'Fallecidos que nadie recoge. Desde lo humano.',
      duracion: '75 – 90 s',
      propuesta:
        'Un problema que nadie ha tocado: si un familiar muere en casa un sábado de puente, la familia puede esperar hasta el martes a que lo recojan. La morgue abre y cierra cuando quiere. Lo contamos con un testimonio, con respeto y sin morbo.',
      gancho: 'Una silla vacía y un reloj. Texto que avanza: “Sábado. Domingo. Lunes festivo.”',
      guion: [
        { t: '0 – 5 s', plano: 'Silla vacía, reloj.', texto: 'Texto: “Sábado. Domingo. Lunes festivo.”' },
        { t: '5 – 30 s', plano: 'Testimonio de una familia, en su casa.', texto: 'Quién cuenta su historia (con consentimiento).', tipo: 'arnold' },
        { t: '30 – 50 s', plano: 'Tú, plano medio, tono sereno.', texto: 'Tu propia experiencia, la que contaste en la reunión. Unos 20 segundos.', tipo: 'arnold' },
        { t: '50 – 70 s', plano: 'Titulares de noticias + gráfico del trámite.', texto: '“La morgue abre cuando quiere. Y el trámite del acta de defunción cae sobre la familia.”' },
        { t: '70 – 85 s', plano: 'Radicado.', texto: '“Pedimos horarios y protocolo. Esto no le puede pasar a nadie más.”' },
        CIERRE,
      ],
      radicado: 'Petición sobre los horarios de la morgue municipal y el protocolo de levantamiento en casa.',
      locacion: 'Casa de la familia + interior',
      nota: 'Nunca imágenes del fallecido. Tono respetuoso de principio a fin.',
    },
    {
      id: 'p14',
      n: '14',
      semana: null,
      bloque: 'adicional',
      formato: 'Reel',
      titulo: '¿Qué se puede estudiar en Soacha?',
      linea: 'Educación superior, con Marcela.',
      duracion: '75 s',
      propuesta:
        'Ningún candidato le habla a los jóvenes de educación. Respondemos al creador de contenido que criticó las obras: sí hubo fallas, pero el campus universitario va, y contamos qué traerá. Ideal con Marcela, que fue la delegada del Presidente ante el Consejo Directivo de la Universidad de Cundinamarca.',
      gancho: 'Tú y Marcela frente al campus en obra. Texto: “¿Qué se puede estudiar en Soacha?”',
      guion: [
        { t: '0 – 4 s', plano: 'Los dos frente al campus.', texto: 'Texto: “¿Qué se puede estudiar en Soacha?”' },
        { t: '4 – 20 s', plano: 'Conversación caminando.', texto: '“Hoy, si quieres estudiar algo distinto, te toca irte.”' },
        { t: '20 – 40 s', plano: 'Marcela a cámara.', texto: 'Qué programas y qué universidades llegarían al campus.', tipo: 'arnold' },
        { t: '40 – 60 s', plano: 'Tú a cámara.', texto: 'Tu posición: reconocer las fallas y defender el proyecto. Unos 20 segundos.', tipo: 'arnold' },
        { t: '60 – 75 s', plano: 'Radicado.', texto: '“Pedimos el cronograma. Que no se quede en anuncio.”' },
        CIERRE,
      ],
      radicado: 'Petición sobre el cronograma de obra y la oferta académica del campus.',
      locacion: 'Campus universitario en obra',
      vestuario: 'Chaqueta drill',
      nota: 'Confirmar con Marcela antes de agendar.',
    },
    {
      id: 'p15',
      n: '15',
      semana: null,
      bloque: 'adicional',
      formato: 'Reel',
      titulo: 'La seguridad no puede esperar',
      linea: 'Seguridad para hoy, no sólo a largo plazo.',
      duracion: '60 s',
      propuesta:
        'Tu concepto de seguridad: oportunidades y educación funcionan a largo plazo, pero la gente necesita seguridad ya. Cuidamos las palabras: hablamos de la delincuencia en general y nunca nombramos grupos.',
      gancho: 'Calle de noche, tú de frente: “La seguridad no puede esperar diez años.”',
      guion: [
        { t: '0 – 4 s', plano: 'Calle de noche, plano frontal.', texto: '“La seguridad no puede esperar diez años.”' },
        { t: '4 – 20 s', plano: 'Caminando.', texto: '“Educación y oportunidades, sí. Pero hoy la gente lo que quiere es llegar tranquila a la casa.”' },
        { t: '20 – 45 s', plano: 'Plano medio.', texto: 'Dos o tres medidas inmediatas que propones. Unos 25 segundos.', tipo: 'arnold' },
        { t: '45 – 55 s', plano: 'Dato en pantalla.', texto: 'Cifras oficiales del municipio, con fuente.' },
        CIERRE,
      ],
      radicado: 'Petición sobre la inversión en seguridad: cámaras, iluminación y cuadrantes.',
      locacion: 'Calle, de noche',
      vestuario: 'Chaqueta',
      verificar: 'Cifras de seguridad con fuente oficial.',
      nota: 'Nunca nombrar grupos criminales ni personas.',
    },
    {
      id: 'p16',
      n: '16',
      semana: null,
      bloque: 'adicional',
      formato: 'Reel',
      titulo: '¿Dónde quedaron las sillas del parque?',
      linea: 'Antes y después. Detrimento contado con preguntas.',
      duracion: '45 s',
      propuesta:
        'El mobiliario del parque principal —sillas, materas— se retiró. ¿Por qué y dónde está? Un video corto, visual, de antes y después.',
      gancho: 'Slider de antes y después del parque. Texto: “¿Dónde quedaron?”',
      guion: [
        { t: '0 – 4 s', plano: 'Antes / después con barrido.', texto: 'Texto: “¿Dónde quedaron?”' },
        { t: '4 – 15 s', plano: 'Tú en el parque, donde estaban las sillas.', texto: '“Aquí había sillas. Aquí había materas.”' },
        { t: '15 – 30 s', plano: 'Plano medio.', texto: 'Lo que sabes del retiro y por qué importa. Unos 15 segundos.', tipo: 'arnold' },
        { t: '30 – 45 s', plano: 'Radicado.', texto: '“Pedimos el inventario. Eso es de todos.”' },
        CIERRE,
      ],
      radicado: 'Petición sobre el inventario y el destino del mobiliario retirado.',
      locacion: 'Parque principal',
      verificar: 'Fotos de archivo del parque con fecha.',
    },
    {
      id: 'p17',
      n: '17',
      semana: null,
      bloque: 'adicional',
      formato: 'Reel',
      titulo: 'Nos respondieron',
      linea: 'Segunda parte de Urbaser: el ciclo del sello cerrado.',
      duracion: '60 s',
      propuesta:
        'Cierra el ciclo: radicaste, te respondieron, lo mostramos. Es la prueba de que no vienes a hablar por hablar. Sale cuando llegue la respuesta, o al vencer el plazo legal mostrando que no contestaron.',
      gancho: 'Abres el correo o el sobre de la respuesta en cámara. Texto: “Nos respondieron.”',
      guion: [
        { t: '0 – 4 s', plano: 'Abriendo la respuesta.', texto: 'Texto: “Nos respondieron.”' },
        { t: '4 – 20 s', plano: 'Plano medio.', texto: '“Hace unos días pedimos explicaciones sobre el contrato de Urbaser. Esto contestaron.”' },
        { t: '20 – 45 s', plano: 'Documento en pantalla, frases resaltadas.', texto: 'Qué responden y, sobre todo, qué no responden. Unos 25 segundos.', tipo: 'arnold' },
        { t: '45 – 60 s', plano: 'Plano medio.', texto: '“Y si no responden, también se lo vamos a contar.” + el siguiente paso.' },
        CIERRE,
      ],
      radicado: 'La respuesta oficial a las peticiones de la pieza 01.',
      locacion: 'Interior con fondo limpio',
      vestuario: 'Blazer sobre camiseta blanca',
    },
  ],
}
