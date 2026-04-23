import styles from "./EmptyState.module.css";

function EmptyState() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.illustration}>📭</div>
      <h2 className={styles.title}>There is nothing here</h2>
      <p className={styles.text}>
        Create an invoice by clicking the <strong>New Invoice</strong> button
        and get started.
      </p>
    </div>
  );
}

export default EmptyState;
