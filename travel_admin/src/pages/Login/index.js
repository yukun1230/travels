import { Card, Form, Button, Checkbox, Input, message } from "antd";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import './index.scss'
import { useDispatch } from "react-redux";
import { fetchLogin } from "@/store/modules/user"; 
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // 参数values为表单输入数据
  const onFinish = async (values) => {
    await dispatch(fetchLogin(values))
    navigate('/')
    message.success("登录成功")
    console.log("Success:", values);
  };
  return (
    <div className="login">
      <Card title="旅游日记管理系统" className="login-content">
        <Form
          name="normal_login"
          className="login-form"
          onFinish={onFinish}
          validateTrigger="onBlur"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "请输入用户名!" }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="账号:admin/user"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入密码!" }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          {/* <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>记住我</Checkbox>
            </Form.Item>
          </Form.Item> */}
          <Form.Item className="login-btn">
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              size="large" block
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
