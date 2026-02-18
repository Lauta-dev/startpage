'use client';

import React, { useState, useEffect } from 'react';

const Clock: React.FC = () => {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (date: Date): string => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                   'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const monthName = months[date.getMonth()];
    
    return `${dayName} ${day} de ${monthName}`;
  };

  return (
    <div className="mb-6 sm:mb-8">
      <div className="text-4xl sm:text-5xl font-bold text-white mb-1">
        {formatTime(dateTime)}
      </div>
      <div className="text-base sm:text-lg text-white/60">
        {formatDate(dateTime)}
      </div>
    </div>
  );
};

export default Clock;