import { useIconPath } from "../../hooks/useIconPath";
import { useModelPath } from "../../hooks/useModelPath";
import { useAppStore } from "../../store/useAppStore";
import classes from "./Settings.module.scss";

export const Settings = () => {
  const store = useAppStore();
  const { handleSelectModel } = useModelPath();
  const { handleSelectIcon } = useIconPath();

  return (
    <div className={classes.settings}>
      <div className={classes.field}>
        <div className={classes.labelRow}>
          <span className={classes.label}>Local GGUF Model</span>
          <input
            className={classes.modelText}
            defaultValue={store.modelPath ?? "No model selected..."}
          />
        </div>
        <button onClick={handleSelectModel} className={classes.chooseButton}>
          Choose model
        </button>
      </div>

      <div className={classes.field}>
        <div className={classes.labelRow}>
          <span className={classes.label}>Local icon path</span>
          <input
            className={classes.pathText}
            defaultValue={store.iconPath ?? "No icon selected..."}
          />
        </div>
        <button onClick={handleSelectIcon} className={classes.chooseButton}>
          Choose icon
        </button>
      </div>
    </div>
  );
};
