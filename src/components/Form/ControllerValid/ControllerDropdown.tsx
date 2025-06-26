import { Controller, useFormContext } from "react-hook-form";
import Dropdown from "~/page/Contract/components/Dropdown/Dropdown";
import classNames from "classnames/bind";
import styles from "./ControlledField.module.scss";

const cx = classNames.bind(styles);

interface Option {
    value: string;
    label: string;
    icon?: string;
}

interface ControlledDropdownFieldProps {
    name: string;
    label?: string;
    options: Option[];
    className?: string;
    placeholder?: string;
    requiredMessage?: string;
    disabled?: boolean;
}

const ControlledDropdownField: React.FC<ControlledDropdownFieldProps> = ({
    name,
    label,
    options,
    className,
    placeholder = "Chọn...",
    requiredMessage = "Vui lòng chọn giá trị",
    disabled = false,
}) => {
    const {
        control,
        formState: { errors },
    } = useFormContext();

    return (
        <div className={cx("form-group", "custom-dropdown", className)}>
            {label && <label className={cx("form-label")}>{label} *</label>}

            <Controller
                name={name}
                control={control}
                rules={{
                    required: requiredMessage,
                }}
                render={({ field }) => (
                    <Dropdown
                        options={options}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={placeholder}
                        disabled={disabled}
                        error={!!errors[name]}
                    />
                )}
            />

            {errors[name] && <p className={cx("error-message")}>{String(errors[name]?.message)}</p>}
        </div>
    );
};

export default ControlledDropdownField;
