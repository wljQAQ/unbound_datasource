import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.css';

function App() {
  return (
    <>
      <ConfigProvider locale={zhCN}>
        <RouterProvider router={router}></RouterProvider>
      </ConfigProvider>
    </>
  );
}

export default App;
