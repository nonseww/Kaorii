import classes from "./Modal.module.scss";

interface Props {
  title: string;
  text: string;
  onSubmit: () => void;
  onCancel: () => void;
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
    <div
      className={classes.overlay}
      tabIndex={-1}
      onClick={handleBackdropClick}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          onSubmit();
          onClose();
        }
      }}
    >
      <div className={classes.modal}>
        <h3 className={classes.title}>{title}</h3>
        <p className={classes.text}>{text}</p>
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
      </div>
    </div>
  );
};
