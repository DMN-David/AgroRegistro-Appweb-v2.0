
import { FertilizerForm } from "@/components/forms/fertilizer-form";
import { FertilizersTable } from "@/components/tables/fertilizers-table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function FertilizerPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-headline text-3xl font-bold tracking-tight">
        Registro de Fertilización
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Nueva Aplicación</CardTitle>
          <CardDescription>
            Añada los detalles de la nueva aplicación de fertilizante.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FertilizerForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Historial de Aplicaciones</CardTitle>
            <CardDescription>
                Listado de las últimas aplicaciones de fertilizante.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <FertilizersTable />
        </CardContent>
      </Card>
    </div>
  );
}
