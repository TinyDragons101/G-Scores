import React from 'react';
import useStudentStore from '../stores/studentStore';
import useSubjectStore from '../stores/subjectStore';

const DetailedScores = () => {
  const { student, loading, error } = useStudentStore();
  const { subjects } = useSubjectStore();

  const subjectIdToName = subjects.reduce((acc, subject) => {
    acc[subject.id] = subject.name;
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-6">Detailed Scores</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!student ? (
        <p>Detailed view of search scores here!</p>
      ) : (
        <div className="text-lg">
          <div className="mb-2">
            <span className="font-bold">Student ID:</span> {student.studentId}
          </div>
          <div className="mb-4">
            <span className="font-bold">Language Code:</span> {student.languageCode}
          </div>
          <div className='flex flex-wrap gap-4'>
            <div className="mb-2 font-bold">Scores:</div>
            <div className="flex flex-wrap gap-4">
                {student.scoreList && student.scoreList.slice(0, 5).map((item, idx) => (
                <span key={idx} className="inline-block bg-gray-100 px-4 py-2 rounded shadow text-base">
                    {subjectIdToName[item.subjectId]}: <span className="font-semibold">{item.score}</span>
                </span>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailedScores;
