import { faker } from '@faker-js/faker';

export const makeColumns = (num, Cell) =>
  [...Array(num)].map((_, i) => {
    return {
      id: i.toString(),
      accessorKey: i.toString(),
      header: 'Column ' + i.toString(),
      size: Math.floor(Math.random() * 150) + 100,
      cell: Cell
    };
  });

export const makeData = (num, columns) =>
  [...Array(num)].map(() => ({
    ...Object.fromEntries(columns.map(col => [col.accessorKey, faker.person.firstName()]))
  }));

export type Person = ReturnType<typeof makeData>[0];

// const columns = useMemo<ColumnDef<Person>[]>(
//   () => [
//     {
//       id: 'select',
//       size: 20,
//       header: ({ table }) => {
//         return (
//           <Checkbox
//             {...{
//               checked: table.getIsAllRowsSelected(),
//               indeterminate: table.getIsSomeRowsSelected(),
//               onChange: table.getToggleAllRowsSelectedHandler()
//             }}
//           />
//         );
//       },
//       cell: ({ row }) => {
//         return (
//           <Checkbox
//             className="px-2"
//             {...{
//               checked: row.getIsSelected(),
//               disabled: !row.getCanSelect(),
//               indeterminate: row.getIsSomeSelected(),
//               onChange: row.getToggleSelectedHandler()
//             }}
//           />
//         );
//       }
//     },
//     {
//       id: 'firstName',
//       accessorKey: 'firstName',
//       header: 'FirstName',
//       cell: CellEditor,
//       meta: {
//         test: 1,
//         props: {
//           onClick() {
//             console.log(111);
//           }
//         }
//       }
//     },
//     {
//       id: 'lastName',
//       accessorKey: 'lastName',
//       header: 'LastName',
//       cell: CellEditor,
//       meta: {
//         test: 1,
//         props: {
//           onClick() {
//             console.log(111);
//           }
//         }
//       }
//     },
//     {
//       id: 'age',
//       accessorKey: 'age',
//       cell: CellEditor,
//       header: 'Age',
//       meta: {
//         test: 1,
//         props: {
//           onClick() {
//             console.log(111);
//           }
//         }
//       }
//     },
//     {
//       id: 'visits',
//       accessorKey: 'visits',
//       cell: CellEditor,
//       header: 'Visits'
//     },
//     {
//       id: 'status',
//       accessorKey: 'status',
//       header: 'Status',
//       cell: CellEditor
//     },
//     {
//       id: 'progress',
//       accessorKey: 'progress',
//       header: 'Profile Progress',
//       cell: CellEditor
//     },
//     {
//       id: 'progress2',
//       accessorKey: 'progress2',
//       header: 'Profile Progress',
//       cell: CellEditor
//     },
//     {
//       id: 'progress3',
//       accessorKey: 'progress3',
//       header: 'Profile Progress',
//       cell: CellEditor
//     },
//     {
//       id: 'progress4',
//       accessorKey: 'progress4',
//       header: 'Profile Progress',
//       cell: CellEditor
//     },
//     {
//       id: 'progress5',
//       accessorKey: 'progress5',
//       header: 'Profile Progress',
//       cell: CellEditor
//     }
//   ],
//   []
// );
