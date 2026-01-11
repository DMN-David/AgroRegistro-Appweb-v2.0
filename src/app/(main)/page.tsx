'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAgroData } from '@/context/agro-data-context';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Package, DollarSign } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const { bananaWrappings, cacaoSales, bananaSales } = useAgroData();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const totalBananaWrapping = bananaWrappings
    .filter(item => !item.sold)
    .reduce((sum, item) => sum + item.quantity, 0);
    
  const totalCacaoSalesValue = cacaoSales.reduce(
    (sum, item) => sum + item.totalValue,
    0
  );
  const totalBananaSalesValue = bananaSales.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );

  const recentWrappings = bananaWrappings.slice(0, 3);
  const recentCacaoSales = cacaoSales.slice(0, 3);
  const recentBananaSales = bananaSales.slice(0, 3);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-headline text-3xl font-bold tracking-tight">
        Dashboard
      </h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Plátanos Enfundados Disponibles
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isClient ? totalBananaWrapping.toLocaleString() : '...'}
            </div>
            <p className="text-xs text-muted-foreground">
              Unidades disponibles para la venta
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ventas Totales de Cacao
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isClient ? formatCurrency(totalCacaoSalesValue) : '...'}
            </div>
            <p className="text-xs text-muted-foreground">
              Ingresos totales de cacao
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ventas Totales de Plátano
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isClient ? formatCurrency(totalBananaSalesValue) : '...'}
            </div>
            <p className="text-xs text-muted-foreground">
              Ingresos totales de plátano
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>
              Últimos registros añadidos al sistema.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Últimos Enfundados de Plátano</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Cantidad</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentWrappings.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{isClient ? formatDate(item.date) : '...'}</TableCell>
                      <TableCell>
                        <span className="capitalize">{item.color}</span>
                      </TableCell>
                       <TableCell>
                        {item.sold ? 'Vendido' : 'Disponible'}
                      </TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
             <div>
              <h3 className="font-semibold mb-2">Últimas Ventas de Cacao</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead className="text-right">Valor Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentCacaoSales.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{isClient ? formatDate(item.date) : '...'}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell className="text-right">{isClient ? formatCurrency(item.totalValue) : '...'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
             <div>
              <h3 className="font-semibold mb-2">Últimas Ventas de Plátano</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Color Cinta</TableHead>
                    <TableHead>Cantidad (cajas)</TableHead>
                    <TableHead className="text-right">Precio Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentBananaSales.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{isClient ? formatDate(item.date) : '...'}</TableCell>
                       <TableCell>
                        <span className="capitalize">{item.tapeColor}</span>
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell className="text-right">{isClient ? formatCurrency(item.totalPrice) : '...'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
