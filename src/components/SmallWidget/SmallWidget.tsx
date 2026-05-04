import DefaultLogo from "../../assets/Logo.png";
import classes from "./SmallWidget.module.scss";
import { useDragWindow } from "../../hooks/useDragWindow";
import { useAppStore } from "../../store/useAppStore";
import { convertFileSrc } from "@tauri-apps/api/core";

interface Props {
  onClick: () => void;
}

export const SmallWidget = ({ onClick }: Props) => {
  const { handleMouseDown, handleMouseMove, handleMouseUp } = useDragWindow();
  const iconPath = useAppStore((s) => s.config.icon_path);
  const imgSrc = iconPath ? convertFileSrc(iconPath) : DefaultLogo;

  return (
    <div
      className={classes.container}
      onDoubleClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <img src={imgSrc} className={classes.logo} />
    </div>
  );
};
