import { ReactNode } from "react";
import classes from "./SettingField.module.scss";

interface Props {
  label: string;
  children: ReactNode;
}

export const SettingField = ({ label, children }: Props) => {
  return (
    <form className={classes.field}>
      <span className={classes.label}>{label}</span>
      {children}
    </form>
  );
};
