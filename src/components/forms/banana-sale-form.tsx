'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAgroData } from '@/context/agro-data-context';
import { formatCurrency } from '@/lib/utils';
import type { BananaWrapping } from '@/lib/types';

const formSchema = z.object({
  quantity: z.coerce.number().min(1, 'La cantidad debe ser al menos 1.'),
  tapeColor: z.string({ required_error: 'Debe seleccionar un color de cinta.' }),
  unitPrice: z.coerce.number().min(0.01, 'El precio unitario debe ser positivo.'),
  totalPrice: z.coerce.number(),
  wrappingId: z.string()
});

export function BananaSaleForm() {
  const { addBananaSale, getAvailableWrappings, bananaWrappings } = useAgroData();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 0,
      unitPrice: 0,
      totalPrice: 0,
    },
  });

  const availableWrappings = getAvailableWrappings();
  const quantity = form.watch('quantity');
  const unitPrice = form.watch('unitPrice');
  const wrappingId = form.watch('wrappingId');

  useEffect(() => {
    const total = (quantity || 0) * (unitPrice || 0);
    form.setValue('totalPrice', total);
  }, [quantity, unitPrice, form]);

  useEffect(() => {
    if (wrappingId) {
        const selectedWrapping = bananaWrappings.find(w => w.id === wrappingId);
        if (selectedWrapping) {
            form.setValue('tapeColor', selectedWrapping.color);
        }
    }
  }, [wrappingId, bananaWrappings, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    addBananaSale(values);
    toast({
      title: 'Venta registrada',
      description: 'La venta de cajas de plátano ha sido guardada.',
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem className="lg:col-span-1">
                <FormLabel>Cantidad (cajas)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 100" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="wrappingId"
            render={({ field }) => (
              <FormItem className="lg:col-span-1">
                <FormLabel>Lote de Enfundado</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un lote" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableWrappings.length > 0 ? (
                      availableWrappings.map((wrapping: BananaWrapping) => (
                        <SelectItem key={wrapping.id} value={wrapping.id}>
                          {wrapping.quantity} Unidades ({wrapping.color})
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="-" disabled>No hay lotes disponibles</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormDescription>Lote de enfundado vendido.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="unitPrice"
            render={({ field }) => (
              <FormItem className="lg:col-span-1">
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
              <FormItem className="lg:col-span-1">
                <FormLabel>Precio Total</FormLabel>
                <FormControl>
                  <Input type="text" readOnly disabled value={formatCurrency(field.value)} className="font-bold"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">Guardar Venta</Button>
      </form>
    </Form>
  );
}
