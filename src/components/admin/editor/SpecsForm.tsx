"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { ArticleSpecs } from "@/lib/definitions";

type Props = { defaultValue?: Partial<ArticleSpecs> };

const SECTIONS = [
  {
    title: "Motor",
    fields: [
      { key: "engine", label: "Motor" },
      { key: "displacement", label: "Cilindrada" },
      { key: "power", label: "Potencia" },
      { key: "torque", label: "Torque" },
      { key: "transmission", label: "Transmisión" },
      { key: "drivetrain", label: "Tracción" },
    ],
  },
  {
    title: "Desempeño",
    fields: [
      { key: "zeroToHundred", label: "0–100 km/h" },
      { key: "topSpeed", label: "Velocidad máxima" },
      { key: "fuelConsumption", label: "Consumo (L/100km)" },
      { key: "fuelType", label: "Combustible" },
    ],
  },
  {
    title: "Dimensiones",
    fields: [
      { key: "length", label: "Largo (mm)" },
      { key: "width", label: "Ancho (mm)" },
      { key: "height", label: "Alto (mm)" },
      { key: "wheelbase", label: "Distancia entre ejes (mm)" },
      { key: "weight", label: "Peso (kg)" },
      { key: "trunkCapacity", label: "Cajuela (L)" },
    ],
  },
  {
    title: "Tecnología y seguridad",
    fields: [
      { key: "safetyRating", label: "Calificación de seguridad" },
      { key: "warranty", label: "Garantía" },
      { key: "infotainment", label: "Pantalla / sistema" },
      { key: "driverAssist", label: "Asistencias de manejo" },
    ],
  },
] as const;

export function SpecsForm({ defaultValue = {} }: Props) {
  const [specs, setSpecs] = useState<Partial<ArticleSpecs>>(defaultValue);

  function update(key: keyof ArticleSpecs, value: string) {
    setSpecs((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="space-y-6">
      <input type="hidden" name="specs" value={JSON.stringify(specs)} />

      {SECTIONS.map((section, si) => (
        <div key={section.title}>
          {si > 0 && <Separator className="mb-6" />}
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            {section.title}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
            {section.fields.map(({ key, label }) => (
              <div key={key} className="space-y-1">
                <Label className="text-xs">{label}</Label>
                <Input
                  value={specs[key as keyof ArticleSpecs] ?? ""}
                  onChange={(e) => update(key as keyof ArticleSpecs, e.target.value)}
                  placeholder="—"
                  className="h-8 text-sm"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
