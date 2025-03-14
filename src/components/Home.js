import React, { useState, useEffect } from "react";
import http from "../http-common";
import { useNavigate } from "react-router-dom";

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const navigate = useNavigate();

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const response = await http.get("http://localhost:8090/api/employee/get");
        setEmployees(response.data);
        setFilteredEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employee data!", error);
      } finally {
        setLoading(false);
      }
    };
    loadEmployees();
  }, []);


  const handleDelete = async (id) => {
    
    const confirmDelete = window.confirm("Are you sure you want to delete this employee?");
    if (!confirmDelete) return;

    try {
     
      await http.delete(`http://localhost:8090/api/employee/delete/${id}`);

      // Fetch the updated employee list after deletion
      const response = await http.get("http://localhost:8090/api/employee/get");
      setEmployees(response.data);
      setFilteredEmployees(response.data);

      alert("Employee deleted successfully!");
    } catch (error) {
      console.error("Error deleting employee", error);
      alert("Failed to delete employee. Please try again.");
    }
  };

  const handleSearch = () => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = employees.filter(
      (employee) =>
        employee.firstName.toLowerCase().includes(lowercasedQuery) ||
        employee.lastName.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredEmployees(filtered);
    setCurrentPage(1);
  };

  const handleResetSearch = () => {
    setSearchQuery("");
    setFilteredEmployees(employees);
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedEmployees = [...filteredEmployees].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredEmployees(sortedEmployees);
  };

  const indexOfLastEmployee = currentPage * entriesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - entriesPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);
  const totalPages = Math.ceil(filteredEmployees.length / entriesPerPage);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* 🔹 Navigation Bar */}
      <nav className="navbar">
        <div className="nav-left">
          <button className="nav-btn" onClick={() => navigate("/salary")}>Salary</button>
          <button className="nav-btn" onClick={() => navigate("/aminities")}>Amenities</button>
        </div>
        <h2 className="navbar-title">Employee Table</h2>
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-btn" onClick={handleSearch}>Search</button>
          {searchQuery && (
            <button className="reset-btn" onClick={handleResetSearch}>Refresh Table</button>
          )}
        </div>
      </nav>

      {/* 🔹 Employee Table */}
      <div className="table-container">
        <div className="entries-container">
          <label>Entries per page:</label>
          <select value={entriesPerPage} onChange={(e) => setEntriesPerPage(parseInt(e.target.value))}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>

        <table className="employee-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("id")}>
                ID {sortConfig.key === "id" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
              </th>
              <th onClick={() => handleSort("firstName")}>
                First Name {sortConfig.key === "firstName" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
              </th>
              <th onClick={() => handleSort("lastName")}>
                Last Name {sortConfig.key === "lastName" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
              </th>
              <th onClick={() => handleSort("phoneNumber")}>
                Phone Number {sortConfig.key === "phoneNumber" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentEmployees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>{employee.firstName}</td>
                <td>{employee.lastName}</td>
                <td>{employee.phoneNumber}</td>
                <td>
                  <div className="button-group">
                    <button onClick={() => setSelectedEmployee(employee)} className="view-btn">View</button>
                    <button onClick={() => navigate("/salary")} className="update-btn">add</button>
                    <button onClick={() => navigate("/salary")} className="update-btn">update</button>
                    <button onClick={() => handleDelete(employee.id)} className="delete-btn">Delete</button>
                    <button onClick={() => alert(`Selected Employee ID: ${employee.id}`)}>Click Me</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 🔹 Pagination */}
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={currentPage === index + 1 ? "active" : ""}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* 🔹 Employee Details Modal */}
      {selectedEmployee && (
        <div className="employee-modal">
          <div className="modal-content">
            <h3>Employee Details</h3>
            <p><strong>ID:</strong> {selectedEmployee.id}</p>
            <p><strong>First Name:</strong> {selectedEmployee.firstName}</p>
            <p><strong>Last Name:</strong> {selectedEmployee.lastName}</p>
            <p><strong>Gender:</strong> {selectedEmployee.gender}</p>
            <p><strong>Hire Date:</strong> {new Date(selectedEmployee.hireDate).toLocaleDateString()}</p>
            <p><strong>Email:</strong> {selectedEmployee.email}</p>
            <p><strong>Phone Number:</strong> {selectedEmployee.phoneNumber}</p>
            <p><strong>Address:</strong> {selectedEmployee.address}</p>
            <button onClick={() => setSelectedEmployee(null)} className="close-btn">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeTable;





// import React, { useState, useEffect } from "react";
// import http from "../http-common";
// import { useNavigate } from "react-router-dom";

// const EmployeeTable = () => {
//   const [employees, setEmployees] = useState([]);
//   const [filteredEmployees, setFilteredEmployees] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [entriesPerPage, setEntriesPerPage] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

//   const navigate = useNavigate();

//   useEffect(() => {
//     const loadEmployees = async () => {
//       try {
//         const response = await http.get("/employee/get");
//         setEmployees(response.data);
//         setFilteredEmployees(response.data);
//       } catch (error) {
//         console.error("Error fetching employee data!", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadEmployees();
//   }, []);

//   const handleDelete = async (id) => {
//     const confirmDelete = window.confirm("Are you sure you want to delete this employee?");
//     if (!confirmDelete) return;

//     try {
//       await http.delete(`/employee/delete/${id}`);
//       setFilteredEmployees(filteredEmployees.filter((employee) => employee.id !== id));
//       alert("Employee deleted successfully!");
//     } catch (error) {
//       console.error("Error deleting employee", error);
//       alert("Failed to delete employee. Please try again.");
//     }
//   };

//   const handleSearch = () => {
//     const lowercasedQuery = searchQuery.toLowerCase();
//     const filtered = employees.filter(
//       (employee) =>
//         employee.firstName.toLowerCase().includes(lowercasedQuery) ||
//         employee.lastName.toLowerCase().includes(lowercasedQuery)
//     );
//     setFilteredEmployees(filtered);
//     setCurrentPage(1);
//   };

//   const handleResetSearch = () => {
//     setSearchQuery("");
//     setFilteredEmployees(employees);
//     setCurrentPage(1);
//   };

//   const handleSort = (key) => {
//     let direction = "asc";
//     if (sortConfig.key === key && sortConfig.direction === "asc") {
//       direction = "desc";
//     }
//     setSortConfig({ key, direction });

//     const sortedEmployees = [...filteredEmployees].sort((a, b) => {
//       if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
//       if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
//       return 0;
//     });

//     setFilteredEmployees(sortedEmployees);
//   };

//   const indexOfLastEmployee = currentPage * entriesPerPage;
//   const indexOfFirstEmployee = indexOfLastEmployee - entriesPerPage;
//   const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);
//   const totalPages = Math.ceil(filteredEmployees.length / entriesPerPage);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       {/* 🔹 Navigation Bar */}
//       <nav className="navbar">
//         <div className="nav-left">
//           <button className="nav-btn" onClick={() => navigate("/salary")}>Salary</button>
//           <button className="nav-btn" onClick={() => navigate("/aminities")}>Amenities</button>
//         </div>
//         <h2 className="navbar-title">Employee Table</h2>
//         <div className="search-container">
//           <input
//             type="text"
//             className="search-input"
//             placeholder="Search by name..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//           <button className="search-btn" onClick={handleSearch}>Search</button>
//           {searchQuery && (
//             <button className="reset-btn" onClick={handleResetSearch}>Refresh Table</button>
//           )}
//         </div>
//       </nav>

//       {/* 🔹 Employee Table */}
//       <div className="table-container">
//         <div className="entries-container">
//           <label>Entries per page:</label>
//           <select value={entriesPerPage} onChange={(e) => setEntriesPerPage(parseInt(e.target.value))}>
//             <option value="5">5</option>
//             <option value="10">10</option>
//             <option value="20">20</option>
//             <option value="50">50</option>
//           </select>
//         </div>

//         <table className="employee-table">
//           <thead>
//             <tr>
//               <th onClick={() => handleSort("id")}>
//                 ID {sortConfig.key === "id" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
//               </th>
//               <th onClick={() => handleSort("firstName")}>
//                 First Name {sortConfig.key === "firstName" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
//               </th>
//               <th onClick={() => handleSort("lastName")}>
//                 Last Name {sortConfig.key === "lastName" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
//               </th>
//               <th onClick={() => handleSort("phoneNumber")}>
//                 Phone Number {sortConfig.key === "phoneNumber" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
//               </th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentEmployees.map((employee) => (
//               <tr key={employee.id}>
//                 <td>{employee.id}</td>
//                 <td>{employee.firstName}</td>
//                 <td>{employee.lastName}</td>
//                 <td>{employee.phoneNumber}</td>
//                 <td>
//                   <div className="button-group">
//                     <button onClick={() => setSelectedEmployee(employee)} className="view-btn">View</button>
//                     <button onClick={() => navigate("/salary")} className="update-btn">add</button>
//                     <button onClick={() => navigate("/salary")} className="update-btn">update</button>
//                     <button onClick={() => handleDelete(employee.id)} className="delete-btn">Delete</button>
//                     <button onClick={() => alert(`Selected Employee ID: ${employee.id}`)}>Click Me</button>

//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* 🔹 Pagination */}
//         <div className="pagination">
//           {Array.from({ length: totalPages }, (_, index) => (
//             <button
//               key={index}
//               onClick={() => setCurrentPage(index + 1)}
//               className={currentPage === index + 1 ? "active" : ""}
//             >
//               {index + 1}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* 🔹 Employee Details Modal */}
//       {selectedEmployee && (
//         <div className="employee-modal">
//           <div className="modal-content">
//             <h3>Employee Details</h3>
//             <p><strong>ID:</strong> {selectedEmployee.id}</p>
//             <p><strong>First Name:</strong> {selectedEmployee.firstName}</p>
//             <p><strong>Last Name:</strong> {selectedEmployee.lastName}</p>
//             <p><strong>Gender:</strong> {selectedEmployee.gender}</p>
//             <p><strong>Hire Date:</strong> {new Date(selectedEmployee.hireDate).toLocaleDateString()}</p>
//             <p><strong>Email:</strong> {selectedEmployee.email}</p>
//             <p><strong>Phone Number:</strong> {selectedEmployee.phoneNumber}</p>
//             <p><strong>Address:</strong> {selectedEmployee.address}</p>
//             <button onClick={() => setSelectedEmployee(null)} className="close-btn">Close</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EmployeeTable;




