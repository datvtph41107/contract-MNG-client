import { useFormContext } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import classNames from "classnames/bind";
import styles from "./Input.module.scss";

const cx = classNames.bind(styles);

interface InputProps {
    name: string;
    label?: string;
    type?: string;
    placeholder?: string;
    required?: string;
    minLength?: { value: number; message: string };
    pattern?: { value: RegExp; message: string };
    classNameInput?: string;
    classNameLabel?: string;
    disabled?: boolean;
}

const Input: React.FC<InputProps> = ({
    name,
    label,
    type = "text",
    placeholder,
    required,
    minLength,
    pattern,
    classNameInput,
    classNameLabel,
    disabled,
}) => {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    const classes = cx("form-input", classNameInput, {
        error: errors[name],
        disable: disabled,
    });

    const classesLabel = cx("form-label", classNameLabel);

    return (
        <div className={cx("form-group")}>
            {label && (
                <label className={classesLabel} htmlFor={name}>
                    {label}
                </label>
            )}

            <input
                id={name}
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                readOnly={disabled}
                tabIndex={disabled ? -1 : undefined}
                {...register(name, {
                    required,
                    minLength,
                    pattern,
                })}
                className={classes}
            />

            <ErrorMessage errors={errors} name={name} render={({ message }) => <p className={cx("error-message")}>{message}</p>} />
        </div>
    );
};

export default Input;
