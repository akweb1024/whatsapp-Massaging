import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { db } from '../firebase';
import { collection, deleteDoc, doc } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Company } from '../types';

const columnHelper = createColumnHelper<Company>();

const columns = [
  columnHelper.accessor('name', {
    cell: (info) => info.getValue(),
    header: () => <span>Name</span>,
  }),
  columnHelper.accessor('id', {
    cell: (info) => {
      const onDelete = async () => {
        await deleteDoc(doc(db, 'companies', info.getValue()));
      };
      return (
        <>
          <Button>Edit</Button>
          <Button onClick={onDelete}>Delete</Button>
        </>
      );
    },
    header: () => <span>Actions</span>,
  }),
];

export const CompaniesTable = () => {
  const [snapshot, loading] = useCollection(collection(db, 'companies'));

  const companies = snapshot?.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Company));

  const table = useReactTable({
    data: companies || [],
    columns,
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
