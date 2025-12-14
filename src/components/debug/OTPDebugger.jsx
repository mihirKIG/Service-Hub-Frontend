import { useState } from 'react';

/**
 * Debug Component - Test OTP API Directly
 * Add this to your auth page temporarily to test
 */
const OTPDebugger = () => {
  const [phone, setPhone] = useState('+8801719159900');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const testDirectAPI = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      console.log('🔵 Testing API with phone:', phone);
      
      const url = 'http://127.0.0.1:8000/api/users/send-otp/';
      console.log('🔵 URL:', url);
      
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });

      console.log('🔵 Response status:', res.status);
      
      const data = await res.json();
      console.log('🔵 Response data:', data);

      if (res.ok) {
        setResponse(data);
        alert(`✅ SUCCESS! OTP: ${data.otp}`);
      } else {
        setError(JSON.stringify(data, null, 2));
      }
    } catch (err) {
      console.error('❌ Error:', err);
      setError(err.message);
      
      if (err.message.includes('CORS')) {
        alert('❌ CORS Error! Add localhost:3003 to Django CORS_ALLOWED_ORIGINS');
      } else if (err.message.includes('Failed to fetch')) {
        alert('❌ Cannot connect to backend. Is Django running on port 8000?');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      background: 'white',
      border: '2px solid #ec4899',
      borderRadius: 8,
      padding: 20,
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      zIndex: 9999,
      maxWidth: 400
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#ec4899' }}>🔧 API Debugger</h3>
      
      <input
        type="text"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone number"
        style={{
          width: '100%',
          padding: 8,
          border: '1px solid #ddd',
          borderRadius: 4,
          marginBottom: 10
        }}
      />
      
      <button
        onClick={testDirectAPI}
        disabled={loading}
        style={{
          width: '100%',
          padding: 10,
          background: '#ec4899',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1
        }}
      >
        {loading ? '⏳ Testing...' : '🧪 Test API Direct'}
      </button>

      {response && (
        <div style={{
          marginTop: 10,
          padding: 10,
          background: '#d1fae5',
          borderRadius: 4,
          fontSize: 12
        }}>
          <strong>✅ Success!</strong>
          <pre style={{ margin: '5px 0 0 0', overflow: 'auto' }}>
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}

      {error && (
        <div style={{
          marginTop: 10,
          padding: 10,
          background: '#fee2e2',
          borderRadius: 4,
          fontSize: 12,
          color: '#dc2626'
        }}>
          <strong>❌ Error:</strong>
          <pre style={{ margin: '5px 0 0 0', overflow: 'auto' }}>
            {error}
          </pre>
        </div>
      )}

      <p style={{ fontSize: 10, color: '#666', margin: '10px 0 0 0' }}>
        Open browser console (F12) for detailed logs
      </p>
    </div>
  );
};

export default OTPDebugger;
