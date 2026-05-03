import { useAppStore } from "../../store/useAppStore";
import classes from "./Settings.module.scss";

interface Props {
  handleSelectModel: () => Promise<boolean | void> | void;
}

export const Settings = ({ handleSelectModel }: Props) => {
  const store = useAppStore();

  return (
    <div className={classes.settings}>
      <div>
        <span>Current model path: </span>
        <span>{store.modelPath ?? "undefined"}</span>
      </div>
      <button onClick={handleSelectModel}>Choose model</button>
    </div>
  );
};
