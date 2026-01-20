
'use client';

import { useAgroData } from "@/context/agro-data-context";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { EditBananaSaleForm } from "../forms/edit-banana-sale-form";

const ITEMS_PER_PAGE = 10;

export function BananaSalesTable() {
    const { bananaSales, deleteBananaSale } = useAgroData();
    const [currentPage, setCurrentPage] = useState(1);
    const [isClient, setIsClient] = useState(false);
    const [openDialogs, setOpenDialogs] = useState<Record<string, boolean>>({});
    const { toast } = useToast();

    useEffect(() => {
        setIsClient(true);
    }, []);

    const totalPages = Math.ceil(bananaSales.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentItems = bananaSales.slice(startIndex, endIndex);

    const goToPage = (page: number) => {
        setCurrentPage(page);
    }
    
    const handleSetOpen = (id: string, open: boolean) => {
        setOpenDialogs(prev => ({ ...prev, [id]: open }));
    };

    const handleDelete = async (id: string) => {
        await deleteBananaSale(id);
        toast({
            title: "Venta eliminada",
            description: "El registro de la venta de plátano ha sido eliminado.",
        });
    }

    return (
        <div className="space-y-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Color Cinta</TableHead>
                        <TableHead>Cantidad (cajas)</TableHead>
                        <TableHead>Precio Unitario</TableHead>
                        <TableHead>Precio Total</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentItems.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{isClient ? formatDate(item.date) : '...'}</TableCell>
                            <TableCell><span className="capitalize">{item.tapeColor}</span></TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>{isClient ? formatCurrency(item.unitPrice) : '...'}</TableCell>
                            <TableCell>{isClient ? formatCurrency(item.totalPrice) : '...'}</TableCell>
                            <TableCell className="text-right space-x-2">
                                <Dialog open={openDialogs[item.id] || false} onOpenChange={(open) => handleSetOpen(item.id, open)}>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" size="icon" disabled={item.id.startsWith('mock-')}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Editar Venta de Plátano</DialogTitle>
                                        </DialogHeader>
                                        <EditBananaSaleForm sale={item} setOpen={(open) => handleSetOpen(item.id, open)} />
                                    </DialogContent>
                                </Dialog>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" disabled={item.id.startsWith('mock-')}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Esta acción no se puede deshacer. Se eliminará el registro de venta y el lote de enfundado asociado volverá a estar disponible.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(item.id)}>Eliminar</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
             <div className="flex justify-center items-center gap-2">
                {totalPages > 1 && Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => goToPage(page)}
                    >
                        {page}
                    </Button>
                ))}
            </div>
        </div>
    )
}

    

    