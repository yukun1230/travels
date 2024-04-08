import { Form, Button, Radio, DatePicker, Card, Popover, Popconfirm } from "antd";
import locale from "antd/es/date-picker/locale/zh_CN";
import { Table, Tag, Space, Input } from "antd";
import { EditOutlined, InfoCircleOutlined,DeleteOutlined } from "@ant-design/icons";
import img404 from "@/assets/error.png";
import { useEffect, useState } from "react";
import "./index.scss";
import axios from "axios";
import { delNoteAPI } from '@/api'
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { request } from "@/utils";

const { RangePicker } = DatePicker;
const { Search } = Input;


const Note = () => {
  const navigate = useNavigate()
  // 游记状态枚举
  const status = {
    1: <Tag color="warning">已通过</Tag>,
    2: <Tag color="success">待审核</Tag>,
  };
  // 列数据
  const columns = [
    {
      title: '序号',
      dataIndex: 'key',
      width:80
    },
    {
      title: "封面",
      dataIndex: "photo",
      width: 150,
      render: (photo) => {
        return (
          <img src={photo[0].uri || img404} width={100} height={80} alt="" />
        );
      },
    },
    {
      title: "标题",
      dataIndex: "title",
      ellipsis: true,
    },
    {
      title: "状态",
      dataIndex: "travelState",
      width: 120,
      render: (travelState,data) => {
        return travelState !== 0 ? (
          status[travelState]
        ) : (
          <Popover title={data.remark} trigger="hover">
            <Tag color="error">未通过</Tag>
          </Popover>
        );
      },
      filters: [
        {
          text: "未通过",
          value: 0,
        },
        {
          text: "已通过",
          value: 1,
        },
        {
          text: "待审核",
          value: 2,
        },
      ],
      onFilter: (value, record) => {
        console.log(value,record.travelState)
        return record.travelState === value
      },
    },
    {
      title: "内容",
      dataIndex: "content",
      ellipsis: true,
    },
    {
      title: "发布时间",
      dataIndex: "createTime",
      width: "15%",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => {
        const a1 = +new Date(a.createTime);
        const b1 = +new Date(b.createTime);
        return a1 - b1;
      },
    },
    {
      title: "操作",
      width: "15%",
      render: (data) => {
        return (
          <Space size="middle">
            <InfoCircleOutlined onClick={() => navigate(`/detail?id=${data._id}&view=1`)}/>
            {
              data.travelState === 2 ?<Button type="primary" shape="circle" icon={<EditOutlined />} 
              onClick={() => navigate(`/detail?id=${data._id}&view=0`)} />:''
            }
            <Popconfirm
              title="删除文章"
              description="确认要删除当前文章吗?"
              onConfirm={() => onConfirm(data)}
              okText="Yes"
              cancelText="No">
              {isCanDel?<Button
                type="primary"
                danger
                shape="circle"
                icon={<DeleteOutlined />}
              />:''}
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  // 获取列表
  const [reqData, setReqData] = useState({
    title: "",
    travelState: "",
    begin_date: "",
    end_date: "",
    page: 1,
    pageSize: 10,
  });
  // 游记列表数据管理
  const [noteList, setNoteList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isCanDel,setIsCanDel] = useState(false);

  const type_id = useSelector(state => {
    console.log(state.user)
    return state.user.userInfo.type_id
  })
  useEffect(()=>{
      setIsCanDel(type_id==='1'?true:false)
  },[type_id])
  useEffect(() => {
    function fetchNoteList() {
      // const res = await axios.get("http://localhost:3004/noteList");
      console.log(reqData)
      request.get('/travels/web/getTravels',{params:reqData}).then(res=>{
        //添加序号
        let list=res.travels;
        for (let index = 0; index < list.length; index++) {
          let key=(reqData.page-1)*reqData.pageSize+index+1;
          list[index].key=key;
        }
        setNoteList(list);
        setTotalCount(res.quantity);
      })
    }
    fetchNoteList();
  }, [reqData]);
  // 筛选功能
  const onFinish = (formValues) => {
    console.log(formValues);
    const { title, date, travelState } = formValues;
    setReqData({
      ...reqData,
      travelState: travelState,
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
      page: page.current,
      pageSize:page.pageSize
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
        initialValues={{ travelState: "" }}
        className="formStyle"
        onFinish={onFinish}
      >
        <Form.Item label="状态" name="travelState">
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
          page: reqData.page,
          pageSize: reqData.pageSize,
          total: totalCount
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
