// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: '', age: '', grade: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const res = await axios.get('http://localhost:5000/students');
    setStudents(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`http://localhost:5000/students/${editingId}`, form);
      setEditingId(null);
    } else {
      await axios.post('http://localhost:5000/students', form);
    }
    setForm({ name: '', age: '', grade: '' });
    fetchStudents();
  };

  const handleEdit = (student) => {
    setForm({ name: student.name, age: student.age, grade: student.grade });
    setEditingId(student._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/students/${id}`);
    fetchStudents();
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Student CRUD App</h1>

      <form onSubmit={handleSubmit} className="mb-4">
        <input
          className="border p-2 mr-2"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          className="border p-2 mr-2"
          name="age"
          type="number"
          value={form.age}
          onChange={handleChange}
          placeholder="Age"
          required
        />
        <input
          className="border p-2 mr-2"
          name="grade"
          value={form.grade}
          onChange={handleChange}
          placeholder="Grade"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {editingId ? 'Update' : 'Add'}
        </button>
      </form>

      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Age</th>
            <th className="border p-2">Grade</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td className="border p-2">{student.name}</td>
              <td className="border p-2">{student.age}</td>
              <td className="border p-2">{student.grade}</td>
              <td className="border p-2">
                <button onClick={() => handleEdit(student)} className="mr-2 text-blue-500">Edit</button>
                <button onClick={() => handleDelete(student._id)} className="text-red-500">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
