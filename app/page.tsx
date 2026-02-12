import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold text-gray-900 mb-4">
              ☕ Coffee Loyalty Card
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Collect coffees, earn points, and enjoy rewards!
            </p>
            <p className="text-gray-500">
              Built with Firebase, Next.js, and Apple/Google Wallet integration
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white rounded-lg shadow-xl p-8 hover:shadow-2xl transition-shadow">
              <div className="text-4xl mb-4">👤</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Customer</h2>
              <p className="text-gray-600 mb-6">
                Get your digital loyalty card and start collecting points with every coffee purchase.
              </p>
              <Link
                href="/client"
                className="block w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition duration-200"
              >
                Get Your Card
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-xl p-8 hover:shadow-2xl transition-shadow">
              <div className="text-4xl mb-4">👨‍💼</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin</h2>
              <p className="text-gray-600 mb-6">
                Manage customer loyalty cards, scan QR codes, and view transaction history.
              </p>
              <Link
                href="/admin"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition duration-200"
              >
                Admin Dashboard
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">How It Works</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-3">📧</div>
                <h4 className="font-semibold text-gray-900 mb-2">1. Register</h4>
                <p className="text-gray-600 text-sm">Enter your email to get your unique loyalty card</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">📱</div>
                <h4 className="font-semibold text-gray-900 mb-2">2. Show QR Code</h4>
                <p className="text-gray-600 text-sm">Present your QR code at the counter when you buy coffee</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">🎁</div>
                <h4 className="font-semibold text-gray-900 mb-2">3. Earn Points</h4>
                <p className="text-gray-600 text-sm">Collect points with every purchase and redeem rewards</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
