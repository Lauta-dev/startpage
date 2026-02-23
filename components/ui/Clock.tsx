'use client';

import React, { useState, useEffect } from 'react';

const Clock: React.FC = () => {
  const [dateTime, setDateTime] = useState<Date | null>(null);

  useEffect(() => {
    setDateTime(new Date());
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours   = dateTime ? String(dateTime.getHours()).padStart(2, '0')   : '00';
  const minutes = dateTime ? String(dateTime.getMinutes()).padStart(2, '0') : '00';

  const formatDate = (date: Date): string => {
    const days   = ['DOMINGO','LUNES','MARTES','MIÉRCOLES','JUEVES','VIERNES','SÁBADO'];
    const months = ['ENERO','FEBRERO','MARZO','ABRIL','MAYO','JUNIO',
                    'JULIO','AGOSTO','SEPTIEMBRE','OCTUBRE','NOVIEMBRE','DICIEMBRE'];
    return `${days[date.getDay()]} — ${date.getDate()} DE ${months[date.getMonth()]} DE ${date.getFullYear()}`;
  };

  return (
    <div>
      {/* Time — matches .clock-time from HTML */}
      <div
        className="font-bold leading-none tracking-tight"
        style={{ fontSize: '5.5rem', color: 'var(--text-hi)' }}
      >
        {hours}
        <span style={{ color: 'var(--accent)', animation: 'blink-col 1s step-end infinite' }}>:</span>
        {minutes}
      </div>

      {/* Date — matches .clock-date from HTML */}
      <div
        style={{
          fontSize: '0.62rem',
          letterSpacing: '0.1em',
          color: 'var(--text-lo)',
          marginTop: '8px',
          textTransform: 'uppercase',
        }}
      >
        {dateTime ? formatDate(dateTime) : <span style={{ visibility: 'hidden' }}>LUNES — 00 DE ENERO DE 0000</span>}
      </div>

      <style>{`
        @keyframes blink-col {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.2; }
        }
      `}</style>
    </div>
  );
};

export default Clock;
