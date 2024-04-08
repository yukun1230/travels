import { HomeOutlined,DiffOutlined, LogoutOutlined } from '@ant-design/icons';
import { Layout, Menu, theme, Popconfirm } from 'antd';
import './index.scss'
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearUserInfo} from '@/store/modules/user';

const { Header, Sider } = Layout;
const items = [
  {
    label: '游记管理',
    key: '/',
    icon: <DiffOutlined />,
  },
  {
    label: '数据面板',
    key: 'home',
    icon: <HomeOutlined />,
  }
]

const TravelLayout = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate()
  // 点击菜单跳转路由
  const menuClick = (menu) => {
    navigate(menu.key)
  }
  const location = useLocation()
  const selectedKey = location.pathname
  const dispatch = useDispatch()
  // 获取个人信息
  // useEffect(()=>{
  //   dispatch(fetchUserInfo())
  // },[dispatch])
  const name = useSelector(state => {
    return state.user.userInfo.account
  })
  // 退出登录
  const loginOut = () => {
    dispatch(clearUserInfo())
    navigate('/login')
  }
  return (
    <Layout>
      <Header className='header'>
        <div className="logo" />
        <div className="user-info">
          <span className="user-name">{name}</span>
          <span className="user-logout">
            <Popconfirm title="是否确认退出？" okText="退出" cancelText="取消" onConfirm={loginOut}>
              <LogoutOutlined /> 退出
            </Popconfirm>
          </span>
        </div>
        {/* <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          items={items1}
          style={{
            flex: 1,
            minWidth: 0,
          }}
        /> */}
      </Header>
      <Layout>
        <Sider
          width={200}
          style={{
            background: colorBgContainer,
          }}
        >
          <Menu
            mode="inline"
            selectedKeys={selectedKey}
            style={{
              height: '100%',
              borderRight: 0,
            }}
            items={items}
            onClick={menuClick}
          />
        </Sider>
        <Layout className='content'>
          <Outlet></Outlet>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default TravelLayout;