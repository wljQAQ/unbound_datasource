import { TdHTMLAttributes, TableHTMLAttributes, HTMLAttributes, ThHTMLAttributes } from 'react';

import { useDrag } from 'react-dnd';

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

export const Head = (props: ThHTMLAttributes<HTMLTableCellElement>) => {
  const [ctx, drag] = useDrag(() => ({
    type: 'test',
    item: 'test',
    end(item) {
      console.log(item);
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    })
  }));

  return <th ref={drag} className="relative text-left px-2 font-500 text-#71717A h-10 bg-#F5F5F5" {...props}></th>;
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
