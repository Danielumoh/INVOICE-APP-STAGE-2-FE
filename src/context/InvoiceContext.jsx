import { createContext, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { generateId } from "../utils/generateId";
import { seedInvoices } from "../utils/seedData";

const InvoiceContext = createContext();

export function InvoiceProvider({ children }) {
  const [invoices, setInvoices] = useLocalStorage("invoices", seedInvoices);

  function addInvoice(invoiceData, status = "pending") {
    const newInvoice = {
      ...invoiceData,
      id: generateId(),
      status,
      createdAt:
        invoiceData.createdAt || new Date().toISOString().split("T")[0],
      total: invoiceData.items.reduce(
        (sum, item) => sum + (item.total || 0),
        0,
      ),
    };
    // Use functional update to always work with latest state
    setInvoices((prev) => [...prev, newInvoice]);
    return newInvoice.id;
  }

  function updateInvoice(id, updatedData) {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === id
          ? {
              ...inv,
              ...updatedData,
              total: updatedData.items
                ? updatedData.items.reduce(
                    (sum, item) => sum + (item.total || 0),
                    0,
                  )
                : inv.total,
            }
          : inv,
      ),
    );
  }

  function deleteInvoice(id) {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
  }

  function markAsPaid(id) {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: "paid" } : inv)),
    );
  }

  function saveDraft(invoiceData) {
    return addInvoice(invoiceData, "draft");
  }

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        markAsPaid,
        saveDraft,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoices() {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error("useInvoices must be used inside InvoiceProvider");
  }
  return context;
}
