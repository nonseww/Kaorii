import { Icon } from "../../ui/Icon";
import Minimaze from "../../assets/minimaze.png";
import Close from "../../assets/close.png";
import Tool from "../../assets/Tool.svg";
import Restart from "../../assets/Refresh.svg";
import classes from "./WindowBar.module.scss";

interface Props {
  onMinimazeClick: () => void;
  onCloseClick: () => void;
  onSettings: () => void;
  onRestartChat: () => void;
}

export const WindowBar = ({
  onMinimazeClick,
  onCloseClick,
  onSettings,
  onRestartChat,
}: Props) => {
  return (
    <div className={classes.windowbar}>
      <div className={classes.actionButtons}>
        <button onClick={onSettings} title="Settings">
          <Icon src={Tool} />
        </button>
        <button onClick={onRestartChat} title="Restart chat">
          <Icon src={Restart} />
        </button>
      </div>

      <div className={classes.actionButtons}>
        <button onClick={onMinimazeClick} title="Minimaze">
          <Icon src={Minimaze} />
        </button>
        <button onClick={onCloseClick} title="Close">
          <Icon src={Close} />
        </button>
      </div>
    </div>
  );
};
