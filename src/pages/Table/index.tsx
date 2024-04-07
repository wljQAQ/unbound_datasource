import { useState, useMemo, useEffect, memo } from 'react';
import { Layout, theme, Menu, Button, Checkbox, Input } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

import { createColumnHelper, ColumnDef, flexRender, getCoreRowModel, useReactTable, CellContext } from '@tanstack/react-table';
import { Table, Head, Header as TableHeader, Body, Cell, Row } from '@/components/Table';

const { Header, Content, Sider } = Layout;

type Person = {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  status: string;
  progress: number;
};

let defaultData: Person[] = [
  {
    firstName: 'tanner',
    lastName: 'linsley',
    age: 24,
    visits: 100,
    status: 'In Relationship',
    progress: 50
  },
  {
    firstName: 'tandy',
    lastName: 'miller',
    age: 40,
    visits: 40,
    status: 'Single',
    progress: 80
  }
];

const CellEditor = memo((props: CellContext<Person, unknown>) => {
  const { getValue, row, column, table, cell } = props;

  const initialValue = getValue();
  // We need to keep and update the state of the cell normally
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  console.log(cell);
  // console.log('重新渲染', column.id, column, row, column.getSize(), cell.column.getSize());
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
  const [collapsed, setCollapsed] = useState(false);

  const columns = useMemo<ColumnDef<Person>[]>(
    () => [
      {
        id: 'select',
        size: 20,
        header: ({ table }) => {
          return (
            <Checkbox
              {...{
                checked: table.getIsAllRowsSelected(),
                indeterminate: table.getIsSomeRowsSelected(),
                onChange: table.getToggleAllRowsSelectedHandler()
              }}
            />
          );
        },
        cell: ({ row }) => {
          console.log(row);
          return (
            <Checkbox
            className='px-2'
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler()
              }}
            />
          );
        }
      },
      {
        accessorKey: 'firstName',
        header: 'FirstName',
        cell: CellEditor,
        meta: {
          test: 1,
          props: {
            onClick() {
              console.log(111);
            }
          }
        }
      },
      {
        accessorKey: 'lastName',
        header: 'LastName',
        cell: CellEditor,
        meta: {
          test: 1,
          props: {
            onClick() {
              console.log(111);
            }
          }
        }
      },
      {
        accessorKey: 'age',
        cell: CellEditor,
        header: 'Age',
        meta: {
          test: 1,
          props: {
            onClick() {
              console.log(111);
            }
          }
        }
      },
      {
        accessorKey: 'visits',
        cell: CellEditor,
        header: 'Visits'
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: CellEditor
      },
      {
        accessorKey: 'progress',
        header: 'Profile Progress',
        cell: CellEditor
      }
    ],
    []
  );
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken();

  const [data, _setData] = useState(() => [...defaultData]);

  const table = useReactTable({
    data,
    columns,
    meta: {
      updateData: (index, id, value) => {
        console.log(index, id, value);
      }
    },
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <>
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
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map(headerGroup => (
                  <Row key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <Head key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </Head>
                    ))}
                  </Row>
                ))}
              </TableHeader>
              <Body>
                {table.getRowModel().rows.map(row => (
                  <Row key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <Cell key={cell.id} style={{ width: cell.column.getSize() + 'px' }} {...(cell.column.columnDef.meta?.props || {})}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Cell>
                    ))}
                  </Row>
                ))}
              </Body>
            </Table>
          </Content>
        </Layout>
      </Layout>
    </>
  );
}
