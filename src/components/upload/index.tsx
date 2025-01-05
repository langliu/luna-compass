import { type ChangeEvent, type PropsWithChildren, useRef } from 'react'
import './index.css'

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
  /**
   * 上传进度回调
   * @param percent 上传进度百分比
   * @param file 上传的文件
   */
  onProgress?: (percent: number, file: File) => void
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
}: UploadProps) {
  const uploadRef = useRef<HTMLInputElement>(null)

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
      // 清空文件选择框
      if (uploadRef.current) {
        uploadRef.current.value = ''
      }
    }
  }

  // 处理文件上传
  const handleUpload = async (file: File) => {
    // 创建 FormData 对象
    const formData = new FormData()
    formData.append(name, file)
    // 添加额外数据
    if (data) {
      for (const key of Object.keys(data)) {
        formData.append(key, data[key])
      }
    }
    const xhr = new XMLHttpRequest()
    xhr.open('POST', action, true)
    xhr.withCredentials = withCredentials
    // 设置请求头
    for (const key in headers) {
      xhr.setRequestHeader(key, headers[key])
    }
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = (event.loaded / event.total) * 100
        onProgress?.(percent, file)
      }
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.responseText)
        onSuccess?.(response, file)
      } else {
        onError?.(new Error('Upload failed'), file)
      }
      onChange?.(file)
    }

    xhr.onerror = () => {
      onError?.(new Error('Network error'), file)
      onChange?.(file)
    }

    xhr.onabort = () => {
      onError?.(new Error('Upload aborted'), file)
      onChange?.(file)
    }

    xhr.send(formData)
  }

  return (
    <div className='lc-upload'>
      <div className='lc-upload__label' onClick={handleClick} onKeyDown={() => {}}>
        {children}
        <input
          className='lc-upload__input'
          ref={uploadRef}
          multiple={multiple}
          accept={accept}
          type='file'
          onChange={handleChange}
        />
      </div>
      <UploadList fileList={fileList} onRemove={() => {}} />
    </div>
  )
}
