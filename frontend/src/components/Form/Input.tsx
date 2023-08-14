import { ChangeEvent } from 'react';
import classNames from 'classnames';
import 'assets/scss/Input.scss';

interface IInputProps {
	maxlength?: number;
	placeholder: string;
	onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
	defaultValue?: string;
}

export const Input = (props: IInputProps) => {
	const { maxlength, placeholder, onChange, defaultValue } = props;

	return (
		<input
			className={classNames('Input')}
			maxLength={maxlength}
			onChange={onChange}
			placeholder={placeholder}
			defaultValue={defaultValue}
		/>
	);
};
