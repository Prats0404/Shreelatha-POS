import React, { useState, useEffect } from 'react';

const MenuManager = () => {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({ name: '', price_90: '', price_180: '', price_half: '', price_full: '', price_5lt: '', price_7lt: '' });
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchItems = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/menu', { cache: 'no-store' });
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId 
      ? `http://localhost:3001/api/menu/${editingId}`
      : 'http://localhost:3001/api/menu';
    const method = editingId ? 'PUT' : 'POST';

    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          category: 'Drinks',
          price_90: parseFloat(formData.price_90) || 0,
          price_180: parseFloat(formData.price_180) || 0,
          price_half: parseFloat(formData.price_half) || 0,
          price_full: parseFloat(formData.price_full) || 0,
          price_5lt: parseFloat(formData.price_5lt) || 0,
          price_7lt: parseFloat(formData.price_7lt) || 0,
        })
      });
      setFormData({ name: '', price_90: '', price_180: '', price_half: '', price_full: '', price_5lt: '', price_7lt: '' });
      setEditingId(null);
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (item) => {
    setFormData({ 
      name: item.name, 
      price_90: item.price_90 > 0 ? item.price_90 : '', 
      price_180: item.price_180 > 0 ? item.price_180 : '', 
      price_half: item.price_half > 0 ? item.price_half : '', 
      price_full: item.price_full > 0 ? item.price_full : '',
      price_5lt: item.price_5lt > 0 ? item.price_5lt : '',
      price_7lt: item.price_7lt > 0 ? item.price_7lt : ''
    });
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3001/api/menu/${id}`, { method: 'DELETE' });
      const res = await fetch('http://localhost:3001/api/menu', { cache: 'no-store' });
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="menu-manager animate-fade-in">
      <h3>Drinks Management</h3>
      
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', marginTop: '1rem' }}>
        <h4 style={{ marginBottom: '1rem' }}>{editingId ? 'Edit Drink' : 'Add New Drink'}</h4>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'end' }}>
          <div style={{ flex: '1 1 200px', minWidth: '150px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Drink Name</label>
            <input 
              type="text" 
              className="input-premium" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required 
            />
          </div>
          <div style={{ flex: '1 1 100px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>90ml (₹)</label>
            <input 
              type="number" 
              className="input-premium"  style={{ padding: '0.75rem 0.5rem' }}
              value={formData.price_90}
              onChange={(e) => setFormData({...formData, price_90: e.target.value})}
              min="0" step="0.01" />
          </div>
          <div style={{ flex: '1 1 100px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>180ml (₹)</label>
            <input 
              type="number" 
              className="input-premium" style={{ padding: '0.75rem 0.5rem' }}
              value={formData.price_180}
              onChange={(e) => setFormData({...formData, price_180: e.target.value})}
              min="0" step="0.01" />
          </div>
          <div style={{ flex: '1 1 100px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Half (₹)</label>
            <input 
              type="number" 
              className="input-premium" style={{ padding: '0.75rem 0.5rem' }}
              value={formData.price_half}
              onChange={(e) => setFormData({...formData, price_half: e.target.value})}
              min="0" step="0.01" />
          </div>
          <div style={{ flex: '1 1 100px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Full (₹)</label>
            <input 
              type="number" 
              className="input-premium" style={{ padding: '0.75rem 0.5rem' }}
              value={formData.price_full}
              onChange={(e) => setFormData({...formData, price_full: e.target.value})}
              min="0" step="0.01" />
          </div>
          <div style={{ flex: '1 1 100px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>5L (₹)</label>
            <input 
              type="number" 
              className="input-premium" style={{ padding: '0.75rem 0.5rem' }}
              value={formData.price_5lt}
              onChange={(e) => setFormData({...formData, price_5lt: e.target.value})}
              min="0" step="0.01" />
          </div>
          <div style={{ flex: '1 1 100px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>7L (₹)</label>
            <input 
              type="number" 
              className="input-premium" style={{ padding: '0.75rem 0.5rem' }}
              value={formData.price_7lt}
              onChange={(e) => setFormData({...formData, price_7lt: e.target.value})}
              min="0" step="0.01" />
          </div>
          <div style={{ flex: '1 1 auto', display: 'flex', gap: '0.5rem' }}>
            <button type="submit" className="btn-primary" style={{ height: '48px', padding: '0 1.5rem', width: '100%' }}>
              {editingId ? 'Update' : 'Add'}
            </button>
            {editingId && (
              <button type="button" className="btn-secondary" style={{ height: '48px', padding: '0 1rem' }} onClick={() => { setEditingId(null); setFormData({ name: '', price_90: '', price_180: '', price_half: '', price_full: '', price_5lt: '', price_7lt: '' }); }}>
                X
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h4>Current Drinks</h4>
          <input 
            type="text" 
            placeholder="Search drinks..." 
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
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Name</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>90ml</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>180ml</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Half</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Full</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>5L</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>7L</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())).map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>{item.name}</td>
                  <td style={{ padding: '1rem' }}>{item.price_90 > 0 ? `₹${item.price_90}` : '-'}</td>
                  <td style={{ padding: '1rem' }}>{item.price_180 > 0 ? `₹${item.price_180}` : '-'}</td>
                  <td style={{ padding: '1rem' }}>{item.price_half > 0 ? `₹${item.price_half}` : '-'}</td>
                  <td style={{ padding: '1rem' }}>{item.price_full > 0 ? `₹${item.price_full}` : '-'}</td>
                  <td style={{ padding: '1rem' }}>{item.price_5lt > 0 ? `₹${item.price_5lt}` : '-'}</td>
                  <td style={{ padding: '1rem' }}>{item.price_7lt > 0 ? `₹${item.price_7lt}` : '-'}</td>
                  <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                    <button className="btn-secondary" onClick={() => handleEdit(item)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>Edit</button>
                    <button className="btn-secondary" onClick={() => handleDelete(item.id)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}>Delete</button>
                  </td>
                </tr>
              ))}
              {items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                <tr>
                  <td colSpan="8" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No drinks match your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MenuManager;
