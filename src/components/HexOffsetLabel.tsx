import React, {
  forwardRef,
  memo,
  useMemo,
} from 'react';

interface Props {
  className?: string,
  formatOffset?: (offset: number) => number | string,
  offset?: number | null,
  style?: React.CSSProperties,
};

const HexOffsetLabel = ({
  className,
  formatOffset,
  offset,
  style,
}: Props, ref: React.Ref<HTMLDivElement>) => {
  const formattedOffset = useMemo(
    () => (formatOffset && offset != null ? formatOffset(offset) : offset),
    [offset, formatOffset],
  );

  return (
    <div
      className={className}
      ref={ref}
      style={style}
    >
      {formattedOffset}
    </div>
  );
};

HexOffsetLabel.displayName = 'HexOffsetLabel';

export default memo(forwardRef(HexOffsetLabel));
