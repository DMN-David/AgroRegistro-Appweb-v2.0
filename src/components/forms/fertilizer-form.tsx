
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

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

const formSchema = z.object({
  fertilizerType: z.string({ required_error: 'Debe seleccionar un tipo de fertilizante.' }),
  quantity: z.coerce.number().min(0.1, 'La cantidad debe ser mayor a 0.'),
  notes: z.string().optional(),
});

export function FertilizerForm() {
  const { addFertilizerApplication } = useAgroData();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        fertilizerType: undefined,
        quantity: 0,
        notes: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await addFertilizerApplication(values);
    toast({
      title: 'Registro exitoso',
      description: 'La nueva aplicación de fertilizante ha sido guardada.',
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
        </div>
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
        <Button type="submit">Guardar Aplicación</Button>
      </form>
    </Form>
  );
}
