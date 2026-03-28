import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';

const SalesDashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [aggregatedData, setAggregatedData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/sales', { cache: 'no-store' });
        const data = await res.json();
        setSalesData(data);
        processData(data);
      } catch (err) {
        console.error('Failed to fetch sales', err);
      }
    };
    fetchSales();
  }, []);

  const processData = (data) => {
    // Calculate All-Time Revenue directly from complete fetch
    const revenue = data.reduce((sum, sale) => sum + sale.total_amount, 0);
    setTotalRevenue(revenue);

    // Group transactions by date for linear charting
    const grouped = data.reduce((acc, sale) => {
      const dateObj = new Date(sale.created_at + 'Z');
      const dateStr = `${dateObj.getDate()}/${dateObj.getMonth() + 1}`; // Simplistic DD/MM string
      
      if (!acc[dateStr]) {
        acc[dateStr] = { date: dateStr, revenue: 0, bills: 0 };
      }
      acc[dateStr].revenue += sale.total_amount;
      acc[dateStr].bills += 1;
      return acc;
    }, {});

    // Ensure chronological order for x-axis plots using reverse (backend serves DESC)
    const chartData = Object.values(grouped).reverse();
    setAggregatedData(chartData);
  };

  return (
    <div className="sales-dashboard animate-fade-in">
      <h3>Graphical Revenue Analytics</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
          <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>All-Time Revenue</h4>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--accent-primary)', margin: '0' }}>₹{totalRevenue.toFixed(2)}</h2>
        </div>
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
          <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Total Bills Generated</h4>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', margin: '0' }}>{salesData.length}</h2>
        </div>
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
          <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Active Serving Days</h4>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', margin: '0' }}>{aggregatedData.length}</h2>
        </div>
      </div>

      {aggregatedData.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
          {/* Revenue Smooth Area Chart */}
          <div className="glass-panel" style={{ padding: '2.5rem 1.5rem' }}>
            <h4 style={{ marginBottom: '2rem', color: 'var(--text-secondary)', paddingLeft: '1rem' }}>Daily Revenue Trend</h4>
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <AreaChart data={aggregatedData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--success)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="var(--success)" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="date" stroke="var(--text-secondary)" tick={{fontSize: 12}} tickMargin={10} />
                  <YAxis stroke="var(--text-secondary)" tick={{fontSize: 12}} tickFormatter={(val) => `₹${val}`} tickMargin={10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}
                    itemStyle={{ color: 'var(--success)', fontWeight: 'bold' }}
                    formatter={(value) => [`₹${value.toFixed(2)}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="var(--success)" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Volume of Bills Standard Bar Chart */}
          <div className="glass-panel" style={{ padding: '2.5rem 1.5rem' }}>
            <h4 style={{ marginBottom: '2rem', color: 'var(--text-secondary)', paddingLeft: '1rem' }}>Daily Invoice Volume</h4>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={aggregatedData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="date" stroke="var(--text-secondary)" tick={{fontSize: 12}} tickMargin={10} />
                  <YAxis stroke="var(--text-secondary)" tick={{fontSize: 12}} allowDecimals={false} tickMargin={10} />
                  <Tooltip 
                    cursor={{fill: 'var(--border-color)', opacity: 0.3}}
                    contentStyle={{ backgroundColor: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }}
                    itemStyle={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}
                    formatter={(value) => [value, 'Bills Issued']}
                  />
                  <Bar dataKey="bills" fill="var(--text-secondary)" radius={[6, 6, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Not enough analytical data to generate intelligent charts. Start issuing bills through the primary terminal!
        </div>
      )}
    </div>
  );
};

export default SalesDashboard;
