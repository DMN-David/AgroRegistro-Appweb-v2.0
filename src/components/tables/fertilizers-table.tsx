
'use client';

import { useAgroData } from "@/context/agro-data-context";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { EditFertilizerForm } from "../forms/edit-fertilizer-form";

const ITEMS_PER_PAGE = 10;

export function FertilizersTable() {
    const { fertilizerApplications, deleteFertilizerApplication } = useAgroData();
    const [currentPage, setCurrentPage] = useState(1);
    const [isClient, setIsClient] = useState(false);
    const [openDialogs, setOpenDialogs] = useState<Record<string, boolean>>({});
    const { toast } = useToast();

    useEffect(() => {
        setIsClient(true);
    }, []);

    const totalPages = Math.ceil(fertilizerApplications.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentItems = fertilizerApplications.slice(startIndex, endIndex);

    const goToPage = (page: number) => {
        setCurrentPage(page);
    }

    const handleSetOpen = (id: string, open: boolean) => {
        setOpenDialogs(prev => ({ ...prev, [id]: open }));
    };

    const handleDelete = async (id: string) => {
        await deleteFertilizerApplication(id);
        toast({
            title: "Registro eliminado",
            description: "La aplicación de fertilizante ha sido eliminada.",
        });
    }

    return (
        <div className="space-y-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Notas</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentItems.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{isClient ? formatDate(item.date) : '...'}</TableCell>
                            <TableCell><span className="capitalize">{item.fertilizerType}</span></TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>{item.notes}</TableCell>
                            <TableCell className="text-right space-x-2">
                                <Dialog open={openDialogs[item.id] || false} onOpenChange={(open) => handleSetOpen(item.id, open)}>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Editar Aplicación de Fertilizante</DialogTitle>
                                        </DialogHeader>
                                        <EditFertilizerForm application={item} setOpen={(open) => handleSetOpen(item.id, open)} />
                                    </DialogContent>
                                </Dialog>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Esta acción no se puede deshacer. Esto eliminará permanentemente el registro.
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

    