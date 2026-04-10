'use client';

import { useEffect, useState } from 'react';

export default function BaixarPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function download() {
      try {
        const res = await fetch('/api/download?file=checkupcme.zip');
        if (!res.ok) throw new Error('Erro ao baixar');
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'checkupcme.zip';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        setLoading(false);
      } catch {
        setError(true);
        setLoading(false);
      }
    }
    download();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-red-600 font-semibold text-lg mb-4">Erro ao gerar o arquivo de download.</p>
          <p className="text-gray-500 text-sm">Entre em contato para receber o arquivo por email.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-8">
        <div className="animate-spin w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full mx-auto mb-4" />
        <p className="text-gray-700 font-medium">Preparando download...</p>
        <p className="text-gray-400 text-sm mt-1">checkupcme.zip</p>
      </div>
    </div>
  );
}
