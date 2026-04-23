import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import InvoiceListPage from "./pages/InvoiceListPage.jsx";
import InvoiceDetailPage from "./pages/InvoiceDetailPage.jsx";
import EmptyState from "./components/EmptyState.jsx";
import InvoiceCard from "./components/InvoiceCard.jsx";
import StatusBadge from "./components/StatusBadge.jsx";
import styles from "./App.module.css";
import FilterBar from "./components/FilterBar.jsx";
import InvoiceForm from "./components/InvoiceForm.jsx";
function App() {
  return (
    <div className={styles.appLayout}>
      <Sidebar />
      <main className={styles.mainContent}>
        <Routes>
          <Route path="/" element={<InvoiceListPage />} />
          <Route path="/invoices/:id" element={<InvoiceDetailPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
