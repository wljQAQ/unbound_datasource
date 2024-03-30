import type { FormItemProps, InputProps, CheckboxProps } from 'antd';

interface DatasourceItem {
  title: string;
  desc: string;
  form?: FormItemType[];
}

// 定义可辨识联合，每个成员都有一个共同的可辨识的特征 `type`
type FormItemType =
  | { type: 'Input'; props?: InputProps } & FormItemProps
  | { type: 'Checkbox'; props?: CheckboxProps } & FormItemProps;


export const DATASOURCE_LIST = {
  db: [
    {
      title: 'PostgresSQL',
      desc: '关系型数据库',
      form: [
        {
          type: 'Input',
          label: 'host',
          rules: [{ required: true, message: '请输入端口号!' }],
          props: {
            placeholder: 'host',
            defaultValue: 'localhost',
          }
        }
      ]
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
