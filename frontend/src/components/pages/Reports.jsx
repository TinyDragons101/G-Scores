import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import useSubjectStore from '../../stores/subjectStore';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const LEVEL_LABELS = [
  'Level 1',
  'Level 2',
  'Level 3',
  'Level 4',
];

const Reports = () => {
  const { subjects, subjectsStatistics, loading, error } = useSubjectStore();
  const [selectedSubjectId, setSelectedSubjectId] = useState('');

  const subjectIdToName = subjects.reduce((acc, subject) => {
    acc[subject.id] = subject.name;
    return acc;
  }, {});

  // Lấy statistics của môn học được chọn
  console.log(subjectsStatistics);
  const selectedSubjectStats = subjectsStatistics.find(stat => stat.subjectId == selectedSubjectId);
  console.log(selectedSubjectStats);

  // Prepare data for chart
  const chartData = selectedSubjectStats ? {
    labels: LEVEL_LABELS,
    datasets: [
      {
        label: subjectIdToName[selectedSubjectId],
        backgroundColor: '#4ade80',
        data: [
          Number(selectedSubjectStats.level1),
          Number(selectedSubjectStats.level2),
          Number(selectedSubjectStats.level3),
          Number(selectedSubjectStats.level4),
        ],
      },
    ],
  } : null;

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Student Score Levels by Subject' },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Number of Students' } },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-6">Score Level Report</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Subject:
        </label>
        <select
          value={selectedSubjectId}
          onChange={(e) => setSelectedSubjectId(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select a subject</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>
      </div>
      {!selectedSubjectId ? (
        <p>Please select a subject to view statistics.</p>
      ) : !chartData ? (
        <p>No statistics available for this subject.</p>
      ) : (
        <Bar key={selectedSubjectId} data={chartData} options={options} />
      )}
    </div>
  );
};

export default Reports;
