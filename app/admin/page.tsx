'use client';

import { useState, useEffect } from 'react';

interface Card {
  id: string;
  email: string;
  points: number;
  coffeeCount: number;
  createdAt: string;
  updatedAt: string;
}

interface Transaction {
  id: string;
  userId: string;
  cardId: string;
  coffeeCount: number;
  pointsAdded: number;
  timestamp: string;
}

export default function AdminPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [qrCode, setQrCode] = useState('');
  const [coffeeCount, setCoffeeCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'scan' | 'cards' | 'transactions'>('scan');

  useEffect(() => {
    if (activeTab === 'cards') {
      fetchCards();
    } else if (activeTab === 'transactions') {
      fetchTransactions();
    }
  }, [activeTab]);

  const fetchCards = async () => {
    try {
      const response = await fetch('/api/admin/cards');
      if (response.ok) {
        const data = await response.json();
        setCards(data.cards);
      }
    } catch (error) {
      console.error('Failed to fetch cards:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/admin/transactions');
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrCode, coffeeCount }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ ${data.message}`);
        setQrCode('');
        setCoffeeCount(1);
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch {
      setMessage('❌ An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-blue-100 mt-2">Manage loyalty cards and scan customer QR codes</p>
          </div>

          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('scan')}
                className={`px-8 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'scan'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Scan QR Code
              </button>
              <button
                onClick={() => setActiveTab('cards')}
                className={`px-8 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'cards'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All Cards
              </button>
              <button
                onClick={() => setActiveTab('transactions')}
                className={`px-8 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'transactions'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Recent Transactions
              </button>
            </nav>
          </div>

          <div className="p-8">
            {activeTab === 'scan' && (
              <div className="max-w-2xl mx-auto">
                <form onSubmit={handleScan} className="space-y-6">
                  <div>
                    <label htmlFor="qrCode" className="block text-sm font-medium text-gray-700 mb-2">
                      Scan or Enter QR Code
                    </label>
                    <input
                      type="text"
                      id="qrCode"
                      value={qrCode}
                      onChange={(e) => setQrCode(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="CARD-..."
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="coffeeCount" className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Coffees
                    </label>
                    <input
                      type="number"
                      id="coffeeCount"
                      value={coffeeCount}
                      onChange={(e) => setCoffeeCount(parseInt(e.target.value))}
                      min="1"
                      max="10"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    />
                  </div>

                  {message && (
                    <div className={`px-4 py-3 rounded-lg ${
                      message.startsWith('✅') 
                        ? 'bg-green-50 border border-green-200 text-green-700'
                        : 'bg-red-50 border border-red-200 text-red-700'
                    }`}>
                      {message}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processing...' : 'Add Coffee Purchase'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'cards' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  All Loyalty Cards ({cards.length})
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Coffees
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Points
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Updated
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {cards.map((card) => (
                        <tr key={card.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {card.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {card.coffeeCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {card.points}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(card.updatedAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'transactions' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Recent Transactions
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Coffees Added
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Points Added
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {transactions.map((transaction) => (
                        <tr key={transaction.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {transaction.userId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {transaction.coffeeCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            +{transaction.pointsAdded}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(transaction.timestamp).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
