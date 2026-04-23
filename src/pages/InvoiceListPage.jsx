import { useState } from "react";
import { useInvoices } from "../context/InvoiceContext";
import InvoiceCard from "../components/InvoiceCard.jsx";
import FilterBar from "../components/FilterBar.jsx";
import EmptyState from "../components/EmptyState.jsx";
import InvoiceForm from "../components/InvoiceForm.jsx";
import styles from "./InvoiceListPage.module.css";

function InvoiceListPage() {
  const { invoices } = useInvoices();
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const filteredInvoices =
    selectedFilters.length === 0
      ? invoices
      : invoices.filter((inv) => selectedFilters.includes(inv.status));

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Invoices</h1>
          <p className={styles.subtitle}>
            <span className={styles.mobileText}>
              {invoices.length} invoices
            </span>
            <span className={styles.desktopText}>
              There are {filteredInvoices.length} total invoices
            </span>
          </p>
        </div>
        <div className={styles.headerRight}>
          <FilterBar
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
          />
          <button
            className={styles.newButton}
            onClick={() => setShowForm(true)}
          >
            <span className={styles.newButtonIcon}>+</span>
            <span className={styles.newButtonTextFull}>New Invoice</span>
            <span className={styles.newButtonTextShort}>New</span>
          </button>
        </div>
      </header>

      {filteredInvoices.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className={styles.list}>
          {filteredInvoices.map((invoice) => (
            <InvoiceCard key={invoice.id} invoice={invoice} />
          ))}
        </ul>
      )}

      {/* Render form when New Invoice is clicked */}
      {showForm && <InvoiceForm onClose={() => setShowForm(false)} />}
    </div>
  );
}

export default InvoiceListPage;
