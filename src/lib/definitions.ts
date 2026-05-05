import { z } from "zod/v4";

export const LoginSchema = z.object({
  email: z.email({ error: "Email inválido." }).trim(),
  password: z.string().min(1, { error: "Contraseña requerida." }),
});

export const RegisterSchema = z.object({
  name: z.string().min(2, { error: "Nombre debe tener al menos 2 caracteres." }).trim(),
  email: z.email({ error: "Email inválido." }).trim(),
  password: z
    .string()
    .min(8, { error: "Mínimo 8 caracteres." })
    .regex(/[a-zA-Z]/, { error: "Debe contener al menos una letra." })
    .regex(/[0-9]/, { error: "Debe contener al menos un número." }),
});

export const ArticleSchema = z.object({
  slug: z
    .string()
    .min(3, { error: "Slug debe tener al menos 3 caracteres." })
    .regex(/^[a-z0-9-]+$/, { error: "Solo letras minúsculas, números y guiones." })
    .trim(),
  status: z.enum(["draft", "published"]),
  titleEs: z.string().min(5, { error: "Título en español requerido." }).trim(),
  titleEn: z.string().min(5, { error: "Title in English required." }).trim(),
  excerptEs: z.string().max(300).trim().optional(),
  excerptEn: z.string().max(300).trim().optional(),
  contentEs: z.string().min(10, { error: "Contenido en español requerido." }),
  contentEn: z.string().min(10, { error: "Content in English required." }),
  coverImage: z.string().optional(),
  category: z.string().min(1, { error: "Categoría requerida." }),
  tags: z.string().optional(),
  // Structured data stored as JSON strings from hidden inputs
  specs: z.string().optional(),
  versions: z.string().optional(),
  ratings: z.string().optional(),
  prosCons: z.string().optional(),
  gallery: z.string().optional(),
  videoUrl: z.string().optional(),
});

export type LoginFormState = {
  errors?: { email?: string[]; password?: string[] };
  message?: string;
};

export type RegisterFormState = {
  errors?: { name?: string[]; email?: string[]; password?: string[] };
  message?: string;
};

export type ArticleFormState = {
  errors?: Partial<Record<keyof z.infer<typeof ArticleSchema>, string[]>>;
  message?: string;
  success?: boolean;
  articleId?: string;
};

export type ArticleStatus = "draft" | "published";

// ── Structured blocks ────────────────────────────────────────────────────────

export type ArticleSpecs = {
  // Engine
  engine: string;
  displacement: string;
  power: string;
  torque: string;
  transmission: string;
  drivetrain: string;
  // Performance
  zeroToHundred: string;
  topSpeed: string;
  fuelConsumption: string;
  fuelType: string;
  // Dimensions
  length: string;
  width: string;
  height: string;
  wheelbase: string;
  weight: string;
  trunkCapacity: string;
  // Tech & Safety
  safetyRating: string;
  warranty: string;
  infotainment: string;
  driverAssist: string;
};

export type ArticleVersion = {
  name: string;
  priceMin: string;
  priceMax: string;
  highlights: string;
};

export type ArticleRatings = {
  performance: number;
  comfort: number;
  technology: number;
  value: number;
  design: number;
  safety: number;
};

export type ProConItem = { text: string };

export type ArticleProsCons = {
  pros: ProConItem[];
  cons: ProConItem[];
};

export type ArticleGalleryImage = {
  url: string;
  caption: string;
};

export type Article = {
  id: string;
  slug: string;
  status: ArticleStatus;
  titleEs: string;
  titleEn: string;
  excerptEs: string;
  excerptEn: string;
  contentEs: string;
  contentEn: string;
  coverImage?: string;
  category: string;
  tags: string[];
  views: number;
  createdAt: string;
  updatedAt: string;
  // Structured blocks (optional)
  specs?: Partial<ArticleSpecs>;
  versions?: ArticleVersion[];
  ratings?: Partial<ArticleRatings>;
  prosCons?: ArticleProsCons;
  gallery?: ArticleGalleryImage[];
  videoUrl?: string;
};

export type UserRole = "admin" | "user";

export type SessionPayload = {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  expiresAt: Date;
};
