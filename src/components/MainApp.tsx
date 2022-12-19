import { ModalForm, ProFormText } from '@ant-design/pro-components'
import { Button, Card, Divider } from 'antd'
import React, { useState } from 'react'
import { getInfo } from '../api'
import { Info } from '../api/types'
import List from './List'

interface Values {
  url: string
}

const MainApp = () => {
  const [list, setList] = useState<Info[]>(() =>
    JSON.parse(localStorage.getItem('list') ?? '[]')
  )

  const onDelete = (id: number) => {
    const l = list.filter((item) => item.id !== id)
    localStorage.setItem('list', JSON.stringify(l))
    setList(l)
  }

  return (
    <div>
      <ModalForm<Values>
        trigger={<Button>Open</Button>}
        title="新增"
        width={580}
        onFinish={async (values) => {
          console.log(values.url)
          const pathname = new URL(values.url).pathname.substring(1)
          // https://github.com/element-plus/element-plus
          const [owner, repo] = pathname.split('/')
          const info = await getInfo(owner, repo)
          const l = [...list, info.data]
          setList(l)
          localStorage.setItem('list', JSON.stringify(l))
          return true
        }}
      >
        <ProFormText
          label="Github URL"
          name="url"
          rules={[{ required: true }]}
        />
      </ModalForm>

      <Divider type="horizontal" />

      <List dataSource={list} onDelete={onDelete} />
    </div>
  )
}

export default MainApp
