import React, { useState, useEffect } from 'react';

const InventorySystem = () => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newItemName, setNewItemName] = useState('');

  const fetchItems = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/inventory', { cache: 'no-store' });
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    try {
      await fetch('http://localhost:3001/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newItemName })
      });
      setNewItemName('');
      fetchItems();
    } catch (err) {
      console.error('Failed to add item', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3001/api/inventory/${id}`, { method: 'DELETE' });
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDirectInput = async (id, field, value) => {
    const item = items.find(i => i.id === id);
    if (!item) return;

    let numValue = parseInt(value) || 0;
    let newStockHalf = field === 'half' ? Math.max(0, numValue) : item.stock_half;
    let newStockFull = field === 'full' ? Math.max(0, numValue) : item.stock_full;

    setItems(items.map(i => i.id === id ? { ...i, stock_half: newStockHalf, stock_full: newStockFull } : i));

    try {
        await fetch(`http://localhost:3001/api/inventory/${id}/stock`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stock_half: newStockHalf, stock_full: newStockFull })
        });
    } catch (err) {
        console.error('Failed to update explicitly', err);
        fetchItems();
    }
  };

  const updateStock = async (id, field, delta) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    const currentVal = field === 'half' ? item.stock_half : item.stock_full;
    handleDirectInput(id, field, currentVal + delta);
  };

  return (
    <div className="inventory-system animate-fade-in">
      <h3>Standalone Inventory Management</h3>
      
      <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '1rem', marginBottom: '2rem' }}>
        <h4 style={{ marginBottom: '1rem' }}>Add New Inventory Track</h4>
        <form onSubmit={handleAddItem} style={{ display: 'flex', gap: '1rem', alignItems: 'end' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Item Name</label>
            <input 
              type="text" 
              className="input-premium" 
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="e.g. Signature Whiskey"
              required 
            />
          </div>
          <button type="submit" className="btn-primary" style={{ height: '48px', padding: '0 2rem' }}>
            Add to Inventory
          </button>
        </form>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h4>Current Stock</h4>
          <input 
            type="text" 
            placeholder="Search inventory..." 
            className="input-premium" 
            style={{ width: '250px', padding: '0.5rem 1rem' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Item Name</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Half Cases</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Full Cases</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Total Cases</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())).map(item => {
                const totalCases = item.stock_full + (item.stock_half * 0.5);
                return (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', fontWeight: '500' }}>{item.name}</td>
                  
                  {/* Half Cases */}
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                      <button 
                        onClick={() => updateStock(item.id, 'half', -1)} 
                        style={{ padding: '0.4rem 0.8rem', color: 'var(--text-secondary)', fontWeight: 'bold', background: 'var(--bg-secondary)' }}
                      >-</button>
                      <input 
                        type="number"
                        min="0"
                        value={item.stock_half === 0 ? '' : item.stock_half}
                        placeholder="0"
                        onChange={(e) => handleDirectInput(item.id, 'half', e.target.value)}
                        style={{ width: '60px', textAlign: 'center', border: 'none', background: 'transparent', fontWeight: '600', padding: '0.4rem', outline: 'none', color: 'var(--text-primary)' }}
                      />
                      <button 
                        onClick={() => updateStock(item.id, 'half', 1)} 
                        style={{ padding: '0.4rem 0.8rem', color: 'var(--text-primary)', fontWeight: 'bold', background: 'var(--bg-secondary)' }}
                      >+</button>
                    </div>
                  </td>
                  
                  {/* Full Cases */}
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                      <button 
                        onClick={() => updateStock(item.id, 'full', -1)} 
                        style={{ padding: '0.4rem 0.8rem', color: 'var(--text-secondary)', fontWeight: 'bold', background: 'var(--bg-secondary)' }}
                      >-</button>
                      <input 
                        type="number"
                        min="0"
                        value={item.stock_full === 0 ? '' : item.stock_full}
                        placeholder="0"
                        onChange={(e) => handleDirectInput(item.id, 'full', e.target.value)}
                        style={{ width: '60px', textAlign: 'center', border: 'none', background: 'transparent', fontWeight: '600', padding: '0.4rem', outline: 'none', color: 'var(--text-primary)' }}
                      />
                      <button 
                        onClick={() => updateStock(item.id, 'full', 1)} 
                        style={{ padding: '0.4rem 0.8rem', color: 'var(--text-primary)', fontWeight: 'bold', background: 'var(--bg-secondary)' }}
                      >+</button>
                    </div>
                  </td>

                  {/* Total Cases */}
                  <td style={{ padding: '1rem', fontWeight: '600', color: 'var(--accent-primary)' }}>
                    {totalCases}
                  </td>
                  
                  {/* Delete */}
                  <td style={{ padding: '1rem' }}>
                    <button 
                      className="btn-secondary" 
                      onClick={() => handleDirectInput(item.id, 'delete_placeholder', -1).then(() => handleDelete(item.id))} /* We rely directly on handleDelete, wrap inside an arrow cleanly */
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              )})}
              {items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No inventory items match your search. Add one above.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventorySystem;
