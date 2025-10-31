import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-primary-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="text-2xl font-bold">✈️ BookIt</div>
          <span className="text-sm opacity-90">Travel Experiences</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
