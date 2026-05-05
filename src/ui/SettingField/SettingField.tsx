import { ReactNode } from "react";
import classes from "./SettingField.module.scss";

interface Props {
  label: string;
  children: ReactNode;
}

export const SettingField = ({ label, children }: Props) => {
  return (
    <div className={classes.field}>
      <span className={classes.label}>{label}</span>
      {children}
    </div>
  );
};
