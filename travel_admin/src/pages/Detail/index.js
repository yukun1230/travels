import {
  Card,
  Tag,
  Input,
  Radio,
  Form,
  Breadcrumb,
  Image,
  Typography,
  Button,
  Flex,
  Avatar,
  Space
} from "antd";
import { useEffect, useState } from "react";
import { request } from "@/utils";
import classNames from "classnames"
import "./index.scss";
import { EnvironmentOutlined } from "@ant-design/icons"

const { Paragraph } = Typography;

const Detail = ({ noteId, view, onSubmit, onCancel }) => {
  const [info, setInfo] = useState(null);
  const [radioValue, setRadioValue] = useState(0);
  const [location, setLocation] = useState("");// 发布地点
  // 游记状态枚举
  const status = {
    0: <Tag color="error">未通过</Tag>,
    1: <Tag color="success">已通过</Tag>,
    2: <Tag color="warning">待审核</Tag>,
  };

  useEffect(() => {
    request
      .get("/travels/getDetails", { params: { id: noteId } })
      .then((res) => {
        setInfo(res.travelDetail);
        let info = res.travelDetail;
        if(info.location && info.location.city && info.location.city !== "undefined"){
          setLocation(info.location.city);
        }else if(info.location && info.location.province && info.location.province !== "undefined"){
          setLocation(info.location.province);
        }else if(info.location && info.location.country && info.location.country !== "undefined"){
          setLocation(info.location.country);
        }
      });
      // 发布地点
  }, [noteId]);
  const onChangeRadioValue = (e) => {
    setRadioValue(e.target.value);
  };
  // 审核提交
  const onFinish = (values) => {
    // console.log(values);
    let remark = values.remark;
    const req = {
      id: info._id,
      reason: remark,
    };
    let url = "travels/web/passOneTravel"
    if (radioValue === 1) {
      url = "travels/web/rejectOneTravel"
    }
    request.post(url, req).then((res) => {
      onSubmit()
    })
  }
  
  return (
    <div>
      <Breadcrumb
        items={[
          {
            title: (
              <span className="bread-crumb" onClick={onCancel}>
                游记管理
              </span>
            ),
          },
          { title: "游记详情" },
        ]}
        style={{
          marginBottom: "16px",
        }}
      />
      {info && (
        <Card
          title={info.title}
          style={{ marginBottom: 20 }}
          extra={status[info.travelState]}
        >
          <Image.PreviewGroup>
            {info.photo && 
               <Flex wrap="wrap" gap="middle">
                { info.photo.map((item) => {
                     return (
                       <Image
                         key={item._id}
                         height={200}
                         src={item.uri}
                       />
                     );
                   })
                 }
               </Flex>
            }
          </Image.PreviewGroup>
          <Paragraph>
            <blockquote>
              <div className="travel-content" dangerouslySetInnerHTML={{ __html: info.content }}></div>
            </blockquote>
          </Paragraph>
          <Flex gap="large" justify="flex-start" className="info-desc">
           { location && <Space wrap size={8}>
              <EnvironmentOutlined />
              {location}
            </Space>}
            <Space wrap size={8}>
              <Avatar src={info.userInfo.avatar} />
              {info.userInfo.nickname}
            </Space>
          </Flex>
          {view ? (
            <div className={classNames('view-actions', info.travelState===0 && 'two')}>
              {info.rejectedReason && (
                <Paragraph type="danger" className="reason">
                  <pre>拒绝原因：{info.rejectedReason}</pre>
                </Paragraph>
              )}
              <Button type="primary" onClick={onCancel}>
                返回
              </Button>
            </div>
          ) : (
            <Form
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
              {radioValue === 1 && (
                <Form.Item
                  name="remark"
                  label="拒绝原因"
                  rules={[{ required: true, message: "请输入拒绝原因!" }]}
                >
                  <Input.TextArea
                    showCount
                    rows={4}
                    maxLength={200}
                    placeholder="请输入拒绝原因"
                    allowClear
                  />
                </Form.Item>
              )}
              <Form.Item>
                <div className="view-actions">
                  <Button className="back" onClick={onCancel}>
                    返回
                  </Button>
                  <Button type="primary" htmlType="submit">
                    提交
                  </Button>
                </div>
              </Form.Item>
            </Form>
          )}
        </Card>
      )}
    </div>
  );
};

export default Detail;
