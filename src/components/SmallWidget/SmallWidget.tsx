import Logo from "../../assets/Logo.png";
import classes from "./SmallWidget.module.scss";
import { useDragWindow } from "../../hooks/useDragWindow";

interface Props {
  onClick: () => void;
}

export const SmallWidget = ({ onClick }: Props) => {
  const { handleMouseDown, handleMouseMove, handleMouseUp } = useDragWindow();

  return (
    <div
      className={classes.container}
      onDoubleClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <img src={Logo} className={classes.logo} />
    </div>
  );
};
