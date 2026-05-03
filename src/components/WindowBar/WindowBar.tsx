import { Icon } from "../../ui/Icon";
import Minimaze from "../../assets/minimaze.png";
import Close from "../../assets/close.png";
import classes from "./WindowBar.module.scss";

interface Props {
  onMinimazeClick: () => void;
  onCloseClick: () => void;
}

export const WindowBar = ({ onMinimazeClick, onCloseClick }: Props) => {
  return (
    <div className={classes.windowbar}>
      <button onClick={onMinimazeClick}>
        <Icon src={Minimaze} size={18} />
      </button>
      <button onClick={onCloseClick}>
        <Icon src={Close} size={18} />
      </button>
    </div>
  );
};
