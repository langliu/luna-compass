import { Check, Loader2, Trash, X } from 'lucide-react'
import type { FC } from 'react'
import './index.css'
import { Progress } from '../progress'

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
            {(file.status === 'uploading' || file.status === 'ready') && (
              <Loader2 size={20} style={{ flexShrink: 0 }} />
            )}
            {file.status === 'success' && <Check size={20} style={{ flexShrink: 0 }} />}
            {file.status === 'error' && <X size={20} style={{ flexShrink: 0 }} />}
            <span>{file.name}</span>
            <Trash size={20} className='file-actions' onClick={() => onRemove?.(file)} />
          </span>
          {file.status === 'uploading' && <Progress percent={file?.percent || 0} />}
        </li>
      ))}
    </ul>
  )
}
