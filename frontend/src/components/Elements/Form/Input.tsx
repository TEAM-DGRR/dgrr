import React, { ChangeEvent } from "react";
import classNames from "classnames";
import "assets/scss/Input.scss";

interface IInputProps {
  width?: number;
  placeholder?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const Input = (props: IInputProps) => {
  const { width, placeholder, onChange } = props;

  const inputStyle = {
    width: width ? `${width}px` : "calc(100% - 48px)",
  };

  return (
    <input
      className={classNames("Input")}
      style={inputStyle}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};
