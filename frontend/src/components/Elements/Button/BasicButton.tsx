import React from "react";
import classNames from "classnames";
import "assets/scss/Button.scss";

interface IButtonProps {
  children: string;
  size?: string;
  onClick?: Function;
}

export const Button = (props: IButtonProps) => {
  const { children, size = "lg", onClick } = props;
  return (
    <button className={classNames("Button", size)} onClick={onClick as React.MouseEventHandler}>
      {children}
    </button>
  );
};
