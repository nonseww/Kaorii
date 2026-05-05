import { useState } from "react";
import { useConfig } from "../../hooks/useConfig";
import { useAppStore } from "../../store/useAppStore";
import { SettingField } from "../../ui/SettingField";
import classes from "./Settings.module.scss";

export const Settings = () => {
  const store = useAppStore();
  const { handleSelectModel, handleSelectIcon, handleSelectApiModel } =
    useConfig();
  const [openrouterData, setOpenrouterData] = useState<{
    modelName: string;
    apiKey: string;
  }>({
    modelName: store.config.api_model ?? "",
    apiKey: store.config.api_key_masked ?? "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOpenrouterData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await handleSelectApiModel(openrouterData);
  };

  return (
    <div className={classes.settings}>
      <SettingField label="Local GGUF Model">
        <>
          <input
            value={store.config.model_path ?? "No model selected..."}
            readOnly
          />
          <button onClick={handleSelectModel}>Choose model</button>
        </>
      </SettingField>

      <SettingField label="OpenRouter Model">
        <>
          <input
            value={openrouterData.modelName}
            onChange={handleChange}
            placeholder="Model name"
            required
            name="modelName"
          />
          <input
            value={openrouterData.apiKey}
            onChange={handleChange}
            placeholder="API Key"
            required
            name="apiKey"
          />
          <form className={classes.buttonsContainer}>
            <button onClick={() => {}}>Delete API Key</button>
            <button type="submit" onClick={handleSubmit}>
              Save
            </button>
          </form>
        </>
      </SettingField>

      <SettingField label="Local Widget's Icon">
        <>
          <input
            value={store.config.icon_path ?? "No icon selected..."}
            readOnly
          />
          <button onClick={handleSelectIcon}>Choose icon</button>
        </>
      </SettingField>
    </div>
  );
};
