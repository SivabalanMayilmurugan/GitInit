import React, { useEffect, useState } from 'react';
import { Container, Modal, Button, Form, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getMedicationsByDate, addMedication } from './api'; // update path as needed

export default function Dashboard() {
  const [username, setUsername] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [medications, setMedications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newMed, setNewMed] = useState({ name: '', time: '' });

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('userName');
    if (!storedUser) {
      navigate('/login');
    } else {
      setUsername(storedUser);
    }
  }, [navigate]);

  // Fetch meds when date or user changes
  useEffect(() => {
    if (username) {
      const formattedDate = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD
      getMedicationsByDate(username, formattedDate)
        .then((res) => setMedications(res.data))
        .catch((err) => {
          console.error('Error fetching medications:', err);
          setMedications([]);
        });
    }
  }, [selectedDate, username]);

  const handleAddMedication = () => {
    const payload = {
      email: username,
      name: newMed.name,
      time: newMed.time,
      date: selectedDate.toISOString().split('T')[0],
    };

    addMedication(payload)
      .then(() => {
        setShowModal(false);
        setNewMed({ name: '', time: '' });
        // Refresh meds
        const formattedDate = selectedDate.toISOString().split('T')[0];
        return getMedicationsByDate(username, formattedDate);
      })
      .then((res) => setMedications(res.data))
      .catch((err) => console.error('Error adding medication:', err));
  };

  return (
    <Container fluid className="p-0" style={{ backgroundColor: '#f4f7f9', minHeight: '100vh' }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center bg-primary text-white p-3">
        <div className="d-flex align-items-center gap-2">
          <div className="rounded-circle bg-white text-primary d-flex justify-content-center align-items-center" style={{ width: 40, height: 40 }}>
            <i className="bi bi-person" />
          </div>
          <strong>{username}</strong>
        </div>
        <div>
          <i className="bi bi-bell-fill text-white position-relative">
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">!</span>
          </i>
        </div>
      </div>

      {/* Calendar */}
      <div className="px-4 mt-3 text-center">
        <h5 className="mb-3">
          {selectedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </h5>

        <div className="d-flex justify-content-center mb-4">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            className="form-control w-auto"
            dateFormat="MMMM d, yyyy"
          />
        </div>

        {/* Medication list or empty */}
        {medications.length > 0 ? (
          <ListGroup>
            {medications.map((med, idx) => (
              <ListGroup.Item key={idx}>
                <strong>{med.name}</strong> at <em>{med.time}</em>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <>
            <img src="/dose-empty.png" alt="No meds" style={{ width: 100, opacity: 0.5 }} />
            <p className="text-muted mt-2">No meds for this date</p>
          </>
        )}
      </div>

      {/* Add Button */}
      <div className="fixed-bottom mb-5 me-4 d-flex justify-content-end">
        <button
          className="btn btn-danger rounded-circle"
          style={{ width: 60, height: 60, fontSize: 30 }}
          onClick={() => setShowModal(true)}
        >
          +
        </button>
      </div>

      {/* Add Med Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Medication</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Medicine Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter medicine name"
                value={newMed.name}
                onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Time</Form.Label>
              <Form.Control
                type="time"
                value={newMed.time}
                onChange={(e) => setNewMed({ ...newMed, time: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleAddMedication}>Add</Button>
        </Modal.Footer>
      </Modal>

      {/* Bottom nav */}
      <div className="fixed-bottom bg-white d-flex justify-content-around py-2 border-top">
        <div className="text-primary">Home</div>
        <div className="position-relative">
          <span className="text-muted">Updates</span>
          <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
        </div>
        <div className="text-muted">Medications</div>
        <div className="text-muted">Manage</div>
      </div>
    </Container>
  );
}
