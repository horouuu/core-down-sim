import { Fragment } from "react/jsx-runtime";
import { useId } from "react";
import styles from "./input-box.module.css";
import { useState } from "react";

type BaseProps = {
  name: string;
  label: string;
  width?: number;
  height?: number;
};
type NumberProps = BaseProps & {
  onChange: (name: string, val: number) => void;
  defaultValue?: number;
  min?: number;
  max?: number;
};

type CheckboxProps = BaseProps & {
  onChange: (name: string, val: boolean) => void;
  defaultChecked?: boolean;
};

export function NumberInputBox(props: NumberProps) {
  const { label, name, onChange, defaultValue = 0, min, max } = props;
  const [value, setValue] = useState<number | null>(defaultValue);
  const inputId = useId();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let validValue = isNaN(parseInt(e.target.value))
      ? null
      : parseInt(e.target.value);
    if (max !== undefined && validValue !== null) {
      validValue = Math.min(validValue, max);
    }

    if (min !== undefined && validValue !== null) {
      validValue = Math.max(validValue, min);
    }

    setValue(validValue);
    e.target.value = validValue ? `${validValue}` : "";
    onChange(e.target.name, validValue ?? min ?? 0);
  };

  return (
    <Fragment>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      <input
        id={inputId}
        name={name}
        onChange={handleChange}
        className={
          value && value.toString().length > 2
            ? `${styles.input} ${styles.inputLarge}`
            : styles.input
        }
        defaultValue={defaultValue}
      />
    </Fragment>
  );
}

export function Checkbox(props: CheckboxProps) {
  const {
    label,
    name,
    width = 15,
    height = 15,
    onChange,
    defaultChecked = false,
  } = props;
  const inputId = useId();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.name, e.target.checked);
  };

  return (
    <Fragment>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      <input
        id={inputId}
        type="checkbox"
        name={name}
        onChange={handleChange}
        className={styles.input}
        style={{ width, height, justifySelf: "center" }}
        defaultChecked={defaultChecked}
      />
    </Fragment>
  );
}
