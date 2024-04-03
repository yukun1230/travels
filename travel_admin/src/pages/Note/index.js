import { Form, Button, Radio, DatePicker} from 'antd'
import locale from 'antd/es/date-picker/locale/zh_CN'
import { Table, Tag, Space } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import img404 from '@/assets/error.png'
import { useEffect, useState } from 'react'
import './index.scss'
import axios from 'axios'

const { RangePicker } = DatePicker

const Note = () => {
  // 列数据
  const columns = [
    {
      title: '封面',
      dataIndex: 'cover',
      width: 150,
      render: cover => {
        return <img src={cover.images[0] || img404} width={100} height={80} alt="" />
      }
    },
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 120,
      render: data => <Tag color="green">已审核</Tag>,
      filters: [
        {
          text: '待审核',
          value: 0,
        },
        {
          text: '已通过',
          value: 1,
        },
        {
          text: '未通过',
          value: 2,
        },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: '发布时间',
      dataIndex: 'pubdate',
      width: '15%',
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) => {
        const a1 = +new Date(a.pubdate)
        const b1 = +new Date(b.pubdate)
        return a1 - b1
      }
    },
    {
      title: '操作',
      width: '10%',
      render: data => {
        return (
          <Space size="middle">
            <Button type="primary" shape="circle" icon={<EditOutlined />} />
            <Button
              type="primary"
              danger
              shape="circle"
              icon={<DeleteOutlined />}
            />
          </Space>
        )
      }
    }
  ]
  // 获取列表
  const [reqData, setReqData] = useState({
    status: '',
    begin_date: '',
    end_date: '',
    page: 1,
    per_page: 10
  })
  // 游记列表数据管理
  const [noteList, setNoteList] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  useEffect(() => {
    async function fetchNoteList(){
      const res = await axios.get('http://localhost:3004/noteList')
      // await request.get('',{reqData})
      setNoteList(res.data)
      setTotalCount(res.data.length)
    }
    fetchNoteList()
  },[reqData])
  const onFinish = (formValues) => {
    console.log(formValues);
    setReqData({
      ...reqData,
      status: formValues.status,
      begin_date: formValues.date[0].format('YYYY-MM-DD'),
      end_date: formValues.date[1].format('YYYY-MM-DD'),
     })
  }
  return (
    <div>
        <Form initialValues={{ status: '' }} className='formStyle' onFinish={onFinish}>
          <Form.Item label="状态" name="status">
            <Radio.Group>
              <Radio value={''}>全部</Radio>
              <Radio value={0}>待审核</Radio>
              <Radio value={1}>已通过</Radio>
              <Radio value={2}>未通过</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="日期" name="date">
            {/* 传入locale属性 控制中文显示*/}
            <RangePicker locale={locale}></RangePicker>
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 40 }}>
              筛选
            </Button>
          </Form.Item>
        </Form>
        <Table rowKey="id" columns={columns} dataSource={noteList} />
      {/* <Card title={`根据筛选条件共查询到 count 条结果：`}>
      </Card> */}
    </div>
  )
}


export default Note