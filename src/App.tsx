import { Typography, Modal, Flex, Card, Form, Input, Row, Col } from 'antd';
import { useState } from 'react';
import './App.css';
import { DATASOURCE_LIST } from './constant';

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

const formItemMap = {};

function App() {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  let a = 1;
  async function onOk() {
    const state = await form.validateFields();
    console.log(state);
  }

  function openModal() {
    a = Date.now();
    setOpen(true);
  }

  const Component = Input;

  return (
    <>
      <div className="w-full h-full p-20px">
        <Typography.Title level={3} className="text-center">
          数据源
        </Typography.Title>

        <Row className="max-w-900px mt-10  mx-auto! px-2" gutter={[24, 16]}>
          {DATASOURCE_LIST.db.map(i => {
            return (
              <Col xs={12} md={8}>
                <Card hoverable title={i.title} size="small" onClick={openModal}>
                  {i.desc}
                </Card>
              </Col>
            );
          })}
        </Row>

        {/* <Flex wrap="wrap" gap="large" justify="center">
          {DATASOURCE_LIST.db.map(i => {
            return (
              <Card hoverable className="w-200px" title="PostgreSQL" size="small" onClick={() => setOpen(true)}>
                从撒大苏打
              </Card>
            );
          })}
        </Flex> */}

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
            {a}

            <Form.Item<FieldType> label="主机" name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
              <Component />
            </Form.Item>

            {/* <Form.Item<FieldType> label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
              <Input.Password />
            </Form.Item> */}
          </Form>
        </Modal>
      </div>
    </>
  );
}

export default App;
