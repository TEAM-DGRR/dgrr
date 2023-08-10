import React from "react";
import classNames from "classnames";
import "assets/scss/Button.scss";

interface IButtonProps {
  children: string;
  size?: string;
  onClick?: Function;
  color?: string;
}

export const Button = (props: IButtonProps) => {
  const { children, size = "lg", color = "yellow", onClick } = props;
  return (
    <button
      className={classNames("Button", size, color)}
      onClick={onClick as React.MouseEventHandler}
    >
      {children}
    </button>
  );
};
