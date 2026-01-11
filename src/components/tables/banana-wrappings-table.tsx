'use client';

import { useAgroData } from "@/context/agro-data-context";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

const ITEMS_PER_PAGE = 10;

export function BananaWrappingsTable() {
    const { bananaWrappings } = useAgroData();
    const [currentPage, setCurrentPage] = useState(1);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const totalPages = Math.ceil(bananaWrappings.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentItems = bananaWrappings.slice(startIndex, endIndex);

    const goToPage = (page: number) => {
        setCurrentPage(page);
    }

    return (
        <div className="space-y-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Color Cinta</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Observación</TableHead>
                        <TableHead>Estado</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentItems.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{isClient ? formatDate(item.date) : '...'}</TableCell>
                            <TableCell><span className="capitalize">{item.color}</span></TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>{item.observation}</TableCell>
                            <TableCell>{item.sold ? 'Vendido' : 'Disponible'}</TableCell>
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
