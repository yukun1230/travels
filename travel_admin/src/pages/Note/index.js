import { Form, Button, Radio, DatePicker, Popover, Popconfirm } from "antd";
import { message,Table, Tag, Space, Input, Image } from "antd";
import { EditOutlined,DeleteOutlined,EyeOutlined } from "@ant-design/icons";
// import locale from "antd/es/date-picker/locale/zh_CN";
import img404 from "@/assets/error.png";
import { useEffect, useState,useRef} from "react";
import { useSelector } from 'react-redux';
import "./index.scss";
import { request } from "@/utils";
import Detail from "../Detail";
import dayjs from "dayjs";
import zhCN from 'antd/lib/locale/zh_CN'; // 引入中文语言包
import 'dayjs/locale/zh-cn';
import {ConfigProvider} from 'antd';

const { RangePicker } = DatePicker;

const Note = () => {
  // 角色类型
  const type_id = useSelector(state => state.user.userInfo.type_id)
  // 游记状态枚举
  const status = {
    1: <Tag color="success">已通过</Tag>,
    2: <Tag color="warning">待审核</Tag>,
  };
  // 列数据
  const columns = [
    {
      title: "序号",
      dataIndex: "key",
      width:"5%"
    },
    {
      title: "封面",
      dataIndex: "photo",
      width: "8%",
      render: (photo) => {
        return (
          <Image height={80} 
              src={photo[0].uri || img404}/>
        );
      },
    },
    {
      title: "标题",
      dataIndex: "title",
    },
    {
      title: "状态",
      dataIndex: "travelState",
      width: "8%",
      render: (travelState,data) => {
        return travelState !== 0 ? (
          status[travelState]
        ) : (
          <Popover title={data.rejectedReason} trigger="hover">
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
      width: "10%",
      render: (pubDate) => {
        return dayjs(pubDate).format("YYYY-MM-DD HH:mm:ss")
      },
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
            <Button
              type="primary"
              shape="circle"
              icon={<EyeOutlined />}
              onClick={() => {
                toView(data, 1);
              }}
            />
            {data.travelState === 2 && (
              <Button
                type="primary"
                shape="circle"
                icon={<EditOutlined />}
                onClick={() => {
                  toView(data, 0);
                }}
              />
            )}
            <Popconfirm
              title="删除游记"
              description="确认要删除当前游记吗?"
              onConfirm={() => onConfirm(data)}
              okText="确定"
              cancelText="取消"
            >
              {isCanDel && (
                <Button
                  type="primary"
                  danger
                  shape="circle"
                  icon={<DeleteOutlined />}
                />
              )}
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
    beginDate: "",
    endDate: "",
    page: 1,
    pageSize: 10,
  });
  // 游记列表数据管理
  const [noteList, setNoteList] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false);
  const [isCanDel,setIsCanDel] = useState(false)
  const [dataId,setDataId] =useState(null)
  const [view,setView] =useState(1)
  const [isShow,setIsShow] = useState(false)

  useEffect(()=>{
      setIsCanDel(type_id===1 ? true:false)
  },[type_id])
  // 获取数据
  useEffect(() => {
    setLoading(true)
    const initData=()=>{
      request.get('/travels/web/getTravels',{params:reqData}).then(res=>{
        //添加序号
        let list=res.travels
        for (let index = 0; index < list.length; index++) {
          let key=(reqData.page-1)*reqData.pageSize+index+1
          list[index].key=key
        }
        setNoteList(list)
        setTotalCount(res.quantity)
        setLoading(false)
      })
    }
    initData()
  }, [reqData])
  // 查询操作
  const onFinish = (formValues) => {
    const { title, date, travelState } = formValues;
    setReqData({
      ...reqData,
      travelState: travelState,
      beginDate: date ? date[0].format("YYYY-MM-DD") : "",
      endDate: date ? date[1].format("YYYY-MM-DD") : "",
      title: title, 
      page: 1
    });
  };
  const divRef=useRef(null)
  // 触发分页
  const handleTableChange = (page) => {
    setReqData({
      ...reqData,
      page: page.current,
      pageSize:page.pageSize
    });
    divRef.current.scrollIntoView()
  };
  //详情页返回
  const onCancel= ()=>{
    setIsShow(false)
  }
  const fetchNoteList= ()=> {
    // const res = await axios.get("http://localhost:3004/noteList");
    request.get('/travels/web/getTravels',{params:reqData}).then(res=>{
      //添加序号
      let list=res.travels
      for (let index = 0; index < list.length; index++) {
        let key=(reqData.page-1)*reqData.pageSize+index+1
        list[index].key=key
      }
      setNoteList(list)
      setTotalCount(res.quantity)
    })
  }
  //详情页提交
  const onSubmit=()=>{
    setIsShow(false)
    message.success("审核完成")
    fetchNoteList()
  }
  // onConfirm 删除操作
  const onConfirm = async (data)=> {
    request.post('travels/web/deleteOneTravel',{id:data._id}).then(res=>{
      fetchNoteList()
      message.success("删除成功")
    })
  }
  const toView=async (data,view)=>{
    setDataId(data._id)
    setView(view)
    setIsShow(true)
  }
  return (
    <div ref={divRef}>
      <div style={{display:!isShow? 'block' : 'none'}}>
        <ConfigProvider locale={zhCN}>
          <Form
          initialValues={{ travelState: "" }}
          className="form-style"
          onFinish={onFinish}
          >
          <Form.Item label="状态" name="travelState">
            <Radio.Group>
              <Radio value={""}>全部</Radio>
              <Radio value={0}>未通过</Radio>
              <Radio value={1}>已通过</Radio>
              <Radio value={2}>待审核</Radio>
            </Radio.Group>
          </Form.Item>
  
          <Form.Item label="日期" name="date">
             <RangePicker></RangePicker>
          </Form.Item>
          <Form.Item label="标题" name="title">
            <Input
              placeholder="请输入标题"
              allowClear
              style={{
                width: 200,
              }}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" >
              查询
            </Button>
          </Form.Item>
        </Form>
          <Table
            rowKey="key"
            columns={columns}
            dataSource={noteList}
            pagination={{
              page: reqData.page,
              pageSize: reqData.pageSize,
              total: totalCount,
              showSizeChanger:true,
              showTotal:(total) => `总计 ${total} 条`
            }}
            scroll={{
              y: "80%",
            }}
            loading={loading}
            onChange={handleTableChange}
          />
        </ConfigProvider>

      </div>
      {
        isShow && <Detail noteId={dataId} onSubmit={onSubmit} onCancel={onCancel} view={view}></Detail>
      }
    </div>
  );
};

export default Note;
