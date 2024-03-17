import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper';
import 'virtual:uno.css';

function render(container: HTMLElement) {
  ReactDOM.createRoot(container).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

console.log(window);

// some code
renderWithQiankun({
  mount(props) {
    console.log('mount', props);
    render(props.container);
  },
  bootstrap() {
    console.log('bootstrap');
  },
  unmount(props: any) {
    console.log('unmount');
    const { container } = props;
    const mountRoot = container?.querySelector('#root');
    ReactDOM.unmountComponentAtNode(mountRoot || document.querySelector('#root'));
  }
});

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render(document.getElementById('root')!);
}
