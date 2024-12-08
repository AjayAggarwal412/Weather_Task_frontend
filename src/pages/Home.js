import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavbarComponent from "../Components/Navbar";
import TaskCard from "../Components/TaskCard";
import TaskModal from "../Components/TaskModal";

const Home = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get(
        "https://weather-task-backend.onrender.com/tasks",
        {
          withCredentials: true,
        }
      );

      if (data.message === "No tasks found") {
        setTasks([]);
      } else {
        setTasks(data.tasks);
      }
    } catch (error) {
      setErrorMessage("Failed to fetch tasks.");
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.post(
          "https://weather-task-backend.onrender.com",
          {},
          { withCredentials: true }
        );
        if (response.data.status === false) {
          navigate("/login");
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error(error);
        navigate("/login");
      }
    };
    checkAuth();
    fetchTasks();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post(
        "https://weather-task-backend.onrender.com/logout",
        {},
        { withCredentials: true }
      );
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };

  const handleAddTaskClick = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleTaskAdded = () => fetchTasks();

  // Handle task update
  const handleTaskUpdate = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === updatedTask._id ? updatedTask : task
      )
    );
  };

  // Handle task deletion
  const handleTaskDelete = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
  };

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <NavbarComponent
        onAddTaskClick={handleAddTaskClick}
        onLogout={handleLogout}
      />
      <Container className="mt-4">
        <Row>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <Col md={3} key={task._id} className="mb-4">
                <TaskCard
                  task={task}
                  onTaskUpdate={handleTaskUpdate}
                  onTaskDelete={handleTaskDelete}
                />
              </Col>
            ))
          ) : (
            <p>No tasks found.</p>
          )}
        </Row>
      </Container>

      <TaskModal
        show={showModal}
        onClose={handleCloseModal}
        onTaskAdded={handleTaskAdded}
      />
    </div>
  );
};

export default Home;
