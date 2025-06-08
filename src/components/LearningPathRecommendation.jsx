import React, { useState } from 'react';
import { recommendApi } from '@/utils/api';

const LearningPathRecommendation = () => {
  const [formData, setFormData] = useState({
    student_id: '',
    current_semester: '',
    months_to_exam: '',
    months_to_graduation: '',
    attendance_percent: '',
    subject_wise_grades: {
      C: '',
      DSA: '',
      OS: '',
      Java: '',
      Python: '',
      DBMS: '',
      CN: '',
      Math: '',
    },
  });

  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (['C', 'DSA', 'OS', 'Java', 'DBMS','CN' ,'Python','Math'].includes(name)) {
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

  const handleSubmit = async (e) => {
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

      const res = await recommendApi.post("/generate-learning-path",payload);
      setResponse(res.data);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to fetch recommendation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-4 md:px-10 lg:px-20 py-6">
        <h2 className="text-2xl font-bold mb-4">Generate Learning Path</h2>


      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 border p-5 rounded-lg shadow-sm bg-white">
        <div>
          <label className="block font-medium mb-1">Student ID</label>
          <input
            type="text"
            name="student_id"
            value={formData.student_id}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Current Semester</label>
          <input
            type="number"
            name="current_semester"
            value={formData.current_semester}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Months to Exam</label>
          <input
            type="number"
            name="months_to_exam"
            value={formData.months_to_exam}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Months to Graduation</label>
          <input
            type="number"
            name="months_to_graduation"
            value={formData.months_to_graduation}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Attendance Percentage</label>
          <input
            type="number"
            name="attendance_percent"
            value={formData.attendance_percent}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <h4 className="font-semibold mt-4 mb-2">Subject Wise Grades</h4>
          {Object.keys(formData.subject_wise_grades).map((subject) => (
            <div key={subject} className="mb-2">
              <label className="block font-medium mb-1">{subject}</label>
              <input
                type="number"
                name={subject}
                value={formData.subject_wise_grades[subject]}
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

      {/* Response */}
      {response && (
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
    </div>
  );
};

export default LearningPathRecommendation;
