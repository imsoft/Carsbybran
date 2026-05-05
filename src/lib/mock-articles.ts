import type { Article, ArticleStatus } from "./definitions";
import { db } from "./db";
import { articles as articlesTable } from "./db/schema";
import { eq, ne, and } from "drizzle-orm";

function toArticle(row: typeof articlesTable.$inferSelect): Article {
  return {
    id: row.id,
    slug: row.slug,
    status: row.status as ArticleStatus,
    titleEs: row.titleEs,
    titleEn: row.titleEn,
    excerptEs: row.excerptEs,
    excerptEn: row.excerptEn,
    contentEs: row.contentEs,
    contentEn: row.contentEn,
    coverImage: row.coverImage ?? undefined,
    category: row.category,
    tags: row.tags,
    views: row.views,
    specs: (row.specs as Article["specs"]) ?? undefined,
    versions: (row.versions as Article["versions"]) ?? undefined,
    ratings: (row.ratings as Article["ratings"]) ?? undefined,
    prosCons: (row.prosCons as Article["prosCons"]) ?? undefined,
    gallery: (row.gallery as Article["gallery"]) ?? undefined,
    videoUrl: row.videoUrl ?? undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

const MOCK_ARTICLES: Article[] = [
  {
    id: "1",
    slug: "toyota-gr86-2025-review",
    status: "published",
    titleEs: "Toyota GR86 2025: La Pureza del Placer de Manejar",
    titleEn: "2025 Toyota GR86: The Purity of Driving Pleasure",
    excerptEs: "El GR86 de segunda generación refina todo lo que hacía grande al original: un auto deportivo asequible con alma de verdad.",
    excerptEn: "The second-gen GR86 refines everything that made the original great — an affordable sports car with genuine soul.",
    contentEs: `## Introducción\n\nEl Toyota GR86 2025 representa el pináculo del automóvil deportivo asequible. Con su motor bóxer de 2.4 litros y una filosofía de diseño centrada en el conductor, este auto demuestra que no necesitas gastar una fortuna para disfrutar de la conducción en su forma más pura.\n\n## Diseño y Estilo\n\nEl exterior del GR86 2025 mantiene las líneas agresivas que lo caracterizan, con una capota larga, techo bajo y una postura atlética que comunica velocidad incluso en reposo. El interior ha sido refinado con materiales de mejor calidad y una pantalla central más grande, aunque sigue siendo un cockpit fundamentalmente orientado al conductor.\n\n## Desempeño en Carretera\n\nAl volante, el GR86 2025 es una revelación. La dirección es precisa y comunicativa, los frenos responden con confianza y la caja de 6 velocidades manual tiene uno de los mejores gatillos del segmento. La distribución de peso 53/47 garantiza un equilibrio casi perfecto en curvas.\n\n## Motor y Transmisión\n\nEl motor bóxer de 2.4 litros y 228 hp entrega su potencia de manera lineal y predecible. No es el más potente de su clase, pero su forma de entregar la potencia lo hace sentir más rápido de lo que indican los números. El motor revela libremente hasta las 7,500 rpm.\n\n## Conclusión\n\nEl Toyota GR86 2025 es uno de los mejores autos deportivos asequibles disponibles hoy en día. Para quien prioriza la conexión con el camino sobre la potencia bruta, pocas opciones superan lo que ofrece este pony japonés.`,
    contentEn: `## Introduction\n\nThe 2025 Toyota GR86 represents the pinnacle of affordable sports car engineering. With its 2.4-liter boxer engine and a driver-focused design philosophy, this car proves you don't need to spend a fortune to enjoy driving in its purest form.\n\n## Design and Styling\n\nThe GR86's exterior maintains its aggressive lines — long hood, low roofline, and an athletic stance that communicates speed even at rest. The interior has been refined with better materials and a larger center screen, though it remains a fundamentally driver-focused cockpit.\n\n## On-Road Performance\n\nBehind the wheel, the 2025 GR86 is a revelation. The steering is precise and communicative, the brakes respond with confidence, and the 6-speed manual has one of the best throws in its class. The 53/47 weight distribution guarantees near-perfect balance in corners.\n\n## Engine and Transmission\n\nThe 2.4-liter boxer engine producing 228 hp delivers its power in a linear and predictable manner. It's not the most powerful in its class, but the way it delivers power makes it feel faster than the numbers suggest. The engine revs freely all the way to 7,500 rpm.\n\n## Conclusion\n\nThe 2025 Toyota GR86 is one of the best affordable sports cars available today. For those who prioritize connection with the road over raw power, few options match what this Japanese pony car offers.`,
    coverImage: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200",
    category: "reviews",
    tags: ["toyota", "gr86", "sports-car", "2025"],
    views: 3240,
    createdAt: "2025-03-10T09:00:00Z",
    updatedAt: "2025-03-12T14:30:00Z",
    specs: {
      engine: "Bóxer 4 cilindros 2.4 L",
      displacement: "2,387 cc",
      power: "228 hp @ 7,000 rpm",
      torque: "250 Nm @ 3,700 rpm",
      transmission: "Manual 6 velocidades",
      drivetrain: "RWD",
      zeroToHundred: "6.3 s",
      topSpeed: "226 km/h",
      fuelConsumption: "9.4 L/100km",
      fuelType: "Gasolina",
      length: "4,265 mm",
      width: "1,775 mm",
      height: "1,310 mm",
      wheelbase: "2,575 mm",
      weight: "1,270 kg",
      trunkCapacity: "237 L",
      safetyRating: "NHTSA 5 estrellas",
      warranty: "3 años / 60,000 km",
      infotainment: "Pantalla 8\" Apple CarPlay / Android Auto",
      driverAssist: "Frenado de emergencia, alerta de carril",
    },
    versions: [
      { name: "GR86 Base", priceMin: "590,000", priceMax: "610,000", highlights: "Motor 2.4L, manual 6vel, pantalla 8\", CarPlay" },
      { name: "GR86 Premium", priceMin: "650,000", priceMax: "670,000", highlights: "Llantas BBS, Brembo, asientos Alcantara, diferencial LSD" },
    ],
    ratings: {
      performance: 9,
      comfort: 6,
      technology: 7,
      value: 9,
      design: 9,
      safety: 7,
    },
    prosCons: {
      pros: [
        { text: "Manejo excepcional, uno de los mejores en su categoría" },
        { text: "Motor bóxer con carácter único que revela hasta 7,500 rpm" },
        { text: "Precio competitivo para las prestaciones que ofrece" },
        { text: "Opción de transmisión manual de 6 velocidades de primer nivel" },
      ],
      cons: [
        { text: "Cajuela pequeña con solo 237 litros de capacidad" },
        { text: "Asientos traseros prácticamente inutilizables para adultos" },
        { text: "Tecnología de asistencia al conductor básica comparada con rivales" },
      ],
    },
    gallery: [
      { url: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800", caption: "Exterior frontal" },
      { url: "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800", caption: "Vista lateral" },
      { url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800", caption: "Interior" },
      { url: "https://images.unsplash.com/photo-1493238792000-8113da705763?w=800", caption: "En acción" },
    ],
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: "2",
    slug: "honda-civic-type-r-vs-hyundai-elantra-n",
    status: "published",
    titleEs: "Civic Type R vs Elantra N: Dos Filosofías Deportivas",
    titleEn: "Civic Type R vs Elantra N: Two Sports Car Philosophies",
    excerptEs: "Dos de los hot hatches más emocionantes del mercado cara a cara. ¿Cuál se lleva la corona?",
    excerptEn: "Two of the most exciting hot hatches on the market go head to head. Which one takes the crown?",
    contentEs: `## El Duelo\n\nCuando Honda y Hyundai decidieron crear sus divisiones de alto rendimiento, nadie imaginaba que el resultado sería tan equilibrado. El Civic Type R y el Elantra N representan dos visiones distintas de lo que debe ser un hot hatch moderno.\n\n## Honda Civic Type R: El Ingeniero\n\nEl Type R es un auto construido por ingenieros para ingenieros. Cada detalle ha sido optimizado para la máxima performance en pista. La suspensión adaptiva, el diferencial de deslizamiento limitado y el modo +R hacen que este auto se sienta completamente en casa en un circuito.\n\n## Hyundai Elantra N: El Entertainer\n\nEl Elantra N toma un enfoque diferente. Hyundai apostó por la diversión como prioridad número uno. Con sonidos artificiales del escape, modos de conducción dramáticos y un precio más accesible, este coreano busca conquistar corazones antes que cronómetros.\n\n## En Carretera\n\nEn el uso diario, el Elantra N resulta más cómodo y fácil de llevar. El Type R, aunque más duro, recompensa al conductor con una experiencia más visceral cuando se le aprieta en serio.\n\n## Veredicto\n\nAmbos son ganadores en su propia manera. El Type R para el purista que busca la máxima conexión conductor-máquina. El Elantra N para quien quiere emoción accesible sin sacrificar la practicidad diaria.`,
    contentEn: `## The Battle\n\nWhen Honda and Hyundai decided to create their high-performance divisions, nobody imagined the result would be this evenly matched. The Civic Type R and Elantra N represent two distinct visions of what a modern hot hatch should be.\n\n## Honda Civic Type R: The Engineer\n\nThe Type R is a car built by engineers for engineers. Every detail has been optimized for maximum track performance. The adaptive suspension, limited-slip differential, and +R mode make this car feel completely at home on a circuit.\n\n## Hyundai Elantra N: The Entertainer\n\nThe Elantra N takes a different approach. Hyundai prioritized fun above everything else. With artificial exhaust sounds, dramatic driving modes, and a more accessible price, this Korean car aims to win hearts before stopwatches.\n\n## On the Road\n\nIn daily use, the Elantra N is more comfortable and easier to live with. The Type R, while harsher, rewards the driver with a more visceral experience when pushed hard.\n\n## Verdict\n\nBoth are winners in their own way. The Type R for the purist seeking maximum driver-machine connection. The Elantra N for those wanting accessible excitement without sacrificing daily practicality.`,
    coverImage: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200",
    category: "comparisons",
    tags: ["honda", "hyundai", "hot-hatch", "comparison"],
    views: 5180,
    createdAt: "2025-02-20T10:00:00Z",
    updatedAt: "2025-02-22T09:00:00Z",
    ratings: {
      performance: 9,
      comfort: 7,
      technology: 8,
      value: 8,
      design: 8,
      safety: 8,
    },
    prosCons: {
      pros: [
        { text: "Ambos ofrecen una experiencia de manejo verdaderamente emocionante" },
        { text: "Excelente relación precio-rendimiento comparados con autos premium" },
        { text: "Práctica carrocería hatchback con espacio utilitario real" },
      ],
      cons: [
        { text: "El Type R puede ser incómodo en ciudad por su suspensión rígida" },
        { text: "Los sonidos artificiales del Elantra N no convencen a todos" },
        { text: "Alto consumo de combustible en modo Sport/+R" },
      ],
    },
  },
  {
    id: "3",
    slug: "mazda-mx5-miata-2025",
    status: "draft",
    titleEs: "Mazda MX-5 Miata 2025: El Eterno Roadster",
    titleEn: "2025 Mazda MX-5 Miata: The Eternal Roadster",
    excerptEs: "Sigue siendo la referencia absoluta en roadsters asequibles.",
    excerptEn: "It remains the absolute benchmark for affordable roadsters.",
    contentEs: `## Draft en progreso\n\nContenido pendiente de revisión...`,
    contentEn: `## Draft in progress\n\nContent pending review...`,
    coverImage: "",
    category: "reviews",
    tags: ["mazda", "mx5", "roadster"],
    views: 0,
    createdAt: "2025-04-01T08:00:00Z",
    updatedAt: "2025-04-01T08:00:00Z",
  },
  {
    id: "4",
    slug: "ford-mustang-dark-horse-2025",
    status: "draft",
    titleEs: "Ford Mustang Dark Horse 2025: El Pony Car Definitivo",
    titleEn: "2025 Ford Mustang Dark Horse: The Definitive Pony Car",
    excerptEs: "Ford apuesta fuerte con su versión más extrema del Mustang moderno.",
    excerptEn: "Ford goes all-in with the most extreme version of the modern Mustang.",
    contentEs: `## Borrador inicial\n\nEste artículo está en proceso de escritura...`,
    contentEn: `## Initial draft\n\nThis article is being written...`,
    coverImage: "",
    category: "reviews",
    tags: ["ford", "mustang", "muscle-car"],
    views: 0,
    createdAt: "2025-04-15T11:00:00Z",
    updatedAt: "2025-04-15T11:00:00Z",
  },
  {
    id: "5",
    slug: "geely-monjaro-2024-review",
    status: "published",
    titleEs: "Geely Monjaro 2024: El SUV Chino que Redefine el Lujo Accesible",
    titleEn: "2024 Geely Monjaro: The Chinese SUV Redefining Accessible Luxury",
    excerptEs: "Pasamos dos semanas con el buque insignia de Geely en ciudad y carretera. Lo que genuinamente nos sorprendió — y lo que aún necesita trabajo.",
    excerptEn: "We spent two weeks with Geely's flagship crossover across city traffic and open highway. Here's what genuinely surprised us — and what still needs work.",
    contentEs: `## Introducción\n\nEl Geely Monjaro 2024 llega dispuesto a desafiar a marcas premium establecidas con décadas de historia. Con una cabina que evoca la clase de un Range Rover y un precio que avergüenza a la competencia europea, este SUV chino plantea una pregunta seria: ¿realmente necesitas pagar más por un logo alemán?\n\n## Diseño y Habitáculo\n\nExteriormente, el Monjaro impone con su silueta musculosa, frente en cascada y rines de 21 pulgadas de fundición. El interior es donde realmente demuestra su nivel: tapicería Nappa perforada, techo panorámico doble, pantallas curvas de 12.3 pulgadas para conductor y copiloto, y materiales que difícilmente avergonzarían a un Volvo XC60.\n\n## Desempeño en Ruta\n\nEl motor turbo de 2.0 litros entrega 238 hp con torque suficiente para maniobras ágiles en ciudad y adelantamientos cómodos en carretera. La transmisión de 7 velocidades hace cambios suaves y la conducción es confortable sin perder completamente el contacto con el camino. No es un deportivo, pero tampoco pretende serlo.\n\n## Veredicto\n\nEl Monjaro 2024 es el argumento más convincente de Geely para entrar al mercado de lujo accesible. Al precio de una Mazda CX-5 de gama alta ofrece equipamiento de nivel BMW X3. Quien ignore el badge chino podría estar perdiéndose uno de los mejores valores del segmento.`,
    contentEn: `## Introduction\n\nThe 2024 Geely Monjaro arrives ready to challenge premium brands with decades of history. With a cabin that evokes Range Rover-class luxury and a price that embarrasses European competition, this Chinese SUV asks a serious question: do you really need to pay more for a German badge?\n\n## Design and Interior\n\nExternally, the Monjaro commands attention with its muscular silhouette, cascading front grille, and cast 21-inch wheels. The interior is where it truly proves its caliber: perforated Nappa leather, dual panoramic roof, 12.3-inch curved screens for driver and passenger, and materials that wouldn't embarrass a Volvo XC60.\n\n## On-Road Performance\n\nThe 2.0-liter turbo delivers 238 hp with enough torque for confident city maneuvering and comfortable highway passes. The 7-speed transmission shifts smoothly and the ride is comfortable without completely losing road contact. It's not a sports car, but it never pretends to be.\n\n## Verdict\n\nThe 2024 Monjaro is Geely's most compelling argument for the accessible luxury market. At the price of a top-spec Mazda CX-5 it delivers BMW X3-level equipment. Anyone who overlooks the Chinese badge might be missing one of the best values in the segment.`,
    coverImage: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200",
    category: "suv",
    tags: ["geely", "monjaro", "suv", "2024"],
    views: 4120,
    createdAt: "2026-04-20T10:00:00Z",
    updatedAt: "2026-04-20T10:00:00Z",
    ratings: { performance: 8, comfort: 9, technology: 9, value: 9, design: 8, safety: 8 },
    prosCons: {
      pros: [
        { text: "Equipamiento de nivel premium a precio de segmento medio" },
        { text: "Interior extraordinariamente refinado para su categoría de precio" },
        { text: "Pantallas de 12.3\" con tecnología de primer nivel" },
      ],
      cons: [
        { text: "Red de distribución y servicio aún limitada en México" },
        { text: "Valor de reventa incierto al ser una marca nueva en el mercado" },
        { text: "Peso elevado que afecta ligeramente la agilidad en curvas" },
      ],
    },
  },
  {
    id: "6",
    slug: "mercedes-c300-2024-review",
    status: "published",
    titleEs: "Mercedes-Benz C300 2024: Todavía el Estándar del Segmento Ejecutivo",
    titleEn: "2024 Mercedes-Benz C300: Still the Benchmark for Executive Sedans",
    excerptEs: "Después de 3,000 km al volante confirmamos que el C300 sigue siendo el referente del segmento ejecutivo — a un precio.",
    excerptEn: "After 3,000 km behind the wheel, we confirm the C300 remains the gold standard for business-class driving — at a price.",
    contentEs: `## La Estrella de Tres Puntas Sigue Brillando\n\nEl Mercedes-Benz C300 2024 no necesita presentación. Décadas de refinamiento han producido un sedán que define lo que significa el lujo ejecutivo. La pregunta ya no es si es bueno — lo es — sino si sigue justificando la brecha de precio frente a rivales que han mejorado considerablemente.\n\n## Diseño y Tecnología\n\nLa nueva generación del C-Class hereda el lenguaje de diseño del S-Class: pantalla central de 11.9 pulgadas en posición vertical, instrumentación completamente digital de 12.3 pulgadas y una organización del espacio que prioriza elegancia sobre practicidad. El acabado es impecable y los materiales, de primer orden.\n\n## Motor y Dinámica\n\nEl motor de cuatro cilindros turbo de 2.0 litros con sistema mild-hybrid de 48V entrega 255 hp y 400 Nm de torque, suficiente para sprints urbanos convincentes. La suspensión de control electrónico AIRMATIC absorbe imperfecciones con compostura pero puede resultar demasiado firme en modo Sport.\n\n## ¿Vale la Pena el Premio?\n\nEl C300 sigue siendo un automóvil extraordinario, pero a su precio la competencia de BMW y Audi ya no se queda atrás. Si el badge y el linaje importan, la estrella sigue reinando. Si buscas el máximo valor, hay razones legítimas para explorar alternativas.`,
    contentEn: `## The Three-Pointed Star Still Shines\n\nThe 2024 Mercedes-Benz C300 needs no introduction. Decades of refinement have produced a sedan that defines executive luxury. The question is no longer whether it's good — it is — but whether it still justifies the price premium against rivals that have improved considerably.\n\n## Design and Technology\n\nThe new C-Class generation inherits the S-Class design language: an 11.9-inch vertical center display, fully digital 12.3-inch instrumentation, and a space organization that prioritizes elegance over practicality. The build quality is impeccable and materials are top-tier.\n\n## Engine and Dynamics\n\nThe 2.0-liter four-cylinder turbo with 48V mild-hybrid system delivers 255 hp and 400 Nm of torque, enough for convincing urban sprints. The AIRMATIC electronic suspension absorbs imperfections with composure but can feel too firm in Sport mode.\n\n## Is the Premium Worth It?\n\nThe C300 remains an extraordinary automobile, but at its price point, BMW and Audi competition is no longer far behind. If the badge and lineage matter, the star still reigns. If you're seeking maximum value, there are legitimate reasons to explore alternatives.`,
    coverImage: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200",
    category: "luxury",
    tags: ["mercedes-benz", "c300", "luxury", "sedan", "2024"],
    views: 5180,
    createdAt: "2026-04-15T10:00:00Z",
    updatedAt: "2026-04-15T10:00:00Z",
    ratings: { performance: 9, comfort: 9, technology: 9, value: 7, design: 9, safety: 9 },
    prosCons: {
      pros: [
        { text: "Refinamiento interior sin igual en el segmento" },
        { text: "Sistema MBUX de última generación, intuitivo y completo" },
        { text: "Manejo suave y seguro que inspira confianza en todo momento" },
      ],
      cons: [
        { text: "Precio base elevado con muchas opciones deseables como extras costosos" },
        { text: "Espacio trasero ajustado para pasajeros altos" },
        { text: "Motor de 4 cilindros puede sonar poco premium a altas revoluciones" },
      ],
    },
  },
  {
    id: "7",
    slug: "toyota-highlander-2024-review",
    status: "published",
    titleEs: "Toyota Highlander 2024: El SUV Familiar que Siempre Cumple",
    titleEn: "2024 Toyota Highlander: The Sensible Family SUV That Delivers",
    excerptEs: "Confiable, espacioso y ahora con mejor tecnología. El Highlander sigue siendo la opción predeterminada para familias que priorizan la fiabilidad.",
    excerptEn: "Dependable, spacious, and now with improved tech. The Highlander continues to be the default choice for families that prioritize reliability.",
    contentEs: `## El Campeón de las Familias\n\nEn el mundo de los SUV de tres filas, el Toyota Highlander 2024 no pretende emocionarte. Su misión es más noble: transportar a tu familia con seguridad, comodidad y sin sobresaltos mecánicos durante los próximos diez años. En eso, es imbatible.\n\n## Espacio y Practicidad\n\nLas tres filas ofrecen espacio real para siete ocupantes. La segunda fila Captain Seats en versiones superiores brinda comodidad de clase ejecutiva. La cajuela con la tercera fila levantada es razonable para hacer las compras del súper; con ella bajada, la capacidad de carga es generosa.\n\n## Motorización Híbrida\n\nEl sistema híbrido de 2.5 litros entrega 243 hp combinados y un consumo certificado de 8.5 L/100km en ciclo mixto — un número notable para un vehículo de este tamaño. La transición entre motor eléctrico y gasolina es invisible en uso normal.\n\n## Para Quién es Este Auto\n\nEl Highlander 2024 es la elección racional por excelencia. No tiene el diseño más audaz ni la tecnología más avanzada, pero tampoco decepciona en ningún aspecto. Si necesitas un SUV familiar que funcione perfectamente hoy y dentro de cinco años, ya encontraste tu respuesta.`,
    contentEn: `## The Family Champion\n\nIn the world of three-row SUVs, the 2024 Toyota Highlander doesn't try to excite you. Its mission is nobler: transport your family safely, comfortably, and without mechanical surprises for the next ten years. In that regard, it's unbeatable.\n\n## Space and Practicality\n\nAll three rows offer real space for seven occupants. The Captain Seats second row in higher trims provides executive-class comfort. Cargo space with the third row up is reasonable for grocery runs; folded flat, loading capacity is generous.\n\n## Hybrid Powertrain\n\nThe 2.5-liter hybrid system delivers 243 combined hp and a certified 8.5 L/100km in mixed cycle — a remarkable figure for a vehicle of this size. The transition between electric and gasoline motors is imperceptible in normal use.\n\n## Who This Car Is For\n\nThe 2024 Highlander is the rational choice par excellence. It doesn't have the boldest design or most advanced technology, but it doesn't disappoint in any aspect either. If you need a family SUV that works perfectly today and five years from now, you've already found your answer.`,
    coverImage: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=1200",
    category: "suv",
    tags: ["toyota", "highlander", "suv", "familia", "2024"],
    views: 3870,
    createdAt: "2026-04-10T10:00:00Z",
    updatedAt: "2026-04-10T10:00:00Z",
    ratings: { performance: 7, comfort: 9, technology: 8, value: 8, design: 7, safety: 9 },
    prosCons: {
      pros: [
        { text: "Fiabilidad Toyota comprobada, con los mejores índices de calidad del segmento" },
        { text: "Sistema híbrido eficiente que reduce el costo de operación" },
        { text: "Tres filas con espacio real para todos los ocupantes" },
      ],
      cons: [
        { text: "Diseño exterior conservador que no destaca en estacionamientos" },
        { text: "Motor de cuatro cilindros puede sentirse esforzado con carga completa" },
        { text: "Precio de versiones superiores se acerca a marcas premium" },
      ],
    },
  },
  {
    id: "8",
    slug: "bmw-330i-2024-review",
    status: "published",
    titleEs: "BMW 330i 2024: La Dinámica que Justifica el Badge",
    titleEn: "2024 BMW 330i: Driving Dynamics That Justify the Badge",
    excerptEs: "El último 3 Series demuestra que BMW todavía sabe construir un auto del conductor. Lo llevamos al circuito para descubrir hasta dónde llega.",
    excerptEn: "The latest 3 Series proves BMW still knows how to build a driver's car. We took it to the track to find out how far.",
    contentEs: `## El Auto del Conductor por Excelencia\n\nSi hay un modelo que define la identidad de BMW, ese es el Serie 3. El 330i 2024 llega con la promesa intacta: ser el mejor auto del conductor en su segmento. Después de 3,000 kilómetros en ciudad, carretera y una jornada en el Autódromo Hermanos Rodríguez, podemos confirmar que la promesa se cumple.\n\n## Diseño y Ergonomía\n\nEl interior del nuevo Serie 3 adopta el sistema iDrive 8 con pantalla curva de 14.9 pulgadas. El cockpit es claramente orientado al conductor, con todos los controles esenciales al alcance sin buscarlos en menús. El asiento del conductor se ajusta hasta encontrar la posición perfecta en menos de un minuto.\n\n## Motor y Transmisión\n\nEl bloque B48 de 2.0 litros turbo entrega 255 hp y 400 Nm desde 1,550 rpm. La caja automática de 8 velocidades ZF es la mejor de su clase: rápida en automático, precisa en manual. La dirección de relación variable es comunicativa sin ser nerviosa.\n\n## En Circuito\n\nEs en pista donde el 330i truly entrega. El balance chassis es excepcional, el control de estabilidad M Dynamic Mode permite algo de slide controlado y los frenos resisten varios giros sin fade. La distribución de peso 50:50 es perceptible en cada curva.`,
    contentEn: `## The Driver's Car Par Excellence\n\nIf there's one model that defines BMW's identity, it's the 3 Series. The 2024 330i arrives with its promise intact: to be the best driver's car in its segment. After 3,000 kilometers in city, highway, and a session at the Autodromo Hermanos Rodriguez, we can confirm the promise holds.\n\n## Design and Ergonomics\n\nThe new 3 Series interior adopts the iDrive 8 system with a 14.9-inch curved screen. The cockpit is clearly driver-oriented, with all essential controls within reach without hunting through menus. The driver's seat adjusts to find the perfect position in under a minute.\n\n## Engine and Transmission\n\nThe B48 2.0-liter turbo delivers 255 hp and 400 Nm from 1,550 rpm. The ZF 8-speed automatic is the best in class: fast in auto, precise in manual. The variable-ratio steering is communicative without being nervous.\n\n## On Track\n\nThe 330i truly delivers on circuit. Chassis balance is exceptional, M Dynamic Mode stability control allows some controlled slide, and the brakes resist multiple laps without fade. The 50:50 weight distribution is perceptible in every corner.`,
    coverImage: "https://images.unsplash.com/photo-1580414057403-c5f451f30e1c?w=1200",
    category: "sedan",
    tags: ["bmw", "330i", "sedan", "sport", "2024"],
    views: 4650,
    createdAt: "2026-04-05T10:00:00Z",
    updatedAt: "2026-04-05T10:00:00Z",
    ratings: { performance: 9, comfort: 8, technology: 8, value: 7, design: 9, safety: 8 },
    prosCons: {
      pros: [
        { text: "Dinámica de conducción de primer nivel, la mejor en su segmento" },
        { text: "Motor BMW B48 refinado y con excelente respuesta a cualquier régimen" },
        { text: "Sistema iDrive 8 intuitivo y responsive" },
      ],
      cons: [
        { text: "Precio con opciones puede superar fácilmente los $800,000 MXN" },
        { text: "Suspensión M Sport puede resultar incómoda en calles urbanas deterioradas" },
        { text: "Consumo real en ciudad puede decepcionar respecto a cifras de fábrica" },
      ],
    },
  },
  {
    id: "9",
    slug: "kia-sportage-2024-review",
    status: "published",
    titleEs: "Kia Sportage 2024: Ingeniería Coreana en su Momento más Seguro",
    titleEn: "2024 Kia Sportage: Korean Engineering at Its Most Confident",
    excerptEs: "Diseño audaz, interior premium y una estrategia de precio que pone seria presión a todos los que están sobre él en el segmento.",
    excerptEn: "Bold design, a premium interior and a pricing strategy that puts serious pressure on everyone above it in the segment.",
    contentEs: `## La Nueva Kia se Toma en Serio\n\nSi hace diez años alguien te hubiera dicho que una Kia compite directamente con la Volkswagen Tiguan y la Toyota RAV4, probablemente habrías sonreído. Hoy, el Sportage 2024 no solo compite — en algunos aspectos gana.\n\n## Diseño Exterior\n\nEl lenguaje "Opposites United" de Kia produce aquí uno de los diseños más distintivos del segmento. Las luces divididas, la parrilla tipo "boomerang" y las líneas de la carrocería son reconocibles a distancia. En estacionamientos llenos de SUVs genéricos, el Sportage destaca.\n\n## Tecnología y Habitáculo\n\nLa pantalla curva panorámica de 12.3 pulgadas para instrumentos y 12.3 pulgadas para infoentretenimiento está entre las mejores de su precio. La calidad de materiales, con costuras visibles y insertos con textura, supera lo que esperarías de una Kia de hace cinco años.\n\n## Desempeño y Eficiencia\n\nEl motor turbo de 1.6 litros con 180 hp entrega suficiente dinamismo para el uso diario. La versión híbrida enchufable (PHEV) es especialmente interesante: 265 hp combinados y hasta 50 km en modo eléctrico hacen el costo de operación notablemente bajo para quienes puedan cargar en casa.`,
    contentEn: `## The New Kia is Serious\n\nIf ten years ago someone had told you that a Kia competes directly with the Volkswagen Tiguan and Toyota RAV4, you might have smiled. Today, the 2024 Sportage doesn't just compete — in some aspects, it wins.\n\n## Exterior Design\n\nKia's "Opposites United" design language produces one of the most distinctive designs in the segment here. The split lights, boomerang-style grille, and body lines are recognizable from a distance. In parking lots full of generic SUVs, the Sportage stands out.\n\n## Technology and Cabin\n\nThe panoramic curved 12.3-inch instrument cluster and 12.3-inch infotainment screen is among the best at its price point. Material quality, with visible stitching and textured inserts, exceeds what you'd expect from a Kia five years ago.\n\n## Performance and Efficiency\n\nThe 1.6-liter turbo with 180 hp delivers sufficient dynamism for daily use. The plug-in hybrid (PHEV) version is especially interesting: 265 combined hp and up to 50 km in electric mode make operating costs remarkably low for those who can charge at home.`,
    coverImage: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200",
    category: "suv",
    tags: ["kia", "sportage", "suv", "2024"],
    views: 3210,
    createdAt: "2026-03-28T10:00:00Z",
    updatedAt: "2026-03-28T10:00:00Z",
    ratings: { performance: 8, comfort: 8, technology: 9, value: 9, design: 9, safety: 8 },
    prosCons: {
      pros: [
        { text: "Diseño exterior más atrevido e identificable del segmento" },
        { text: "Tecnología de pantallas de primer nivel incluida de serie" },
        { text: "Opción PHEV con autonomía eléctrica real para uso urbano" },
      ],
      cons: [
        { text: "Motor base de 1.6T puede sentirse insuficiente con 5 ocupantes y carga" },
        { text: "Garantía de mantenimiento más corta que Toyota" },
        { text: "Espacio de cajuela algo menor que rivales directos" },
      ],
    },
  },
  {
    id: "10",
    slug: "volkswagen-tiguan-2024-review",
    status: "published",
    titleEs: "Volkswagen Tiguan 2024: Pragmatismo Refinado en un Segmento Competido",
    titleEn: "2024 Volkswagen Tiguan: Refined Pragmatism in a Crowded Segment",
    excerptEs: "El Tiguan mantiene su precisión alemana y añade un carácter más cálido. Una elección sólida en un segmento que rara vez decepciona.",
    excerptEn: "The Tiguan keeps its German precision and adds a warmer character. A solid choice in a segment that rarely disappoints.",
    contentEs: `## El Pragmatista Premium\n\nEl Volkswagen Tiguan 2024 es el SUV compacto que probablemente deberías comprar si no quieres arriesgarte. No tiene el diseño más audaz ni la tecnología más llamativa, pero tampoco tiene las debilidades evidentes de sus rivales. Es, en pocas palabras, el SUV más completo del segmento.\n\n## Calidad de Construcción\n\nLa calidad de ensamblaje del Tiguan sigue siendo el referente del segmento. Los paneles encajan perfectamente, los materiales tienen solidez táctil y los plásticos de contacto frecuente envejecen bien. Diez años después, un Tiguan se siente más sólido que muchos SUVs de tres años de la competencia.\n\n## Dinámica y Confort\n\nLa plataforma MQB aporta un comportamiento dinámico equilibrado: suficientemente cómodo para viajes largos, suficientemente ágil para no aburrirte en carreteras sinuosas. El motor TSI de 1.4 o 2.0 litros cubre bien el espectro de necesidades.\n\n## El Argumento Volkswagen\n\nEl Tiguan es más caro que un Kia Sportage equivalente y menos emocionante que un Mazda CX-5, pero tiene algo que ninguno de ellos puede replicar: la percepción de solidez y la tranquilidad de una marca con décadas de historial en México.`,
    contentEn: `## The Premium Pragmatist\n\nThe 2024 Volkswagen Tiguan is the compact SUV you should probably buy if you don't want to take risks. It doesn't have the boldest design or most eye-catching technology, but it also lacks the obvious weaknesses of its rivals. It is, in short, the most complete SUV in the segment.\n\n## Build Quality\n\nTiguan's assembly quality remains the segment benchmark. Panels fit perfectly, materials have tactile solidity, and frequently touched plastics age well. Ten years later, a Tiguan feels more solid than many three-year-old competitor SUVs.\n\n## Dynamics and Comfort\n\nThe MQB platform delivers balanced dynamic behavior: comfortable enough for long trips, agile enough to stay interesting on winding roads. The 1.4 or 2.0-liter TSI engine covers the needs spectrum well.\n\n## The Volkswagen Argument\n\nThe Tiguan is more expensive than an equivalent Kia Sportage and less exciting than a Mazda CX-5, but it has something neither can replicate: the perception of solidity and peace of mind of a brand with decades of history in Mexico.`,
    coverImage: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200",
    category: "suv",
    tags: ["volkswagen", "tiguan", "suv", "2024"],
    views: 2980,
    createdAt: "2026-03-20T10:00:00Z",
    updatedAt: "2026-03-20T10:00:00Z",
    ratings: { performance: 7, comfort: 9, technology: 8, value: 8, design: 8, safety: 9 },
    prosCons: {
      pros: [
        { text: "Calidad de construcción y ensamblaje de referencia en el segmento" },
        { text: "Comportamiento dinámico equilibrado, cómodo y predecible" },
        { text: "Red de distribución y servicio amplia en toda la República Mexicana" },
      ],
      cons: [
        { text: "Precio más alto que rivales con equipamiento similar" },
        { text: "Diseño exterior discreto que no genera entusiasmo" },
        { text: "Sistema de infotainment más lento que la competencia asiática" },
      ],
    },
  },
  {
    id: "11",
    slug: "audi-a4-2024-review",
    status: "published",
    titleEs: "Audi A4 2024: Excelencia Discreta para el Conductor Exigente",
    titleEn: "2024 Audi A4: Understated Excellence for the Discerning Driver",
    excerptEs: "La discreción es una característica, no un defecto. El A4 recompensa a quien mira más allá de la superficie con una experiencia de conducción profundamente refinada.",
    excerptEn: "Subtlety is a feature, not a bug. The A4 rewards those who look past the surface with a deeply refined driving experience.",
    contentEs: `## El Traje a Medida del Segmento\n\nEl Audi A4 2024 es para quien sabe lo que quiere. No grita su presencia con diseños extravagantes ni intenta seducirte con tecnología innecesaria. Ofrece una combinación de refinamiento, calidad y dinámica que se descubre con el tiempo — y que cada día se aprecia más.\n\n## Interior Virtual Cockpit\n\nEl Virtual Cockpit Pro de 12.3 pulgadas sigue siendo uno de los displays de instrumentación más personalizables y elegantes del mercado. La MMI de segunda pantalla de 10.1 pulgadas con sistema operativo táctil es rápida y lógica. El silencio acústico a 120 km/h en autovía está entre los mejores de la categoría.\n\n## Cuattro y Dinámica\n\nEl sistema quattro de tracción integral adapta continuamente el reparto de par entre ejes según las condiciones de adherencia. En combinación con la suspensión adaptiva, el resultado es un auto que se siente clavado al asfalto pero sin transmitir incomodidad al conductor.\n\n## Madurez sobre Espectáculo\n\nEl A4 no intentará impresionarte en las primeras horas. Pero después de un mes, cuando el BMW del compañero ya empezó a sentirse normal, el Audi sigue revelando pequeños detalles de calidad que justifican cada peso invertido.`,
    contentEn: `## The Bespoke Suit of the Segment\n\nThe 2024 Audi A4 is for those who know what they want. It doesn't announce its presence with extravagant designs or try to seduce you with unnecessary technology. It offers a combination of refinement, quality, and dynamics that reveals itself over time — and that you appreciate more with each passing day.\n\n## Virtual Cockpit Interior\n\nThe 12.3-inch Virtual Cockpit Pro remains one of the most customizable and elegant instrument displays on the market. The 10.1-inch MMI second-screen with touch OS is fast and logical. Acoustic silence at 120 km/h on the highway is among the best in its category.\n\n## Quattro and Dynamics\n\nThe quattro all-wheel-drive system continuously adapts torque distribution between axles according to grip conditions. Combined with adaptive suspension, the result is a car that feels glued to the asphalt without transmitting discomfort to the driver.\n\n## Maturity Over Spectacle\n\nThe A4 won't try to impress you in the first hours. But after a month, when the colleague's BMW has started feeling normal, the Audi keeps revealing small quality details that justify every peso invested.`,
    coverImage: "https://images.unsplash.com/photo-1616788494672-ec7ca25fdda9?w=1200",
    category: "luxury",
    tags: ["audi", "a4", "luxury", "sedan", "2024"],
    views: 3540,
    createdAt: "2026-03-15T10:00:00Z",
    updatedAt: "2026-03-15T10:00:00Z",
    ratings: { performance: 8, comfort: 9, technology: 9, value: 7, design: 9, safety: 8 },
    prosCons: {
      pros: [
        { text: "Calidad de habitáculo y refinamiento acústico de nivel superior" },
        { text: "Virtual Cockpit Pro personalizable y elegante, referente de la industria" },
        { text: "Sistema quattro que aporta seguridad real en condiciones adversas" },
      ],
      cons: [
        { text: "Precio con opciones puede llegar a niveles del segmento de lujo alto" },
        { text: "Diseño evolutivo que puede pasar desapercibido frente a rivales más atrevidos" },
        { text: "Espacio trasero justo para viajes largos con tres ocupantes adultos" },
      ],
    },
  },
];

export async function getArticles(): Promise<Article[]> {
  try {
    const rows = await db.select().from(articlesTable);
    if (rows.length > 0) return rows.map(toArticle);
  } catch {}
  return MOCK_ARTICLES;
}

export async function getArticleById(id: string): Promise<Article | undefined> {
  try {
    const rows = await db.select().from(articlesTable).where(eq(articlesTable.id, id));
    if (rows.length > 0) return toArticle(rows[0]);
    const total = await db.select().from(articlesTable);
    if (total.length > 0) return undefined;
  } catch {}
  return MOCK_ARTICLES.find((a) => a.id === id);
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  try {
    const rows = await db
      .select()
      .from(articlesTable)
      .where(and(eq(articlesTable.slug, slug), eq(articlesTable.status, "published")));
    if (rows.length > 0) return toArticle(rows[0]);
    const total = await db.select().from(articlesTable);
    if (total.length > 0) return undefined;
  } catch {}
  return MOCK_ARTICLES.find((a) => a.slug === slug && a.status === "published");
}

export async function getRelatedArticles(id: string, limit = 3): Promise<Article[]> {
  try {
    const rows = await db
      .select()
      .from(articlesTable)
      .where(and(ne(articlesTable.id, id), eq(articlesTable.status, "published")))
      .limit(limit);
    if (rows.length > 0) return rows.map(toArticle);
    const total = await db.select().from(articlesTable);
    if (total.length > 0) return [];
  } catch {}
  return MOCK_ARTICLES.filter((a) => a.id !== id && a.status === "published").slice(0, limit);
}

export async function getArticleStats() {
  try {
    const rows = await db.select().from(articlesTable);
    if (rows.length > 0) {
      const mapped = rows.map(toArticle);
      return {
        total: mapped.length,
        published: mapped.filter((a) => a.status === "published").length,
        drafts: mapped.filter((a) => a.status === "draft").length,
        totalViews: mapped.reduce((sum, a) => sum + a.views, 0),
      };
    }
  } catch {}
  return {
    total: MOCK_ARTICLES.length,
    published: MOCK_ARTICLES.filter((a) => a.status === "published").length,
    drafts: MOCK_ARTICLES.filter((a) => a.status === "draft").length,
    totalViews: MOCK_ARTICLES.reduce((sum, a) => sum + a.views, 0),
  };
}

export { MOCK_ARTICLES };
