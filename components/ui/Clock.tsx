'use client';

import React, { useState, useEffect } from 'react';
import { IconClock } from '@tabler/icons-react';

const Clock: React.FC = () => {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date): string =>
    date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });

  const formatDate = (date: Date): string => {
    const days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
    const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                    'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    return `${days[date.getDay()]} ${date.getDate()} de ${months[date.getMonth()]}`;
  };

  return (
    <div>
      <div className="text-5xl sm:text-6xl font-bold tracking-tight mb-1 flex items-center gap-3"
           style={{ color: 'var(--text-primary)' }}>
        <IconClock size={44} stroke={1.25} className="hidden sm:block" style={{ color: 'var(--text-muted)' }} />
        {formatTime(dateTime)}
      </div>
      <div className="text-base sm:text-lg font-light tracking-wide sm:pl-[56px]"
           style={{ color: 'var(--text-secondary)' }}>
        {formatDate(dateTime)}
      </div>
    </div>
  );
};

export default Clock;
