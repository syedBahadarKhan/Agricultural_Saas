import React from 'react';

export default function PlaceholderPage({ title }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-slate-500">
      <div className="text-4xl mb-4">🚧</div>
      <h2 className="text-xl font-bold text-navy-900 mb-2">{title}</h2>
      <p>This module is currently under development.</p>
    </div>
  );
}
