import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const ClassAttendanceIndicator = ({ userId }) => {
  const [attendance, setAttendance] = useState([null, null, null, null, null]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const { data } = await axios.get(`/api/users/${userId}/attendance`);
        setAttendance(data);
      } catch (error) {
        console.error('Error fetching attendance:', error);
      }
    };
    
    if (userId) fetchAttendance();
  }, [userId, refresh]);

  const getStatusIcon = (status) => {
    if (status === true) return '✓';
    if (status === false) return '✗';
    return '-';
  };

  const getStatusColor = (status) => {
    if (status === true) return 'text-green-500';
    if (status === false) return 'text-red-500';
    return 'text-gray-400';
  };

  return (
    <div className="flex space-x-2">
      {attendance.map((status, index) => (
        <span 
          key={index}
          className={`${getStatusColor(status)} font-bold text-lg`}
          title={getStatusTitle(status, index)}
        >
          {getStatusIcon(status)}
        </span>
      ))}
    </div>
  );
};

// Helper para tooltips
const getStatusTitle = (status, index) => {
  const positions = ['Última clase', '2da última', '3ra última', '4ta última', '5ta última'];
  if (status === null) return `${positions[index]}: Sin respuesta`;
  return `${positions[index]}: ${status ? 'Asistió' : 'No asistió'}`;
};

export default ClassAttendanceIndicator;