import { Icon } from "../Icon";
import LoaderIcon from "../../assets/Loader.svg";
import classes from "./Loader.module.scss";

export const Loader = () => {
  return (
    <div className={classes.loaderContainer}>
      <Icon src={LoaderIcon} size={40} />
      <span>Model is running...</span>
    </div>
  );
};
