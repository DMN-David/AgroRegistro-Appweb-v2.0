import { BananaSaleForm } from "@/components/forms/banana-sale-form";
import { BananaSalesTable } from "@/components/tables/banana-sales-table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function BananaSalePage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-headline text-3xl font-bold tracking-tight">
        Registro de Venta de Cajas de Plátano
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Nueva Venta</CardTitle>
          <CardDescription>
            Añada los detalles de la nueva venta de cajas de plátano.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BananaSaleForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Ventas de Plátano</CardTitle>
          <CardDescription>
            Listado de las últimas ventas de plátano registradas.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <BananaSalesTable />
        </CardContent>
      </Card>
    </div>
  );
}
