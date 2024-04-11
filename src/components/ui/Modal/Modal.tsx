import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import style from "./index.module.css";

interface IModalProps {
  show: boolean;
  footer?: boolean;
  children?: React.ReactNode;
  onOk?: ((e: React.MouseEvent<HTMLElement, MouseEvent>) => void) | undefined;
  className?: string;
  onCancel?:
    | ((e: React.MouseEvent<HTMLElement, MouseEvent>) => void)
    | undefined;
  title: React.ReactNode;
  header?: boolean;
  width?: string | number;
  okText?: React.ReactNode;
  cancelText?: React.ReactNode;
  closeAble?: boolean;
  styleContent?:React.CSSProperties;
}

interface ComponentModal extends React.FC<IModalProps> {}

const Modal: ComponentModal = (props) => {
  const {
    show,
    title,
    children,
    footer,
    onOk,
    className,
    onCancel,
    header,
    okText,
    cancelText,
    closeAble,
    styleContent,
    width,
  } = props;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={`${style["container-modal"]} ${className ?? ""}`}
        >
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={overlayVariants}
            onClick={(e) => onCancel?.(e)}
            className={`${style["modal-overlay"]}`}
          />
          <motion.div
            className={style["modal"]}
            style={{ width: width ?? "80%" }}
            initial={{ y: "100vh" }}
            animate={{ y: 0 }}
            exit={{ y: "100vh" }}
            transition={{ duration: 0.5 }}
          >
            {header && (
              <div className={style["modal-header"]}>
                <div className={style["modal-title"]}>{title}</div>
                {closeAble && (
                  <div
                    className={style["modal-close-icon"]}
                    onClick={(e) => onCancel?.(e)}
                  >
                    X
                  </div>
                )}
              </div>
            )}
            <div className={style["modal-content"]} style={styleContent}>{children}</div>
            {footer && (
              <div className={style["modal-footer"]}>
                <button
                  className={style["modal-footer-button-left"]}
                  onClick={(e) => onCancel?.(e)}
                >
                  {cancelText ?? "Cancel"}
                </button>
                <button
                  className={style["modal-footer-button-right"]}
                  onClick={(e) => onOk?.(e)}
                >
                  {okText ?? "Accept"}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const overlayVariants = {
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      duration: 0.3,
      delayChildren: 0.4,
    },
  },
  hidden: {
    opacity: 0,
    transition: {
      when: "afterChildren",
      duration: 0.3,
      delay: 0.4,
    },
  },
};

export default Modal;
