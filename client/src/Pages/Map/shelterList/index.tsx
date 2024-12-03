import React, { useEffect, useState } from 'react';
import { MapPin, Phone, Mail, Globe } from 'lucide-react';
import PurpleButton from '../../../Components/UI/lightPurpleButton';
import { ShelterClient, Shelter, Pet } from './client';
import './styles.css';

interface ShelterListProps {
  onShelterClick?: (shelterId: string) => void;
  onShelterUpdate: () => void;
  userRole?: string;
  currentShelterId?: string;
}

const ShelterList: React.FC<ShelterListProps> = ({ 
  onShelterClick, 
  onShelterUpdate, 
  userRole, 
  currentShelterId 
}) => {
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [shelterPets, setShelterPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'verified'>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (userRole === 'Shelter' && currentShelterId) {
          // Fetch only current shelter's data and its pets
          const [shelterData, petsData] = await Promise.all([
            ShelterClient.fetchShelters(),
            ShelterClient.fetchShelterPets(currentShelterId)
          ]);
          setShelters(shelterData.filter(s => s._id === currentShelterId));
          setShelterPets(petsData);
        } else {
          // Fetch all shelters for non-shelter users
          const shelterData = await ShelterClient.fetchShelters();
          setShelters(shelterData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userRole, currentShelterId]);

  // Filter shelters based on activeFilter
  const filteredShelters = shelters.filter(shelter => {
    if (activeFilter === 'verified') {
      return shelter.verified;
    }
    return true; // 'all' filter shows everything
  });

  const toggleVerification = async (shelterId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/shelters/${shelterId}/toggle-verification`, {
        method: 'PATCH',
      });
      
      if (!response.ok) {
        throw new Error('Failed to update verification status');
      }
      
      // Update local state
      setShelters(shelters.map(shelter => 
        shelter._id === shelterId 
          ? { ...shelter, verified: !shelter.verified }
          : shelter
      ));
      console.log("Shelter verification status updated", shelters);

      // Call the update function from props
      onShelterUpdate();
    } catch (err) {
      console.error('Error toggling verification:', err);
    }
  };

  const handleShelterClick = (shelterId: string) => {
    if (onShelterClick) {
      onShelterClick(shelterId);
    }
  };

  if (loading) return <div className="text-center py-4">Loading shelters...</div>;
  if (error) return <div className="text-center py-4 text-danger">{error}</div>;

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">
        {userRole === 'Shelter' ? 'My Shelter Profile' : 'Animal Shelters Directory'}
      </h1>
      
      {userRole !== 'Shelter' && (
        <ul className="nav nav-pills justify-content-center mb-4">
          <li className="nav-item mx-2">
            <PurpleButton
              variant={activeFilter === 'all' ? 'solid' : 'outline'}
              onClick={() => setActiveFilter('all')}
            >
              All Shelters
            </PurpleButton>
          </li>
          <li className="nav-item mx-2">
            <PurpleButton
              variant={activeFilter === 'verified' ? 'solid' : 'outline'}
              onClick={() => setActiveFilter('verified')}
            >
              Verified Partners
            </PurpleButton>
          </li>
        </ul>
      )}

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {filteredShelters.map((shelter) => (
          <div 
            key={shelter._id} 
            className="col"
            onClick={() => handleShelterClick(shelter._id)}
            style={{ cursor: 'pointer' }}
          >
            <div className="card h-100 shadow-sm shelter-card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h5 className="card-title mb-0">{shelter.name}</h5>
                  <button
                    onClick={() => toggleVerification(shelter._id)}
                    className={`btn btn-sm ${shelter.verified ? 'btn-success' : 'btn-danger'}`}
                  >
                    {shelter.verified ? 'Verified' : 'Not Verified'}
                  </button>
                </div>
                
                <div className="shelter-info">
                  <p className="card-text mb-2 d-flex align-items-center text-muted">
                    <MapPin size={16} className="me-2" />
                    {shelter.address || "Not Available"}
                  </p>
                  
                  <p className="card-text mb-2 d-flex align-items-center text-muted">
                    <Phone size={16} className="me-2" />
                    {shelter.phone || "Not Available"}
                  </p>
                  
                  <p className="card-text mb-2 d-flex align-items-center text-muted">
                    <Mail size={16} className="me-2" />
                    {shelter.email || "Not Available"}
                  </p>
                </div>

                <div className="mt-3 d-flex gap-2">
                  {shelter.website && (
                    <button 
                      className="btn btn-outline-secondary d-flex align-items-center justify-content-center flex-grow-1"
                      onClick={() => window.open(shelter.website, '_blank')}
                    >
                      <Globe size={16} className="me-1" />
                      Visit Website
                    </button>
                  )}
                  <PurpleButton className="btn btn-primary d-flex align-items-center justify-content-center flex-grow-1">
                    Contact
                  </PurpleButton>
                </div>
              </div>
              
              {userRole === 'Shelter' && shelter._id === currentShelterId && (
                <div className="mt-4">
                  <h6 className="border-bottom pb-2">Found Pets in This Shelter</h6>
                  <div className="shelter-pets-list">
                    {shelterPets.length > 0 ? (
                      shelterPets.map(pet => (
                        <div key={pet._id} className="pet-item p-2 border-bottom">
                          <div className="d-flex align-items-center">
                            <img 
                              src={pet.picture || "/api/placeholder/50/50"} 
                              alt={pet.name}
                              className="rounded-circle me-2"
                              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                            />
                            <div>
                              <h6 className="mb-0">{pet.name}</h6>
                              <small className="text-muted">
                                {pet.kind} • {pet.color}
                              </small>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted text-center py-2">
                        No pets currently in this shelter
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredShelters.length === 0 && (
        <div className="text-center py-4 text-muted">
          No shelters found.
        </div>
      )}
    </div>
  );
};

export default ShelterList;