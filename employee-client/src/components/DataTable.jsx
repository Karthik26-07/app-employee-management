import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { Typography } from "@material-tailwind/react";

const DataTable = ({ columns, data }) => {
  const [dataTable, setDataTable] = useState({
    data: [],
  });
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      <table className="mt-4 w-full min-w-max table-auto text-left responsive">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="align-middle">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="border-b border-gray-300 !p-4 pb-8"
                >
                  <Typography
                    color="blue-gray"
                    variant="small"
                    className="!font-bold"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </Typography>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row, index) => {
              const isLast = index === table.getRowModel().rows.length - 1;
              const rowClasses = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";

              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className={rowClasses}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="p-4 text-center text-gray-500 "
              >
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

export default DataTable;
