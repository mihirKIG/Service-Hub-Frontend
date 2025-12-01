const ProviderDashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Provider Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-500 text-sm mb-2">Total Bookings</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-500 text-sm mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold">$0</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-500 text-sm mb-2">Avg Rating</h3>
          <p className="text-3xl font-bold">0.0</p>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
