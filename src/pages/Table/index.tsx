import { useState, useCallback } from 'react';
import { Layout, theme, Menu, Button } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react'; // AG Grid Component
import 'ag-grid-community/styles/ag-grid.css'; // Mandatory CSS required by the grid
import 'ag-grid-community/styles/ag-theme-quartz.css'; // Optional Theme applied to the grid

const { Header, Content, Sider } = Layout;

export default function Table() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken();

  const isRowSelectable = useCallback(rowNode => {
    return !rowNode.data?.add;
  }, []);

  const [rowData, setRowData] = useState([
    { make: 'Tesla', model: 'Model Y', price: 64950, electric: true },
    { make: 'Ford', model: 'F-Series', price: 33850, electric: false },
    { make: 'Toyota', model: 'Corolla', price: 29600, electric: false },
    { add: true }
  ]);

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState([
    { field: 'make', headerCheckboxSelection: true, checkboxSelection: true },
    { field: 'model' },
    { field: 'price' },
    { field: 'electric' }
  ]);

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
            <div
              className="ag-theme-quartz h-full border-r-none" // applying the grid theme
            >
              <AgGridReact
                rowSelection="multiple"
                defaultColDef={{ filter: true }}
                rowData={rowData}
                isRowSelectable={isRowSelectable}
                columnDefs={colDefs}
              />
            </div>
          </Content>
        </Layout>
      </Layout>
    </>
  );
}
