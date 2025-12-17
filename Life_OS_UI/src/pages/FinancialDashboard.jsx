import { useState, useEffect } from 'react';
import './Page.css'; // For the shared page styling

const FinancialDashboard = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/accounts');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAccounts(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  return (
    <div className="page-container">
      <header>
        <h1>Financial Dashboard</h1>
      </header>
      <main>
        <h2>Your Accounts</h2>
        {loading && <p>Loading accounts from Plaid...</p>}
        {error && <p className='error-message'>Error fetching data: {error}</p>}
        {!loading && !error && (
          <table>
            <thead>
              <tr>
                <th>Account Name</th>
                <th>Type</th>
                <th className='balance-header'>Balance</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account, index) => (
                <tr key={index}>
                  <td>{account.name}</td>
                  <td>{account.subtype}</td>
                  <td className='balance-cell'>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: account.currency || 'USD',
                    }).format(account.balance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
};

export default FinancialDashboard;
