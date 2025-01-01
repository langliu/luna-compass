import { merge } from 'lodash-es';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { WatermarkProps } from '.';
import { toNumber } from '../../utils';

export type WatermarkOptions = Omit<
  WatermarkProps,
  'children' | 'style' | 'className'
>;

/**
 * 默认配置
 */
const defaultOptions = {
  width: 100,
  rotate: -20,
  zIndex: 1,
  fontStyle: {
    color: '#000',
    fontFamily: 'PingFang SC',
    fontSize: 14,
    fontWeight: 400,
  },
  gap: [100, 100],
  offset: [0, 0],
  getContainer: () => document.body,
};

function getWatermarkOptions(
  params: Partial<WatermarkOptions> = {},
): WatermarkOptions {
  return {
    ...params,
    rotate: params.rotate || defaultOptions.rotate,
    zIndex: params.zIndex || defaultOptions.zIndex,
    fontStyle: {
      ...defaultOptions.fontStyle,
      ...params.fontStyle,
    },
    getContainer: params.getContainer || defaultOptions.getContainer,
  };
}

const measureTextSize = (
  ctx: CanvasRenderingContext2D,
  content: string[],
  rotate: number,
) => {
  let width = 0;
  let height = 0;
  const lineSize: Array<{ width: number; height: number }> = [];

  for (const item of content) {
    const {
      width: textWidth,
      fontBoundingBoxAscent,
      fontBoundingBoxDescent,
    } = ctx.measureText(item);

    const textHeight = fontBoundingBoxAscent + fontBoundingBoxDescent;

    if (textWidth > width) {
      width = textWidth;
    }

    height += textHeight;
    lineSize.push({ height: textHeight, width: textWidth });
  }

  const angle = (rotate * Math.PI) / 180;

  return {
    originWidth: width,
    originHeight: height,
    width: Math.ceil(
      Math.abs(Math.sin(angle) * height) + Math.abs(Math.cos(angle) * width),
    ),
    height: Math.ceil(
      Math.abs(Math.sin(angle) * width) + Math.abs(height * Math.cos(angle)),
    ),
    lineSize,
  };
};

async function getCanvasData(options: Required<WatermarkOptions>) {
  const { width, height, rotate, content, fontStyle, gap, offset, image } =
    options;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  /**
   * 设备像素比
   */
  const ratio = window.devicePixelRatio;

  const configCanvas = (size: { width: number; height: number }) => {
    // 画布宽=文字宽+水平间距
    const canvasWidth = gap[0] + size.width;
    // 画布高=文字高+垂直间距
    const canvasHeight = gap[1] + size.height;
    // 设置画布宽高
    canvas.setAttribute('width', `${canvasWidth * ratio}px`);
    canvas.setAttribute('height', `${canvasHeight * ratio}px`);
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
    // 将中心点移动到画布中心
    ctx?.translate((canvasWidth * ratio) / 2, (canvasHeight * ratio) / 2);
    ctx?.scale(ratio, ratio);
    ctx?.rotate((rotate * Math.PI) / 180);
  };

  const drawText = () => {
    const {
      fontSize,
      color = defaultOptions.fontStyle.color,
      fontWeight,
      fontFamily,
    } = fontStyle;
    const realFontSize = toNumber(fontSize, 0) || fontStyle.fontSize;

    ctx.font = `${fontWeight} ${realFontSize}px ${fontFamily}`;
    const measureSize = measureTextSize(ctx, [...content], rotate);

    const width = options.width || measureSize.width;
    const height = options.height || measureSize.height;

    configCanvas({ width, height });

    ctx.fillStyle = color;
    ctx.font = `${fontWeight} ${realFontSize}px ${fontFamily}`;
    ctx.textBaseline = 'top';

    [...content].forEach((item, index) => {
      const { height: lineHeight, width: lineWidth } =
        measureSize.lineSize[index];

      const xStartPoint = -lineWidth / 2;
      const yStartPoint =
        -(options.height || measureSize.originHeight) / 2 + lineHeight * index;

      ctx.fillText(
        item,
        xStartPoint,
        yStartPoint,
        options.width || measureSize.originWidth,
      );
    });
    return Promise.resolve({ base64Url: canvas.toDataURL(), height, width });
  };

  const drawImage = () => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.referrerPolicy = 'no-referrer';
      img.src = image;
      img.onload = () => {
        let [optionWidth, optionHeight] = [width, height];
        if (!optionWidth) {
          optionWidth = (img.width / img.height) * optionHeight;
        } else if (!optionHeight) {
          optionHeight = (img.height / img.width) * optionWidth;
        }
        configCanvas({
          width: img.width,
          height: img.height,
        });
        ctx?.drawImage(img, -width / 2, -height / 2, width, height);
        resolve({
          base64: canvas.toDataURL(),
          width: optionWidth,
          height: optionHeight,
        });
      };
      img.onerror = () => {
        return drawText();
      };
    });
  };
}

export function useWatermark(params: WatermarkOptions) {
  const [options, setOptions] = useState(params);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const mergedOptions = getWatermarkOptions(options);

  const container = mergedOptions.getContainer?.();

  const generateWatermark = useCallback(() => {
    // console.log('generateWatermark', options)
    if (!container) return;
  }, [container]);

  useEffect(() => {
    generateWatermark();
  }, [options, generateWatermark]);

  return {
    generateWatermark: (newOptions: Partial<WatermarkOptions>) => {
      setOptions(merge({}, options, newOptions));
    },
    destroy: () => {},
  };
}
