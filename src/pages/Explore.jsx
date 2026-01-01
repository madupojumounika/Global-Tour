import React, { useState } from 'react';
import PackageCard from '../components/PackageCard';
import { PACKAGES } from '../constants/packages';

function Explore() {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredPackages = PACKAGES.filter(pkg =>
    pkg.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBook = (pkg) => alert(`Book: ${pkg.title}`);
  const handleViewMap = (pkg) => alert(`Map: ${pkg.title}`);

  return (
    <div className="p-6 bg-slate-900 min-h-screen">
      <input
        type="text"
        placeholder="Search for any place..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full md:w-1/2 p-3 rounded-xl border border-red-500 bg-slate-800 text-white placeholder:text-slate-400 mb-6"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPackages.map(pkg => (
          <PackageCard
            key={pkg.id}
            pkg={pkg}
            onBook={handleBook}
            onViewMap={handleViewMap}
          />
        ))}
      </div>
    </div>
  );
}

export default Explore;
