import type { ServiceSlug } from "@/lib/slugs";

export type ServiceContent = {
  slug: ServiceSlug;
  title: string;
  metaDescription: string;
  eyebrow: string;
  heroTitle: string;
  heroDescription: string;
  intro: string[];
  highlights: string[];
  processSteps: { title: string; description: string }[];
};

// Contenido hardcodeado siguiendo Docs/05-contenidos-y-diseno.md (tono cercano, primera persona
// del plural, específico). TODO: migrar a Sanity (documento `service`, ver Docs/BACKEND.md
// sección 3) cuando LRC quiera poder editar estos textos sin tocar código.
export const services: ServiceContent[] = [
  {
    slug: "encimeras-de-cocina",
    title: "Encimeras de cocina",
    metaDescription:
      "Encimeras de cocina a medida en porcelánico, cuarzo compacto y granito: plantillado, fabricación en taller propio e instalación en Madrid.",
    eyebrow: "Encimeras de cocina",
    heroTitle: "Encimeras de cocina a medida en porcelánico, cuarzo compacto y granito",
    heroDescription:
      "Diseñamos, fabricamos e instalamos tu encimera a medida, tomando plantilla en tu propia cocina para un ajuste perfecto entre armarios, fregadero y electrodomésticos.",
    intro: [
      "La encimera es la pieza que más se usa y más se nota de una cocina: aguanta calor, cortes, líquidos y el peso de años de uso, así que su elección no es solo estética. Trabajamos con porcelánico, cuarzo compacto y granito — los tres materiales que mejor combinan resistencia, higiene y acabado — y te ayudamos a elegir el que mejor encaja con cómo usas tu cocina, no solo con lo que se ve mejor en foto.",
      "Tomamos plantilla exacta en tu vivienda una vez elegido el material, para que los cortes de fregadero, placa de inducción y remates encajen al milímetro. Fabricamos la pieza en nuestro propio taller y la instalamos con nuestro equipo, sin subcontratar el montaje a terceros — así respondemos nosotros mismos si algo no encaja a la primera.",
      "Trabajamos tanto sustituciones de encimera sola, sin tocar el resto de la cocina, como encimeras dentro de una reforma completa; si tu proyecto incluye también mobiliario, échale un vistazo a nuestra reforma de cocina integral.",
    ],
    highlights: [
      "Medición y plantillado en tu vivienda",
      "Corte a medida de fregadero, placa e inducción",
      "Cantos pulidos, biselados o en bocel, a elegir",
      "Retirada de la encimera antigua",
      "Instalación por nuestro propio equipo",
    ],
    processSteps: [
      {
        title: "Visita y plantillado",
        description: "Medimos tu cocina in situ y tomamos plantilla exacta de la encimera, incluidos los cortes de fregadero y placa.",
      },
      {
        title: "Elección de material y acabado",
        description: "Te enseñamos muestras reales de porcelánico, cuarzo compacto y granito para que elijas color, textura y tipo de canto.",
      },
      {
        title: "Fabricación en taller",
        description: "Cortamos y trabajamos la pieza a medida en nuestro taller, con los cortes y remates ya definidos en el plantillado.",
      },
      {
        title: "Instalación y retirada de la antigua",
        description: "Instalamos la nueva encimera y retiramos la anterior en la misma visita, dejando la cocina lista para usar.",
      },
    ],
  },
  {
    slug: "reformas-de-cocina",
    title: "Reforma de cocina",
    metaDescription:
      "Reforma integral de cocina en Madrid: diseño, mobiliario a medida, encimera y electrodomésticos con un único equipo de principio a fin.",
    eyebrow: "Reforma de cocina",
    heroTitle: "Reforma integral de cocina, de la demolición a la última pieza",
    heroDescription:
      "Diseño, mobiliario a medida, encimera y electrodomésticos: una única reforma de cocina, con un único interlocutor de principio a fin.",
    intro: [
      "Reformar una cocina implica coordinar albañilería, fontanería, electricidad, mobiliario y encimera, normalmente con varios gremios distintos. Nos encargamos de todo el proceso con un único equipo, para que no tengas que hacer tú de coordinador de obra.",
      "Diseñamos la distribución según el espacio disponible y cómo usas la cocina — isla, en L, en U, lineal —, fabricamos el mobiliario a medida y la encimera en nuestro taller, y gestionamos la instalación de electrodomésticos si los necesitas nuevos. Tú decides el nivel de acabado; nosotros nos encargamos de que todo llegue a tiempo y encaje entre sí.",
      "Trabajamos tanto reformas completas, quitando tabiques y cambiando instalaciones, como renovaciones más ligeras que mantienen la distribución actual pero cambian mobiliario y encimera. En la primera visita te decimos con claridad qué tipo de reforma necesita tu cocina.",
    ],
    highlights: [
      "Diseño de distribución a medida",
      "Mobiliario de cocina fabricado a medida",
      "Encimera en el material que elijas",
      "Coordinación de fontanería y electricidad",
      "Instalación de electrodomésticos",
    ],
    processSteps: [
      { title: "Visita y presupuesto", description: "Valoramos tu cocina actual y te damos un presupuesto cerrado por el proyecto completo." },
      { title: "Diseño y materiales", description: "Definimos la distribución, el mobiliario y el material de la encimera contigo." },
      { title: "Obra y fabricación", description: "Ejecutamos la demolición e instalaciones necesarias mientras fabricamos el mobiliario y la encimera en taller." },
      { title: "Montaje final", description: "Instalamos mobiliario, encimera y electrodomésticos, y revisamos cada detalle contigo antes de entregar." },
    ],
  },
  {
    slug: "reformas-de-bano",
    title: "Reforma de baño",
    metaDescription:
      "Reforma de baño en Madrid: demolición, instalaciones, alicatado, sanitarios, mampara y encimera con un único equipo.",
    eyebrow: "Reforma de baño",
    heroTitle: "Reforma de baño: alicatado, sanitarios y mampara con un único equipo",
    heroDescription:
      "Alicatado, sanitarios, mampara y encimera de baño con los mismos acabados de calidad que nuestras cocinas.",
    intro: [
      "El baño tiene sus propios problemas técnicos — humedad, desagües, ventilación — que conviene resolver bien desde el principio para no tener sorpresas después. Nos encargamos de la reforma completa: demolición del baño actual, nuevas instalaciones si hacen falta, alicatado, sanitarios, mampara y encimera.",
      "Trabajamos con los mismos materiales que en nuestras encimeras de cocina (porcelánico, cuarzo compacto y granito) para la encimera del baño, además de gres porcelánico de gran formato para suelo y paredes, cada vez más habitual por su resistencia a la humedad y sus juntas mínimas.",
      "Ya sea cambiar bañera por ducha, ganar espacio de almacenaje o renovar por completo la instalación, valoramos el baño en la primera visita y te damos un presupuesto cerrado antes de empezar.",
    ],
    highlights: [
      "Demolición y nuevas instalaciones si hace falta",
      "Alicatado y solado en gres porcelánico de gran formato",
      "Sanitarios, grifería y mampara",
      "Encimera de baño a medida",
      "Sustitución de bañera por ducha",
    ],
    processSteps: [
      { title: "Visita y presupuesto", description: "Revisamos el estado de las instalaciones y te damos un presupuesto cerrado para todo el proyecto." },
      { title: "Diseño y materiales", description: "Elegimos juntos alicatado, sanitarios, mampara y encimera." },
      { title: "Obra", description: "Ejecutamos demolición, instalaciones y alicatado con nuestro propio equipo." },
      { title: "Instalación final", description: "Montamos sanitarios, mampara y encimera, y dejamos el baño listo para usar." },
    ],
  },
  {
    slug: "reformas-integrales",
    title: "Reforma integral",
    metaDescription:
      "Reforma integral de vivienda o local comercial en Madrid, llave en mano: albañilería, instalaciones y acabados con un único interlocutor.",
    eyebrow: "Reforma integral",
    heroTitle: "Reforma integral de vivienda o local comercial, llave en mano",
    heroDescription:
      "Vivienda o local completo: albañilería, instalaciones y acabados con un único interlocutor, de principio a fin.",
    intro: [
      "Una reforma integral toca todo: distribución, instalaciones, carpintería, suelos, cocina y baños. Cuantos más gremios distintos intervienen, más fácil es que algo se retrase o no encaje entre sí. Coordinamos todo el proceso con nuestro propio equipo, incluidas las partes que hacemos también por separado — cocinas, baños y encimeras — para que la reforma avance como un único proyecto.",
      "Trabajamos tanto viviendas completas como locales comerciales que necesitan adaptarse a un nuevo uso: cambio de distribución, instalaciones nuevas de electricidad y fontanería, suelos, pintura y carpintería.",
      "Te acompañamos desde el primer boceto de distribución hasta la última mano de pintura, con un presupuesto cerrado desde el principio y un único punto de contacto durante toda la obra.",
    ],
    highlights: [
      "Redistribución de espacios",
      "Instalaciones de electricidad y fontanería",
      "Suelos, alicatados y pintura",
      "Cocina y baños incluidos si los necesitas",
      "Reformas de locales comerciales",
    ],
    processSteps: [
      { title: "Visita y proyecto", description: "Valoramos el espacio y definimos contigo la nueva distribución y el alcance de la obra." },
      { title: "Presupuesto cerrado", description: "Te damos un presupuesto detallado por partidas, sin sorpresas durante la obra." },
      { title: "Ejecución de la obra", description: "Coordinamos albañilería, instalaciones y acabados con nuestro propio equipo." },
      { title: "Entrega y garantía", description: "Revisamos cada detalle contigo y respondemos con garantía tras la entrega." },
    ],
  },
];

export function getServiceBySlug(slug: string): ServiceContent | undefined {
  return services.find((s) => s.slug === slug);
}
