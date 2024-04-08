import { TdHTMLAttributes, TableHTMLAttributes, HTMLAttributes, ThHTMLAttributes, CSSProperties } from 'react';
import type { Header as HeaderProps } from '@tanstack/react-table';
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

export const Row = (props: React.HTMLAttributes<HTMLTableRowElement>) => {
  return <tr className=" table-border border-b hover:bg-#2196f318" {...props}></tr>;
};

export const Header = (props: HTMLAttributes<HTMLTableSectionElement>) => {
  return <thead className="select-none" {...props}></thead>;
};

// export const Head = (props: ThHTMLAttributes<HTMLTableCellElement>) => {
export const Head = ({ header }: { header: HeaderProps<Person, unknown> }) => {
  const { attributes, isDragging, listeners, setNodeRef, transform } = useSortable({
    id: header.column.id
  });
  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: 'relative',
    transform: CSS.Translate.toString(transform), // translate instead of transform to avoid squishing
    transition: 'width transform 0.3s ease-in-out',
    whiteSpace: 'nowrap',
    width: header.column.getSize(),
    zIndex: isDragging ? 1 : 0
  };

  const test = header.getResizeHandler();
  function handleResize(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    test(e);
  }

  return (
    <th
      ref={setNodeRef}
      className="relative text-left px-2 font-500 text-#71717A h-10 bg-#F5F5F5"
      style={style}
      colSpan={header.colSpan}
      {...attributes}
      {...listeners}
    >
      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}

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
  return (
    <div className="relative w-full overflow-auto">
      <table className="w-full text-sm border-collapse table-border border" {...props}></table>
    </div>
  );
};
