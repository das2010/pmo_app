import React, { useEffect, useState } from 'react';
import {
  getAllocations,
  createAllocation,
  updateAllocation,
} from '../services/serviceService';
import { parseISO, eachWeekOfInterval } from 'date-fns';
import { getAssignedResources } from '../services/serviceService';

/**
 * Genera todas las semanas (ej. lunes) entre startDate y endDate (inclusive).
 */
function generateWeekDates(startDate, endDate) {
  // ... usando date-fns
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  return eachWeekOfInterval({ start, end }, { weekStartsOn: 1 });
}

function ServiceAssignmentGrid({ service, onClose }) {
  const [allocations, setAllocations] = useState([]);
  const [assignedResources, setAssignedResources] = useState([]);
  const [weeks, setWeeks] = useState([]);

  useEffect(() => {
    if (service) {
      fetchAllocations(service.id);
      fetchAssigned(service.id);
      const w = generateWeekDates(service.start_date, service.end_date);
      setWeeks(w);
    }
  }, [service]);

  const fetchAllocations = async (serviceId) => {
    try {
      const data = await getAllocations(serviceId);
      setAllocations(data);
    } catch (error) {
      console.error('Error al obtener allocations:', error);
    }
  };

  const fetchAssigned = async (serviceId) => {
    try {
      const assigned = await getAssignedResources(serviceId);
      setAssignedResources(assigned);
    } catch (error) {
      console.error('Error al obtener recursos asignados:', error);
    }
  };

  const getHours = (resourceId, weekDate) => {
    const strDate = weekDate.toISOString().split('T')[0];
    const found = allocations.find(a => a.resource_id === resourceId && a.week_date === strDate);
    return found ? found.hours : 0;
  };

  const handleHoursChange = async (resourceId, weekDate, newHours) => {
    const strDate = weekDate.toISOString().split('T')[0];
    const existing = allocations.find(a => a.resource_id === resourceId && a.week_date === strDate);
    const hoursNum = Number(newHours);
    try {
      if (existing) {
        // update
        const updated = await updateAllocation(existing.id, { hours: hoursNum });
        updated.week_date = updated.week_date.split('T')[0];
		setAllocations(prev => prev.map(p => p.id === existing.id ? updated : p));
      } else {
        // create
        const created = await createAllocation(service.id, {
          resource_id: resourceId,
          week_date: strDate,
          hours: hoursNum,
        });
		created.week_date = created.week_date.split('T')[0];
        setAllocations(prev => [...prev, created]);
      }
    } catch (error) {
      console.error('Error al cambiar horas:', error);
      alert('Error al cambiar horas');
    }
  };

  return (
    <div>
      <h3>Asignaciones Semanales: {service.description}</h3>
      <button onClick={onClose}>Cerrar</button>

      <table border="1" cellPadding="5" style={{ marginTop: '10px' }}>
        <thead>
          <tr>
            <th>Sector / Recurso</th>
            {weeks.map((wDate) => {
              const strDate = wDate.toISOString().split('T')[0];
              return <th key={strDate}>{strDate}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {assignedResources.map((ar) => (
            <tr key={ar.id}>
              <td>{ar.sector_name} / {ar.resource_name} {ar.resource_lastname}</td>
              {weeks.map((wd) => {
                const wKey = wd.toISOString().split('T')[0];
                const currentHours = getHours(ar.resource_id, wd);
                return (
                  <td key={wKey} style={{ textAlign: 'center' }}>
                    <input
                      type="number"
                      min="0"
                      value={currentHours}
                      onChange={(e) => handleHoursChange(ar.resource_id, wd, e.target.value)}
                      style={{ width: '60px' }}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ServiceAssignmentGrid;
