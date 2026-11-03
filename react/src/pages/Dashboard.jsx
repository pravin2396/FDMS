import React from 'react';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1" />
    </div>
  );
};

export default Dashboard;
