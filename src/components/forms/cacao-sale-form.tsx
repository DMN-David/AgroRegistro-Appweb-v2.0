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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAgroData } from '@/context/agro-data-context';
import { formatCurrency } from '@/lib/utils';

const formSchema = z.object({
  quantity: z.coerce.number().min(1, 'La cantidad debe ser al menos 1.'),
  unitPrice: z.coerce.number().min(0.01, 'El precio unitario debe ser positivo.'),
  totalValue: z.coerce.number(),
  description: z.string().optional(),
});

export function CacaoSaleForm() {
  const { addCacaoSale } = useAgroData();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 0,
      unitPrice: 0,
      totalValue: 0,
      description: '',
    },
  });

  const quantity = form.watch('quantity');
  const unitPrice = form.watch('unitPrice');

  useEffect(() => {
    const total = (quantity || 0) * (unitPrice || 0);
    form.setValue('totalValue', total);
  }, [quantity, unitPrice, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    addCacaoSale(values);
    toast({
      title: 'Venta registrada',
      description: 'La venta de cacao ha sido guardada.',
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cantidad (kg)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 50" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="unitPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor Unitario ($)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="e.g., 2.50" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="totalValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor Total</FormLabel>
                <FormControl>
                  <Input type="text" readOnly disabled value={formatCurrency(field.value)} className="font-bold" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descripción de la venta, cliente, etc."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Guardar Venta</Button>
      </form>
    </Form>
  );
}
