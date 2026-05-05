import { redirect } from "next/navigation";

type Props = { searchParams: Promise<{ from?: string }> };

export default async function RegisterFallback({ searchParams }: Props) {
  const params = await searchParams;
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v != null) as [string, string][]
  ).toString();
  redirect(`/en-US/register${qs ? `?${qs}` : ""}`);
}
