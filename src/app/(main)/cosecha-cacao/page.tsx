import { CacaoSaleForm } from "@/components/forms/cacao-sale-form";
import { CacaoSalesTable } from "@/components/tables/cacao-sales-table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function CacaoSalePage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-headline text-3xl font-bold tracking-tight">
        Registro de Cosecha y Venta de Cacao
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Nueva Venta</CardTitle>
          <CardDescription>
            Añada los detalles de la nueva venta de cacao.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CacaoSaleForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Historial de Ventas de Cacao</CardTitle>
            <CardDescription>
                Listado de las últimas ventas de cacao registradas.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <CacaoSalesTable />
        </CardContent>
      </Card>
    </div>
  );
}
