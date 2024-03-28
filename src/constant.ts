export const DATASOURCE_LIST = {
  db: [
    {
      title: 'PostgresSQL',
      desc: '关系型数据库',
      form: [
        {
          type: 'input',
          label: 'host',
          props: {
            placeholder: 'host',
            defaultValue: 'localhost',
            rules: [{ required: true, message: '请输入端口号!' }]
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
  ]
};
