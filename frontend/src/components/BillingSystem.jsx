import React, { useState, useEffect } from 'react';

const BillingSystem = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [currentOrder, setCurrentOrder] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/menu', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => setMenuItems(data))
      .catch(err => console.error(err));
  }, []);

  const addToOrder = (item, size, price) => {
    const orderId = `${item.id}-${size}`; // Unique ID per drink + size
    const existing = currentOrder.find(o => o.orderId === orderId);
    if (existing) {
      setCurrentOrder(currentOrder.map(o => 
        o.orderId === orderId ? { ...o, quantity: o.quantity + 1 } : o
      ));
    } else {
      setCurrentOrder([...currentOrder, { ...item, orderId, size, price, quantity: 1 }]);
    }
  };

  const removeFromOrder = (orderId) => {
    setCurrentOrder(currentOrder.filter(o => o.orderId !== orderId));
  };

  const updateQuantity = (orderId, delta) => {
    setCurrentOrder(currentOrder.map(o => {
      if (o.orderId === orderId) {
        const newQ = o.quantity + delta;
        return newQ > 0 ? { ...o, quantity: newQ } : o;
      }
      return o;
    }));
  };

  const total = currentOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const grandTotal = total;

  const handlePrintReceipt = async () => {
    window.print();
    
    // Save to sales history
    try {
      await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          total_amount: grandTotal,
          items_json: currentOrder
        })
      });
      // Clear the order automatically after generating the bill
      setCurrentOrder([]);
    } catch (err) {
      console.error('Failed to save sale snapshot', err);
    }
  };

  return (
    <div className="billing-system animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem' }}>
      
      {/* Point of Sale Items */}
      <div className="pos-menu hide-on-print">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3>Select Drinks</h3>
          <input 
            type="text" 
            placeholder="Search drinks..." 
            className="input-premium" 
            style={{ width: '250px', padding: '0.5rem 1rem' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {menuItems.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())).map(item => (
            <div 
              key={item.id} 
              className="glass-panel" 
              style={{ padding: '1rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
            >
              <span style={{ fontWeight: '600', display: 'block', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{item.name}</span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {item.price_90 > 0 && (
                  <button className="btn-secondary" onClick={() => addToOrder(item, '90ml', item.price_90)} style={{ padding: '0.5rem', fontSize: '0.9rem' }}>
                    90ml (₹{item.price_90})
                  </button>
                )}
                {item.price_180 > 0 && (
                  <button className="btn-secondary" onClick={() => addToOrder(item, '180ml', item.price_180)} style={{ padding: '0.5rem', fontSize: '0.9rem' }}>
                    180ml (₹{item.price_180})
                  </button>
                )}
                {item.price_half > 0 && (
                  <button className="btn-secondary" onClick={() => addToOrder(item, 'Half', item.price_half)} style={{ padding: '0.5rem', fontSize: '0.9rem' }}>
                    Half (₹{item.price_half})
                  </button>
                )}
                {item.price_full > 0 && (
                  <button className="btn-secondary" onClick={() => addToOrder(item, 'Full', item.price_full)} style={{ padding: '0.5rem', fontSize: '0.9rem' }}>
                    Full (₹{item.price_full})
                  </button>
                )}
                {item.price_5lt > 0 && (
                  <button className="btn-secondary" onClick={() => addToOrder(item, '5L', item.price_5lt)} style={{ padding: '0.5rem', fontSize: '0.9rem' }}>
                    5L (₹{item.price_5lt})
                  </button>
                )}
                {item.price_7lt > 0 && (
                  <button className="btn-secondary" onClick={() => addToOrder(item, '7L', item.price_7lt)} style={{ padding: '0.5rem', fontSize: '0.9rem' }}>
                    7L (₹{item.price_7lt})
                  </button>
                )}
              </div>
            </div>
          ))}
          {menuItems.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
            <p style={{ color: 'var(--text-secondary)' }}>No drinks match your search.</p>
          )}
        </div>
      </div>

      {/* Bill Summary */}
      <div className="bill-summary glass-panel hide-on-print" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', maxHeight: 'calc(100vh - 100px)' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h3>Current Bill</h3>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '2rem' }}>
          {currentOrder.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '2rem' }}>No items added yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {currentOrder.map(item => (
                <div key={item.orderId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500' }}>{item.name} <span style={{fontSize: '0.8rem', color: 'var(--accent-primary)', marginLeft: '0.5rem'}}>{item.size}</span></div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>₹{item.price} x {item.quantity}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex', background: 'var(--bg-tertiary)', borderRadius: '4px' }}>
                      <button onClick={() => updateQuantity(item.orderId, -1)} style={{ padding: '0.2rem 0.6rem', color: 'var(--text-primary)' }}>-</button>
                      <span style={{ padding: '0.2rem 0.6rem' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.orderId, 1)} style={{ padding: '0.2rem 0.6rem', color: 'var(--text-primary)' }}>+</button>
                    </div>
                    <div style={{ fontWeight: '600', width: '60px', textAlign: 'right' }}>₹{(item.price * item.quantity).toFixed(0)}</div>
                    <button onClick={() => removeFromOrder(item.orderId)} style={{ color: 'var(--danger)', padding: '0.2rem' }}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '700', color: 'var(--accent-primary)' }}>
            <span>Total</span>
            <span>₹{grandTotal.toFixed(2)}</span>
          </div>
          <button 
            className="btn-primary" 
            style={{ width: '100%', height: '56px', fontSize: '1.1rem' }}
            onClick={handlePrintReceipt}
            disabled={currentOrder.length === 0}
          >
            Generate Receipt
          </button>
        </div>
      </div>

      {/* Hidden Printable Receipt */}
      <div className="printable-receipt" style={{ display: 'none', padding: '1rem', fontFamily: 'monospace' }}>
        <div style={{ textAlign: 'center', marginBottom: '1rem', borderBottom: '1px dashed #000', paddingBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>Shrilatha Wines</h2>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>Bill Summary</p>
          <p style={{ margin: 0, fontSize: '0.8rem', marginTop: '0.2rem' }}>Date: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
        </div>
        
        <div style={{ display: 'flex', borderBottom: '1px solid #000', paddingBottom: '0.5rem', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.85rem' }}>
          <span style={{ flex: 2 }}>Item</span>
          <span style={{ flex: 1, textAlign: 'center' }}>Qty</span>
          <span style={{ flex: 1, textAlign: 'right' }}>Total</span>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          {currentOrder.map(item => (
            <div key={item.orderId} style={{ display: 'flex', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
              <span style={{ flex: 2 }}>{item.name} <small>({item.size})</small></span>
              <span style={{ flex: 1, textAlign: 'center' }}>x{item.quantity}</span>
              <span style={{ flex: 1, textAlign: 'right' }}>₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px dashed #000', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1rem' }}>
          <span>Grand Total:</span>
          <span>₹{grandTotal.toFixed(2)}</span>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.8rem' }}>
          <p style={{ margin: 0 }}>Thank you for visiting</p>
          <p style={{ margin: 0, fontWeight: 'bold' }}>Shrilatha Wines!</p>
        </div>
      </div>
    </div>
  );
};

export default BillingSystem;
