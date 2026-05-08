INSERT INTO articles (
  id, slug, status, title_es, title_en, excerpt_es, excerpt_en, content_es, content_en, 
  cover_image, category, tags, views, specs, versions, ratings, pros_cons, gallery, video_url, 
  created_at, updated_at
) VALUES (
  'art_1746600000000',
  'volkswagen-tiguan-2026-resena',
  'published',
  'Volkswagen Tiguan 2026: Renovación total para la familia y la tecnología',
  '2026 Volkswagen Tiguan: Total renewal for family and technology',
  'Descubre la nueva generación del VW Tiguan 2026, destacando por su pantalla flotante de 15 pulgadas, motor 1.4L TSI y máximo nivel de seguridad.',
  'Discover the new generation of the 2026 VW Tiguan, featuring a 15-inch floating screen, a 1.4L TSI engine, and top-tier safety standards.',
  '## Introducción\nLa Volkswagen Tiguan 2026 llega para redefinir los viajes familiares, combinando un diseño moderno con un nivel de digitalización sin precedentes en su categoría.\n\n## Diseño Exterior\nEl exterior ha sido estilizado para ser más aerodinámico y elegante. Destacan sus faros Matrix LED con direccionales dinámicas y opciones de rines de aluminio que van desde las 17 hasta las 20 pulgadas en la versión R-Line.\n\n## Interior y Confort\nEl interior da un salto al futuro. Incorpora el Volkswagen Digital Cockpit de nueva generación y una enorme pantalla táctil flotante que puede ser de 12.9 hasta 15 pulgadas. Añade techo panorámico, asientos en leatherette y, en versiones tope, un sistema de sonido Harman/Kardon de 12 bocinas.\n\n## Manejo y Motor\nConserva el confiable motor 1.4 L TSI que entrega 150 caballos de fuerza y 250 Nm de torque, acoplado a una rápida transmisión DSG de 7 velocidades, ideal para una conducción fluida tanto en ciudad como en carretera.\n\n## Consumo\nLa marca declara un rendimiento de combustible combinado de 15.3 km/l, una cifra competitiva para un SUV de sus dimensiones.\n\n## Seguridad\nGalardonada con 5 estrellas en Latin NCAP, cuenta con 6 bolsas de aire y un robusto paquete de asistentes a la conducción (ADAS) que incluye Control Crucero Adaptativo (ACC), Asistente de Mantenimiento de Carril, y frenado de emergencia frontal.\n\n## Conclusión\nLa Tiguan 2026 es la opción perfecta para quienes buscan un SUV seguro, espacioso y altamente tecnológico, respaldado por la tradición y calidad de ensamble de Volkswagen.',
  '## Introduction\nThe 2026 Volkswagen Tiguan arrives to redefine family trips, combining modern design with an unprecedented level of digitization in its category.\n\n## Exterior Design\nThe exterior has been stylized to be more aerodynamic and elegant. Highlights include Matrix LED headlights with dynamic turn signals and alloy wheel options ranging from 17 to 20 inches on the R-Line trim.\n\n## Interior and Comfort\nThe interior leaps into the future. It incorporates the new generation Volkswagen Digital Cockpit and a massive floating touchscreen ranging from 12.9 to 15 inches. It adds a panoramic sunroof, leatherette seating, and in top trims, a 12-speaker Harman/Kardon sound system.\n\n## Driving and Engine\nIt retains the reliable 1.4L TSI engine delivering 150 horsepower and 250 Nm of torque, mated to a quick-shifting 7-speed DSG transmission, ideal for smooth driving in both city and highway conditions.\n\n## Fuel Consumption\nThe brand claims a combined fuel efficiency of 15.3 km/l, a competitive figure for an SUV of its size.\n\n## Safety\nAwarded 5 stars by Latin NCAP, it features 6 airbags and a robust suite of Advanced Driver Assistance Systems (ADAS) including Adaptive Cruise Control (ACC), Lane Assist, and Frontal Emergency Braking.\n\n## Conclusion\nThe 2026 Tiguan is the perfect choice for those looking for a safe, spacious, and highly technological SUV, backed by Volkswagen’s tradition and build quality.',
  'https://www.vw.com.mx/idhub/content/dam/vw-ngw/vw_pkw/importers/mx/models/tiguan-2025/1920x1080_tiguan_exterior_2025.jpg',
  'reviews',
  ARRAY['volkswagen', 'tiguan', 'suv', '2026', 'familiar']::text[],
  0,
  $$
  {
    "engine": "1.4L TSI",
    "displacement": "",
    "power": "150 Hp",
    "torque": "250 Nm",
    "transmission": "DSG 7 velocidades",
    "drivetrain": "",
    "zeroToHundred": "",
    "topSpeed": "",
    "fuelConsumption": "15.3 km/l",
    "fuelType": "Gasolina",
    "length": "",
    "width": "",
    "height": "",
    "wheelbase": "",
    "weight": "",
    "trunkCapacity": "",
    "safetyRating": "5 Estrellas Latin NCAP",
    "warranty": "5 años o 100,000 km",
    "infotainment": "Pantalla flotante de hasta 15\", Wireless App-Connect, VW Digital Cockpit",
    "driverAssist": "Travel Assist, ACC, Lane Assist, Frenado de emergencia, Cámara 360"
  }
  $$::jsonb,
  $$
  [
    { "name": "Trendline", "priceMin": "613190", "priceMax": "613190", "highlights": "Rines 17\", Pantalla 12.9\", Digital Cockpit, Motor 1.4 TSI" },
    { "name": "Comfortline", "priceMin": "694290", "priceMax": "694290", "highlights": "Rines 18\", Techo panorámico, Asientos leatherette, Wireless App-Connect" },
    { "name": "R-Line", "priceMin": "795790", "priceMax": "795790", "highlights": "Rines 20\", Pantalla 15\" con Harman/Kardon, Detalles R-Line, Cámara 360" }
  ]
  $$::jsonb,
  '{ "performance": 7, "comfort": 9, "technology": 9, "value": 8, "design": 8, "safety": 10 }'::jsonb,
  $$
  {
    "pros": [
      { "text": "Excelente nivel de seguridad de serie (5 estrellas Latin NCAP)" },
      { "text": "Sistema de infoentretenimiento masivo y avanzado" },
      { "text": "Transmisión DSG muy eficiente" }
    ],
    "cons": [
      { "text": "Motor 1.4 TSI empieza a sentirse justo para el segmento" },
      { "text": "Salto de precio considerable hacia la versión R-Line" }
    ]
  }
  $$::jsonb,
  '[]'::jsonb,
  NULL,
  NOW(),
  NOW()
);
