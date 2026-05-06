-- Ejecutar en Neon: SQL Editor → pegar → Run
-- O: psql "$DATABASE_URL" -f scripts/insert-geely-monjaro.sql
-- Si falla por slug duplicado, cambia slug e id abajo.

INSERT INTO articles (
  id, slug, status, title_es, title_en, excerpt_es, excerpt_en, content_es, content_en,
  cover_image, category, tags, views, specs, versions, ratings, pros_cons, gallery, video_url,
  created_at, updated_at
) VALUES (
  'art_1778030954144',
  'geely-monjaro-2026-resena',
  'published',
  'Geely Monjaro 2026: Lujo y Tecnología en un SUV de Alto Rendimiento',
  'Geely Monjaro 2026: Luxury and Technology in a High-Performance SUV',
  'El Geely Monjaro 2026 redefine el segmento con su motor turbo de 235 HP, interior premium y tecnología avanzada.',
  'The 2026 Geely Monjaro redefines the segment with its 235 HP turbo engine, premium interior, and advanced technology.',
  E'## Introducción\nEl Geely Monjaro 2026 llega al mercado mexicano como un referente de sofisticación. Este SUV combina una estética imponente con un rendimiento mecánico robusto.\n\n## Diseño y Exterior\nCon líneas elegantes y rines de 20 pulgadas, el Monjaro proyecta una presencia sólida. Sus faros LED inteligentes aseguran una visibilidad excepcional.\n\n## Interior y Confort\nLa cabina destaca por el tablero "Infinity Screen" de tres pantallas. Los asientos cuentan con funciones de masaje y ajuste eléctrico, garantizando el máximo confort.\n\n## Motor y Desempeño\nImpulsado por un motor 2.0L Turbo que entrega 235 HP y 350 Nm de torque, acoplado a una caja automática de 8 velocidades y tracción AWD.\n\n## Seguridad y Tecnología\nIntegra 15 sistemas ADAS, incluyendo frenado de emergencia autónomo y monitoreo de punto ciego, asegurando la protección de todos los pasajeros.\n\n## Conclusión\nEl Monjaro es una opción equilibrada para quienes buscan lujo, potencia y seguridad integral.',
  E'## Introduction\nThe 2026 Geely Monjaro arrives in the market as a benchmark for sophistication. This SUV combines imposing aesthetics with robust mechanical performance.\n\n## Design and Exterior\nWith elegant lines and 20-inch wheels, the Monjaro projects a solid presence. Its intelligent LED headlights ensure exceptional visibility.\n\n## Interior and Comfort\nThe cabin stands out for the three-screen "Infinity Screen" dashboard. The seats feature massage functions and electric adjustment, ensuring maximum comfort.\n\n## Engine and Performance\nPowered by a 2.0L Turbo engine delivering 235 HP and 350 Nm of torque, paired with an 8-speed automatic transmission and AWD system.\n\n## Safety and Technology\nIt integrates 15 ADAS systems, including autonomous emergency braking and blind-spot monitoring, ensuring the protection of all passengers.\n\n## Conclusion\nThe Monjaro is a balanced choice for those seeking luxury, power, and comprehensive safety.',
  'https://www.geelymexico.com/content/dam/geely/monjaro.jpg',
  'reviews',
  ARRAY['geely', 'monjaro', 'suv', '2026']::text[],
  0,
  $$
  {
    "engine": "2.0L Turbo",
    "displacement": "1,969 cm3",
    "power": "235 HP @ 5,500 rpm",
    "torque": "350 Nm @ 1,800-4,500 rpm",
    "transmission": "Automática 8 velocidades",
    "drivetrain": "AWD",
    "zeroToHundred": "8.4 s",
    "topSpeed": "215 km/h",
    "fuelConsumption": "13.47 km/l (combinado)",
    "fuelType": "91 octanos",
    "length": "4,770 mm",
    "width": "1,895 mm",
    "height": "1,689 mm",
    "wheelbase": "2,845 mm",
    "weight": "1,770 kg",
    "trunkCapacity": "562 L",
    "safetyRating": "5 estrellas",
    "warranty": "5 años/150k km defensa a defensa, 8 años/250k km tren motriz",
    "infotainment": "Infinity Screen 3 pantallas, Qualcomm Snapdragon 8155",
    "driverAssist": "15 sistemas ADAS"
  }
  $$::jsonb,
  $$
  [
    { "name": "GF", "priceMin": "699990", "priceMax": "699990", "highlights": "Equipamiento completo, AWD, Motor 2.0 Turbo" }
  ]
  $$::jsonb,
  '{"performance": 8, "comfort": 9, "technology": 9, "value": 8, "design": 8, "safety": 9}'::jsonb,
  $$
  {
    "pros": [ { "text": "Motor potente con excelente respuesta" }, { "text": "Interior tecnológico y lujoso" }, { "text": "Garantía extendida en tren motriz" } ],
    "cons": [ { "text": "Consumo de combustible elevado en ciudad" }, { "text": "Dimensiones amplias difíciles de estacionar" } ]
  }
  $$::jsonb,
  '[]'::jsonb,
  NULL,
  NOW(),
  NOW()
);
