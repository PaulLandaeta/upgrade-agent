import { Upload, Button, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'

const props: UploadProps = {
  name: 'file',
  multiple: false,
  action: '/api/analyze', // ajustar cuando backend esté listo
  onChange(info) {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} cargado exitosamente`)
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} falló al cargar`)
    }
  },
}

export default function UploadPage() {
  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Sube tu proyecto Angular</h2>
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Seleccionar archivo ZIP</Button>
      </Upload>
    </div>
  )
}
