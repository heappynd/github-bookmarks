import {
  FormInstance,
  ModalForm,
  ProFormText,
} from '@ant-design/pro-components'
import { useRef, useState } from 'react'
import { getInfo } from './api'
import { Info } from './api/types'
import List from './components/List'

interface Values {
  url: string
}

function App() {
  const [list, setList] = useState<Info[]>(() =>
    JSON.parse(localStorage.getItem('list') ?? '[]')
  )

  const onDelete = (id: number) => {
    const l = list.filter((item) => item.id !== id)
    localStorage.setItem('list', JSON.stringify(l))
    setList(l)
  }

  const [open, setOpen] = useState(false)

  const formRef = useRef<FormInstance>(null)

  return (
    <div className="App">
      <List dataSource={list} onDelete={onDelete} open={() => setOpen(true)} />

      <ModalForm<Values>
        formRef={formRef}
        open={open}
        onOpenChange={setOpen}
        title="新增"
        width={580}
        onFinish={async (values) => {
          console.log(values.url)
          const pathname = new URL(values.url).pathname.substring(1)
          // https://github.com/element-plus/element-plus
          const [owner, repo] = pathname.split('/')
          const info = await getInfo(owner, repo)
          const l = [info.data, ...list]
          setList(l)
          localStorage.setItem('list', JSON.stringify(l))
          formRef.current?.resetFields()
          return true
        }}
      >
        <ProFormText
          label="Github URL"
          name="url"
          rules={[{ required: true }]}
        />
      </ModalForm>
    </div>
  )
}

export default App
