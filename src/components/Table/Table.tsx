import {
  TdHTMLAttributes,
  TableHTMLAttributes,
  useState,
  useEffect,
  HTMLAttributes,
  ThHTMLAttributes,
  CSSProperties,
  forwardRef,
  useMemo
} from 'react';
import type { Header as HeaderProps, Column as ColumnProps, Table as TableProps } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type Person = {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  status: string;
  progress: number;
};

import { Divider } from 'antd';

export const Cell = (props: TdHTMLAttributes<HTMLTableCellElement>) => {
  return <td className=" text-#4B4B4B hover:table-outline z-2" {...props}></td>;
};

export const Row = forwardRef((props: React.HTMLAttributes<HTMLTableRowElement>, ref) => {
  return <tr ref={ref} className=" flex table-border border-b hover:bg-#2196f318 w-full" {...props}></tr>;
});

export const Header = (props: HTMLAttributes<HTMLTableSectionElement>) => {
  return <thead className="select-none" {...props}></thead>;
};

// export const Head = (props: ThHTMLAttributes<HTMLTableCellElement>) => {
export const Head = ({ header, table }: { header: HeaderProps<Person, unknown>; table: TableProps<any> }) => {
  const { attributes, isDragging, listeners, setNodeRef, transform } = useSortable({
    id: header.id
  });

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    transform: CSS.Translate.toString(transform), // translate instead of transform to avoid squishing
    transition: 'width transform 0.3s ease-in-out',
    whiteSpace: 'nowrap',
    width: header.getSize(),
    zIndex: isDragging ? 1 : 0
  };
  const test = header.getResizeHandler();
  const sort = header.column.getToggleSortingHandler();
  function handleResize(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    test(e);
  }
  console.log(listeners, attributes);
  function handleClick(e) {
    console.log(sort);
    sort(e);
  }

  return (
    <th
      ref={setNodeRef}
      className="relative flex flex-wrap select-none  cursor-pointer items-center text-left px-2 font-500 text-#71717A h-10 bg-#F5F5F5"
      style={style}
      colSpan={header.colSpan}
      onClick={handleClick}
      {...attributes}
      {...listeners}
    >
      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
      {{
        asc: ' 🔼',
        desc: ' 🔽'
      }[header.column.getIsSorted() as string] ?? null}
      {header.column.getCanFilter() ? (
        <div className="w-full" onClick={e => e.stopPropagation()}>
          <Filter column={header.column} table={table} />
        </div>
      ) : null}
      <Divider
        onMouseDown={handleResize}
        className="absolute right-0px top-50% translate-y--50% z-4 border-2 border-#D9D9DB cursor-ew-resize"
        type="vertical"
      />
    </th>
  );
};

export const Body = (props: HTMLAttributes<HTMLTableSectionElement>) => {
  return <tbody {...props}></tbody>;
};

export const Table = (props: TableHTMLAttributes<HTMLTableElement>) => {
  return <table className="w-full text-sm border-collapse table-border border" {...props}></table>;
};

function Filter({ column, table }: { column: ColumnProps<any, unknown>; table: TableProps<any> }) {
  const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  const sortedUniqueValues = useMemo(
    () => (typeof firstValue === 'number' ? [] : Array.from(column.getFacetedUniqueValues().keys()).sort()),
    [column.getFacetedUniqueValues()]
  );

  return typeof firstValue === 'number' ? (
    <div>
      <div className="flex space-x-2">
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          value={(columnFilterValue as [number, number])?.[0] ?? ''}
          onChange={value => column.setFilterValue((old: [number, number]) => [value, old?.[1]])}
          placeholder={`Min ${column.getFacetedMinMaxValues()?.[0] ? `(${column.getFacetedMinMaxValues()?.[0]})` : ''}`}
          className="w-24 border shadow rounded"
        />
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          value={(columnFilterValue as [number, number])?.[1] ?? ''}
          onChange={value => column.setFilterValue((old: [number, number]) => [old?.[0], value])}
          placeholder={`Max ${column.getFacetedMinMaxValues()?.[1] ? `(${column.getFacetedMinMaxValues()?.[1]})` : ''}`}
          className="w-24 border shadow rounded"
        />
      </div>
      <div className="h-1" />
    </div>
  ) : (
    <>
      <datalist id={column.id + 'list'}>
        {sortedUniqueValues.slice(0, 5000).map((value: any) => (
          <option value={value} key={value} />
        ))}
      </datalist>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? '') as string}
        onChange={value => column.setFilterValue(value)}
        placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
        className="w-36 border shadow rounded"
        list={column.id + 'list'}
      />
      <div className="h-1" />
    </>
  );
}

// A debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return <input {...props} value={value} onChange={e => setValue(e.target.value)} />;
}
