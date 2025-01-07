import './index.css'
import { clsx } from 'clsx'

export type ProgressStatus = 'active' | 'exception' | 'success' | 'normal'
export type ProgressProps = {
  /**
   * 进度条百分比
   */
  percent: number
  status?: ProgressStatus
  showInfo?: boolean
  /**
   * 进度条大小
   */
  size?: 'default' | 'small'
}

export function Progress({
  percent = 0,
  status = 'normal',
  showInfo = true,
  size = 'default',
}: ProgressProps) {
  return (
    <div className='lc-progress'>
      <div className='lc-progress-inner'>
        <div
          className={clsx('lc-progress-bg', {
            'lc-progress-bg-exception': status === 'exception',
            'lc-progress-bg-success': percent >= 100 || status === 'success',
            'lc-progress-bg-normal': status === 'normal',
            'lc-progress-size-small': size === 'small',
          })}
          style={{ width: `${percent}%` }}
        />
      </div>
      {showInfo && (
        <div className='lc-progress-text'>
          <span>{percent}%</span>
        </div>
      )}
    </div>
  )
}
