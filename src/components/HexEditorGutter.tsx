import React, { forwardRef, memo } from 'react';

interface Props {
  children?: React.ReactNode,
  className?: string,
  style?: React.CSSProperties,
};

const HexEditorGutter = ({
  children = <>&nbsp;</>,
  className,
  style,
}: Props, ref: React.Ref<HTMLDivElement>) => (
  <div
    className={className}
    ref={ref}
    style={style}
  >
    {children}
  </div>
);

HexEditorGutter.displayName = 'HexEditorGutter';

export default memo(forwardRef(HexEditorGutter));
