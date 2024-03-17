import { Typography, Modal, Flex, Card, Form, Input } from 'antd';
import { useState } from 'react';
import './App.css';

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

function App() {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  async function onOk() {
    const state = await form.validateFields();
    console.log(state);
  }

  return (
    <>
      <div className="w-full h-full p-20px">
        <Typography.Title level={3} className="text-center">
          数据源
        </Typography.Title>

        <Flex wrap="wrap" gap="large" justify="center">
          <Card hoverable className="w-200px" title="PostgreSQL" size="small" onClick={() => setOpen(true)}>
            从撒大苏打
          </Card>
        </Flex>

        <Modal title="连接PostgreSQL" open={open} onCancel={() => setOpen(false)} onOk={onOk}>
          <Form
            form={form}
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            autoComplete="off"
          >
            <Form.Item<FieldType> label="主机" name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
              <Input />
            </Form.Item>

            <Form.Item<FieldType> label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
              <Input.Password />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
}

export default App;
