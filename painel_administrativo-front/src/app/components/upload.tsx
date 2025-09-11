import React from "react"
import { InboxOutlined } from "@ant-design/icons"
import { Upload, message } from "antd"

import type { UploadProps } from "antd"

const { Dragger } = Upload

type UploadComponentProps = {
  height?: number
  iconSize?: number
  text?: boolean
}

const UploadComponent: React.FC<UploadComponentProps> = ({
  height = 180,
  iconSize = 48,
  text = true,
}) => {
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
        message.success(`${info.file.name} Arquivo enviado com sucesso.`)
      } else if (status === "error") {
        message.error(`${info.file.name} Falha ao carregar arquivo!`)
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files)
    },
  }

  return (
    <Dragger {...props} height={height}>
      <p className="ant-upload-drag-icon" style={{ fontSize: iconSize }}>
        <InboxOutlined style={{ fontSize: iconSize }} />
      </p>
      {text && (
        <p className="ant-upload-text">
          Clique ou arraste aqui para fazer o envio
        </p>
      )}
    </Dragger>
  )
}

export default UploadComponent
