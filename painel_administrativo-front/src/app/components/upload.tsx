import React from "react"
import { InboxOutlined } from "@ant-design/icons"
import { Upload, message } from "antd"

import type { UploadProps } from "antd"

const { Dragger } = Upload

const props: UploadProps = {
  name: "file",
  multiple: true,
  action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload", //trocar para a api que faz upload de arquivo.
  onChange(info) {
    const { status } = info.file
    if (status !== "uploading") {
      console.log(info.file, info.fileList)
    }
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`)
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`)
    }
  },
  onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files)
  },
}

const UploadComponent: React.FC = () => (
  <Dragger {...props}>
    <p className="ant-upload-drag-icon">
      <InboxOutlined />
    </p>
    <p className="ant-upload-text">Clique ou arraste aqui para fazer o envio</p>
  </Dragger>
)

export default UploadComponent
