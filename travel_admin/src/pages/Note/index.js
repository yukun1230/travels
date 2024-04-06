import { Form, Button, Radio, DatePicker, Card, Popover, Popconfirm } from "antd";
import locale from "antd/es/date-picker/locale/zh_CN";
import { Table, Tag, Space, Input } from "antd";
import { EditOutlined, DeleteOutlined, AudioOutlined } from "@ant-design/icons";
import img404 from "@/assets/error.png";
import { useEffect, useState } from "react";
import "./index.scss";
import axios from "axios";
import { delNoteAPI } from '@/api'
import { useNavigate } from "react-router-dom";

const { RangePicker } = DatePicker;
const { Search } = Input;

const Note = () => {
  const navigate = useNavigate()
  // 游记状态枚举
  const status = {
    0: <Tag color="warning">待审核</Tag>,
    1: <Tag color="success">已通过</Tag>,
  };
  // 列数据
  const columns = [
    {
      title: "封面",
      dataIndex: "cover",
      width: 150,
      render: (cover) => {
        return (
          <img src={cover.images[0] || img404} width={100} height={80} alt="" />
        );
      },
    },
    {
      title: "标题",
      dataIndex: "title",
    },
    {
      title: "状态",
      dataIndex: "status",
      width: 120,
      render: (data) => {
        return data.code != 2 ? (
          status[data.code]
        ) : (
          <Popover title={data.remark} trigger="hover">
            <Tag color="error">未通过</Tag>
          </Popover>
        );
      },
      filters: [
        {
          text: "待审核",
          value: 0,
        },
        {
          text: "已通过",
          value: 1,
        },
        {
          text: "未通过",
          value: 2,
        },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "发布时间",
      dataIndex: "pubDate",
      width: "15%",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => {
        const a1 = +new Date(a.pubDate);
        const b1 = +new Date(b.pubDate);
        return a1 - b1;
      },
    },
    {
      title: "操作",
      width: "15%",
      render: (data) => {
        return (
          <Space size="middle">
            <Button type="primary" shape="circle" icon={<EditOutlined />} 
            onClick={() => navigate(`/detail?id=${data.id}`)} />
            <Popconfirm
              title="删除文章"
              description="确认要删除当前文章吗?"
              onConfirm={() => onConfirm(data)}
              okText="Yes"
              cancelText="No">
              <Button
                type="primary"
                danger
                shape="circle"
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  // 获取列表
  const [reqData, setReqData] = useState({
    title: "",
    status: "",
    begin_date: "",
    end_date: "",
    page: 1,
    per_page: 4,
  });
  // 游记列表数据管理
  const [noteList, setNoteList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  useEffect(() => {
    async function fetchNoteList() {
      const res = await axios.get("http://localhost:3004/noteList");
      // await request.get('',{reqData})
      setNoteList(res.data);
      setTotalCount(res.data.length);
    }
    fetchNoteList();
  }, [reqData]);
  // 筛选功能
  const onFinish = (formValues) => {
    console.log(formValues);
    const { title, date, status } = formValues;
    setReqData({
      ...reqData,
      status: status,
      begin_date: date ? date[0].format("YYYY-MM-DD") : "",
      end_date: date ? date[1].format("YYYY-MM-DD") : "",
      title: title,
    });
  };
  // 通过游记标题搜索
  const onSearch = (value) => {
    setReqData({
      ...reqData,
      title: value,
    });
  };
  // 触发分页
  const handleTableChange = (page) => {
    setReqData({
      ...reqData,
      page: page,
    });
  };
  // onConfirm 删除操作
  const onConfirm = async (data)=> {
    await delNoteAPI(data.id);
    setReqData({
      ...reqData
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
      <Table
        rowKey="id"
        columns={columns}
        dataSource={noteList}
        pagination={{
          pageSize: 4,
        }}
        scroll={{
          y: "80%",
        }}
        onChange={handleTableChange}
      />
      {/* <Card title={`根据筛选条件共查询到 count 条结果：`}>
      </Card> */}
    </div>
  );
};

export default Note;
