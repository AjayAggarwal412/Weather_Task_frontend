import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import axios from "axios";

const TaskModal = ({ show, onClose, onTaskAdded }) => {
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    status: "Pending",
    city: "",
    weather: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData({
      ...taskData,
      [name]: value,
    });
  };

  const fetchWeather = async (city) => {
    try {
      const response = await axios.get(
        `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=a55e8dc857931c9580eb7eb24193965d`
      );
      return response.data.weather[0].description;
    } catch (error) {
      setErrorMessage("Could not fetch weather data");
      return "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const weather = await fetchWeather(taskData.city);
    if (!weather) return;

    try {
      const response = await axios.post(
        "https://weather-task-backend.onrender.com/tasks",
        { ...taskData, weather },
        { withCredentials: true }
      );

      if (response.data.message === "Task added successfully") {
        setSuccessMessage("Task added successfully!");
        onTaskAdded();
        setTaskData({
          title: "",
          description: "",
          status: "Pending",
          city: "",
          weather: "",
        });
        onClose();

        setTimeout(() => {
          setSuccessMessage("");
        }, 2000);
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      setErrorMessage("Something went wrong, please try again.");
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={taskData.title}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              name="description"
              value={taskData.description}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="status">
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="status"
              value={taskData.status}
              onChange={handleInputChange}
            >
              <option value="Pending">Pending</option>
              <option value="In-Progress">In-Progress</option>
              <option value="Completed">Completed</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="city">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              name="city"
              value={taskData.city}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Add Task
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default TaskModal;
