import React, { useState, useEffect } from 'react';
import { Share2, MapPin, Search } from 'lucide-react';
import PurpleButton from '../../Components/UI/lightPurpleButton';
import { FaTrash } from "react-icons/fa";
import ContactModal, { ContactFormData } from '../../Components/util/Contact';

interface Pet {
  _id: string;
  color: string;
  name: string;
  kind: string;
  status: string;
  location: string;
  picture: string;
  description: string;
}

const PetSearch: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'dogs' | 'cats'>('all');
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const API_URL = process.env.NODE_ENV === 'production' 
  ? process.env.API_URL 
  : 'http://localhost:5000';
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'lost' | 'found'>('all');

  const handleDeletePet = async (petId: string) => {
    if (!window.confirm('Are you sure you want to delete this pet?')) {
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/pets/${petId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete pet');
      }

      // Remove the deleted pet from the state
      setPets(pets.filter(pet => pet._id !== petId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete pet');
    }
  };

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const type = activeTab === 'all' ? 'all' : activeTab.slice(0, -1);
        console.log("type:", type);
        const response = await fetch(`${API_URL}/api/pets?type=${type}`);
        if (!response.ok) throw new Error('Failed to fetch pets');
        const data = await response.json();
        setPets(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [activeTab]);

  const filteredPets = pets?.filter((pet) => {
    if (!pet) return false;
    
    const searchTerm = searchQuery.toLowerCase();
    const matchesSearch = (
      (pet.name?.toLowerCase() || '').includes(searchTerm) ||
      (pet.color?.toLowerCase() || '').includes(searchTerm) ||
      (pet.kind?.toLowerCase() || '').includes(searchTerm) ||
      (pet.location?.toLowerCase() || '').includes(searchTerm) ||
      (pet.description?.toLowerCase() || '').includes(searchTerm)
    );

    const matchesStatus = statusFilter === 'all' || 
      pet.status.toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  }) || [];

  const handleContactSubmit = (formData: ContactFormData) => {
    console.log('Contact form submitted:', formData);
    alert('Message sent! The owner will be notified.');
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-danger">{error}</div>;

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Lost Pets Search Database</h1>
      
      <div className="row mb-4">
        <div className="col-md-8 mx-auto">
          <div className="d-flex gap-3">
            <div className="btn-group" role="group" aria-label="Status filter">
              <button
                type="button"
                className={`badge rounded-pill px-3 py-2 ${
                  statusFilter === 'all' 
                    ? 'bg-secondary text-white' 
                    : 'bg-light text-secondary'
                }`}
                style={{
                  fontSize: '0.8rem',
                  minWidth: '70px',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onClick={() => setStatusFilter('all')}
              >
                All
              </button>
              <button
                type="button"
                className={`badge rounded-pill px-3 py-2 ms-2 ${
                  statusFilter === 'lost' 
                    ? 'bg-danger text-white' 
                    : 'bg-light text-danger'
                }`}
                style={{
                  fontSize: '0.8rem',
                  minWidth: '70px',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onClick={() => setStatusFilter('lost')}
              >
                Lost
              </button>
              <button
                type="button"
                className={`badge rounded-pill px-3 py-2 ms-2 ${
                  statusFilter === 'found' 
                    ? 'bg-success text-white' 
                    : 'bg-light text-success'
                }`}
                style={{
                  fontSize: '0.8rem',
                  minWidth: '70px',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onClick={() => setStatusFilter('found')}
              >
                Found
              </button>
            </div>

            <div className="input-group flex-grow-1">
              <span className="input-group-text bg-white">
                <Search size={18} className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search by name, color, type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <ul className="nav nav-pills justify-content-center mb-4">
        <li className="nav-item mx-2">
          <PurpleButton
            variant={activeTab === 'all' ? 'solid' : 'outline'}
            onClick={() => setActiveTab('all')}
            className="nav-link"
          >
            <i className="bi bi-paw me-2"></i>
            All Pets
          </PurpleButton>
        </li>
        <li className="nav-item mx-2">
          <PurpleButton
            variant={activeTab === 'dogs' ? 'solid' : 'outline'}
            onClick={() => setActiveTab('dogs')}
            className="nav-link"
          >
            <i className="bi bi-paw me-2"></i>
            Dogs
          </PurpleButton>
        </li>
        <li className="nav-item mx-2">
          <PurpleButton
            variant={activeTab === 'cats' ? 'solid' : 'outline'}
            onClick={() => setActiveTab('cats')}
            className="nav-link"
          >
            <i className="bi bi-paw me-2"></i>
            Cats
          </PurpleButton>
        </li>
      </ul>

      {/* Pet Cards Grid */}
      <div className="row row-cols-1 row-cols-md-2 g-4">
        {filteredPets.map((pet) => (
          <div key={pet._id} className="col">
            <div className="card h-100">
              <div className="row g-0">
                <div className="col-md-6">
                  <img
                    src={pet.picture || "/api/placeholder/400/320"}
                    alt={pet.name}
                    className="img-fluid h-100 w-100 object-fit-cover"
                    style={{ maxHeight: '300px' }}
                  />
                </div>
                <div className="col-md-6">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h5 className="card-title mb-1">{pet.name}</h5>
                        <small className="text-muted d-flex align-items-center">
                          <MapPin size={16} className="me-1" />
                          {pet.location}
                        </small>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <span className={`badge ${
                          pet.status === 'Lost' ? 'bg-danger' : 'bg-success'
                        }`}>
                          {pet.status}
                        </span>
                        <button
                          className="btn btn-link text-secondary p-0 border-0"
                          onClick={() => handleDeletePet(pet._id)}
                          title="Delete pet"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <p className="mb-1"><strong>Type:</strong> {pet.kind}</p>
                      <p className="mb-1"><strong>Color:</strong> {pet.color}</p>
                      <p className="card-text small text-muted">
                        {pet.description}
                      </p>
                    </div>

                    <div className="d-flex gap-2">
                      <PurpleButton
                        variant="outline"
                        className="d-flex align-items-center"
                      >
                        <Share2 size={16} />
                        Share
                      </PurpleButton>
                      <PurpleButton 
                        variant="solid"
                        onClick={() => {
                          setSelectedPet(pet);
                          setShowContactModal(true);
                        }}
                      >
                        Contact
                      </PurpleButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPets.length === 0 && (
        <div className="text-center py-4 text-muted">
          {searchQuery 
            ? `No pets found matching "${searchQuery}"`
            : `No ${activeTab === 'all' ? 'pets' : activeTab} found.`
          }
        </div>
      )}

      <ContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        petName={selectedPet?.name || ''}
        onSubmit={handleContactSubmit}
      />
    </div>
  );
};

export default PetSearch;