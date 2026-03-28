import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const SalesHistory = () => {
  const [sales, setSales] = useState([]);
  
  const fetchSales = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/sales', { cache: 'no-store' });
      const data = await res.json();
      setSales(data);
    } catch (err) {
      console.error('Failed to fetch sales logs', err);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  // Utility to match sqlite DATETIME output securely by converting local boundaries conceptually
  const isToday = (dateString) => {
    const saleDate = new Date(dateString + 'Z'); 
    const today = new Date();
    return saleDate.getDate() === today.getDate() && 
           saleDate.getMonth() === today.getMonth() && 
           saleDate.getFullYear() === today.getFullYear();
  };

  const todaySalesTotal = sales
    .filter(s => isToday(s.created_at))
    .reduce((sum, sale) => sum + sale.total_amount, 0);

  const handleResetHistory = async () => {
    if (!window.confirm('Are you ABSOLUTELY sure you want to wipe ALL sales history? This cannot be undone.')) return;
    try {
      await fetch('http://localhost:3001/api/sales', { method: 'DELETE' });
      setSales([]); // dynamically clear view efficiently
    } catch(err) {
      console.error('Failed to reset history', err);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Formatting PDF Headers
    doc.setFontSize(18);
    doc.text('Shrilatha Wines - Sales Report', 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
    
    const tableColumn = ["Bill ID", "Date & Time", "Items Sold", "Amount (Rs)"];
    const tableRows = [];
    let grossTotal = 0;

    sales.forEach(sale => {
      const date = new Date(sale.created_at + 'Z');
      const dateStr = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      
      let itemSummary = 'Unknown';
      try {
        const items = JSON.parse(sale.items_json || '[]');
        itemSummary = items.map(i => `${i.name} (${i.size}) x${i.quantity}`).join(', ');
      } catch(e) {}

      grossTotal += sale.total_amount;
      tableRows.push([`#${sale.id}`, dateStr, itemSummary, sale.total_amount.toFixed(2)]);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 36,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [74, 59, 50] } // Matches minimal dark brown primary
    });

    const finalY = doc.lastAutoTable?.finalY || 40;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Report Grand Total: Rs. ${grossTotal.toFixed(2)}`, 14, finalY + 12);

    doc.save('Shrilatha_Sales_Report.pdf');
  };

  const handleDeleteSale = async (id) => {
    if (!window.confirm(`Are you sure you want to delete Bill #${id}?`)) return;
    try {
      await fetch(`http://localhost:3001/api/sales/${id}`, { method: 'DELETE' });
      fetchSales();
    } catch (err) {
      console.error('Failed to delete sale', err);
    }
  };

  return (
    <div className="sales-history animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Sales History</h3>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-primary" onClick={handleDownloadPDF} style={{ padding: '0.5rem 1.5rem', fontWeight: 'bold' }}>
            Download PDF
          </button>
          <button className="btn-secondary" onClick={handleResetHistory} style={{ color: 'var(--danger)', borderColor: 'var(--danger)', padding: '0.5rem 1.5rem', fontWeight: 'bold' }}>
            Reset All Sales
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Today's Total Revenue</h4>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--success)', margetTop: '0' }}>₹{todaySalesTotal.toFixed(2)}</h2>
        </div>
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Total Bills Today</h4>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', margetTop: '0' }}>
            {sales.filter(s => isToday(s.created_at)).length}
          </h2>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h4 style={{ marginBottom: '1.5rem' }}>Recent Transaction Log</h4>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Bill ID</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Date & Time</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Items Sold</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', textAlign: 'right' }}>Total Amount</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sales.map(sale => {
                const date = new Date(sale.created_at + 'Z');
                let itemSummary = 'Unknown';
                try {
                  const items = JSON.parse(sale.items_json || '[]');
                  itemSummary = items.map(i => `${i.name} (${i.size}) x${i.quantity}`).join(', ');
                } catch(e) {}

                return (
                  <tr key={sale.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>#{sale.id}</td>
                    <td style={{ padding: '1rem' }}>{date.toLocaleDateString()} {date.toLocaleTimeString()}</td>
                    <td style={{ padding: '1rem', fontSize: '0.9rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={itemSummary}>
                      {itemSummary}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold', color: 'var(--success)' }}>
                      ₹{sale.total_amount.toFixed(2)}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <button 
                        className="btn-secondary" 
                        onClick={() => handleDeleteSale(sale.id)}
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
              {sales.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No sales have been recorded yet. Generate a bill to see it here!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesHistory;
