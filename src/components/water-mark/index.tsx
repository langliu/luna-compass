import {
  type CSSProperties,
  type FC,
  type PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
} from 'react'
import { defaultOptions } from './constant'
import { useWatermark } from './useWatermark'

export type WatermarkProps = PropsWithChildren<{
  style?: CSSProperties
  className?: string
  zIndex?: string | number
  width?: number
  height?: number
  rotate?: number
  image?: string
  content?: string | string[]
  fontStyle?: {
    color?: string
    fontFamily?: string
    fontSize?: number | string
    fontWeight?: number | string
  }
  /**
   * [水平间距, 垂直间距]
   */
  gap?: [number, number]
  /**
   * [水平偏移, 垂直偏移]
   */
  offset?: [number, number]
  /**
   * 获取水印容器
   */
  getContainer?: () => HTMLElement | null
}>

const Watermark: FC<WatermarkProps> = (props) => {
  const {
    className,
    style,
    zIndex = defaultOptions.zIndex,
    width = defaultOptions.width,
    height,
    rotate = defaultOptions.rotate,
    image,
    content,
    fontStyle = defaultOptions.fontStyle,
    gap = defaultOptions.gap,
    offset = defaultOptions.offset,
    children,
  } = props

  const containerRef = useRef<HTMLDivElement>(null)

  const getWatermarkContainer = useCallback(() => {
    return props.getContainer ? props.getContainer() : containerRef.current
  }, [props.getContainer])

  const generateWatermark = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return
    }
    // 设备像素比
    const ratio = window.devicePixelRatio
    console.log('ratio', ratio)
    const configCanvas = (size: { width: number; height: number }) => {
      // 画布宽=文字宽+水平间距
      const canvasWidth = gap[0] + size.width
      // 画布高=文字高+垂直间距
      const canvasHeight = gap[1] + size.height
      // 设置画布宽高
      canvas.setAttribute('width', `${canvasWidth * ratio}px`)
      canvas.setAttribute('height', `${canvasHeight * ratio}px`)
      canvas.style.width = `${canvasWidth}px`
      canvas.style.height = `${canvasHeight}px`
      // 将中心点移动到画布中心
      ctx?.translate((canvasWidth * ratio) / 2, (canvasHeight * ratio) / 2)
      ctx?.scale(ratio, ratio)
      ctx?.rotate((rotate * Math.PI) / 180)
    }
    const drawText = () => {}

    const drawImage = (src: string) => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.referrerPolicy = 'no-referrer'
        img.src = src
        img.onload = () => {
          let [optionWidth, optionHeight] = [width, height]
          if (!optionHeight) {
            optionHeight = (img.height / img.width) * optionWidth
          }
          configCanvas({
            width: img.width,
            height: img.height,
          })
          ctx?.drawImage(
            img,
            -width / 2,
            -optionHeight / 2,
            width,
            optionHeight,
          )
          resolve({
            base64Url: canvas.toDataURL(),
            width: optionWidth,
            height: optionHeight,
          })
        }
        img.onerror = () => {
          return drawText()
        }
      })
    }
    if (image) {
      return drawImage(image)
    }
    drawText()
  }

  useEffect(() => {
    generateWatermark()?.then(({ base64Url, width, height }) => {
      const wmStyle = `
      width:100%;
      height:100%;
      position:absolute;
      top:0;
      left:0;
      bottom:0;
      right:0;
      pointer-events: none;
      z-index:${zIndex};
      background-position: 0 0;
      background-size:${gap[0] + width}px ${gap[1] + height}px;
      background-repeat: repeat;
      background-image:url(${base64Url})`
      const container = getWatermarkContainer()
      if (container) {
        const div = document.createElement('div')
        div.setAttribute('style', wmStyle.trim())
        container.style.position = 'relative'
        container?.append(div)
      }
    })
  }, [getWatermarkContainer])

  return children ? (
    <div className={className} style={style} ref={containerRef}>
      {children}
    </div>
  ) : null
}
