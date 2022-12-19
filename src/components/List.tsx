import { DeleteOutlined, GithubOutlined, HomeOutlined } from '@ant-design/icons'
import { ProList } from '@ant-design/pro-components'
import { Badge, Button, Space, Tag, Typography } from 'antd'
import React, { FC, useMemo, useState } from 'react'
import { Info } from '../api/types'
import Highlighter from 'react-highlight-words'

interface IProps {
  dataSource: Info[]
  onDelete(id: number): void
  open(): void
}

const renderBadge = (count: number, active = false) => {
  return (
    <Badge
      count={count}
      style={{
        marginBlockStart: -2,
        marginInlineStart: 4,
        color: active ? '#1890FF' : '#999',
        backgroundColor: active ? '#E6F7FF' : '#eee',
      }}
    />
  )
}

const List: FC<IProps> = ({ dataSource, onDelete, open }) => {
  const [activeKey, setActiveKey] = useState<React.Key | undefined>('tab1')
  const [query, setQuery] = useState('')

  const data = useMemo(() => {
    return dataSource.filter((item) => {
      return new RegExp(query, 'i').test(item.description)
    })
  }, [dataSource, query])

  return (
    <ProList<Info>
      pagination={{ pageSize: 7 }}
      toolbar={{
        menu: {
          activeKey,
          items: [
            {
              key: '',
              label: <span>全部 {renderBadge(99, activeKey === 'all')}</span>,
            },
            {
              key: 'vue',
              label: <span>Vue {renderBadge(9, activeKey === 'vue')}</span>,
            },
            {
              key: 'react',
              label: <span>React {renderBadge(9, activeKey === 'react')}</span>,
            },
            {
              key: 'node',
              label: <span>Node {renderBadge(9, activeKey === 'node')}</span>,
            },
            {
              key: 'ant',
              label: <span>Antd {renderBadge(9, activeKey === 'ant')}</span>,
            },
          ],
          onChange: (key) => {
            setActiveKey(key)
            setQuery(key)
          },
        },
        search: {
          onSearch: (value) => {},
          allowClear: true,
        },
        actions: [
          <Button type="primary" key="primary" onClick={open}>
            新建
          </Button>,
        ],
      }}
      rowKey="name"
      headerTitle="基础列表"
      dataSource={data}
      metas={{
        title: {
          dataIndex: 'name',
        },
        avatar: {
          dataIndex: ['owner', 'avatar_url'],
        },
        description: {
          dataIndex: 'description',
          render: (text, record) => {
            return (
              <Typography.Paragraph type="secondary" ellipsis={{ rows: 1 }}>
                <Highlighter
                  searchWords={[query]}
                  textToHighlight={record.description}
                  activeStyle={{ background: 'red' }}
                  caseSensitive={false}
                />
              </Typography.Paragraph>
            )
          },
        },
        subTitle: {
          dataIndex: 'language',
          render: (text, record) => {
            return text && <Tag color="green">{text}</Tag>
          },
        },
        content: {
          dataIndex: 'topics',
          render: (text, record) => (
            <Space size={0}>
              {record.topics.slice(0, 5).map((item) => (
                <Tag key={item} color="blue">
                  {item}
                </Tag>
              ))}
            </Space>
          ),
        },
        actions: {
          render: (text, record) => [
            record.homepage && (
              <Button
                key={1}
                icon={<HomeOutlined />}
                href={record.homepage}
                target="_blank"
              />
            ),
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
}

export default List
