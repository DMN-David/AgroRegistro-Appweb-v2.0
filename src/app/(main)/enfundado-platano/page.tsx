import { BananaWrappingForm } from "@/components/forms/banana-wrapping-form";
import { BananaWrappingsTable } from "@/components/tables/banana-wrappings-table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function BananaWrappingPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-headline text-3xl font-bold tracking-tight">
        Registro de Enfundado de Plátano
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Nuevo Registro</CardTitle>
          <CardDescription>
            Añada los detalles del nuevo lote de plátanos enfundados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BananaWrappingForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Historial de Enfundados</CardTitle>
            <CardDescription>
                Listado de los últimos registros de plátanos enfundados.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <BananaWrappingsTable />
        </CardContent>
      </Card>
    </div>
  );
}
