import { useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge.jsx";
import styles from "./InvoiceCard.module.css";

function InvoiceCard({ invoice }) {
  const navigate = useNavigate();

  // Format date from "2021-08-18" to "18 Aug 2021"
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  // Format amount to currency
  function formatAmount(amount) {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount);
  }

  return (
    <li
      className={styles.card}
      onClick={() => navigate(`/invoices/${invoice.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) =>
        e.key === "Enter" && navigate(`/invoices/${invoice.id}`)
      }
      aria-label={`View invoice ${invoice.id}`}
    >
      {/* Top row: ID + Client Name */}
      <div className={styles.row}>
        <span className={styles.id}>
          <span className={styles.hash}>#</span>
          {invoice.id}
        </span>
        <span className={styles.client}>{invoice.clientName}</span>
      </div>

      {/* Bottom row: Due date + Amount + Status */}
      <div className={styles.row}>
        <div className={styles.meta}>
          <span className={styles.due}>
            Due {formatDate(invoice.paymentDue)}
          </span>
          <span className={styles.amount}>{formatAmount(invoice.total)}</span>
        </div>
        <StatusBadge status={invoice.status} />
      </div>

      {/* Arrow icon (desktop only) */}
      <span className={styles.arrow}>›</span>
    </li>
  );
}

export default InvoiceCard;
