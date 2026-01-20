
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useEffect } from 'react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAgroData } from '@/context/agro-data-context';
import { formatCurrency } from '@/lib/utils';
import type { BananaSale } from '@/lib/types';
import { Timestamp } from 'firebase/firestore';
import { Label } from '../ui/label';

const formSchema = z.object({
  date: z.date({ required_error: 'Debe seleccionar una fecha.' }),
  quantity: z.coerce.number().min(1, 'La cantidad debe ser al menos 1.'),
  tapeColor: z.string(),
  unitPrice: z.coerce.number().min(0.01, 'El precio unitario debe ser positivo.'),
  totalPrice: z.coerce.number(),
});

interface EditBananaSaleFormProps {
  sale: BananaSale;
  setOpen: (open: boolean) => void;
}

export function EditBananaSaleForm({ sale, setOpen }: EditBananaSaleFormProps) {
  const { updateBananaSale } = useAgroData();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: sale.date instanceof Timestamp ? sale.date.toDate() : new Date(sale.date),
      quantity: sale.quantity,
      tapeColor: sale.tapeColor,
      unitPrice: sale.unitPrice,
      totalPrice: sale.totalPrice,
    },
  });

  const quantity = form.watch('quantity');
  const unitPrice = form.watch('unitPrice');

  useEffect(() => {
    const total = (quantity || 0) * (unitPrice || 0);
    form.setValue('totalPrice', total);
  }, [quantity, unitPrice, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await updateBananaSale(sale.id, values);
    toast({
      title: 'Venta actualizada',
      description: 'La venta de plátano ha sido actualizada.',
    });
    setOpen(false);
  }

  const formatDateForInput = (date: Date): string => {
    try {
      return format(date, 'yyyy-MM-dd');
    } catch (error) {
      return '';
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha de Venta</FormLabel>
                <FormControl>
                    <Input
                      type="date"
                      value={field.value ? formatDateForInput(field.value) : ''}
                      onChange={(e) => {
                        const dateValue = e.target.value;
                        const date = new Date(dateValue + 'T00:00:00');
                        field.onChange(date);
                      }}
                      className="w-full"
                    />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cantidad (cajas)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 100" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='space-y-2'>
            <Label>Color de Cinta</Label>
            <Input type="text" readOnly disabled value={sale.tapeColor} className="capitalize font-bold"/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="unitPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio Unitario ($)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="e.g., 10.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="totalPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio Total</FormLabel>
                <FormControl>
                  <Input type="text" readOnly disabled value={formatCurrency(field.value)} className="font-bold"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button type="submit">Guardar Cambios</Button>
        </div>
      </form>
    </Form>
  );
}

    