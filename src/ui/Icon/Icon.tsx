import classes from "./Icon.module.scss";

interface Props {
  src: string;
  alt?: string;
  size?: number;
}

export const Icon = ({ src, alt = "", size }: Props) => {
  return (
    <img
      src={src}
      alt={alt}
      style={size ? { width: `${size}px`, height: `${size}px` } : {}}
      className={classes.icon}
    />
  );
};
