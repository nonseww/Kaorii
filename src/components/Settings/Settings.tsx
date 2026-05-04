import { useAppStore } from "../../store/useAppStore";
import classes from "./Settings.module.scss";

interface Props {
  handleSelectModel: () => Promise<boolean | void> | void;
}

export const Settings = ({ handleSelectModel }: Props) => {
  const store = useAppStore();

  return (
    <div className={classes.settings}>
      <div className={classes.field}>
        <div className={classes.labelRow}>
          <span className={classes.label}>Local GGUF Model</span>
          <input
            className={classes.modelPathText}
            defaultValue={store.modelPath ?? "No model selected..."}
          />
        </div>
        <button
          onClick={handleSelectModel}
          className={classes.chooseModelButton}
        >
          Choose model
        </button>
      </div>
    </div>
  );
};
