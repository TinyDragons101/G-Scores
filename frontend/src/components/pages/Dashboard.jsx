import React, { useState, useEffect } from 'react';
import useStudentStore from '../../stores/studentStore';
import useSubjectStore from '../../stores/subjectStore';

const GROUPS = ['A', 'B', 'C', 'D'];

const Dashboard = () => {
  const { topStudents, loading, error, fetchTopStudentsByGroup } = useStudentStore();
  const [selectedGroup, setSelectedGroup] = useState('');
  const { subjects } = useSubjectStore();

  const subjectIdToName = subjects.reduce((acc, subject) => {
    acc[subject.id] = subject.name;
    return acc;
  }, {});


  const transformedTopStudents = topStudents.map((student) => ({
    studentId: student.studentId,
    languageCode: student.languageCode,
    scoreList: student.scoreList.map((score) => ({ name: subjectIdToName[score.subjectId], score: score.score }))
  }));

  useEffect(() => {
    if (selectedGroup) {
      fetchTopStudentsByGroup(selectedGroup);
    }
  }, [selectedGroup]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-6">Top Students by Group</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Group:
        </label>
        <select
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select a group</option>
          {GROUPS.map((group) => (
            <option key={group} value={group}>
              Group {group}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {!selectedGroup ? (
        <p>Please select a group to view top students.</p>
      ) : topStudents.length == 0 ? (
        <p>No students found for this group.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 text-left">Student ID</th>
                <th className="py-3 px-4 text-left">Language Code</th>
                <th className="py-3 px-4 text-left">Scores</th>
              </tr>
            </thead>
            <tbody>
              {transformedTopStudents.map((student) => (
                <tr key={student.studentId} className="border-b">
                  <td className="py-3 px-4">{student.studentId}</td>
                  <td className="py-3 px-4">{student.languageCode}</td>
                  <td className="py-3 px-4">
                    {student.scoreList.map((score, index) => (
                      <span key={index} className="mr-4">
                        {score.name}: {score.score}
                      </span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;