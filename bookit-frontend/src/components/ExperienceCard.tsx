import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Experience } from '../types';

interface Props {
  experience: Experience;
}

const ExperienceCard: React.FC<Props> = ({ experience }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/experience/${experience.id}`)}
      className="card cursor-pointer transform hover:scale-105 transition-transform"
    >
      <img
        src={experience.imageUrl}
        alt={experience.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg">{experience.title}</h3>
          <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-xs font-semibold">
            {experience.category}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-3">{experience.location}</p>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{experience.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-sm">{experience.duration}</span>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary-600">${experience.pricePerPerson}</p>
            <p className="text-xs text-gray-500">per person</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;
