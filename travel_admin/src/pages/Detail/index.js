import { Link } from 'react-router-dom'
import { Card, Breadcrumb, Image, Typography, Button, Flex } from "antd";
import { useSearchParams } from 'react-router-dom';
 
const { Title, Paragraph } = Typography;

const Detail = () => {
  const [searchParams] = useSearchParams()
  const noteId = searchParams.get('id')
  console.log(noteId);
  const content = {
      key: '1',
      // label: 'Product',
      children: "当我以为的仙侠世界\n\n仅存在于小说的虚幻中\n\n望仙谷却给了我答案\n\n我像是穿越到了 会布衣长裙\n\n走过揽月桥\n\n绝壁之上，悬挂的木屋\n\n伴山而居，融为自然\n\n山体间，横穿的吊桥\n\n仿佛是通行市的望仙谷景区\n\n房屋沿山而建，错落有致\n\n像极了仙侠故事中的山谷美景",
    }
  
  return (
    <div>
      <Breadcrumb
            items={[
              { title: <Link to={"/"}>游记管理</Link> },
              { title: "游记详情" },
            ]}
            style={{
              marginBottom: '16px',
            }}
          />
      <Card
        title="游记的标题"
        style={{ marginBottom: 20 }}
        extra={<a href="#">More</a>}
      >
        <Image.PreviewGroup
          preview={{
            onChange: (current, prev) =>
              console.log(`current index: ${current}, prev index: ${prev}`),
          }}
        >
          <Image
            width={200}
            src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
          />
          <Image
            width={200}
            src="https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg"
          />
        </Image.PreviewGroup>
        <Paragraph>
          <blockquote>{content.children}</blockquote>
        </Paragraph>
        <Flex gap="small" justify="flex-end" wrap="wrap">
          <Button>拒绝</Button>
          <Button type="primary">
            通过
          </Button>
        </Flex>
      </Card>
    </div>
  );
}

export default Detail;