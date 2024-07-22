import { Form, Button, Radio, DatePicker, Popover, Popconfirm } from "antd";
import { message,Table, Tag, Space, Input, Image } from "antd";
import { EditOutlined,DeleteOutlined,EyeOutlined } from "@ant-design/icons";
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
  const [isCanDel,setIsCanDel] = useState(false) // 是否可以删除
  const [dataId,setDataId] =useState(null) // 详情页id
  const [view,setView] =useState(1) // 0 编辑 1 查看
  const [isShow,setIsShow] = useState(false) // 是否显示详情页 false显示列表页 true显示详情页

  useEffect(()=>{
      setIsCanDel(type_id===1 ? true:false)
  },[type_id])
  // 获取数据
  useEffect(() => {
    const initData=()=>{
      setLoading(true)
      request.get('/travels/web/getTravels',{params:{page:1,pageSize:10}}).then(res=>{
        //添加序号
        let list=res.travels
        for (let index = 0; index < list.length; index++) {
          let key=index+1
          list[index].key=key
        }
        setNoteList(list)
        setTotalCount(res.quantity)
        setLoading(false)
      })
    }
    initData()
  }, [])
  // 查询操作
  const onFinish = (formValues) => {
    console.log(formValues);
    const { title, date, travelState } = formValues;
    let params={
      ...reqData,
      travelState: travelState,
      beginDate: date ? date[0].format("YYYY-MM-DD") : "",
      endDate: date ? date[1].format("YYYY-MM-DD") : "",
      title: title, 
      page: 1
    }
    
    const throttleAction = throttle(fetchNoteList, 100)
    throttleAction(params)
  }
  // 节流函数
  function throttle(fn, delay) {
    let timer = null;
    return function () {
      if (!timer) {
        timer = setTimeout(() => {
          fn.apply(this, arguments)
          timer = null
        }, delay)
      }
    }
  }
  const divRef=useRef(null)
  // 触发分页
  const handleTableChange = (page) => {
    fetchNoteList({
      ...reqData,
      page: page.current,
      pageSize:page.pageSize
    })
    divRef.current.scrollIntoView() // 滚动到顶部
  };
  //详情页返回
  const onCancel= ()=>{
    setIsShow(false)
  }
  const fetchNoteList= (params)=> {
    setReqData(params)
    setLoading(true)
    request.get('/travels/web/getTravels',{params:params}).then(res=>{
      //添加序号
      let list=res.travels
      for (let index = 0; index < list.length; index++) {
        let key=(params.page-1)*params.pageSize+index+1
        list[index].key=key
      }
      setLoading(false)
      setNoteList(list)
      setTotalCount(res.quantity)
    })
  }
  //详情页提交
  const onSubmit=()=>{
    setIsShow(false)
    message.success("审核完成")
    fetchNoteList(reqData)
  }
  // onConfirm 删除操作
  const onConfirm = (data)=> {
    request.post('travels/web/deleteOneTravel',{id:data._id}).then(res=>{
      fetchNoteList(reqData)
      message.success("删除成功")
    })
  }
  //跳转详情页
  const toView = (data,view)=>{
    setDataId(data._id)
    setView(view)
    setIsShow(true)
  }
  return (
    <div ref={divRef}>
      <div style={{display:!isShow? 'block' : 'none'}}>
        <ConfigProvider locale={zhCN}>
          <Form name="searchForm"
          initialValues={{ travelState: "" }}
          className="form-style"
          onFinish={onFinish}
          autoComplete="off"
          >
          <Form.Item label="状态" name="travelState">
            <Radio.Group name="radiogroup" >
              <Radio value={""}>全部</Radio>
              <Radio value={0}>未通过</Radio>
              <Radio value={1}>已通过</Radio>
              <Radio value={2}>待审核</Radio>
            </Radio.Group>
          </Form.Item>
  
          <Form.Item label="日期" name="date">
             <RangePicker />
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
