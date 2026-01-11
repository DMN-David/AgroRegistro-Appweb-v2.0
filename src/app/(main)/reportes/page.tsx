
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Download } from 'lucide-react';
import { format, startOfMonth } from 'date-fns';
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
  const [month, setMonth] = useState<Date>(startOfMonth(new Date()));
  const { bananaWrappings, cacaoSales, bananaSales, fertilizerApplications } = useAgroData();

  const generatePDF = () => {
    const doc = new jsPDF() as jsPDFWithAutoTable;
    const selectedMonth = month.getMonth();
    const selectedYear = month.getFullYear();

    const monthName = format(month, 'MMMM yyyy', { locale: es });

    doc.text(`Reporte de Registros - ${monthName}`, 14, 16);

    const filterByMonth = (item: { date: Date | string }) => {
      const itemDate = typeof item.date === 'string' ? new Date(item.date) : item.date;
      return itemDate.getMonth() === selectedMonth && itemDate.getFullYear() === selectedYear;
    };
    
    // Banana Wrappings
    const filteredWrappings = bananaWrappings.filter(filterByMonth);
    if (filteredWrappings.length > 0) {
      doc.text("Enfundados de Plátano", 14, doc.autoTable.previous.finalY + 15);
      doc.autoTable({
        startY: doc.autoTable.previous.finalY + 20,
        head: [['Fecha', 'Color Cinta', 'Cantidad', 'Estado']],
        body: filteredWrappings.map((item: BananaWrapping) => [
          formatDate(item.date),
          item.color,
          item.quantity,
          item.sold ? 'Vendido' : 'Disponible',
        ]),
      });
    }
    
    // Cacao Sales
    const filteredCacaoSales = cacaoSales.filter(filterByMonth);
    if(filteredCacaoSales.length > 0) {
        doc.text("Ventas de Cacao", 14, doc.autoTable.previous.finalY + 10);
        doc.autoTable({
            startY: doc.autoTable.previous.finalY + 15,
            head: [['Fecha', 'Cantidad (kg)', 'Valor Unitario', 'Valor Total']],
            body: filteredCacaoSales.map((item: CacaoSale) => [
                formatDate(item.date),
                item.quantity,
                formatCurrency(item.unitPrice),
                formatCurrency(item.totalValue),
            ]),
        });
    }

    // Banana Sales
    const filteredBananaSales = bananaSales.filter(filterByMonth);
    if(filteredBananaSales.length > 0) {
        doc.text("Ventas de Plátano", 14, doc.autoTable.previous.finalY + 10);
        doc.autoTable({
            startY: doc.autoTable.previous.finalY + 15,
            head: [['Fecha', 'Color Cinta', 'Cantidad (cajas)', 'Precio Total']],
            body: filteredBananaSales.map((item: BananaSale) => [
                formatDate(item.date),
                item.tapeColor,
                item.quantity,
                formatCurrency(item.totalPrice),
            ]),
        });
    }

    // Fertilizer Applications
    const filteredFertilizers = fertilizerApplications.filter(filterByMonth);
     if(filteredFertilizers.length > 0) {
        doc.text("Aplicaciones de Fertilizante", 14, doc.autoTable.previous.finalY + 10);
        doc.autoTable({
            startY: doc.autoTable.previous.finalY + 15,
            head: [['Fecha', 'Tipo', 'Cantidad', 'Notas']],
            body: filteredFertilizers.map((item: FertilizerApplication) => [
                formatDate(item.date),
                item.fertilizerType,
                item.quantity,
                item.notes || '',
            ]),
        });
    }


    doc.save(`reporte_${format(month, 'yyyy_MM')}.pdf`);
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-headline text-3xl font-bold tracking-tight">
        Generar Reportes
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Seleccionar Mes</CardTitle>
          <CardDescription>
            Elija el mes para el cual desea generar el reporte en PDF.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className="w-[280px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(month, 'MMMM yyyy', { locale: es })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={month}
                onSelect={(day) => day && setMonth(startOfMonth(day))}
                locale={es}
                initialFocus
                captionLayout="dropdown-buttons" 
                fromYear={2020} 
                toYear={2030}
              />
            </PopoverContent>
          </Popover>
          <Button onClick={generatePDF}>
            <Download className="mr-2 h-4 w-4" />
            Descargar PDF
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
