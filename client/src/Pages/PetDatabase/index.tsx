import React, { useState, useEffect } from 'react';
import { Share2, MapPin, Search, Pencil } from 'lucide-react';
import PurpleButton from '../../Components/UI/lightPurpleButton';
import { FaTrash } from "react-icons/fa";
import ContactModal, { ContactFormData } from '../../Components/util/Contact';
import { PetClient, Pet } from './clients';
import './styles.css';
import PetUpdateModal from './PetUpdateModal';
import { isAdmin } from '../../Components/UI/auth';
import { useReducer } from 'react';
import { petReducer, initialState } from './petReducer';
import { useNavigate } from 'react-router';

const PetSearch: React.FC = () => {
  const [state, dispatch] = useReducer(petReducer, initialState);
  const { pets, loading, error } = state;
  const navigate= useNavigate();
  
  const [activeTab, setActiveTab] = useState<'all' | 'dogs' | 'cats'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'lost' | 'found'>('all');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const showEditButton = isAdmin();
  const [searchCriteria, setSearchCriteria] = useState<'all' | 'name' | 'color' | 'kind' | 'location' | 'description'>('all');
  const [searchInput, setSearchInput] = useState('');

  const handleDeletePet = async (petId: string) => {
    if (!window.confirm('Are you sure you want to delete this pet?')) {
      return;
    }
    
    try {
      await PetClient.deletePet(petId);
      dispatch({ type: 'DELETE_PET', payload: petId });
    } catch (err) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: err instanceof Error ? err.message : 'Failed to delete pet'
      });
    }
  };

  useEffect(() => {
    const fetchPets = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        if (searchQuery.trim()) {
          let searchResults;
          if (searchCriteria === 'all') {
            searchResults = await PetClient.searchPets(searchQuery);
          } else {
            searchResults = await PetClient.searchPetsByCriteria(searchQuery, searchCriteria);
          }
          dispatch({ type: 'SET_PETS', payload: searchResults });
        } else {
          const type = activeTab === 'all' ? 'all' : activeTab.slice(0, -1);
          const data = await PetClient.fetchPets(type);
          dispatch({ type: 'SET_PETS', payload: data });
        }
      } catch (err) {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: err instanceof Error ? err.message : 'An error occurred'
        });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    const debounceTimer = setTimeout(fetchPets, 300);
    return () => clearTimeout(debounceTimer);
  }, [activeTab, searchQuery, searchCriteria]);

  const displayedPets = pets.filter(pet => 
    statusFilter === 'all' || pet.status.toLowerCase() === statusFilter
  );

  const handleContactSubmit = (formData: ContactFormData) => {
    console.log('Contact form submitted:', formData);
    alert('Message sent! The owner will be notified.');
  };

  const handleUpdatePet = async (petId: string, data: FormData) => {
    try {
      const updatedPet = await PetClient.updatePet(petId, data);
      dispatch({ type: 'UPDATE_PET', payload: updatedPet });
      setShowUpdateModal(false);
    } catch (err) {
      console.error('Update failed:', err);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: err instanceof Error ? err.message : 'Failed to update pet'
      });
    }
  };

  const handleSearch = () => {
    setSearchQuery(searchInput);
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-danger">{error}</div>;

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Pets Search Database</h1>
      
      <div className="row mb-4">
        <div className="col-md-8 mx-auto">
          <div className="d-flex gap-3">
            <div className="btn-group" role="group" aria-label="Status filter">
              <button
                type="button"
                className={`badge rounded-pill px-3 py-2 status-filter-button all ${
                  statusFilter !== 'all' ? 'inactive' : ''
                }`}
                onClick={() => setStatusFilter('all')}
              >
                All
              </button>
              <button
                type="button"
                className={`badge rounded-pill px-3 py-2 ms-2 status-filter-button lost ${
                  statusFilter !== 'lost' ? 'inactive' : ''
                }`}
                onClick={() => setStatusFilter('lost')}
              >
                Lost
              </button>
              <button
                type="button"
                className={`badge rounded-pill px-3 py-2 ms-2 status-filter-button found ${
                  statusFilter !== 'found' ? 'inactive' : ''
                }`}
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
                placeholder={`Search by ${searchCriteria === 'all' ? 'all criteria' : searchCriteria}...`}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button
                className="btn btn-primary"
                onClick={handleSearch}
              >
                Search
              </button>
              <button
                className="btn btn-outline-secondary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {searchCriteria.charAt(0).toUpperCase() + searchCriteria.slice(1)}
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><button className="dropdown-item" onClick={() => setSearchCriteria('all')}>All Criteria</button></li>
                <li><button className="dropdown-item" onClick={() => setSearchCriteria('name')}>Name</button></li>
                <li><button className="dropdown-item" onClick={() => setSearchCriteria('color')}>Color</button></li>
                <li><button className="dropdown-item" onClick={() => setSearchCriteria('kind')}>Type</button></li>
                <li><button className="dropdown-item" onClick={() => setSearchCriteria('location')}>Location</button></li>
                <li><button className="dropdown-item" onClick={() => setSearchCriteria('description')}>Description</button></li>
              </ul>
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
        {displayedPets.map((pet) => (
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
                        {showEditButton && (
                          <>
                            <button
                              className="btn btn-link text-secondary p-0 border-0"
                              onClick={() => {
                                setSelectedPet(pet);
                                setShowUpdateModal(true);
                              }}
                              title="Edit pet"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              className="btn btn-link text-secondary p-0 border-0"
                              onClick={() => handleDeletePet(pet._id)}
                              title="Delete pet"
                            >
                              <FaTrash />
                            </button>
                          </>
                        )}
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
                          navigate(`/profile/${pet.userId}`);
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

      {displayedPets.length === 0 && (
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

      <PetUpdateModal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        onSubmit={handleUpdatePet}
        pet={selectedPet}
      />
    </div>
  );
};

export default PetSearch;