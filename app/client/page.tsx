'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ClientPage() {
  const [email, setEmail] = useState('');
  const [card, setCard] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // First try to get existing card
      const getResponse = await fetch(`/api/cards/get?email=${encodeURIComponent(email)}`);
      
      if (getResponse.ok) {
        const data = await getResponse.json();
        setCard(data);
      } else if (getResponse.status === 404) {
        // Card doesn't exist, create a new one
        const createResponse = await fetch('/api/cards/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        if (createResponse.ok) {
          const data = await createResponse.json();
          setCard(data);
        } else {
          setError('Failed to create loyalty card');
        }
      } else {
        setError('Failed to fetch loyalty card');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-4xl font-bold text-center text-amber-900 mb-2">
            Coffee Loyalty Card
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Collect coffees, earn points!
          </p>

          {!card ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter your email to get your loyalty card
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Loading...' : 'Get My Card'}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">Your Loyalty Card</h2>
                <p className="text-amber-100">{card.email}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-amber-50 rounded-lg p-6 text-center">
                  <div className="text-4xl font-bold text-amber-900">{card.coffeeCount}</div>
                  <div className="text-sm text-gray-600 mt-2">Coffees Purchased</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-6 text-center">
                  <div className="text-4xl font-bold text-orange-900">{card.points}</div>
                  <div className="text-sm text-gray-600 mt-2">Points Earned</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                  Your QR Code
                </h3>
                <div className="flex justify-center">
                  {card.qrCodeImage && (
                    <img 
                      src={card.qrCodeImage} 
                      alt="QR Code" 
                      className="w-64 h-64 border-4 border-white shadow-lg rounded-lg"
                    />
                  )}
                </div>
                <p className="text-sm text-gray-600 text-center mt-4">
                  Show this QR code at the counter to collect your stamps
                </p>
              </div>

              <button
                onClick={() => setCard(null)}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition duration-200"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
