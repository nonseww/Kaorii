import Logo from "../../assets/logo60x60.jpg";
import classes from "./SmallWidget.module.scss";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useRef } from "react";

interface Props {
  onClick: () => void;
}

export const SmallWidget = ({ onClick }: Props) => {
  const startPos = useRef<{ x: number; y: number } | null>(null);

  const handleMouseDown = async (e: React.MouseEvent) => {
    if (e.button === 0) {
      startPos.current = { x: e.screenX, y: e.screenY };
    }
  };

  const handleMouseMove = async (e: React.MouseEvent) => {
    if (startPos.current) {
      const deltaX = Math.abs(startPos.current.x - e.screenX);
      const deltaY = Math.abs(startPos.current.y - e.screenY);

      if (deltaX > 5 || deltaY > 5) {
        startPos.current = null;
        await getCurrentWindow().startDragging();
      }
    }
  };

  const handleMouseUp = () => {
    startPos.current = null;
  };

  return (
    <div
      className={classes.container}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <img src={Logo} className={classes.logo} />
    </div>
  );
};
