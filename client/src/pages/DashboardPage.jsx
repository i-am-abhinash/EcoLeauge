import React, { useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import { Container, Grid, Card, CardActionArea, CardContent, Typography, Button, Box } from '@mui/material';
import { motion } from 'framer-motion';
import './Dashboard.css';

const WASTE_MANAGEMENT_CONCEPT_ID = "68cff2c764bf857de6b681f9";
const WATER_CONSERVATION_CONCEPT_ID = "68cff2e764bf857de6b681fa";
const RENEWABLE_ENERGY_CONCEPT_ID = "68cff30d64bf857de6b681fb";
const BIODIVERSITY_CONCEPT_ID = "68cff32a64bf857de6b681fc";
const AIR_QUALITY_CONCEPT_ID = "68cff34164bf857de6b681fd";
const SUSTAINABLE_AGRICULTURE_CONCEPT_ID = "68cff35a64bf857de6b681fe";
const CLIMATE_ACTION_CONCEPT_ID = "68cff37864bf857de6b681ff";
const FOREST_CONSERVATION_CONCEPT_ID = "68cff39264bf857de6b68200";
const OCEAN_HEALTH_CONCEPT_ID = "68cff3a664bf857de6b68201";
const ECOSYSTEM_CONCEPT_ID = "68cff3b864bf857de6b68202";

const INTERMEDIATE_CONCEPTS = [
  { id: "68cf80f664bf857de6b6800a", title: 'Circular Economy', emoji: '🔄', prerequisite: "68cff3b864bf857de6b68202", path: '#' },
  { id: "68cf810f64bf857de6b6800b", title: 'Sustainable Urban Planning', emoji: '🏙️', prerequisite: "68cf80f664bf857de6b6800a", path: '#' },
  { id: "68cf8d2664bf857de6b68077", title: 'Green Technology', emoji: '🔋', prerequisite: "68cf810f64bf857de6b6800b", path: '#' },
  { id: "68cf8d5f0fede65dc6af65a1", title: 'Environmental Law', emoji: '⚖️', prerequisite: "68cf8d2664bf857de6b68077", path: '#' },
  { id: "68cf914b14b86e706950269f", title: 'Carbon Footprint', emoji: '👣', prerequisite: "68cf8d5f0fede65dc6af65a1", path: '#' },
  { id: "68cf91900fede65dc6af65a2", title: 'Ecological Restoration', emoji: '🌱', prerequisite: "68cf914b14b86e706950269f", path: '#' },
];

const ADVANCED_CONCEPTS = [
  { id: "68cfa0f664bf857de6b6800a", title: 'Geothermal Energy', emoji: '🌋', prerequisite: "68cf91900fede65dc6af65a2", path: '#' },
  { id: "68cfa10f64bf857de6b6800b", title: 'Hydroponics', emoji: '🥬', prerequisite: "68cfa0f664bf857de6b6800a", path: '#' },
  { id: "68cfad2664bf857de6b68077", title: 'Bioremediation', emoji: '🦠', prerequisite: "68cfa10f64bf857de6b6800b", path: '#' },
  { id: "68cfad5f0fede65dc6af65a1", title: 'Climate Modeling', emoji: '📈', prerequisite: "68cfad2664bf857de6b68077", path: '#' },
  { id: "68cfb14b14b86e706950269f", title: 'Marine Biology', emoji: '🔬', prerequisite: "68cfad5f0fede65dc6af65a1", path: '#' },
];

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const cardVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };
const GRAND_QUIZ_ID = "68cfd45f0fede65dc6af65b1";

const BASIC_CONCEPTS_UNLOCKED_ORDER = [
  { id: WASTE_MANAGEMENT_CONCEPT_ID, title: 'Waste Management', emoji: '♻️', prerequisite: null, path: '/intro/waste-management' },
  { id: WATER_CONSERVATION_CONCEPT_ID, title: 'Water Conservation', emoji: '💧', prerequisite: WASTE_MANAGEMENT_CONCEPT_ID, path: '#' },
  { id: RENEWABLE_ENERGY_CONCEPT_ID, title: 'Renewable Energy', emoji: '☀️', prerequisite: WATER_CONSERVATION_CONCEPT_ID, path: '#' },
  { id: BIODIVERSITY_CONCEPT_ID, title: 'Biodiversity', emoji: '🦋', prerequisite: RENEWABLE_ENERGY_CONCEPT_ID, path: '#' },
  { id: AIR_QUALITY_CONCEPT_ID, title: 'Air Quality', emoji: '💨', prerequisite: BIODIVERSITY_CONCEPT_ID, path: '#' },
  { id: SUSTAINABLE_AGRICULTURE_CONCEPT_ID, title: 'Sustainable Agriculture', emoji: '🌱', prerequisite: AIR_QUALITY_CONCEPT_ID, path: '#' },
  { id: CLIMATE_ACTION_CONCEPT_ID, title: 'Climate Action', emoji: '🌍', prerequisite: SUSTAINABLE_AGRICULTURE_CONCEPT_ID, path: '#' },
  { id: FOREST_CONSERVATION_CONCEPT_ID, title: 'Forest Conservation', emoji: '🌲', prerequisite: CLIMATE_ACTION_CONCEPT_ID, path: '#' },
  { id: OCEAN_HEALTH_CONCEPT_ID, title: 'Ocean Health', emoji: '🐋', prerequisite: FOREST_CONSERVATION_CONCEPT_ID, path: '#' },
  { id: ECOSYSTEM_CONCEPT_ID, title: 'EcoSystem', emoji: '🌿', prerequisite: OCEAN_HEALTH_CONCEPT_ID, path: '#' },
];

function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { level } = useParams();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  if (!user) return null;
  
  let conceptsToDisplay = [];
  let title = "Learning Paths";
  
  switch(level) {
    case 'intermediate':
      conceptsToDisplay = INTERMEDIATE_CONCEPTS;
      title = "Intermediate Level";
      break;
    case 'advanced':
      conceptsToDisplay = ADVANCED_CONCEPTS;
      title = "Advanced Level";
      break;
    case 'basic':
    default:
      conceptsToDisplay = BASIC_CONCEPTS_UNLOCKED_ORDER;
      title = "Basic Level";
      break;
  }

  const completedChallenges = user.completedChallenges || [];
  
  const isPreviousLevelComplete = (currentLevel) => {
    let previousConcepts;
    switch(currentLevel) {
      case 'intermediate':
        previousConcepts = BASIC_CONCEPTS_UNLOCKED_ORDER;
        break;
      case 'advanced':
        previousConcepts = INTERMEDIATE_CONCEPTS;
        break;
      default:
        return true;
    }
    const lastConceptOfPreviousLevel = previousConcepts[previousConcepts.length - 1];
    return completedChallenges.includes(lastConceptOfPreviousLevel.id);
  };
  
  const isLevelUnlocked = isPreviousLevelComplete(level);
  const isGrandQuizUnlocked = conceptsToDisplay.every(concept => completedChallenges.includes(concept.id));

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 6, mb: 4 }} className="dashboard-container">
      <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4, color: 'text.primary' }}>
        {title}
      </Typography>
      {!isLevelUnlocked && level !== 'basic' && (
        <Typography variant="h5" color="error" sx={{ textAlign: 'center', my: 4 }}>
          You must complete all concepts in the previous level to unlock this one.
        </Typography>
      )}
      <div className="subject-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', alignItems: 'stretch' }}>
        {conceptsToDisplay.map((subject, index) => {
          let isUnlocked = false;

          if (index === 0) {
            isUnlocked = isLevelUnlocked; // Unlocks the first card of an unlocked level
          } else {
            const previousLevelId = conceptsToDisplay[index - 1].id;
            isUnlocked = completedChallenges.includes(previousLevelId);
          }
          
          return (
            <div key={subject.id} className="subject-card-wrapper" style={{ opacity: isUnlocked ? 1 : 0.5 }}>
              <Card className="subject-card" sx={{
                bgcolor: 'background.paper',
                border: '1px solid #233554',
                height: '100%'
              }}>
                <CardActionArea
                  component={isUnlocked ? Link : 'div'}
                  to={isUnlocked ? subject.path : '#'}
                  disabled={!isUnlocked}
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 4, flexGrow: 1 }}>
                    <Typography sx={{ fontSize: '3rem' }}>{subject.emoji}</Typography>
                    <Typography variant="h6" component="div" sx={{ mt: 2, color: 'text.primary', fontWeight: 600 }}>
                      {subject.title}
                    </Typography>
                    {!isUnlocked && <Typography sx={{ mt: 1 }}>🔒 Locked</Typography>}
                  </CardContent>
                </CardActionArea>
              </Card>
            </div>
          );
        })}
      </div>
      
      {/* New Grand Quiz Button at the bottom */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button 
          variant="contained" 
          color="primary" 
          size="large" 
          fullWidth
          component={Link} 
          to={`/game/${GRAND_QUIZ_ID}`}
          disabled={!isGrandQuizUnlocked}
        >
          {isGrandQuizUnlocked ? "Grand Quiz" : "Grand Quiz 🔒"}
        </Button>
      </Box>
    </Container>
  );
}
export default DashboardPage;