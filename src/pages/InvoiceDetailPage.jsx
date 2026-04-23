import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useInvoices } from "../context/InvoiceContext";
import StatusBadge from "../components/StatusBadge.jsx";
import InvoiceForm from "../components/InvoiceForm.jsx";
import DeleteModal from "../components/DeleteModal.jsx";
import styles from "./InvoiceDetailPage.module.css";

function InvoiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { invoices, markAsPaid, deleteInvoice } = useInvoices();
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const invoice = invoices.find((inv) => inv.id === id);

  if (!invoice) {
    return (
      <div className={styles.notFound}>
        <p>Invoice not found.</p>
        <button onClick={() => navigate("/")}>Go Back</button>
      </div>
    );
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount);
  }

  function handleDelete() {
    deleteInvoice(invoice.id);
    navigate("/");
  }

  return (
    <div className={styles.page}>
      {/* ── Back Button ── */}
      <button className={styles.backBtn} onClick={() => navigate("/")}>
        ‹ Go back
      </button>

      {/* ── Status Bar ── */}
      <div className={styles.statusBar}>
        <div className={styles.statusLeft}>
          <span className={styles.statusLabel}>Status</span>
          <StatusBadge status={invoice.status} />
        </div>
        <div className={styles.actions}>
          {invoice.status !== "paid" && (
            <button
              className={styles.btnEdit}
              onClick={() => setShowEdit(true)}
            >
              Edit
            </button>
          )}
          <button
            className={styles.btnDelete}
            onClick={() => setShowDelete(true)}
          >
            Delete
          </button>
          {invoice.status === "pending" && (
            <button
              className={styles.btnPaid}
              onClick={() => markAsPaid(invoice.id)}
            >
              Mark as Paid
            </button>
          )}
        </div>
      </div>

      {/* ── Invoice Details ── */}
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.cardHeader}>
          <div>
            <p className={styles.invoiceId}>
              <span className={styles.hash}>#</span>
              {invoice.id}
            </p>
            <p className={styles.description}>{invoice.description}</p>
          </div>
          <address className={styles.senderAddress}>
            <p>{invoice.senderAddress.street}</p>
            <p>{invoice.senderAddress.city}</p>
            <p>{invoice.senderAddress.postCode}</p>
            <p>{invoice.senderAddress.country}</p>
          </address>
        </div>

        {/* Meta Grid */}
        <div className={styles.metaGrid}>
          <div className={styles.metaItem}>
            <p className={styles.metaLabel}>Invoice Date</p>
            <p className={styles.metaValue}>{formatDate(invoice.createdAt)}</p>
          </div>
          <div className={styles.metaItem}>
            <p className={styles.metaLabel}>Payment Due</p>
            <p className={styles.metaValue}>{formatDate(invoice.paymentDue)}</p>
          </div>
          <div className={styles.metaItem}>
            <p className={styles.metaLabel}>Bill To</p>
            <p className={styles.metaValue}>{invoice.clientName}</p>
            <address className={styles.clientAddress}>
              <p>{invoice.clientAddress.street}</p>
              <p>{invoice.clientAddress.city}</p>
              <p>{invoice.clientAddress.postCode}</p>
              <p>{invoice.clientAddress.country}</p>
            </address>
          </div>
          <div className={styles.metaItem}>
            <p className={styles.metaLabel}>Sent To</p>
            <p className={styles.metaValue}>{invoice.clientEmail}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className={styles.itemsTable}>
          <div className={styles.tableHeader}>
            <span>Item Name</span>
            <span className={styles.center}>QTY.</span>
            <span className={styles.right}>Price</span>
            <span className={styles.right}>Total</span>
          </div>
          {invoice.items.map((item, index) => (
            <div key={index} className={styles.tableRow}>
              <span className={styles.itemName}>{item.name}</span>
              <span className={`${styles.itemQty} ${styles.center}`}>
                {item.quantity}
              </span>
              <span className={`${styles.itemPrice} ${styles.right}`}>
                {formatCurrency(item.price)}
              </span>
              <span className={`${styles.itemTotal} ${styles.right}`}>
                {formatCurrency(item.total)}
              </span>
            </div>
          ))}
          <div className={styles.tableFooter}>
            <span>Amount Due</span>
            <span className={styles.amountDue}>
              {formatCurrency(invoice.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Actions */}
      <div className={styles.mobileActions}>
        {invoice.status !== "paid" && (
          <button className={styles.btnEdit} onClick={() => setShowEdit(true)}>
            Edit
          </button>
        )}
        <button
          className={styles.btnDelete}
          onClick={() => setShowDelete(true)}
        >
          Delete
        </button>
        {invoice.status === "pending" && (
          <button
            className={styles.btnPaid}
            onClick={() => markAsPaid(invoice.id)}
          >
            Mark as Paid
          </button>
        )}
      </div>

      {/* Edit Form */}
      {showEdit && (
        <InvoiceForm
          onClose={() => setShowEdit(false)}
          existingInvoice={invoice}
        />
      )}

      {/* Delete Modal */}
      {showDelete && (
        <DeleteModal
          invoiceId={invoice.id}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </div>
  );
}

export default InvoiceDetailPage;
