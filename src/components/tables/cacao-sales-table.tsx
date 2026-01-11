'use client';

import { useAgroData } from "@/context/agro-data-context";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

const ITEMS_PER_PAGE = 10;

export function CacaoSalesTable() {
    const { cacaoSales } = useAgroData();
    const [currentPage, setCurrentPage] = useState(1);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const totalPages = Math.ceil(cacaoSales.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentItems = cacaoSales.slice(startIndex, endIndex);

    const goToPage = (page: number) => {
        setCurrentPage(page);
    }

    return (
        <div className="space-y-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Cantidad (kg)</TableHead>
                        <TableHead>Valor Unitario</TableHead>
                        <TableHead>Valor Total</TableHead>
                        <TableHead>Descripción</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentItems.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{isClient ? formatDate(item.date) : '...'}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>{isClient ? formatCurrency(item.unitPrice) : '...'}</TableCell>
                            <TableCell>{isClient ? formatCurrency(item.totalValue) : '...'}</TableCell>
                            <TableCell>{item.description}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
             <div className="flex justify-center items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
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
