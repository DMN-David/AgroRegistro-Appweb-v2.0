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
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useAgroData } from '@/context/agro-data-context';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { BananaWrapping } from '@/lib/types';

const formSchema = z.object({
  quantity: z.coerce.number().min(1, 'La cantidad debe ser al menos 1.'),
  unitPrice: z.coerce.number().min(0.01, 'El precio unitario debe ser positivo.'),
  totalPrice: z.coerce.number(),
  wrappingIds: z.array(z.string()).min(1, 'Debe seleccionar al menos un lote.'),
});

export function BananaSaleForm() {
  const { addBananaSale, getAvailableWrappings } = useAgroData();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 0,
      unitPrice: 0,
      totalPrice: 0,
      wrappingIds: [],
    },
  });

  const availableWrappings = getAvailableWrappings();
  const quantity = form.watch('quantity');
  const unitPrice = form.watch('unitPrice');

  useEffect(() => {
    const total = (quantity || 0) * (unitPrice || 0);
    form.setValue('totalPrice', total);
  }, [quantity, unitPrice, form]);

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
            name="wrappingIds"
            render={({ field }) => (
              <FormItem className="lg:col-span-1 flex flex-col">
                <FormLabel>Lotes de Enfundado</FormLabel>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <FormControl>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <span className="truncate">
                        {field.value?.length > 0
                            ? `${field.value.length} lote(s) seleccionado(s)`
                            : 'Seleccione uno o más lotes'}
                        </span>
                      </Button>
                    </FormControl>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="start">
                    {availableWrappings.length > 0 ? (
                      availableWrappings.map((wrapping: BananaWrapping) => (
                        <DropdownMenuCheckboxItem
                          key={wrapping.id}
                          checked={field.value?.includes(wrapping.id)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...(field.value || []), wrapping.id])
                              : field.onChange(field.value?.filter((value) => value !== wrapping.id));
                          }}
                           onSelect={(e) => e.preventDefault()} // Prevent closing on select
                        >
                          cinta {wrapping.color} ({wrapping.quantity} Unidades) - {formatDate(wrapping.date)}  
                        </DropdownMenuCheckboxItem> //mi propia version de como escoger los lotes
                      ))
                     ) : (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">No hay lotes disponibles</div>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
                <FormDescription>Lotes de enfundado vendidos.</FormDescription> 
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
