import React, { useEffect, useState } from 'react';
import { MapPin, Phone, Mail, Globe } from 'lucide-react';
import PurpleButton from '../../../Components/UI/lightPurpleButton';
import './styles.css';
interface Shelter {
  _id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
}

const ShelterList: React.FC = () => {
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'verified'>('all');

  useEffect(() => {
    const fetchShelters = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/shelters');
        if (!response.ok) {
          throw new Error('Failed to fetch shelters');
        }
        const data = await response.json();
        setShelters(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchShelters();
  }, []);

  if (loading) return <div className="text-center py-4">Loading shelters...</div>;
  if (error) return <div className="text-center py-4 text-danger">{error}</div>;

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Animal Shelters Directory</h1>
      
      {/* Navigation Tabs */}
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

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {shelters.map((shelter) => (
          <div key={shelter._id} className="col">
            <div className="card h-100 shadow-sm shelter-card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h5 className="card-title mb-0">{shelter.name}</h5>
                  <span className="badge bg-success">Verified</span>
                </div>
                
                <div className="shelter-info">
                  <p className="card-text mb-2 d-flex align-items-center text-muted">
                    <MapPin size={16} className="me-2" />
                    {shelter.address}
                  </p>
                  
                  {shelter.phone && (
                    <p className="card-text mb-2 d-flex align-items-center text-muted">
                      <Phone size={16} className="me-2" />
                      {shelter.phone}
                    </p>
                  )}
                  
                  {shelter.email && (
                    <p className="card-text mb-2 d-flex align-items-center text-muted">
                      <Mail size={16} className="me-2" />
                      {shelter.email}
                    </p>
                  )}
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
            </div>
          </div>
        ))}
      </div>

      {shelters.length === 0 && (
        <div className="text-center py-4 text-muted">
          No shelters found.
        </div>
      )}
    </div>
  );
};

export default ShelterList;