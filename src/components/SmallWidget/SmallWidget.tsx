import Logo from "../../assets/logo60x60.jpg";
import classes from "./SmallWidget.module.scss";

interface Props {
  onClick: () => void;
}

export const SmallWidget = ({ onClick }: Props) => {
  return (
    <img
      src={Logo}
      className={classes.logo}
      onClick={onClick}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  );
};
