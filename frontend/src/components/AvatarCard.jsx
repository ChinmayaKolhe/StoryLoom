import React from 'react';

const AvatarCard = ({ avatar, onSelect, selected = false }) => {
  return (
    <div
      onClick={() => onSelect && onSelect(avatar)}
      className={`card cursor-pointer transform transition-all duration-200 hover:scale-105 ${
        selected ? 'ring-4 ring-primary-500' : ''
      }`}
    >
      <div className="relative">
        <img
          src={avatar.generatedImageUrl || avatar.originalImageUrl}
          alt={avatar.characterName}
          className="w-full h-48 object-cover rounded-lg mb-3"
        />
        {selected && (
          <div className="absolute top-2 right-2 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Selected
          </div>
        )}
      </div>
      <h3 className="font-semibold text-lg text-gray-800">{avatar.characterName}</h3>
      <p className="text-sm text-gray-500 capitalize">{avatar.style} style</p>
    </div>
  );
};

export default AvatarCard;
