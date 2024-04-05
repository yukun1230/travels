import { Form, Button, Radio, DatePicker} from 'antd'
import locale from 'antd/es/date-picker/locale/zh_CN'
import { Table, Tag, Space, Input } from 'antd'
import { EditOutlined, DeleteOutlined, AudioOutlined} from '@ant-design/icons'
import img404 from '@/assets/error.png'
import { useEffect, useState } from 'react'
import './index.scss'
import axios from 'axios'

const { RangePicker } = DatePicker
const { Search } = Input;

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
    title: '',
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
      pageSize: 3,
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
  // 筛选功能
  const onFinish = (formValues) => {
    console.log(formValues);
    const { title, date, status } = formValues
    setReqData({
      ...reqData,
      status: status,
      begin_date: date ? date[0].format('YYYY-MM-DD') : '',
      end_date: date ? date[1].format('YYYY-MM-DD') : '',
      title: title
     })
  }
// 通过游记标题搜索
  const onSearch = (value) => {
    setReqData({
      ...reqData,
      title: value
     })
  }
  // 触发分页
  const handleTableChange = (page) => {
    console.log(page);
    setReqData({
      ...reqData,
      page
     })
  }
  return (
    <div>
      <Form
        initialValues={{ status: "" }}
        className="formStyle"
        onFinish={onFinish}
      >
        <Form.Item label="状态" name="status">
          <Radio.Group>
            <Radio value={""}>全部</Radio>
            <Radio value={0}>待审核</Radio>
            <Radio value={1}>已通过</Radio>
            <Radio value={2}>未通过</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="日期" name="date">
          {/* 传入locale属性 控制中文显示*/}
          <RangePicker locale={locale}></RangePicker>
        </Form.Item>
        <Form.Item label="标题" name="title">
          <Search
            placeholder="通过标题搜索"
            allowClear
            onSearch={onSearch}
            style={{
              width: 200,
            }}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ marginLeft: 40 }}>
            筛选
          </Button>
        </Form.Item>
      </Form>
      <Table rowKey="id" columns={columns} dataSource={noteList} onChange={handleTableChange}/>
      {/* <Card title={`根据筛选条件共查询到 count 条结果：`}>
      </Card> */}
    </div>
  );
}


export default Note