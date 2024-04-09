import { Card,Tag,Input,Radio,Form, Breadcrumb, Image, Typography, Button } from "antd";
import { useEffect, useState } from 'react';
import { request } from '@/utils';
import "./index.scss";
 
const { Paragraph } = Typography;

const Detail = ({noteId,view,onSubmit,onCancel}) => {
  const [info,setInfo] = useState(null)
  const [radioValue, setRadioValue] = useState(0)
// 游记状态枚举
const status = {
  0: <Tag color="error">未通过</Tag>,
  1: <Tag color="warning">已通过</Tag>,
  2: <Tag color="success">待审核</Tag>,
};

  useEffect(()=>{
    request.get('/travels/getDetails',{params:{id:noteId}}).then(res=>{
      setInfo(res.travelDetail)
    })
  },[noteId]);
  const onChangeRadioValue=(e)=>{
    setRadioValue(e.target.value)
  }
   // 审核提交
   const onFinish = (values) => {
    console.log(values)
    let remark=values.remark;
    let req={
      id:info._id,
      reason:remark
    }
    let url="travels/web/passOneTravel";
    if(radioValue===1){
      url="travels/web/rejectOneTravel"
    }
    request.post(url,req).then(res=>{
      onSubmit()
    })
  }
  return (
    <div>
      <Breadcrumb
            items={[
              { title: <span className="bread-crumb" onClick={onCancel}>游记管理</span> },
              { title: "游记详情" },
            ]}
            style={{
              marginBottom: '16px',
            }}
          />
      {
        info&&<Card
        title={info.title}
        style={{ marginBottom: 20 }}
        extra={
          status[info.travelState]
        }
      >
        <Image.PreviewGroup
          preview={{
            onChange: (current, prev) =>
              console.log(`current index: ${current}, prev index: ${prev}`),
          }}
        >
          {
            info.photo?info.photo.map(item=>{
              return <Image
              key={item._id}
              height={200}
              style={{paddingRight:'10px'}}
              src={item.uri}
            />
            }):''
          }
        </Image.PreviewGroup>
        <Paragraph>
          <blockquote>
            <div dangerouslySetInnerHTML={{ __html: info.content }} style={{wordBreak: 'break-all', whiteSpace: 'pre-wrap'}}>
            </div>
          </blockquote>
        </Paragraph>
      
        {
          view?<div style={{display:'flex',justifyContent:'flex-end'}}>
            <Button type='primary' onClick={onCancel} >
              返回
            </Button>
          </div>:<Form
          name="normal_verify"
          className="login-form"
          onFinish={onFinish}
          validateTrigger="onBlur"
        >
          <Form.Item label="审核">
            <Radio.Group onChange={onChangeRadioValue} value={radioValue}>
             <Radio value={0}>通过</Radio>
              <Radio value={1}>拒绝</Radio>
            </Radio.Group>
          </Form.Item>
          {
            (radioValue===1)&&<Form.Item
            name="remark"
            label='拒绝原因'
            rules={[{ required: true, message: "请输入拒绝原因!" }]}
          >
            <Input.TextArea
              rows={4}
              maxLength={200}
              placeholder="请输入拒绝原因"
            />
          </Form.Item>
          }
          <Form.Item>
            <div style={{display:'flex',justifyContent:'flex-end'}}>
            <Button
              type="primary"
              htmlType="submit"
            >
              提交
            </Button>
            <Button type='normal' onClick={onCancel} >
              返回
            </Button>
            </div>
          </Form.Item>
        </Form>
        }
      </Card>
      }
    </div>
  );
}

export default Detail;