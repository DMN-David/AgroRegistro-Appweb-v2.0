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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { Bar, BarChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { useAgroData } from '@/context/agro-data-context';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Package, DollarSign } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { startOfMonth, subMonths, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

export default function DashboardPage() {
  const { bananaWrappings, cacaoSales, bananaSales } = useAgroData();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const totalBananaWrapping = useMemo(() =>
    bananaWrappings
      .filter(item => !item.sold)
      .reduce((sum, item) => sum + item.quantity, 0), [bananaWrappings]);

  const totalCacaoSalesValue = useMemo(() => cacaoSales.reduce(
    (sum, item) => sum + item.totalValue,
    0
  ), [cacaoSales]);

  const totalBananaSalesValue = useMemo(() => bananaSales.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  ), [bananaSales]);

  const recentWrappings = useMemo(() => bananaWrappings.slice(0, 3), [bananaWrappings]);
  const recentCacaoSales = useMemo(() => cacaoSales.slice(0, 3), [cacaoSales]);
  const recentBananaSales = useMemo(() => bananaSales.slice(0, 3), [bananaSales]);

  const monthlyChartData = useMemo(() => {
    if (!isClient) return [];

    const allSales = [
      ...cacaoSales.map(s => ({ date: s.date, total: s.totalValue })),
      ...bananaSales.map(s => ({ date: s.date, total: s.totalPrice })),
    ];

    const last6Months = Array.from({ length: 6 }, (_, i) => subMonths(startOfMonth(new Date()), i));

    const data = last6Months.map(monthDate => {
      const monthKey = format(monthDate, 'yyyy-MM');
      const monthName = format(monthDate, 'MMM', { locale: es });

      const total = allSales
        .filter(sale => format(new Date(sale.date), 'yyyy-MM') === monthKey)
        .reduce((sum, sale) => sum + sale.total, 0);

      return { month: monthName.charAt(0).toUpperCase() + monthName.slice(1), total };
    }).reverse();

    return data;
  }, [cacaoSales, bananaSales, isClient]);

  const distributionChartData = useMemo(() => {
    if (!isClient) return [];

    return [
      { product: 'Cacao', value: totalCacaoSalesValue, fill: 'hsl(var(--chart-1))' },
      { product: 'Plátano', value: totalBananaSalesValue, fill: 'hsl(var(--chart-2))' },
    ].filter(d => d.value > 0);
  }, [totalCacaoSalesValue, totalBananaSalesValue, isClient]);

  const chartConfig = {
    total: {
      label: 'Ingresos',
      color: 'hsl(var(--chart-1))',
    },
    cacao: {
      label: 'Cacao',
      color: 'hsl(var(--chart-1))',
    },
    platano: {
      label: 'Plátano',
      color: 'hsl(var(--chart-2))',
    },
  };


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
                    <TableHead>Colores Cinta</TableHead>
                    <TableHead>Cantidad (cajas)</TableHead>
                    <TableHead className="text-right">Precio Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentBananaSales.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{isClient ? formatDate(item.date) : '...'}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {item.tapeColors.map(color => (
                            <Badge key={color} variant="secondary" className="capitalize">{color}</Badge>
                          ))}
                        </div>
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

        <Card>
          <CardHeader>
            <CardTitle>Visualización de Ingresos</CardTitle>
            <CardDescription>
              Un resumen gráfico de los ingresos en los últimos 6 meses y la distribución por producto.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <h3 className="font-semibold mb-4">Ingresos Mensuales (Últimos 6 Meses)</h3>
              {isClient && monthlyChartData.length > 0 ? (
                <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                  <BarChart accessibilityLayer data={monthlyChartData}>
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <YAxis
                      tickFormatter={(value) => formatCurrency(Number(value))}
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />}
                    />
                    <Bar dataKey="total" fill="var(--color-total)" radius={4} />
                  </BarChart>
                </ChartContainer>
              ) : (
                <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                  No hay datos de ventas para mostrar.
                </div>
              )}
            </div>
            <div className="lg:col-span-2">
              <h3 className="font-semibold mb-4">Distribución de Ingresos</h3>
              {isClient && distributionChartData.length > 0 ? (
                <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                  <PieChart accessibilityLayer>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel formatter={(value, name, item) => (
                        `${item.payload.product}: ${formatCurrency(Number(value))}`
                      )} />}
                    />
                    <Pie
                      data={distributionChartData}
                      dataKey="value"
                      nameKey="product"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      strokeWidth={2}
                    />
                    <ChartLegend content={<ChartLegendContent />} />
                  </PieChart>
                </ChartContainer>
              ) : (
                <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                  No hay datos de ventas para mostrar.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
