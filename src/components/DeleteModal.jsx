import { useEffect, useRef } from "react";
import styles from "./DeleteModal.module.css";

function DeleteModal({ invoiceId, onConfirm, onCancel }) {
  const cancelRef = useRef(null);

  // Focus trap + ESC key close
  useEffect(() => {
    cancelRef.current?.focus();
    function handleKey(e) {
      if (e.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onCancel]);

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={styles.modal}>
        <h2 id="modal-title" className={styles.title}>
          Confirm Deletion
        </h2>
        <p className={styles.text}>
          Are you sure you want to delete invoice #{invoiceId}? This action
          cannot be undone.
        </p>
        <div className={styles.actions}>
          <button
            ref={cancelRef}
            className={styles.btnCancel}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button className={styles.btnDelete} onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
