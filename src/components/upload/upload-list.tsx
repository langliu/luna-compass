import { Check, Loader2, Trash, X } from 'lucide-react'
import type { FC } from 'react'
import './index.css'

export type UploadStatus = 'ready' | 'uploading' | 'success' | 'error'

export type UploadFile = {
  uid: string
  size: number
  name: string
  status?: UploadStatus
  percent?: number
  raw?: File
  response?: unknown
  error?: unknown
}

export type UploadListProps = {
  fileList: UploadFile[]
  onRemove: (_file: UploadFile) => void
}

export const UploadList: FC<UploadListProps> = ({ fileList, onRemove }) => {
  return (
    <ul className='lc-upload-list'>
      {fileList.map((file) => (
        <li key={file.uid} className={`lc-upload-list-item lc-upload-list-item-${file.status}`}>
          <span className='file-name'>
            {(file.status === 'uploading' || file.status === 'ready') && <Loader2 />}
            {file.status === 'success' && <Check />}
            {file.status === 'error' && <X />}
            {file.name}
          </span>
          <div className='file-actions'>
            <Trash onClick={() => onRemove?.(file)} />
          </div>
        </li>
      ))}
    </ul>
  )
}
