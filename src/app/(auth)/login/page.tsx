import { redirect } from "next/navigation";

type Props = { searchParams: Promise<{ from?: string; error?: string }> };

export default async function LoginFallback({ searchParams }: Props) {
  const params = await searchParams;
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v != null) as [string, string][]
  ).toString();
  redirect(`/en-US/login${qs ? `?${qs}` : ""}`);
}
