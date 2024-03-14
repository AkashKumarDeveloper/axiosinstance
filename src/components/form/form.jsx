import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axiosInstance from '../instance/instance';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  age: Yup.number().required('Age is required').positive('Age must be positive').integer('Age must be an integer'),
});

const CrudComponent = () => {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/users');
      console.log("Response>>",response.data);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleEdit = (userId) => {
    setEditingId(userId);
  };

  const handleDelete = async (userId) => {
    try {
      await axiosInstance.delete(`/users/${userId}`);
      console.log("users.filter((id) => users.id !== id)",users.filter((users) => users.id != userId));
      setUsers(users.filter((users) => users.id != userId));
      // fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (editingId) {
        await axiosInstance.put(`/users/${editingId}`, values);
      } else {
        await axiosInstance.post('/users', values);
      }
      setSubmitting(false);
      setEditingId(null);
      fetchUsers();
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1>User Management</h1>
      <Formik
        initialValues={{ name: '', email: '', age: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label htmlFor="name">Name:</label>
              <Field type="text" name="name" />
              <ErrorMessage name="name" component="div" />
            </div>
            <div>
              <label htmlFor="email">Email:</label>
              <Field type="email" name="email" />
              <ErrorMessage name="email" component="div" />
            </div>
            <div>
              <label htmlFor="age">Age:</label>
              <Field type="number" name="age" />
              <ErrorMessage name="age" component="div" />
            </div>
            <button type="submit" disabled={isSubmitting}>
              {editingId ? 'Update' : 'Add'}
            </button>
          </Form>
        )}
      </Formik>
      <h2>Users</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} - {user.email} - {user.age}
            <button onClick={() => handleEdit(user.id)}>Edit</button>
            <button onClick={() => handleDelete(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CrudComponent;