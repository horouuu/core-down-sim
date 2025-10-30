import { Fragment } from "react/jsx-runtime";
import { useId } from "react";
import styles from "./input-box.module.css";

type InputBoxProps = {
  label: string;
  name: string;
  width?: number;
  height?: number;
  defaultValue?: number;
};

export function InputBox({
  label,
  name,
  width = 30,
  height = 30,
  defaultValue,
}: InputBoxProps) {
  const inputId = useId();
  return (
    <Fragment>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      <input
        id={inputId}
        name={name}
        className={styles.input}
        style={{ width, height }}
        defaultValue={defaultValue}
      />
    </Fragment>
  );
}
