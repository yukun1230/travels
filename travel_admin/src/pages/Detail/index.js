import { Link } from 'react-router-dom'
import { Card, Breadcrumb, Image, Typography, Button, Flex } from "antd";
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { request } from '@/utils';
 
const { Title, Paragraph } = Typography;

const Detail = () => {
  const [searchParams] = useSearchParams()
  const noteId = searchParams.get('id')
  const view =searchParams.get('view')
  const [info,setInfo] = useState({})

  useEffect(()=>{
    request.get('/travels/getDetails',{params:{id:noteId}}).then(res=>{
      setInfo(res.travelDetail)
    })
  },[])
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
        title={info.title}
        style={{ marginBottom: 20 }}
        extra={<a href="#">More</a>}
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
              height={100}
              style={{paddingRight:'5px'}}
              src={item.uri}
            />
            }):''
          }
        </Image.PreviewGroup>
        <Paragraph>
          <blockquote>{info.content}</blockquote>
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