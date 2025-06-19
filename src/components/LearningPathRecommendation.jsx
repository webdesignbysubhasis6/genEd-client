import React, { useState } from 'react';
import { recommendApi, recommendSubApi } from '@/utils/api';

const subjectSemesterMap = {
  1: ['C'],
  2: ['C', 'DSA'],
  3: ['C', 'DSA', 'OS'],
  4: ['C', 'DSA', 'OS', 'Java'],
  5: ['C', 'DSA', 'OS', 'Java', 'DBMS'],
  6: ['C', 'DSA', 'OS', 'Java', 'DBMS', 'CN'],
  7: ['C', 'DSA', 'OS', 'Java', 'DBMS', 'CN', 'Python'],
  8: ['C', 'DSA', 'OS', 'Java', 'DBMS', 'CN', 'Python', 'Math'],
};

const LearningPathRecommendation = () => {
  const [recommendationType, setRecommendationType] = useState('grade');
  const [formData, setFormData] = useState({
    student_id: '',
    current_semester: '',
    months_to_exam: '',
    months_to_graduation: '',
    attendance_percent: '',
    subject_wise_grades: {},
  });
  const [subject, setSubject] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (Object.values(subjectSemesterMap).flat().includes(name)) {
      setFormData((prev) => ({
        ...prev,
        subject_wise_grades: {
          ...prev.subject_wise_grades,
          [name]: Number(value),
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const payload = {
        ...formData,
        current_semester: Number(formData.current_semester),
        months_to_exam: Number(formData.months_to_exam),
        months_to_graduation: Number(formData.months_to_graduation),
        attendance_percent: Number(formData.attendance_percent),
      };

      const res = await recommendApi.post("/generate-learning-path", payload);
      setResponse(res.data);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to fetch recommendation.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const res = await recommendSubApi.post("/subject-resources", { subject });
      setResponse(res.data);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to fetch subject recommendation.');
    } finally {
      setLoading(false);
    }
  };

  const currentSemester = Number(formData.current_semester);
  const allowedSubjects = subjectSemesterMap[currentSemester] || [];

  return (
    <div className="w-full px-4 md:px-10 lg:px-20 py-6">
      <h2 className="text-2xl font-bold mb-6">Select Recommendation Type</h2>

      <div className="mb-6">
        <select
          className="border rounded px-4 py-2"
          value={recommendationType}
          onChange={(e) => {
            setRecommendationType(e.target.value);
            setResponse(null);
          }}
        >
          <option value="grade">By Grade</option>
          <option value="subject">By Subject</option>
        </select>
      </div>

      {recommendationType === 'grade' && (
        <form onSubmit={handleGradeSubmit} className="space-y-4 border p-5 rounded-lg shadow-sm bg-white">
          {/* Basic Inputs */}
          {['student_id', 'current_semester', 'months_to_exam', 'months_to_graduation', 'attendance_percent'].map((field) => (
            <div key={field}>
              <label className="block font-medium mb-1 capitalize">{field.replace(/_/g, ' ')}</label>
              <input
                type={field === 'student_id' ? 'text' : 'number'}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
          ))}

          {/* Subject Wise Grades */}
          <div>
            <h4 className="font-semibold mt-4 mb-2">Subject Wise Grades</h4>
            {allowedSubjects.map((subject) => (
              <div key={subject} className="mb-2">
                <label className="block font-medium mb-1">{subject}</label>
                <input
                  type="number"
                  name={subject}
                  value={formData.subject_wise_grades[subject] || ''}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? 'Generating...' : 'Get Recommendation'}
          </button>
        </form>
      )}

      {recommendationType === 'subject' && (
        <form onSubmit={handleSubjectSubmit} className="space-y-4 border p-5 rounded-lg shadow-sm bg-white">
          <div>
            <label className="block font-medium mb-1">Select Subject</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            >
              <option value="">-- Select --</option>
              {subjectSemesterMap[8].map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? 'Fetching...' : 'Get Resources'}
          </button>
        </form>
      )}

      {/* Response Output */}
      {response && recommendationType === 'grade' && (
        <div className="mt-6 border p-5 rounded-lg shadow bg-white">
          <h3 className="text-xl font-semibold mb-4">Recommendation Result</h3>
          <p><strong>Student ID:</strong> {response.student_id}</p>
          <p><strong>Current Semester:</strong> {response.current_semester}</p>
          <p><strong>Core Average:</strong> {response.core_average}</p>
          <p><strong>Plan Type:</strong> {response.plan_type}</p>

          <div className="mt-4">
            <h4 className="font-semibold">Focus Areas:</h4>
            <ul className="list-disc ml-6 text-red-600">
              {response.focus_areas.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <h4 className="font-semibold">Strong Areas:</h4>
            <ul className="list-disc ml-6 text-green-600">
              {response.strong_areas.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <h4 className="font-semibold">Recommendations:</h4>
            <ul className="list-disc ml-6 text-gray-800">
              {response.recommendations.map((rec, idx) => (
                <li key={idx}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {response && recommendationType === 'subject' && (
        <div className="mt-6 border p-5 rounded-lg shadow bg-white">
          <h3 className="text-xl font-semibold mb-4">Resources for: {response.subject}</h3>
          <p><strong>Beginner:</strong> {response.resources.beginner}</p>
          <p><strong>Intermediate:</strong> {response.resources.intermediate}</p>
          <p><strong>Advanced:</strong> {response.resources.advanced}</p>

          <div className="mt-4">
            <h4 className="font-semibold">Courses:</h4>
            <ul className="list-disc ml-6 text-blue-600">
              {response.resources.courses.map((course, idx) => (
                <li key={idx}>
                  <a href={course.link} target="_blank" rel="noopener noreferrer">
                    {course.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningPathRecommendation;
