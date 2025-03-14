
import React, { useState, useEffect } from "react";
import http from "../http-common";
import { useNavigate, useParams } from "react-router-dom";

const EmployeeForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [employee, setEmployee] = useState({
    id: "",
    firstName: " ",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    position: "",
    department: "",
    hireDate: "",
    email: "",
    phoneNumber: "",
    address: "",
  });

  // If 'id' exists, fetch the employee data
  useEffect(() => {
    if (id) {
      const fetchEmployee = async () => {
        try {
          const response = await http.get(`/employee/get/${id}`);  // Make sure the endpoint is correct
          setEmployee(response.data);
        } catch (error) {
          console.error("Error fetching employee data!", error);
          alert("Employee not found.");
        }
      };

      fetchEmployee();
    }
  }, [id]);  // Fetch data when 'id' changes

  const handleChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (id) {
        // If 'id' exists, it's an update request
        await http.put(`/employee/update/${id}`, employee);
        alert("Employee updated successfully!");
      } else {
        // Otherwise, it's an add request
        await http.post("/employee/add", employee);
        alert("Employee added successfully!");
      }

      // Clear form after submission and navigate back to employee list
      setEmployee({
        id: "",
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "",
        position: "",
        department: "",
        hireDate: "",
        email: "",
        phoneNumber: "",
        address: "",
      });

      navigate("/employees");
    } catch (error) {
      console.error("Error submitting employee data:", error);
      alert("Failed to submit employee data.");
    }
  };

  return (
    <div>
      <nav className="navbar">
        <div className="nav-links-center">
          <ul className="nav-links">
            <li><button onClick={() => navigate("/home")}>Home</button></li>
            <button className="nav-btn" onClick={() => navigate("/aminities")}>Amenities</button>
          </ul>
        </div>
      </nav>

      <div className="form-container">
        <h2>{id ? "Update Employee" : "Add Employee"}</h2>
        <form onSubmit={handleSubmit} className="employee-form">
          {id && (
            <div className="form-group">
              <label>ID:</label>
              <input
                type="text"
                name="id"
                value={employee.id}
                onChange={handleChange}
                readOnly  // Make the 'id' field read-only for updates
              />
            </div>
          )}

          <div className="form-group">
            <label>First Name:</label>
            <input
              type="text"
              name="firstName"
              value={employee.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={employee.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Date of Birth:</label>
            <input
              type="date"
              name="dateOfBirth"
              value={employee.dateOfBirth}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Gender:</label>
            <select name="gender" value={employee.gender} onChange={handleChange} required>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Position:</label>
            <input
              type="text"
              name="position"
              value={employee.position}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Department:</label>
            <input
              type="text"
              name="department"
              value={employee.department}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Hire Date:</label>
            <input
              type="date"
              name="hireDate"
              value={employee.hireDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={employee.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number:</label>
            <input
              type="tel"
              name="phoneNumber"
              value={employee.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Address:</label>
            <textarea
              name="address"
              value={employee.address}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <button type="submit" className="submit-btn">
            {id ? "Update Employee" : "Add Employee"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;


