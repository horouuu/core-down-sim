import { Fragment } from "react/jsx-runtime";
import { useId } from "react";
import styles from "./input-box.module.css";
import { useState } from "react";

type InputBoxProps = {
  label: string;
  name: string;
  onChange: (name: string, val: number) => void;
  width?: number;
  height?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
};

export function InputBox({
  label,
  name,
  onChange,
  width = 30,
  height = 30,
  defaultValue,
  min,
  max,
}: InputBoxProps) {
  const [value, setValue] = useState<number | null>(defaultValue ?? 0);
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
        value={value ?? undefined}
        onChange={handleChange}
        className={styles.input}
        style={{ width, height }}
        defaultValue={defaultValue}
      />
    </Fragment>
  );
}
