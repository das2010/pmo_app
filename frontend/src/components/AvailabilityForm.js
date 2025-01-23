import React, { useEffect, useState } from 'react';

/**
 * Función de utilidad para convertir distintos formatos de fecha
 * a la forma "YYYY-MM-DD" que <input type="date" /> necesita.
 */
function parseToInputDate(dbDateStr) {
  if (!dbDateStr) return '';

  // Caso: formateo ISO con 'T' (ej: "2025-01-01T00:00:00.000Z")
  if (dbDateStr.includes('T')) {
    return dbDateStr.split('T')[0];  // "2025-01-01"
  }

  // Caso: formateo "DD/MM/YYYY"
  if (dbDateStr.includes('/')) {
    const [dd, mm, yyyy] = dbDateStr.split('/');
    return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
  }

  // Fallback: si ya está en "YYYY-MM-DD" o algo similar
  return dbDateStr;
}

/**
 * Componente para crear/editar un período de disponibilidad (resource_availabilities).
 * Recibe:
 *  - availability: el registro a editar (opcional)
 *  - onSave: callback para guardar
 *  - onCancel: callback para cancelar
 */
function AvailabilityForm({ availability, onSave, onCancel }) {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [dailyHours, setDailyHours] = useState(0);

  useEffect(() => {
    if (availability) {
      setFromDate(parseToInputDate(availability.from_date));
      setToDate(parseToInputDate(availability.to_date));
      setDailyHours(availability.daily_hours);
    } else {
      setFromDate('');
      setToDate('');
      setDailyHours(0);
    }
  }, [availability]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      from_date: fromDate,  // "YYYY-MM-DD"
      to_date: toDate,      // "YYYY-MM-DD"
      daily_hours: Number(dailyHours),
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '10px' }}>
      <div>
        <label>Desde:</label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Hasta:</label>
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Horas diarias:</label>
        <input
          type="number"
          min="0"
          value={dailyHours}
          onChange={(e) => setDailyHours(e.target.value)}
          required
        />
      </div>

      <div style={{ marginTop: '10px' }}>
        <button type="submit">Guardar</button>
        <button type="button" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
}

export default AvailabilityForm;
