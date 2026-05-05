import type { Metadata } from "next";
import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/session";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = { title: "Ajustes" };

export default async function SettingsPage() {
  const session = await getSession();

  return (
    <>
      <DashboardHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Ajustes" },
        ]}
      />
      <main className="flex-1 overflow-auto p-6 max-w-xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Perfil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Nombre</span>
              <span className="text-sm font-medium">{session?.name ?? "—"}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="text-sm font-medium">{session?.email ?? "—"}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Rol</span>
              <Badge variant="outline" className="text-xs capitalize">
                {session?.role ?? "admin"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sesión</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Sesión activa hasta:{" "}
              <span className="text-foreground font-medium">
                {session?.expiresAt
                  ? new Date(session.expiresAt).toLocaleDateString("es-MX", {
                      dateStyle: "long",
                    })
                  : "—"}
              </span>
            </p>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
