import { useFormContext } from "react-hook-form";
import classNames from "classnames/bind";
import styles from "./TextArea.module.scss";

const cx = classNames.bind(styles);

interface TextAreaProps {
    name: string;
    label?: string;
    placeholder?: string;
    rows?: number;
    required?: string;
}

const TextArea: React.FC<TextAreaProps> = ({ name, label, placeholder, rows = 4, required }) => {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    return (
        <div className={cx("form-group")}>
            {label && <label className={cx("form-label")}>{label}</label>}
            <textarea
                rows={rows}
                {...register(name, { required })}
                placeholder={placeholder}
                className={cx("form-input", { error: errors[name] })}
            />
            {errors[name]?.message && <p className={cx("error-message")}>{String(errors[name]?.message)}</p>}
        </div>
    );
};

export default TextArea;
