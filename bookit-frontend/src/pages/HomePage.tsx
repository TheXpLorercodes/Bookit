import React, { useEffect, useState } from 'react';
import { getExperiences } from '../api';
import { Experience } from '../types';
import ExperienceCard from '../components/ExperienceCard';

const HomePage: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getExperiences();
      setExperiences(data.experiences);
    } catch (err) {
      setError('Failed to load experiences');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = experiences.filter(exp =>
    exp.title.toLowerCase().includes(search.toLowerCase()) ||
    exp.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Discover Amazing Experiences</h1>
        <p className="text-gray-600 text-lg">Explore and book incredible travel adventures</p>
      </div>

      <div className="mb-8">
        <input
          type="text"
          placeholder="Search experiences..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field max-w-md mx-auto block"
        />
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-600"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-center">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((exp) => (
            <ExperienceCard key={exp.id} experience={exp} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
