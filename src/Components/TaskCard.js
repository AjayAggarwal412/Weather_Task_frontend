import React, { useState } from "react";
import { Card, Button, Modal } from "react-bootstrap";
import axios from "axios";

const TaskCard = ({ task, onTaskUpdate, onTaskDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title);
  const [newDescription, setNewDescription] = useState(task.description);
  const [newStatus, setNewStatus] = useState(task.status);
  const [newCity, setNewCity] = useState(task.city);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "danger";
      case "In-Progress":
        return "info";
      case "Completed":
        return "success";
      default:
        return "secondary";
    }
  };

  const getWeather = async (city) => {
    try {
      // Fetch weather details from your weather API (replace URL with actual API endpoint)
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=a55e8dc857931c9580eb7eb24193965d`
      );
      return response.data.weather[0].description; // Or any other weather details you want
    } catch (error) {
      console.error("Error fetching weather:", error);
      return "Weather information not available"; // Return a default message if error occurs
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `https://weather-task-backend.onrender.com/tasks/${task._id}`,
        {
          withCredentials: true,
        }
      );
      onTaskDelete(task._id); // Update parent component to remove the task
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const weather = await getWeather(newCity);

      const updatedTask = {
        title: newTitle,
        description: newDescription,
        status: newStatus,
        weather: weather,
        city: newCity,
      };

      const response = await axios.put(
        `https://weather-task-backend.onrender.com/tasks/${task._id}`,
        updatedTask,
        { withCredentials: true }
      );

      onTaskUpdate(response.data.task); // Update parent component with updated task
      setShowModal(false); // Close modal after updating
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <>
      <Card
        className="mb-3 shadow-sm"
        style={{
          width: "18rem",
          height: "21rem",
          borderRadius: "15px",
          backgroundColor: "#e9ecef",
        }}
      >
        <Card.Body>
          <Card.Title
            className="text-center mb-4"
            style={{ fontWeight: "bold", fontSize: "1.2rem", color: "#343a40" }}
          >
            {task.title}
          </Card.Title>

          <hr />

          <Card.Text
            className="mb-4"
            style={{
              fontSize: "1rem",
              color: "#6c757d",
              textAlign: "justify",
              lineHeight: "1.5",
            }}
          >
            {task.description}
          </Card.Text>

          <Card.Subtitle
            className="mb-5 text-muted"
            style={{ fontSize: "0.9rem" }}
          >
            Status:{" "}
            <span
              className={`badge bg-${getStatusColor(task.status)}`}
              style={{ fontSize: "0.9rem" }}
            >
              {task.status}
            </span>
          </Card.Subtitle>

          <Card.Text
            style={{ fontSize: "1rem", color: "#343a40" }}
            className="mb-5"
          >
            Weather: {task.weather}
          </Card.Text>

          <hr />

          <div className="d-flex justify-content-between mt-3">
            <Button variant="warning" onClick={() => setShowModal(true)}>
              Edit
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Edit Task Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label>Title</label>
            <input
              type="text"
              className="form-control"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>Description</label>
            <textarea
              className="form-control"
              rows="3"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="mb-3">
            <label>Status</label>
            <select
              className="form-control"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="In-Progress">In-Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="mb-3">
            <label>City</label>
            <input
              type="text"
              className="form-control"
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TaskCard;
