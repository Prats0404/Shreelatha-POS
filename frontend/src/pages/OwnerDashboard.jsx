import React, { useState, useEffect } from 'react';
import './OwnerDashboard.css';
import MenuManager from '../components/MenuManager';
import BillingSystem from '../components/BillingSystem';
import InventorySystem from '../components/InventorySystem';
import SalesHistory from '../components/SalesHistory';
import SalesDashboard from '../components/SalesDashboard';

const OwnerDashboard = () => {
  const [activeTab, setActiveTab] = useState('billing'); // User requested to drop directly to billing
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className="dashboard-layout animate-fade-in">
      <aside className="dashboard-sidebar glass-panel hide-on-print">
        <h2 className="dashboard-logo">Shrilatha<span> Wines</span></h2>
        <nav className="dashboard-nav">
          <button 
            className={`nav-btn ${activeTab === 'billing' ? 'active' : ''}`}
            onClick={() => setActiveTab('billing')}
          >
            Billing System
          </button>
          <button 
            className={`nav-btn ${activeTab === 'menu' ? 'active' : ''}`}
            onClick={() => setActiveTab('menu')}
          >
            Drinks Management
          </button>
          <button 
            className={`nav-btn ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            Inventory
          </button>
          <button 
            className={`nav-btn ${activeTab === 'sales' ? 'active' : ''}`}
            onClick={() => setActiveTab('sales')}
          >
            Sales History
          </button>
          <button 
            className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Sales Charts
          </button>
        </nav>
        <button 
          onClick={toggleTheme} 
          className="btn-secondary theme-toggle-btn"
          style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.85rem' }}
        >
          {isDarkMode ? '☀️ Light Theme' : '🌙 Dark Theme'}
        </button>
      </aside>
      
      <main className="dashboard-main glass-panel">
        {activeTab === 'billing' && <BillingSystem />}
        {activeTab === 'menu' && <MenuManager />}
        {activeTab === 'inventory' && <InventorySystem />}
        {activeTab === 'sales' && <SalesHistory />}
        {activeTab === 'dashboard' && <SalesDashboard />}
      </main>
    </div>
  );
};

export default OwnerDashboard;
