import { cva } from 'class-variance-authority';
import type { HTMLAttributes, ReactNode } from 'react';
import { Children, useContext, useMemo } from 'react';
import './index.css';
import { ConfigContext } from '../config-provider';

export type SpaceSizeType = 'small' | 'middle' | 'large' | number | undefined;

export type SpaceProps = HTMLAttributes<HTMLDivElement> & {
  /** 间距大小 */
  size?: SpaceSizeType | [SpaceSizeType, SpaceSizeType];
  /** 对齐方式 */
  align?: 'start' | 'end' | 'center' | 'baseline';
  /**
   * 间距方向
   */
  direction?: 'horizontal' | 'vertical';
  /**
   * 设置分隔符
   */
  split?: ReactNode;
  /** 是否换行 */
  warp?: boolean;
};

const spaceVariants = cva('lc-space', {
  variants: {
    align: {
      end: 'lc-space-align-end',
      start: 'lc-space-align-start',
      center: 'lc-space-align-center',
      baseline: 'lc-space-align-baseline',
    },
    direction: {
      horizontal: 'lc-space-horizontal',
      vertical: 'lc-space-vertical',
    },
  },
  defaultVariants: {
    direction: 'horizontal',
  },
});

const spaceSize = {
  small: 8,
  middle: 16,
  large: 24,
};

function getNumberSize(size: SpaceSizeType) {
  return typeof size === 'string' ? spaceSize[size] : size || 0;
}

export function Space({
  align,
  size = 'small',
  direction = 'horizontal',
  split,
  style,
  className,
  ...props
}: SpaceProps) {
  const { space } = useContext(ConfigContext);
  const spaceSize = space?.size || size;

  const children = Children.toArray(props.children).map((child, index) => {
    const key = `space-${index}`;
    return (
      <div className="space-item astra-kit" key={key} data-key={key}>
        {child}
      </div>
    );
  });

  const [horizontalSize, verticalSize] = useMemo(
    () =>
      (
        (Array.isArray(spaceSize) ? spaceSize : [spaceSize, spaceSize]) as [
          SpaceSizeType,
          SpaceSizeType,
        ]
      ).map((item) => getNumberSize(item)),
    [spaceSize],
  );

  return (
    <div
      {...props}
      className={spaceVariants({
        direction,
        align,
        className: className,
      })}
      style={{
        columnGap: horizontalSize,
        rowGap: verticalSize,
        flexWrap: props.warp ? 'wrap' : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
