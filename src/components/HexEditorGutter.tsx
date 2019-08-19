import React, { forwardRef } from 'react';

interface Props {
  children?: React.ReactNode,
  className?: string,
  style?: React.CSSProperties,
};

const HexEditorGutter = forwardRef(({
  children = <>&nbsp;</>,
  className,
  style,
}: Props, ref: React.Ref<HTMLDivElement>) => {
  return (
    <div
      className={className}
      ref={ref}
      style={style}
    >
      {children}
    </div>
  );
});

export default React.memo(HexEditorGutter);
