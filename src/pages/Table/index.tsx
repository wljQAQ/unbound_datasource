import { useState, useMemo, useRef, memo, CSSProperties } from 'react';
import { Layout, theme, Menu, Button, Checkbox, Dropdown, message, Pagination } from 'antd';
import type { MenuProps } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, CopyOutlined } from '@ant-design/icons';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  CellContext,
  getPaginationRowModel,
  PaginationState,
  Header as HeaderProps,
  Row as RowProps
} from '@tanstack/react-table';
import { Table, Head, Header as TableHeader, Body, Cell, Row } from '@/components/Table';

// needed for table body level scope DnD setup
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';

import { useVirtualizer } from '@tanstack/react-virtual';

import { Person, makeColumns, makeData } from './makeData';

const { Header, Content, Sider } = Layout;

const items: MenuProps['items'] = [
  {
    label: '复制',
    key: 'copy',
    icon: <CopyOutlined />
  }
];

const CellEditor = memo((props: CellContext<Person, unknown>) => {
  const { getValue, row, column, table, cell } = props;
  const initialValue = getValue();
  // We need to keep and update the state of the cell normally
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  // console.log('重新渲染', table.options.meta);
  // When the input is blurred, we'll call our table meta's updateData function
  const onBlur = () => {
    // table.options.meta?.updateData(index, id, value);
  };

  const toggleEditing = () => {
    setIsEditing(edit => !edit); // 切换编辑状态
  };
  // If the initialValue is changed external, sync it up with our state
  // useEffect(() => {
  //   setValue(initialValue);
  // }, [initialValue]);
  return isEditing ? (
    // <div className="bg-red">{value}</div>
    <input
      className="inline-block w-full px-2 h-37px border-rounded-0 border-none focus:table-outline"
      defaultValue={value as string}
      onBlur={toggleEditing} // 比如你可以在输入框失焦时保存并退出编辑模式
      autoFocus
    />
  ) : (
    // <span>111</span>
    <div className="p-2" onClick={toggleEditing}>
      {value}
    </div>
  );
});

export default function Tables() {
  const columns = useMemo<ColumnDef<Person>[]>(() => makeColumns(100), []);
  const [data, _setData] = useState(() => makeData(1_000, columns));

  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [tableState, setTableState] = useState({
    currentCells: []
  });

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const [messageApi, contextHolder] = message.useMessage();
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
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken();

  const [columnOrder, setColumnOrder] = useState<string[]>(() => columns.map(c => c.id!));
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setColumnOrder(columnOrder => {
        const oldIndex = columnOrder.indexOf(active.id as string);
        const newIndex = columnOrder.indexOf(over.id as string);
        return arrayMove(columnOrder, oldIndex, newIndex); //this is just a splice util
      });
    }
  }

  const table = useReactTable({
    data,
    columns,
    // defaultColumn: {
    //   minSize: 100,
    //   maxSize: 800
    // },
    state: {
      columnOrder
      // pagination
    },
    // onColumnOrderChange: setColumnOrder,
    // getPaginationRowModel: getPaginationRowModel(),
    // onPaginationChange: setPagination,
    // columnResizeMode: 'onChange', // 列宽调整模式 onChange  onEnd
    // columnResizeDirection: 'ltr', // 列宽调整方向 ltr rtl
    meta: {
      updateData: (index, id, value) => {
        console.log(index, id, value);
      },
      tableState
    },
    getCoreRowModel: getCoreRowModel()
  });

  const { rows } = table.getRowModel();

  const visibleColumns = table.getVisibleLeafColumns();

  console.log(visibleColumns);

  //we are using a slightly different virtualization strategy for columns (compared to virtual rows) in order to support dynamic row heights
  const columnVirtualizer = useVirtualizer({
    count: visibleColumns.length,
    estimateSize: index => visibleColumns[index].getSize(), //estimate width of each column for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    horizontal: true,
    overscan: 3 //how many columns to render on each side off screen each way (adjust this for performance)
  });

  //The virtualizer needs to know the scrollable container element
  const tableContainerRef = useRef<HTMLDivElement>(null);

  //dynamic row height virtualization - alternatively you could use a simpler fixed row height strategy without the need for `measureElement`
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 37, //estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    //measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== 'undefined' && navigator.userAgent.indexOf('Firefox') === -1
        ? element => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5
  });

  const virtualColumns = columnVirtualizer.getVirtualItems();
  const virtualRows = rowVirtualizer.getVirtualItems();
  console.log(virtualColumns);
  //different virtualization strategy for columns - instead of absolute and translateY, we add empty columns to the left and right
  let virtualPaddingLeft: number | undefined;
  let virtualPaddingRight: number | undefined;

  if (columnVirtualizer && virtualColumns?.length) {
    virtualPaddingLeft = virtualColumns[0]?.start ?? 0;
    virtualPaddingRight = columnVirtualizer.getTotalSize() - (virtualColumns[virtualColumns.length - 1]?.end ?? 0);
  }

  console.log(virtualPaddingRight, virtualPaddingLeft);
  const sensors = useSensors(useSensor(MouseSensor, {}), useSensor(TouchSensor, {}), useSensor(KeyboardSensor, {}));

  function onContextMenu(event: React.MouseEvent<HTMLDivElement>) {
    const dom = event.target as HTMLElement;
    if (!dom) return;
    const closestTableNode = dom.closest('[data-table]') as HTMLElement;
    if (!closestTableNode) {
      setMenuOpen(false);
      return;
    }
    const [type, id] = closestTableNode.dataset.table!.split('-');
    console.log(closestTableNode.dataset, id, type);

    setTableState(prev => {
      return {
        ...prev,
        currentCells: [id]
      };
    });
    //获取当前的id
    event.preventDefault();
    setMenuOpen(true);
    function hiddenMenu() {
      setMenuOpen(false);
      window.removeEventListener('click', hiddenMenu);
    }
    window.addEventListener('click', hiddenMenu);
  }

  const onClick: MenuProps['onClick'] = ({ key }) => {
    console.log(tableState, key);
    messageApi.success('你点击了' + key);
  };

  function onPChange(page, pageSize) {
    console.log(page, pageSize);

    table.setPageIndex(page - 1);
    table.setPageSize(pageSize);
  }

  return (
    <>
      {contextHolder}
      <DndContext collisionDetection={closestCenter} modifiers={[restrictToHorizontalAxis]} onDragEnd={handleDragEnd} sensors={sensors}>
        <Layout className="h-full">
          <Sider theme="light" trigger={null} collapsible collapsed={collapsed}>
            <Menu
              className="h-full"
              theme="light"
              mode="inline"
              defaultSelectedKeys={['1']}
              items={[
                {
                  key: '1',
                  label: 'nav 1'
                },
                {
                  key: '2',
                  label: 'nav 2'
                },
                {
                  key: '3',
                  label: 'nav 3'
                }
              ]}
            />
          </Sider>
          <Layout>
            <Header style={{ padding: 0, background: colorBgContainer }}>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: '16px',
                  width: 64,
                  height: 64
                }}
              />
            </Header>
            <Content
              style={{
                background: colorBgContainer,
                borderRadius: borderRadiusLG
              }}
            >
              <Dropdown open={menuOpen} menu={{ items, onClick }} trigger={['contextMenu']}>
                <div ref={tableContainerRef} className="overflow-auto relative h-400px">
                  <Table className="grid" onContextMenu={onContextMenu}>
                    <TableHeader className="grid sticky top-0 z-1">
                      {table.getHeaderGroups().map(headerGroup => (
                        <Row className="flex w-full" key={headerGroup.id}>
                          {virtualPaddingLeft ? (
                            //fake empty column to the left for virtualization scroll padding
                            <th style={{ display: 'flex', width: virtualPaddingLeft }} />
                          ) : null}
                          {/* <SortableContext items={columnOrder} strategy={horizontalListSortingStrategy}> */}
                            {virtualColumns.map(vc => {
                              const header = headerGroup.headers[vc.index];
                              return <Head key={header.id} header={header}></Head>;
                            })}
                          {/* </SortableContext> */}
                          {virtualPaddingRight ? (
                            //fake empty column to the right for virtualization scroll padding
                            <th style={{ display: 'flex', width: virtualPaddingRight }} />
                          ) : null}
                        </Row>
                      ))}
                    </TableHeader>
                    <Body className="grid relative will-change-transform" style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
                      {virtualRows.map(virtualRow => {
                        const row = rows[virtualRow.index] as RowProps<Person>;
                        const visibleCells = row.getVisibleCells();
                        return (
                          <Row
                            data-index={virtualRow.index} //needed for dynamic row height measurement
                            ref={node => rowVirtualizer.measureElement(node)} //measure dynamic row height
                            key={row.id}
                            style={{
                              display: 'flex',
                              position: 'absolute',
                              // transform: `translate3d(0px,${virtualRow.start}px,0px)`, //this should always be a `style` as it changes on scroll
                              transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
                              width: '100%'
                            }}
                          >
                            {virtualPaddingLeft ? (
                              //fake empty column to the left for virtualization scroll padding
                              <td style={{ display: 'flex', width: virtualPaddingLeft }} />
                            ) : null}
                            {virtualColumns.map(vc => {
                              const cell = visibleCells[vc.index];
                              return (
                                <Cell
                                  data-table={`cell-${cell.id}`}
                                  key={cell.id}
                                  style={{ width: cell.column.getSize() }}
                                  {...(cell.column.columnDef.meta?.props || {})}
                                >
                                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </Cell>
                              );
                            })}
                            {virtualPaddingRight ? (
                              //fake empty column to the right for virtualization scroll padding
                              <td style={{ display: 'flex', width: virtualPaddingRight }} />
                            ) : null}
                          </Row>
                        );
                      })}
                    </Body>
                  </Table>
                </div>
              </Dropdown>
              {/* <Pagination
                className="text-right p-10px"
                total={table.getRowCount()}
                showTotal={total => `共计${total}条`}
                showSizeChanger
                showQuickJumper
                onChange={onPChange}
              /> */}
            </Content>
          </Layout>
        </Layout>
      </DndContext>
    </>
  );
}
