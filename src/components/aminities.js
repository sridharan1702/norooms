
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import for navigation
import http from "../http-common";


const AmenitiesSelectBox = () => {
  const [amenities, setAmenities] = useState([]);
  const [selectedAmenity, setSelectedAmenity] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [newAmenity, setNewAmenity] = useState({ name: "", status: "", icon: "" });

  const [countries, setCountries] = useState([]);
  const [showCountrySelect, setShowCountrySelect] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");

  useEffect(() => {
    const loadAmenities = async () => {
      try {
        const response = await http.get("/master/amenities");
        setAmenities(response.data);
      } catch (err) {
        setError("Failed to load amenities");
      } finally {
        setLoading(false);
      }
    };
    loadAmenities();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await http.get("/master/countries");
      setCountries(response.data);
      setShowCountrySelect(true);
    } catch (err) {
      setError("Failed to load countries");
    }
  };

  const fetchStates = async (countryId) => {
    try {
      setStates([]);
      const response = await http.get(`/master/states/${countryId}`);
      setStates(response.data);
    } catch (err) {
      setError("Failed to load states");
    }
  };

  const handleAmenityChange = (event) => {
    setSelectedAmenity(event.target.value);
  };

  const handleCountryChange = (event) => {
    const countryId = event.target.value;
    setSelectedCountry(countryId);
    setSelectedState("");
    fetchStates(countryId);
  };

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
  };

  const handleInputChange = (event) => {
    let { name, value } = event.target;
    setNewAmenity((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const amenityData = {
      ...newAmenity,
      status: newAmenity.status === "" || newAmenity.status === "inactive" ? false : true,
    };

    try {
      const response = await http.post("/master/amenities", amenityData);
      setAmenities([...amenities, response.data]);
      setShowPopup(false);
      setNewAmenity({ name: "", status: "", icon: "" });
      alert("Successfully saved!");
    } catch (err) {
      console.error("Error adding amenity", err);
    }
  };

  return (
    <>
      {/* Full-width Navigation Bar */}
      <nav className="navbar">
  <div className="nav-links-center">
    <ul className="nav-links">
      <li><Link to="/home">Home</Link></li>
      <li><Link to="/salary">Salary</Link></li>
    </ul>
  </div>

</nav>


      <div className="amenities-container">
        <h2 className="title">Select an Amenity</h2>
        <select value={selectedAmenity} onChange={handleAmenityChange} className="custom-select">
          <option value="" disabled>Choose an amenity</option>
          {amenities.map((amenity) => (
            <option key={amenity.id} value={amenity.id}>{amenity.name}</option>
          ))}
        </select>
        {selectedAmenity && <p className="selected-text">Selected Amenity: <strong>{selectedAmenity}</strong></p>}

        <button className="add-button" onClick={() => setShowPopup(true)}>Add New Amenity</button>
        <button className="country-button" onClick={fetchCountries}>Select countries</button>

        {showCountrySelect && (
          <>
            <select value={selectedCountry} onChange={handleCountryChange} className="custom-select">
              <option value="" disabled>Choose a country</option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>{country.name} ({country.id})</option>
              ))}
            </select>

            {selectedCountry && states.length > 0 && (
              <select value={selectedState} onChange={handleStateChange} className="custom-select">
                <option value="" disabled>Choose a state</option>
                {states.map((state) => (
                  <option key={state.id} value={state.id}>{state.name}</option>
                ))}
              </select>
            )}
          </>
        )}

        {showPopup && (
          <div className="popup-overlay">
            <div className="popup">
              <h3>Add Amenity</h3>
              <form>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={newAmenity.name}
                  onChange={handleInputChange}
                  required
                />
                <select
                  name="status"
                  value={newAmenity.status}
                  onChange={handleInputChange}
                >
                  <option value="">Choose status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <input
                  type="text"
                  name="icon"
                  placeholder="Icon URL"
                  value={newAmenity.icon}
                  onChange={handleInputChange}
                />
                <div className="popup-buttons">
                  <button type="button" onClick={handleSubmit}>Save</button>
                  <button type="button" onClick={() => setShowPopup(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AmenitiesSelectBox;

