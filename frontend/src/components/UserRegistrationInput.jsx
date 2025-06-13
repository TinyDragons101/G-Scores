import React, { useState } from 'react';
import useStudentStore from '../stores/studentStore';

const UserRegistrationInput = () => {

  const { student, loading, fetchStudentScores } = useStudentStore();
  const [studentId, setStudentId] = useState('');

  const handleSubmit = () => {
    if (studentId.trim()) {
      fetchStudentScores(studentId);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-6">User Registration</h2>
      <div className="flex items-end space-x-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Registration Number:
          </label>
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="Enter registration number"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={handleSubmit}
          className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default UserRegistrationInput; 