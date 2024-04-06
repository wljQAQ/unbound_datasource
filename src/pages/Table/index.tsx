import { useState, useMemo, useEffect } from 'react';
import { Layout, theme, Menu, Button, Checkbox } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

import { createColumnHelper, ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
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
  },
  {
    firstName: 'joe',
    lastName: 'dirte',
    age: 45,
    visits: 20,
    status: 'Complicated',
    progress: 10
  }
];

// Give our default column cell renderer editing superpowers!
const defaultColumn: Partial<ColumnDef<Person>> = {
  cell: ({ getValue, row, column, table }) => {
    const initialValue = getValue();
    // We need to keep and update the state of the cell normally
    const [value, setValue] = useState(initialValue);
    const [isEditing, setIsEditing] = useState(false);
    console.log(column, column.id);
    // When the input is blurred, we'll call our table meta's updateData function
    const onBlur = () => {
      // table.options.meta?.updateData(index, id, value);
    };

    const toggleEditing = () => {
      setIsEditing(edit => !edit); // 切换编辑状态
    };
    // If the initialValue is changed external, sync it up with our state
    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);
    return isEditing ? (
      <input
        defaultValue={value as string}
        onBlur={toggleEditing} // 比如你可以在输入框失焦时保存并退出编辑模式
        autoFocus
      />
    ) : (
      <span onClick={toggleEditing}>{value}</span> // 显示文本并在点击时切换到编辑状态
    );
    // return <input value={value as string} onChange={e => setValue(e.target.value)} onBlur={onBlur} />;
    return value;
  }
};

export default function Tables() {
  const [collapsed, setCollapsed] = useState(false);
  const [editedCells, setEditedCells] = useState({});

  const columns = useMemo<ColumnDef<Person>[]>(
    () => [
      {
        id: 'select',
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
        footer: props => props.column.id,
        meta: {
          test: 1
        }
      },
      {
        accessorKey: 'visits',
        header: () => <span>Visits</span>,
        footer: props => props.column.id
      },
      {
        accessorKey: 'status',
        header: 'Status',
        footer: props => props.column.id
      },
      {
        accessorKey: 'progress',
        header: 'Profile Progress',
        footer: props => props.column.id
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
    defaultColumn,
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
                      <Cell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Cell>
                    ))}
                  </Row>
                ))}
              </Body>
              {/* <tfoot>
                {table.getFooterGroups().map(footerGroup => (
                  <Row key={footerGroup.id}>
                    {footerGroup.headers.map(header => (
                      <Head key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.footer, header.getContext())}
                      </Head>
                    ))}
                  </Row>
                ))}
              </tfoot> */}
            </Table>
          </Content>
        </Layout>
      </Layout>
    </>
  );
}
