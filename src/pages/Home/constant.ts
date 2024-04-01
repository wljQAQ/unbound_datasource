import type { FormItemProps, InputProps, CheckboxProps, FormProps } from 'antd';

export interface DatasourceItem {
  title: string;
  desc: string;
  form?: Form;
}

export interface Form extends FormProps {
  items: FormItemType[];
}

// 定义可辨识联合，每个成员都有一个共同的可辨识的特征 `type`
export type FormItemType =
  | ({ type: 'Input'; name: string; props?: InputProps } & FormItemProps)
  | ({ type: 'Checkbox'; name: string; props?: CheckboxProps } & FormItemProps);

export const DATASOURCE_LIST = {
  db: [
    {
      title: 'PostgresSQL',
      desc: '关系型数据库',
      form: {
        initialValues: { host: 'localhost', port: 5432, database: 'postgres', username: 'postgres', password: '123456' },
        items: [
          {
            type: 'Input',
            name: 'host',
            label: 'Host',
            rules: [{ required: true, message: '输入主机地址!' }],
            props: {
              placeholder: '输入主机地址'
            }
          },
          {
            type: 'Input',
            name: 'port',
            label: 'Port',
            rules: [{ required: true, message: '请输入端口号!' }],
            props: {
              placeholder: '输入端口号'
            }
          },
          {
            type: 'Input',
            name: 'database',
            label: 'Database',
            rules: [{ required: true, message: '输入数据库名称!' }],
            props: {
              placeholder: '输入数据库名称'
            }
          },
          {
            type: 'Input',
            name: 'username',
            label: 'User',
            rules: [{ required: true, message: '请输入用户名!' }],
            props: {
              placeholder: '请输入用户名'
            }
          },
          {
            type: 'Password',
            name: 'password',
            label: 'Password',
            rules: [{ required: true, message: '请输入密码!' }],
            props: {
              placeholder: '请输入密码'
            }
          }
        ]
      }
    },
    {
      title: 'MySQL',
      desc: '关系型数据库'
    },
    {
      title: 'MongoDB',
      desc: '非关系型数据库'
    },
    {
      title: 'SQL Server',
      desc: '关系型数据库'
    }
  ] as DatasourceItem[]
};
