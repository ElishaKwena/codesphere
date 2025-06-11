import React from 'react';
import { Link } from 'react-router-dom'
import { ROUTES } from '../../config/constants'
import react from '../../assets/icons/react.png'
import javascript from '../../assets/icons/java-script.png'
import php from '../../assets/icons/php.png'
import csharp from '../../assets/icons/csharp.png'
import java from '../../assets/icons/java.png'
import cyber from '../../assets/icons/cyber.png'

const groups = [
  {
    name: 'React DevOps',
    icon: react,
    members: 24000,
    link: ROUTES.communities,
  },
  {
    name: 'JavaScript Devs',
    icon: javascript,
    members: 36000,
    link: ROUTES.communities,
  },
  {
    name: 'Php Elephants',
    icon: php,
    members: 2000,
    link: ROUTES.communities,
  },
  {
    name: 'C# Shapers',
    icon: csharp,
    members: 16000,
    link: ROUTES.communities,
  },
  {
    name: 'java DevOps',
    icon: java,
    members: 24000,
    link: ROUTES.communities,
  },
  {
    name: 'Cyber security',
    icon: cyber,
    members: 121000,
    link: ROUTES.communities,
  },
];

function formatMembers(num) {
  if (num >= 1000) return `${Math.round(num / 1000)}k Members`;
  return `${num} Members`;
}

const FeaturedGroups = () => {
  return (
    <section className="w-full">
      <div className='w-[97%] mx-auto'>
        <div className="flex items-center justify-between w-full mt-1 mb-1">
            <h1 className='text-2xl font-bold text-white md:text-3xl'>Featured Groups</h1>
            <Link to={ROUTES.groups} className="text-lg font-semibold text-electric hover:underline">See All</Link>
        </div>
        <div className="grid w-full grid-cols-2 gap-3 mx-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {groups.map((group, idx) => (
          <Link to={group.link} key={idx} className="flex flex-col items-center p-6 py-2 transition-all duration-300 border rounded-md shadow bg-dark800 border-border02 hover:border-electric group">
            <img src={group.icon} alt={group.name} className="w-16 h-16 mb-1" />
            <h2 className="mb-0 font-bold text-center text-white text-md">{group.name}</h2>
            <span className="mb-1 text-center text-border text-md">{formatMembers(group.members)}</span>
          </Link>
        ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedGroups;