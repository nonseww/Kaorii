import classes from "./Modal.module.scss";

interface Props {
  title: string;
  text: string;
  onSubmit?: () => void;
  onCancel?: () => void;
  onClose: () => void;
}

export const Modal = ({ title, text, onSubmit, onCancel, onClose }: Props) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel && onCancel();
      onClose();
    }
  };

  return (
    <div className={classes.overlay} onClick={handleBackdropClick}>
      <div className={classes.modal}>
        <h3 className={classes.title}>{title}</h3>
        <p className={classes.text}>{text}</p>
        {onSubmit && onCancel && (
          <div className={classes.buttonsContainer}>
            <button
              onClick={() => {
                onCancel();
                onClose();
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onSubmit();
                onClose();
              }}
            >
              Ok
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
