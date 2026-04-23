import styles from "./StatusBadge.module.css";

// This component receives a status string and renders
// the correctly colored badge automatically.
function StatusBadge({ status }) {
  return (
    <span className={`${styles.badge} ${styles[status]}`}>
      <span className={styles.dot} />
      {/* Capitalize first letter */}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default StatusBadge;
