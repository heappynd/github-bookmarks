import { ProList } from '@ant-design/pro-components'
import { Button, Space, Tag } from 'antd'
import { FC } from 'react'
import { Info } from '../api/types'
import { GithubOutlined, HomeOutlined, DeleteOutlined } from '@ant-design/icons'

interface IProps {
  dataSource: Info[]
  onDelete(id: number): void
}

const List: FC<IProps> = ({ dataSource, onDelete }) => (
  <ProList<Info>
    pagination={{ pageSize: 5 }}
    toolBarRender={() => {
      return [
        <Button key="add" type="primary">
          新建
        </Button>,
      ]
    }}
    onRow={(record: any) => {
      return {
        onMouseEnter: () => {
          console.log(record)
        },
        onClick: () => {
          console.log(record)
        },
      }
    }}
    rowKey="name"
    headerTitle="基础列表"
    dataSource={dataSource}
    metas={{
      title: {
        dataIndex: 'name',
      },
      avatar: {
        dataIndex: ['owner', 'avatar_url'],
      },
      description: {
        dataIndex: 'description',
      },
      subTitle: {
        render: (text, record) => {
          return (
            <Space size={0}>
              {record.topics.slice(0, 3).map((item) => (
                <Tag key={item} color="blue">
                  {item}
                </Tag>
              ))}
            </Space>
          )
        },
      },
      content: {
        dataIndex: 'language',
      },
      actions: {
        render: (text, record) => [
          <Button
            key={1}
            icon={<HomeOutlined />}
            href={record.homepage}
            target="_blank"
          />,
          <Button
            key={2}
            icon={<GithubOutlined />}
            href={record.html_url}
            target="_blank"
          />,
          <Button
            key={3}
            icon={<DeleteOutlined />}
            onClick={() => {
              onDelete(record.id)
            }}
          />,
        ],
      },
    }}
  />
)

export default List
