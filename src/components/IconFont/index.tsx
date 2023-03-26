import React from "react";
import classNames from "classnames";
import "./style.scss";

type Props = {
  type: string;
  active?: boolean;
  className?: string;
  size?: number | string;
  style?: React.CSSProperties;
};

const IconFont = ({
  type,
  active,
  className,
  size = "1.571em",
  style
}: Props) => {
  return (
    <i
      style={{ fontSize: size, ...style }}
      className={classNames(
        "fp",
        {
          icon_active: active,
          [`fp-${type}`]: type
        },
        className
      )}
    />
  );
};

export default IconFont;
