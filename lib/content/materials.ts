import type { MaterialSlug } from "@/lib/slugs";

export type MaterialContent = {
  slug: MaterialSlug;
  title: string;
  metaDescription: string;
  eyebrow: string;
  heroTitle: string;
  heroDescription: string;
  intro: string[];
  features: string[];
  varieties: { name: string; description: string }[];
  care: string[];
};

// Contenido hardcodeado siguiendo Docs/05-contenidos-y-diseno.md. Las variedades/acabados
// concretos son genéricos hasta que LRC facilite su catálogo real de proveedores (ver
// Docs/05-contenidos-y-diseno.md "Activos que hay que recopilar del cliente").
// TODO: migrar a Sanity (documento `material`, ver Docs/BACKEND.md sección 3) y confirmar
// variedades exactas con el catálogo real de LRC.
export const materials: MaterialContent[] = [
  {
    slug: "porcelanico",
    title: "Porcelánico",
    metaDescription:
      "Encimeras de porcelánico técnico en Madrid: resistencia a rayaduras y calor, grandes formatos y mínimas juntas. Fabricación e instalación propia.",
    eyebrow: "Materiales",
    heroTitle: "Encimeras de porcelánico: resistencia y grandes formatos sin juntas",
    heroDescription:
      "Encimeras de porcelánico técnico, con formatos de gran tamaño que reducen juntas visibles y una resistencia pensada para el uso diario de una cocina.",
    intro: [
      "El porcelánico técnico (también llamado gres porcelánico compacto o sinterizado) es uno de los materiales que más ha crecido en encimeras de cocina en los últimos años, y no por moda: se fabrica a altísima presión y temperatura, lo que lo hace prácticamente inmune a rayaduras, manchas y calor directo. Puedes apoyar una sartén recién sacada del fuego sin necesidad de salvamanteles, algo que no puedes hacer con la mayoría de materiales.",
      "Se fabrica en planchas de gran formato, lo que permite encimeras en una sola pieza, con muy pocas juntas visibles incluso en cocinas grandes o con isla. Es un material no poroso, por lo que no absorbe líquidos ni olores y es muy fácil de mantener sin productos especiales.",
      "Trabajamos varios acabados y colores de porcelánico según el fabricante con el que trabajemos en cada momento; en la visita a nuestro taller te enseñamos las muestras disponibles para que veas el color y la textura reales antes de decidir, algo que en pantalla nunca se aprecia del todo bien.",
    ],
    features: [
      "Prácticamente inmune a rayaduras y cortes",
      "Resiste calor directo sin marcarse",
      "No poroso: no mancha ni absorbe olores",
      "Formatos de gran tamaño con mínimas juntas",
      "Resistente a rayos UV: no pierde color con la luz",
    ],
    varieties: [
      { name: "Acabado mate / natural", description: "Textura suave al tacto que disimula bien las huellas y marcas de uso diario." },
      { name: "Acabado pulido / brillo", description: "Superficie con más reflejo, aporta luminosidad a cocinas con poca luz natural." },
      { name: "Imitación piedra natural", description: "Reproduce vetas de mármol o granito con el mantenimiento propio del porcelánico." },
    ],
    care: [
      "Limpieza con agua y jabón neutro, sin productos abrasivos",
      "No necesita sellado ni tratamientos periódicos",
      "Resistente a los productos de limpieza habituales de cocina",
      "Evita golpes secos en los bordes, el punto más sensible del material",
    ],
  },
  {
    slug: "cuarzo-compacto",
    title: "Cuarzo compacto",
    metaDescription:
      "Encimeras de cuarzo compacto (Silestone, Dekton y similares) en Madrid: superficie no porosa, amplia gama de colores. Fabricación e instalación propia.",
    eyebrow: "Materiales",
    heroTitle: "Encimeras de cuarzo compacto (Silestone, Dekton y similares)",
    heroDescription:
      "Superficie no porosa, fácil de limpiar y con una de las gamas de color y textura más amplias del mercado.",
    intro: [
      "El cuarzo compacto es una piedra artificial fabricada a partir de cuarzo natural, combinado con resinas, lo que le da una superficie mucho más uniforme y no porosa que la piedra natural, sin perder buena parte de su dureza. Marcas como Silestone o Dekton trabajan con esta tecnología y son de las opciones más habituales en cocinas reformadas en los últimos años.",
      "Al no ser poroso, no necesita sellado y es muy resistente a manchas de vino, aceite, café o zumo de limón, algo que la piedra natural sin tratar no garantiza igual. Es además uno de los materiales con más variedad de color y textura, incluyendo acabados que imitan mármol o cemento con un mantenimiento mucho más sencillo que el original.",
      "No es un material recomendable para apoyar directamente ollas o sartenes muy calientes sin salvamanteles, por las resinas de su composición; te lo explicamos bien en la visita para que sepas qué esperar según tu forma de cocinar.",
    ],
    features: [
      "No poroso: no mancha ni necesita sellado",
      "Amplia gama de colores y texturas, incluyendo imitación mármol",
      "Muy resistente a rayaduras en uso normal de cocina",
      "Superficie higiénica, apta para contacto con alimentos",
      "No recomendado para calor directo sin salvamanteles",
    ],
    varieties: [
      { name: "Colores lisos", description: "Tonos uniformes (blancos, grises, negros) para cocinas de estética minimalista." },
      { name: "Imitación mármol", description: "Vetas que reproducen mármol de Carrara u otras piedras naturales, con menos mantenimiento." },
      { name: "Texturas y grano", description: "Acabados con textura visible que ayudan a disimular marcas de uso diario." },
    ],
    care: [
      "Limpieza con agua y jabón neutro",
      "Usa salvamanteles con ollas y sartenes muy calientes",
      "Evita productos de limpieza muy concentrados en uso prolongado",
      "No necesita sellado periódico",
    ],
  },
  {
    slug: "granito",
    title: "Granito",
    metaDescription:
      "Encimeras de granito en Madrid: piedra natural de máxima dureza, con vetas únicas en cada pieza. Fabricación e instalación propia.",
    eyebrow: "Materiales",
    heroTitle: "Encimeras de granito: piedra natural de máxima dureza",
    heroDescription:
      "Piedra natural de máxima dureza, con vetas únicas en cada pieza — no hay dos encimeras de granito exactamente iguales.",
    intro: [
      "El granito es piedra natural extraída directamente de cantera, lo que lo convierte en uno de los materiales más duros que existen para encimera de cocina. Es prácticamente imposible rayarlo con el uso normal de una cocina, y aguanta bien el calor directo.",
      "Al ser piedra natural, cada pieza tiene vetas y tonalidades únicas: dos encimeras del mismo tipo de granito nunca son exactamente iguales, algo que aprecian quienes buscan un acabado con más carácter que los materiales fabricados en serie. A diferencia del porcelánico o el cuarzo, el granito sí es ligeramente poroso, por lo que recomendamos un sellado inicial y, según el uso, algún repaso puntual con los años.",
      "Trabajamos distintas variedades de granito nacional e importado según disponibilidad; en la visita al taller te mostramos las planchas disponibles para que elijas la que mejor combina con tu cocina, ya que el veteado real solo se aprecia bien en la pieza física.",
    ],
    features: [
      "Piedra natural de máxima dureza",
      "Resiste calor directo y cortes sin marcarse",
      "Vetas y tonos únicos en cada pieza",
      "Ligeramente poroso: recomendable un sellado inicial",
      "Gran durabilidad: encimeras que duran décadas",
    ],
    varieties: [
      { name: "Granitos claros", description: "Tonos grises y beige, aportan luminosidad a la cocina." },
      { name: "Granitos oscuros", description: "Negros y grises oscuros, un clásico de cocinas con mobiliario claro." },
      { name: "Granitos con veta marcada", description: "Vetas de color muy visibles, para quien busca una pieza con más carácter." },
    ],
    care: [
      "Sellado inicial recomendado para reducir la porosidad",
      "Limpieza con agua y jabón neutro, sin productos ácidos agresivos",
      "Usa salvamanteles y tablas de corte para conservar el brillo",
      "Repaso de sellado cada varios años según el uso",
    ],
  },
];

export function getMaterialBySlug(slug: string): MaterialContent | undefined {
  return materials.find((m) => m.slug === slug);
}
