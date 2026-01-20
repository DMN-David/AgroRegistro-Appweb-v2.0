'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAgroData } from '@/context/agro-data-context';
import { TAPE_COLORS } from '@/lib/data';
import type { BananaWrapping } from '@/lib/types';
import { Timestamp } from 'firebase/firestore';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  date: z.date({ required_error: 'Debe seleccionar una fecha.' }),
  quantity: z.coerce.number().min(1, 'La cantidad debe ser al menos 1.'),
  color: z.string({ required_error: 'Debe seleccionar un color.' }),
  observation: z.string().optional(),
});

interface EditBananaWrappingFormProps {
  wrapping: BananaWrapping;
  setOpen: (open: boolean) => void;
}

export function EditBananaWrappingForm({ wrapping, setOpen }: EditBananaWrappingFormProps) {
  const { updateBananaWrapping } = useAgroData();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: wrapping.date instanceof Timestamp ? wrapping.date.toDate() : new Date(wrapping.date),
      quantity: wrapping.quantity,
      color: wrapping.color,
      observation: wrapping.observation || '', 
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await updateBananaWrapping(wrapping.id, values);
    toast({
      title: 'Registro actualizado',
      description: 'El enfundado de plátano ha sido actualizado.',
    });
    setOpen(false);
    form.reset();
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
                <FormLabel>Fecha de Registro</FormLabel>
                <FormControl>
                   <Input
                      type="date"
                      value={field.value ? formatDateForInput(field.value) : ''}
                      onChange={(e) => {
                        const dateValue = e.target.value;
                        // The value from input type=date is in 'yyyy-mm-dd' string format.
                        // We need to convert it to a Date object, accounting for timezone.
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
                <FormLabel>Cantidad</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 150" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color de Cinta</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un color" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {TAPE_COLORS.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      {color.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="observation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observación</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Añada cualquier nota relevante..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button type="submit">Guardar Cambios</Button>
        </div>
      </form>
    </Form>
  );
}
