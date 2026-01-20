'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download } from 'lucide-react';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAgroData } from '@/context/agro-data-context';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { BananaWrapping, CacaoSale, BananaSale, FertilizerApplication } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { UserOptions } from 'jspdf-autotable';

interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: UserOptions) => jsPDF;
}

export default function ReportesPage() {
  const [startDate, setStartDate] = useState<Date>(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState<Date>(endOfMonth(new Date()));
  const { bananaWrappings, cacaoSales, bananaSales, fertilizerApplications } = useAgroData();

  const generatePDF = () => {
    if (!startDate || !endDate) {
      alert("Por favor seleccione un rango de fechas válido.");
      return;
    }

    const doc = new jsPDF() as jsPDFWithAutoTable;
    /*   const [year, monthNum] = selectedMonth.split('-').map(Number);
       const reportDate = new Date(year, monthNum - 1, 1);
   
       const monthName = format(reportDate, 'MMMM yyyy', { locale: es }); */

    doc.setFontSize(18);
    doc.text(`Reporte del ${formatDate(startDate)} al ${formatDate(endDate)}`, 14, 22);
    doc.setFontSize(11);

    let cursorY = 30;

    const filterByDateRange = (item: { date: Date | string }) => {
      const itemDate = new Date(item.date);
      itemDate.setHours(0, 0, 0, 0);
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Include the whole end day
      return itemDate >= start && itemDate <= end;
    };

    // Banana Wrappings
    const filteredWrappings = bananaWrappings.filter(filterByDateRange).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    if (filteredWrappings.length > 0) {
      const totalWrappings = filteredWrappings.reduce((sum, item) => sum + item.quantity, 0);
      doc.setFontSize(14);
      doc.text("Enfundados de Plátano", 14, cursorY);
      cursorY += 7;
      doc.autoTable({
        startY: cursorY,
        head: [['Fecha', 'Color Cinta', 'Observación', 'Cantidad', 'Estado']],
        body: filteredWrappings.map((item: BananaWrapping) => [
          formatDate(item.date),
          item.color,
          item.observation || '',
          item.quantity,
          item.sold ? 'Vendido' : 'Disponible',
        ]),
        foot: [['Total de Enfundes', '', '', totalWrappings.toString(), '']],
        footStyles: { fontStyle: 'bold' },
      });
      cursorY = doc.autoTable.previous.finalY + 10;
    }

    // Cacao Sales
    const filteredCacaoSales = cacaoSales.filter(filterByDateRange).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    if (filteredCacaoSales.length > 0) {
      const totalCacaoQuantity = filteredCacaoSales.reduce((sum, item) => sum + item.quantity, 0);
      const totalCacaoValue = filteredCacaoSales.reduce((sum, item) => sum + item.totalValue, 0);
      doc.setFontSize(14);
      doc.text("Ventas de Cacao", 14, cursorY);
      cursorY += 7;
      doc.autoTable({
        startY: cursorY,
        head: [['Fecha', 'Cantidad (L)', 'Valor Unitario', 'Valor Total']],
        body: filteredCacaoSales.map((item: CacaoSale) => [
          formatDate(item.date),
          item.quantity,
          formatCurrency(item.unitPrice),
          formatCurrency(item.totalValue),
        ]),
        foot: [['Total', `${totalCacaoQuantity.toFixed(2)} L`, '', formatCurrency(totalCacaoValue)]],
        footStyles: { fontStyle: 'bold' },
      });
      cursorY = doc.autoTable.previous.finalY + 10;
    }

    // Banana Sales
    const filteredBananaSales = bananaSales.filter(filterByDateRange).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    if (filteredBananaSales.length > 0) {
      const totalBananaQuantity = filteredBananaSales.reduce((sum, item) => sum + item.quantity, 0);
      const totalBananaValue = filteredBananaSales.reduce((sum, item) => sum + item.totalPrice, 0);
      doc.setFontSize(14);
      doc.text("Ventas de Plátano", 14, cursorY);
      cursorY += 7;
      doc.autoTable({
        startY: cursorY,
        head: [['Fecha', 'Color Cinta', 'Cantidad (cajas)', 'Precio Total']],
        body: filteredBananaSales.map((item: BananaSale) => [
          formatDate(item.date),
          item.tapeColor,
          item.quantity,
          formatCurrency(item.totalPrice),
        ]),
        foot: [['Total', '', `${totalBananaQuantity} cajas`, formatCurrency(totalBananaValue)]],
        footStyles: { fontStyle: 'bold' },
      });
      cursorY = doc.autoTable.previous.finalY + 10;
    }

    // Fertilizer Applications
    const filteredFertilizers = fertilizerApplications.filter(filterByDateRange).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    if (filteredFertilizers.length > 0) {
      const totalFertilizerQuantity = filteredFertilizers.reduce((sum, item) => sum + item.quantity, 0);
      doc.setFontSize(14);
      doc.text("Aplicaciones de Fertilizante", 14, cursorY);
      cursorY += 7;
      doc.autoTable({
        startY: cursorY,
        head: [['Fecha', 'Tipo', 'Cantidad (L)', 'Notas']],
        body: filteredFertilizers.map((item: FertilizerApplication) => [
          formatDate(item.date),
          item.fertilizerType,
          item.quantity,
          item.notes || '',
        ]),
        foot: [['Total', '', `${totalFertilizerQuantity.toFixed(2)}`, '']],
        footStyles: { fontStyle: 'bold' },
      });
      cursorY = doc.autoTable.previous.finalY + 10;
    }

    if (cursorY === 30) {
      doc.text("No hay registros para el rango de fechas seleccionado.", 14, cursorY);
    }

    doc.save(`reporte_${format(startDate, 'yyyy-MM-dd')}_a_${format(endDate, 'yyyy-MM-dd')}.pdf`);
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-headline text-3xl font-bold tracking-tight">
        Generar Reportes
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Seleccionar Rango de Fechas</CardTitle>
          <CardDescription>
            Elija el rango de fechas para el cual desea generar el reporte en PDF.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Label htmlFor="start-date">Desde</Label>
            <Input
                id="start-date"
                type="date"
                value={format(startDate, 'yyyy-MM-dd')}
                onChange={(e) => setStartDate(new Date(e.target.value + 'T00:00:00'))}
                className="w-auto"
            />
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="end-date">Hasta</Label>
            <Input
                id="end-date"
                type="date"
                value={format(endDate, 'yyyy-MM-dd')}
                onChange={(e) => setEndDate(new Date(e.target.value + 'T00:00:00'))}
                className="w-auto"
            />
          </div>
          <Button onClick={generatePDF}>
            <Download className="mr-2 h-4 w-4" />
            Descargar PDF
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}