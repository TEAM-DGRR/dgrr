import { ChangeEvent } from "react";
import classNames from "classnames";
import "assets/scss/Input.scss";

interface IInputProps {
  maxlength?: number;
  placeholder: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const Input = (props: IInputProps) => {
  const { maxlength, placeholder, onChange } = props;

  return (
    <input
      className={classNames("Input")}
      maxLength={maxlength}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};
