import { useConfig } from "../../hooks/useConfig";
import { useAppStore } from "../../store/useAppStore";
import classes from "./Settings.module.scss";

export const Settings = () => {
  const store = useAppStore();
  const { handleSelectModel, handleSelectIcon } = useConfig();

  return (
    <div className={classes.settings}>
      <div className={classes.field}>
        <div className={classes.labelRow}>
          <span className={classes.label}>Local GGUF Model</span>
          <input
            className={classes.pathText}
            value={store.config.model_path ?? "No model selected..."}
            readOnly
          />
        </div>
        <button onClick={handleSelectModel} className={classes.chooseButton}>
          Choose model
        </button>
      </div>

      <div className={classes.field}>
        <div className={classes.labelRow}>
          <span className={classes.label}>Local Widget's Icon</span>
          <input
            className={classes.pathText}
            value={store.config.icon_path ?? "No icon selected..."}
            readOnly
          />
        </div>
        <button onClick={handleSelectIcon} className={classes.chooseButton}>
          Choose icon
        </button>
      </div>
    </div>
  );
};
