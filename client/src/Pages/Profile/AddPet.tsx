import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PurpleButton from "../../Components/UI/lightPurpleButton";
import { getCurrentUserId } from "../../Components/UI/auth";

const AddPet: React.FC = () => {
  const navigate = useNavigate();
  const [petData, setPetData] = useState({
    name: '',
    kind: '',
    color: '',
    status: 'found',
    location: '',
    picture: '',
    description: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPetData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = getCurrentUserId();
    console.log("userId",userId);
    try {
        const response = await fetch(`/api/pets/add/${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name:petData.name,
            kind:petData.kind,
            color:petData.color,
            status:petData.status,     
            description:petData.description
          })
        });
    
        if (!response.ok) {
          throw new Error('Failed to add pet');
        }
    
        navigate('/profile'); // Redirect to profile after success
      } catch (error) {
        console.error('Error adding pet:', error);
        setError('Failed to add pet. Please try again.');
      }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Add New Pet</h2>
      <form onSubmit={handleSubmit} className="col-lg-8 mx-auto">
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={petData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Kind</label>
          <input
            type="text"
            name="kind"
            className="form-control"
            value={petData.kind}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Color</label>
          <input
            type="text"
            name="color"
            className="form-control"
            value={petData.color}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Status</label>
          <select
            name="status"
            className="form-control"
            value={petData.status}
            onChange={handleInputChange}
            required
          >
            <option value="lost">Lost</option>
            <option value="notLost">Not Lost</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Location</label>
          <input
            type="text"
            name="location"
            className="form-control"
            value={petData.location}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-control"
            value={petData.description}
            onChange={handleInputChange}
            rows={3}
          />
        </div>

        <div className="mb-3">
          <PurpleButton type="submit">Submit Pet Information</PurpleButton>
          <PurpleButton type="button" onClick={() => navigate('/profile')}>
            Cancel
          </PurpleButton>
        </div>
      </form>
    </div>
);
}

export default AddPet;