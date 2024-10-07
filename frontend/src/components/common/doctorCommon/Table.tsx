import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

interface Column {
  id: string;
  label: string;
  align?: 'right' | 'left' | 'center';
}

interface TableProps {
  columns: Column[];
  rows: Array<{ [key: string]: any }>;
  onViewDetails?: (row: { [key: string]: any }) => void; // Callback to handle View Details
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
    fontWeight: 'bold',
    fontSize: 16,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const CustomTable: React.FC<TableProps> = ({ columns, rows, onViewDetails }) => {
  return (
    <TableContainer component={Paper} sx={{ width: '100%', margin: 0 }}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <StyledTableCell key={column.id} align={column.align}>
                {column.label}
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <StyledTableRow key={index}>
              {columns.map((column) => (
                <StyledTableCell key={`${column.id}-${index}`} align={column.align}>
                  {column.id === 'viewDetails' ? (
                    <button
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 w-24 h-10 rounded-xl px-1 py-2 text-white font-semibold text-[14px]"
                      onClick={() => onViewDetails && onViewDetails(row)} // Trigger the callback when the button is clicked
                    >
                      View Details
                    </button>
                  ) : (
                    row[column.id] // Display regular cell data for other columns
                  )}
                </StyledTableCell>
              ))}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CustomTable;
