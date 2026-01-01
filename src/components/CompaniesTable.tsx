import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { db } from '../firebase';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Company } from '../types';

interface CompaniesTableProps {
  onEdit: (company: Company) => void;
  refetch: boolean;
}

const columnHelper = createColumnHelper<Company>();

const columns = (onEdit: (company: Company) => void, refetchData: () => void) => [
  columnHelper.accessor('name', {
    cell: (info) => info.getValue(),
    header: () => <span>Name</span>,
  }),
  columnHelper.accessor('id', {
    cell: (info) => {
      const onDelete = async () => {
        await deleteDoc(doc(db, 'companies', info.getValue()));
        refetchData();
      };
      return (
        <>
          <Button onClick={() => onEdit(info.row.original)}>Edit</Button>
          <Button onClick={onDelete}>Delete</Button>
        </>
      );
    },
    header: () => <span>Actions</span>,
  }),
];

export const CompaniesTable = ({ onEdit, refetch }: CompaniesTableProps) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCompanies = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, 'companies'));
    const companiesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Company));
    setCompanies(companiesData);
    setLoading(false);
  };

  useEffect(() => {
    fetchCompanies();
  }, [refetch]);

  const table = useReactTable({
    data: companies || [],
    columns: columns(onEdit, fetchCompanies),
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Table>
      <TableHead>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableCell key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableHead>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
