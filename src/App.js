import React, { useState, useEffect } from 'react';

function App() {
  const [products, setProducts] = useState([]);
  const [order, setOrder] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ดึงข้อมูลจาก Google Sheet (ต้องเปลี่ยนเป็น URL ของคุณเอง)
    fetch('https://script.google.com/macros/s/AKfycbxMivDLxbU-2TTBGyFQbSBJBYKanGu32UZ7YgM6pdKnL1gCbp435sT39uDRMvk0VlA5jw/exec')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
    })
      .catch((err) => {
        console.error('Error loading sheet:', err);
        setLoading(false);
    });
  }, []);

  
    // console.log('products',products);
  const handleChange = (name, value) => {
    setOrder((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getOrderList = () => {
    return Object.entries(order)
      .filter(([_, value]) => value && parseFloat(value) > 0)
      .map(([name, qty]) => {
        const product = products.find((p) => p['Product name'] === name);
        return `• ${name} ${qty} ${product?.unit || ''}`;
      })
      .join('\n');
  };

  if (loading) return <div>Loading...</div>;
  
  return (
    <div style={{ padding: '20px', color: 'white', background: '#121212', minHeight: '100vh' }}>
      <h2>Order Form</h2>
      {products.map((item) => (
        <div key={item['Product name']} style={{ marginBottom: '10px' }}>
          {item['Product name']}:
          <input
            type="number"
            placeholder={`unit: ${item.unit}`}
            onChange={(e) => handleChange(item['Product name'], e.target.value)}
            style={{ marginLeft: '10px', width: '80px' }}
          />
        </div>
      ))}

      <h3>Email Draft</h3>
      <div
        style={{
          whiteSpace: 'pre-line',
          background: '#1e1e1e',
          padding: '15px',
          borderRadius: '8px',
          border: '1px solid #555',
          marginTop: '10px',
        }}
      >
        Hi Thu,<br />
        We'd like to order tomorrow as below:
        <br />
        <br />
        {getOrderList()}
        <br />
        <br />
        Best regards,<br />
        Malee Made in Thailand.
      </div>
    </div>
  );
}

export default App;
