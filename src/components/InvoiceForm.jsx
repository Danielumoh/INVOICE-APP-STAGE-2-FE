import { useState } from "react";
import { useInvoices } from "../context/InvoiceContext";
import styles from "./InvoiceForm.module.css";

const EMPTY_ITEM = { name: "", quantity: 1, price: 0, total: 0 };

const EMPTY_FORM = {
  senderAddress: { street: "", city: "", postCode: "", country: "" },
  clientName: "",
  clientEmail: "",
  clientAddress: { street: "", city: "", postCode: "", country: "" },
  description: "",
  createdAt: new Date().toISOString().split("T")[0],
  paymentTerms: 30,
  items: [{ ...EMPTY_ITEM }],
};

function InvoiceForm({ onClose, existingInvoice = null }) {
  const { addInvoice, updateInvoice, saveDraft } = useInvoices();

  // If editing, use existing data. If creating, use empty form.
  const [form, setForm] = useState(
    existingInvoice
      ? {
          senderAddress: existingInvoice.senderAddress,
          clientName: existingInvoice.clientName,
          clientEmail: existingInvoice.clientEmail,
          clientAddress: existingInvoice.clientAddress,
          description: existingInvoice.description,
          createdAt: existingInvoice.createdAt,
          paymentTerms: existingInvoice.paymentTerms,
          items: existingInvoice.items,
        }
      : {
          ...EMPTY_FORM,
          senderAddress: { ...EMPTY_FORM.senderAddress },
          clientAddress: { ...EMPTY_FORM.clientAddress },
          items: [{ ...EMPTY_ITEM }],
        },
  );

  const [errors, setErrors] = useState({});

  // ── Generic field updater ──
  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function handleAddressChange(type, field, value) {
    setForm((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: value },
    }));
  }

  // ── Item handlers ──
  function handleItemChange(index, field, value) {
    const updatedItems = form.items.map((item, i) => {
      if (i !== index) return item;
      const updated = { ...item, [field]: value };
      // Auto-calculate total whenever quantity or price changes
      updated.total =
        parseFloat(updated.quantity || 0) * parseFloat(updated.price || 0);
      return updated;
    });
    setForm((prev) => ({ ...prev, items: updatedItems }));
  }

  function handleAddItem() {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { ...EMPTY_ITEM }],
    }));
  }

  function handleRemoveItem(index) {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  }

  // ── Calculate grand total ──
  function calculateTotal() {
    return form.items.reduce((sum, item) => sum + (item.total || 0), 0);
  }

  // ── Calculate payment due date ──
  function calculatePaymentDue() {
    const date = new Date(form.createdAt);
    date.setDate(date.getDate() + parseInt(form.paymentTerms));
    return date.toISOString().split("T")[0];
  }

  // ── Validation ──
  function validate() {
    const newErrors = {};
    if (!form.clientName.trim())
      newErrors.clientName = "Client name is required";
    if (!form.clientEmail.trim())
      newErrors.clientEmail = "Client email is required";
    else if (!/\S+@\S+\.\S+/.test(form.clientEmail))
      newErrors.clientEmail = "Valid email required";
    if (!form.description.trim())
      newErrors.description = "Description is required";
    if (!form.senderAddress.street.trim())
      newErrors.senderStreet = "Street is required";
    if (!form.senderAddress.city.trim())
      newErrors.senderCity = "City is required";
    if (!form.senderAddress.postCode.trim())
      newErrors.senderPostCode = "Post code is required";
    if (!form.senderAddress.country.trim())
      newErrors.senderCountry = "Country is required";
    if (!form.clientAddress.street.trim())
      newErrors.clientStreet = "Street is required";
    if (!form.clientAddress.city.trim())
      newErrors.clientCity = "City is required";
    if (!form.clientAddress.postCode.trim())
      newErrors.clientPostCode = "Post code is required";
    if (!form.clientAddress.country.trim())
      newErrors.clientCountry = "Country is required";
    if (form.items.length === 0)
      newErrors.items = "At least one item is required";
    form.items.forEach((item, i) => {
      if (!item.name.trim()) newErrors[`itemName${i}`] = "Item name required";
      if (item.quantity <= 0) newErrors[`itemQty${i}`] = "Must be > 0";
      if (item.price <= 0) newErrors[`itemPrice${i}`] = "Must be > 0";
    });
    return newErrors;
  }

  // ── Submit handlers ──
  function handleSend() {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const payload = {
      ...form,
      total: calculateTotal(),
      paymentDue: calculatePaymentDue(),
    };
    if (existingInvoice) {
      updateInvoice(existingInvoice.id, payload);
    } else {
      addInvoice(payload, "pending");
    }
    onClose();
  }

  function handleDraft() {
    const payload = {
      ...form,
      total: calculateTotal(),
      paymentDue: calculatePaymentDue(),
    };
    saveDraft(payload);
    onClose();
  }

  // ── Format currency ──
  function formatCurrency(amount) {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount);
  }

  return (
    <>
      {/* Overlay — clicking it closes the form */}
      <div className={styles.overlay} onClick={onClose} />

      <div className={styles.panel} role="dialog" aria-label="Invoice form">
        <div className={styles.formInner}>
          <h2 className={styles.formTitle}>
            {existingInvoice ? `Edit #${existingInvoice.id}` : "New Invoice"}
          </h2>

          {/* ── Bill From ── */}
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Bill From</legend>
            <div className={styles.field}>
              <label htmlFor="senderStreet">Street Address</label>
              <input
                id="senderStreet"
                value={form.senderAddress.street}
                onChange={(e) =>
                  handleAddressChange("senderAddress", "street", e.target.value)
                }
                className={errors.senderStreet ? styles.inputError : ""}
              />
              {errors.senderStreet && (
                <span className={styles.error}>{errors.senderStreet}</span>
              )}
            </div>
            <div className={styles.threeCol}>
              <div className={styles.field}>
                <label htmlFor="senderCity">City</label>
                <input
                  id="senderCity"
                  value={form.senderAddress.city}
                  onChange={(e) =>
                    handleAddressChange("senderAddress", "city", e.target.value)
                  }
                  className={errors.senderCity ? styles.inputError : ""}
                />
                {errors.senderCity && (
                  <span className={styles.error}>{errors.senderCity}</span>
                )}
              </div>
              <div className={styles.field}>
                <label htmlFor="senderPostCode">Post Code</label>
                <input
                  id="senderPostCode"
                  value={form.senderAddress.postCode}
                  onChange={(e) =>
                    handleAddressChange(
                      "senderAddress",
                      "postCode",
                      e.target.value,
                    )
                  }
                  className={errors.senderPostCode ? styles.inputError : ""}
                />
                {errors.senderPostCode && (
                  <span className={styles.error}>{errors.senderPostCode}</span>
                )}
              </div>
              <div className={styles.field}>
                <label htmlFor="senderCountry">Country</label>
                <input
                  id="senderCountry"
                  value={form.senderAddress.country}
                  onChange={(e) =>
                    handleAddressChange(
                      "senderAddress",
                      "country",
                      e.target.value,
                    )
                  }
                  className={errors.senderCountry ? styles.inputError : ""}
                />
                {errors.senderCountry && (
                  <span className={styles.error}>{errors.senderCountry}</span>
                )}
              </div>
            </div>
          </fieldset>

          {/* ── Bill To ── */}
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Bill To</legend>
            <div className={styles.field}>
              <label htmlFor="clientName">Client's Name</label>
              <input
                id="clientName"
                value={form.clientName}
                onChange={(e) => handleChange("clientName", e.target.value)}
                className={errors.clientName ? styles.inputError : ""}
              />
              {errors.clientName && (
                <span className={styles.error}>{errors.clientName}</span>
              )}
            </div>
            <div className={styles.field}>
              <label htmlFor="clientEmail">Client's Email</label>
              <input
                id="clientEmail"
                type="email"
                value={form.clientEmail}
                onChange={(e) => handleChange("clientEmail", e.target.value)}
                className={errors.clientEmail ? styles.inputError : ""}
              />
              {errors.clientEmail && (
                <span className={styles.error}>{errors.clientEmail}</span>
              )}
            </div>
            <div className={styles.field}>
              <label htmlFor="clientStreet">Street Address</label>
              <input
                id="clientStreet"
                value={form.clientAddress.street}
                onChange={(e) =>
                  handleAddressChange("clientAddress", "street", e.target.value)
                }
                className={errors.clientStreet ? styles.inputError : ""}
              />
              {errors.clientStreet && (
                <span className={styles.error}>{errors.clientStreet}</span>
              )}
            </div>
            <div className={styles.threeCol}>
              <div className={styles.field}>
                <label htmlFor="clientCity">City</label>
                <input
                  id="clientCity"
                  value={form.clientAddress.city}
                  onChange={(e) =>
                    handleAddressChange("clientAddress", "city", e.target.value)
                  }
                  className={errors.clientCity ? styles.inputError : ""}
                />
                {errors.clientCity && (
                  <span className={styles.error}>{errors.clientCity}</span>
                )}
              </div>
              <div className={styles.field}>
                <label htmlFor="clientPostCode">Post Code</label>
                <input
                  id="clientPostCode"
                  value={form.clientAddress.postCode}
                  onChange={(e) =>
                    handleAddressChange(
                      "clientAddress",
                      "postCode",
                      e.target.value,
                    )
                  }
                  className={errors.clientPostCode ? styles.inputError : ""}
                />
                {errors.clientPostCode && (
                  <span className={styles.error}>{errors.clientPostCode}</span>
                )}
              </div>
              <div className={styles.field}>
                <label htmlFor="clientCountry">Country</label>
                <input
                  id="clientCountry"
                  value={form.clientAddress.country}
                  onChange={(e) =>
                    handleAddressChange(
                      "clientAddress",
                      "country",
                      e.target.value,
                    )
                  }
                  className={errors.clientCountry ? styles.inputError : ""}
                />
                {errors.clientCountry && (
                  <span className={styles.error}>{errors.clientCountry}</span>
                )}
              </div>
            </div>
          </fieldset>

          {/* ── Invoice Details ── */}
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Invoice Details</legend>
            <div className={styles.twoCol}>
              <div className={styles.field}>
                <label htmlFor="createdAt">Invoice Date</label>
                <input
                  id="createdAt"
                  type="date"
                  value={form.createdAt}
                  onChange={(e) => handleChange("createdAt", e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="paymentTerms">Payment Terms</label>
                <select
                  id="paymentTerms"
                  value={form.paymentTerms}
                  onChange={(e) => handleChange("paymentTerms", e.target.value)}
                  className={styles.select}
                >
                  <option value={1}>Next 1 Day</option>
                  <option value={7}>Next 7 Days</option>
                  <option value={14}>Next 14 Days</option>
                  <option value={30}>Next 30 Days</option>
                </select>
              </div>
            </div>
            <div className={styles.field}>
              <label htmlFor="description">Project Description</label>
              <input
                id="description"
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className={errors.description ? styles.inputError : ""}
              />
              {errors.description && (
                <span className={styles.error}>{errors.description}</span>
              )}
            </div>
          </fieldset>

          {/* ── Item List ── */}
          <div className={styles.itemsSection}>
            <h3 className={styles.itemsTitle}>Item List</h3>
            {errors.items && (
              <span className={styles.error}>{errors.items}</span>
            )}

            {form.items.map((item, index) => (
              <div key={index} className={styles.itemRow}>
                <div className={styles.field} style={{ flex: 3 }}>
                  <label>Item Name</label>
                  <input
                    value={item.name}
                    onChange={(e) =>
                      handleItemChange(index, "name", e.target.value)
                    }
                    className={
                      errors[`itemName${index}`] ? styles.inputError : ""
                    }
                  />
                  {errors[`itemName${index}`] && (
                    <span className={styles.error}>
                      {errors[`itemName${index}`]}
                    </span>
                  )}
                </div>
                <div className={styles.field} style={{ flex: 1 }}>
                  <label>Qty.</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, "quantity", e.target.value)
                    }
                    className={
                      errors[`itemQty${index}`] ? styles.inputError : ""
                    }
                  />
                </div>
                <div className={styles.field} style={{ flex: 2 }}>
                  <label>Price</label>
                  <input
                    type="number"
                    min="0"
                    value={item.price}
                    onChange={(e) =>
                      handleItemChange(index, "price", e.target.value)
                    }
                    className={
                      errors[`itemPrice${index}`] ? styles.inputError : ""
                    }
                  />
                </div>
                <div className={styles.field} style={{ flex: 2 }}>
                  <label>Total</label>
                  <span className={styles.itemTotal}>
                    {formatCurrency(item.total)}
                  </span>
                </div>
                <button
                  className={styles.removeItem}
                  onClick={() => handleRemoveItem(index)}
                  aria-label="Remove item"
                >
                  🗑
                </button>
              </div>
            ))}

            <button className={styles.addItem} onClick={handleAddItem}>
              + Add New Item
            </button>
          </div>

          {/* ── Form Actions ── */}
          <div className={styles.actions}>
            {!existingInvoice && (
              <button className={styles.btnDiscard} onClick={onClose}>
                Discard
              </button>
            )}
            {existingInvoice && (
              <button className={styles.btnDiscard} onClick={onClose}>
                Cancel
              </button>
            )}
            <div className={styles.actionsRight}>
              {!existingInvoice && (
                <button className={styles.btnDraft} onClick={handleDraft}>
                  Save as Draft
                </button>
              )}
              <button className={styles.btnSend} onClick={handleSend}>
                {existingInvoice ? "Save Changes" : "Save & Send"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default InvoiceForm;
