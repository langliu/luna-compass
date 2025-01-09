import { type ChangeEvent, type PropsWithChildren, useRef, useState } from 'react'
import './index.css'
import Dragger from './dragger'
import { type UploadFile, UploadList } from './upload-list'

export type UploadProps = PropsWithChildren<{
  /**
   * 上传地址
   */
  action: string
  /**
   * 上传携带的请求头
   */
  headers?: Record<string, string>
  /**
   * 上传的文件字段名, 默认为 `file`
   */
  name?: string
  /**
   * 上传携带的额外数据
   */
  data?: Record<string, string>
  /**
   * 是否携带 cookie
   */
  withCredentials?: boolean
  /**
   * 上传文件的类型
   */
  accept?: string
  /**
   * 是否支持多选
   */
  multiple?: boolean
  /**
   * 上传文件状态改变时的回调
   * @param file
   * @returns
   */
  beforeUpload?: (file: File) => boolean | Promise<File>
  onSuccess?: (response: unknown, file: File) => void
  onError?: (error: Error, file: File) => void
  onChange?: (file: File) => void
  onProgress?: (percentage: number, file: File) => void
  onRemove?: (file: UploadFile) => void
  drag?: boolean
}>

export function Upload({
  action,
  name = 'file',
  headers = {},
  data,
  withCredentials = false,
  accept,
  multiple = false,
  children,
  beforeUpload,
  onSuccess,
  onError,
  onChange,
  onProgress,
  onRemove,
  drag = false,
}: UploadProps) {
  const uploadRef = useRef<HTMLInputElement>(null)

  const [fileList, setFileList] = useState<UploadFile[]>([])

  /**
   * 触发上传文件选择
   */
  const handleClick = () => {
    if (uploadRef.current) {
      uploadRef.current.click()
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target
    // 判断是否有文件被选择
    if (files && files.length > 0) {
      uploadFiles(files)
      // 清空文件选择框
      if (uploadRef.current) {
        uploadRef.current.value = ''
      }
    }
  }

  const uploadFiles = (files: FileList) => {
    // 处理文件上传
    for (const file of Array.from(files)) {
      // 检查是否定义了 beforeUpload 函数
      if (beforeUpload) {
        const result = beforeUpload(file)
        // 如果返回值是一个 Promise
        if (result && result instanceof Promise) {
          // 等待 Promise 解析并获取处理后的文件
          result.then((file) => {
            // 调用 handleUpload 函数上传文件
            handleUpload(file)
          })
        } else if (result) {
          // 如果 beforeUpload 函数返回 true，则直接上传文件
          handleUpload(file)
        }
      } else {
        // 如果没有定义 beforeUpload 函数，则直接上传文件
        handleUpload(file)
      }
    }
  }

  // 处理文件上传
  const handleUpload = async (file: File) => {
    const uploadFile: UploadFile = {
      uid: `${Date.now()}upload-file${file.name}`,
      status: 'ready',
      name: file.name,
      size: file.size,
      percent: 0,
      raw: file,
    }
    setFileList((prevList) => {
      return [uploadFile, ...prevList]
    })
    // 创建 FormData 对象
    const formData = new FormData()
    formData.append(name, file)
    // 添加额外数据
    if (data) {
      for (const key of Object.keys(data)) {
        formData.append(key, data[key])
      }
    }

    // 发送请求
    const xhr = new XMLHttpRequest()
    xhr.open('POST', action, true)
    xhr.withCredentials = withCredentials
    // 设置请求头
    for (const key in headers) {
      xhr.setRequestHeader(key, headers[key])
    }
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = (event.loaded / event.total) * 100
        if (progress < 100) {
          updateFileList(uploadFile, {
            percent: progress,
            status: 'uploading',
          })
        }
        onProgress?.(progress, file)
        // 在这里可以调用一个函数来更新进度条或其他UI元素
      }
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.responseText)
        updateFileList(uploadFile, { status: 'success', response: response })
        onSuccess?.(response, file)
      } else {
        updateFileList(uploadFile, {
          status: 'error',
          error: new Error('Upload failed'),
        })
        onError?.(new Error('Upload failed'), file)
      }
      onChange?.(file)
    }

    xhr.onerror = () => {
      updateFileList(uploadFile, {
        status: 'error',
        error: new Error('Network error'),
      })
      onError?.(new Error('Network error'), file)
      onChange?.(file)
    }

    xhr.onabort = () => {
      onError?.(new Error('Upload aborted'), file)
      onChange?.(file)
    }

    xhr.send(formData)
  }

  const updateFileList = (file: UploadFile, uploadObj: Partial<UploadFile>) => {
    setFileList((prevState) => {
      return prevState.map((item) => {
        if (item.uid === file.uid) {
          return { ...item, ...uploadObj }
        }
        return item
      })
    })
  }

  const handleRemove = (file: UploadFile) => {
    setFileList((prevState) => prevState.filter((item) => item.uid !== file.uid))
    onRemove?.(file)
  }

  return (
    <div className='lc-upload'>
      <div className='lc-upload__label' onClick={handleClick} onKeyDown={() => {}}>
        {drag ? (
          <Dragger
            onFile={(files) => {
              uploadFiles(files)
            }}
          >
            {children}
          </Dragger>
        ) : (
          children
        )}

        <input
          className='lc-upload__input'
          ref={uploadRef}
          multiple={multiple}
          accept={accept}
          type='file'
          onChange={handleChange}
        />
      </div>
      <UploadList fileList={fileList} onRemove={handleRemove} />
    </div>
  )
}
