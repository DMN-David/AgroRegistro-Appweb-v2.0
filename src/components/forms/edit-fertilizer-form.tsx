
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
import type { FertilizerApplication } from '@/lib/types';
import { Timestamp } from 'firebase/firestore';

const formSchema = z.object({
  date: z.date({ required_error: 'Debe seleccionar una fecha.' }),
  fertilizerType: z.string({ required_error: 'Debe seleccionar un tipo de fertilizante.' }),
  quantity: z.coerce.number().min(0.1, 'La cantidad debe ser mayor a 0.'),
  notes: z.string().optional(),
});

interface EditFertilizerFormProps {
  application: FertilizerApplication;
  setOpen: (open: boolean) => void;
}

export function EditFertilizerForm({ application, setOpen }: EditFertilizerFormProps) {
  const { updateFertilizerApplication } = useAgroData();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: application.date instanceof Timestamp ? application.date.toDate() : new Date(application.date),
      fertilizerType: application.fertilizerType,
      quantity: application.quantity,
      notes: application.notes || '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await updateFertilizerApplication(application.id, values);
    toast({
      title: 'Registro actualizado',
      description: 'La aplicación de fertilizante ha sido actualizada.',
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
                <FormLabel>Fecha de Aplicación</FormLabel>
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
            name="fertilizerType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Fertilizante</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="urea">Urea</SelectItem>
                    <SelectItem value="fosfato">Fosfato</SelectItem>
                    <SelectItem value="potasio">Potasio</SelectItem>
                    <SelectItem value="completo">Completo</SelectItem>
                    <SelectItem value="organico">Orgánico</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cantidad (kg o L)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 20" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Añada cualquier nota relevante sobre la aplicación..."
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

    