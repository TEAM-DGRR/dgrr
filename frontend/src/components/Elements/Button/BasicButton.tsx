import React from "react";
import classNames from "classnames";
import "assets/scss/Button.scss";

interface IButtonProps {
  children: string;
  width?: string;
  height?: string;
  onClick?: Function;
  color?: string;
}

export const Button = (props: IButtonProps) => {
  const {
    children,
    width = "calc(100% - 48px)",
    height = "56px",
    color = "yellow",
    onClick,
  } = props;
  return (
    <button
      className={classNames("Button", color)}
      onClick={onClick as React.MouseEventHandler}
      style={{ width: width, height: height }}
    >
      {children}
    </button>
  );
};
