import './index.css'

export type ProgressStatus = 'active' | 'exception'
export type ProgressProps = {
  /**
   * 进度条百分比
   */
  progress: number
  status?: ProgressStatus
  showInfo?: boolean
}

export function Progress({ progress = 0, status = 'active', showInfo = true }: ProgressProps) {
  return (
    <div className='lc-progress'>
      <div className='lc-progress-inner' style={{ width: `${progress}%` }} />
      {showInfo && (
        <div className='lc-progress-text'>
          <span>{progress}%</span>
          {status === 'exception' && <span className='progress-info-exception'>异常</span>}
        </div>
      )}
    </div>
  )
}
