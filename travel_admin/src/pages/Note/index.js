import { Form, Button, Radio, DatePicker, Popover, Popconfirm } from "antd";
import locale from "antd/es/date-picker/locale/zh_CN";
import { message,Table, Tag, Space, Input } from "antd";
import { EditOutlined,DeleteOutlined,EyeOutlined } from "@ant-design/icons";
import img404 from "@/assets/error.png";
import { useEffect, useState} from "react";
import "./index.scss";
import { useSelector } from 'react-redux';
import { request } from "@/utils";
import Detail from "../Detail";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;


const Note = () => {
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
      width:70
    },
    {
      title: "封面",
      dataIndex: "photo",
      width: '10%',
      render: (photo) => {
        return (
          <img src={photo[0].uri || img404}  height={80} alt="" />
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
      width: "12%",
      render: (data) => {
        return (
          <Space size="middle">
            <Button type="primary" shape="circle" icon={<EyeOutlined />} 
            onClick={()=>{toView(data,1)}} /> 
            {/* <InfoCircleOutlined onClick={() => navigate(`/detail?id=${data._id}&view=1`)}/> */}
            {
              data.travelState === 2 && <Button type="primary" shape="circle" icon={<EditOutlined />} 
              onClick={()=>{toView(data,0)}} /> 
            }
            <Popconfirm
              title="删除游记"
              description="确认要删除当前游记吗?"
              onConfirm={() => onConfirm(data)}
              okText="确定"
              cancelText="取消">
              {isCanDel && <Button
                type="primary"
                danger
                shape="circle"
                icon={<DeleteOutlined />}
              /> }
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
  const [isCanDel,setIsCanDel] = useState(false)
  const [dataId,setDataId] =useState(null)
  const [view,setView] =useState(1)
  const [isShow,setIsShow] = useState(false)

  const type_id = useSelector(state => state.user.userInfo.type_id)

  useEffect(()=>{
      setIsCanDel(type_id==='1'?true:false)
  },[type_id])
  useEffect(() => {
    const initData=()=>{
      request.get('/travels/web/getTravels',{params:reqData}).then(res=>{
        //添加序号
        console.log(res)
        let list=res.travels;
        for (let index = 0; index < list.length; index++) {
          let key=(reqData.page-1)*reqData.pageSize+index+1
          list[index].key=key
        }
        setNoteList(list);
        setTotalCount(res.quantity)
      })
    }
    initData()
  }, [reqData])
  // 筛选功能
  const onFinish = (formValues) => {
    const { title, date, travelState } = formValues;
    setReqData({
      ...reqData,
      travelState: travelState,
      beginDate: date ? date[0].format("YYYY-MM-DD") : "",
      endDate: date ? date[1].format("YYYY-MM-DD") : "",
      title: title, 
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
  //详情页返回
  const onCancel= ()=>{
    setIsShow(false)
  }
  const fetchNoteList= ()=> {
    // const res = await axios.get("http://localhost:3004/noteList");
    request.get('/travels/web/getTravels',{params:reqData}).then(res=>{
      //添加序号
      let list=res.travels;
      for (let index = 0; index < list.length; index++) {
        let key=(reqData.page-1)*reqData.pageSize+index+1
        list[index].key=key
      }
      setNoteList(list);
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
          <Form
          initialValues={{ travelState: "" }}
          className="formStyle"
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
            {/* 传入locale属性 控制中文显示*/}
            <RangePicker locale={locale}></RangePicker>
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
            <Button type="primary" htmlType="submit" style={{ marginLeft: 40 }}>
              查询
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
            total: totalCount,
            showSizeChanger:true,
            locale:{
              items_per_page: '/页',
            },
            showTotal:(total) => `总计${total}条`
          }}
          scroll={{
            y: "80%",
          }}
          onChange={handleTableChange}
        />

      </div>
      {
        isShow&&<Detail noteId={dataId} onSubmit={onSubmit} onCancel={onCancel} view={view}></Detail>
      }
    </div>
  );
};

export default Note;
