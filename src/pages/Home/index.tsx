import { Typography, Modal, Checkbox, Card, Form, Input, Row, Col } from 'antd';
import { useState } from 'react';
import { DATASOURCE_LIST, DatasourceItem } from './constant';
import { useRequest } from 'ahooks';

const FormComMap = { Input, Checkbox, Password: Input.Password };

function Home() {
  const [open, setOpen] = useState(false);
  const [dataForm, setDataForm] = useState<DatasourceItem>();
  const [form] = Form.useForm();

  async function onOk() {
    const state = await form.validateFields();
    console.log(state);

    fetch('/api/v1/datasource/connectDB', {
      method: 'POST',
      body: JSON.stringify(state)
    })
      .then(async res => {
        const body = await res.json();
        console.log(res, 'res', body);
      })
      .catch(err => {
        console.log(err, 'err');
      });
  }

  function openModal(item: DatasourceItem) {
    setDataForm(item);
    setTimeout(() => {
      console.log(dataForm, item);
    }, 1000);
    setOpen(true);
  }

  return (
    <>
      <div className="w-full h-full p-20px">
        <Typography.Title level={3} className="text-center">
          数据源
        </Typography.Title>

        <Row className="max-w-900px mt-10  mx-auto! px-2" gutter={[24, 16]}>
          {DATASOURCE_LIST.db.map(i => {
            return (
              <Col key={i.title} xs={12} md={8}>
                <Card hoverable title={i.title} size="small" onClick={() => openModal(i)}>
                  {i.desc}
                </Card>
              </Col>
            );
          })}
        </Row>

        <Modal title="连接PostgreSQL" open={open} onCancel={() => setOpen(false)} onOk={onOk}>
          <Form {...(dataForm?.form || {})} form={form} name="basic" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
            {dataForm?.form &&
              dataForm.form?.items.map(item => {
                const Component = FormComMap[item.type] as React.ComponentType<typeof item.props>;
                return (
                  <Form.Item label="主机" key={item.name} {...item}>
                    <Component {...(item.props || {})} />
                  </Form.Item>
                );
              })}
          </Form>
        </Modal>
      </div>
    </>
  );
}

export default Home;
