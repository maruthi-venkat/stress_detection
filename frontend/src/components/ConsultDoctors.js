import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, CardMedia, Typography, Rating, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const DarkCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#1a1a1a',
  color: '#ffffff',
  '&:hover': {
    transform: 'scale(1.02)',
    transition: 'transform 0.2s ease-in-out',
  },
}));

const ConsultDoctors = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/doctors');
      if (response.ok) {
        const data = await response.json();
        setDoctors(data);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#121212', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ color: '#ffffff', mb: 4 }}>
        Consult with Our Specialists
      </Typography>
      
      <Grid container spacing={3}>
        {doctors.map((doctor, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <DarkCard>
              <CardMedia
                component="img"
                height="200"
                image={`/images/${doctor.image}`}
                alt={doctor.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {doctor.name}
                </Typography>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  {doctor.specialization}
                </Typography>
                <Typography variant="body2" sx={{ color: '#cccccc', mb: 1 }}>
                  {doctor.experience} Experience
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Rating value={doctor.rating} precision={0.1} readOnly />
                  <Typography variant="body2" sx={{ ml: 1, color: '#cccccc' }}>
                    ({doctor.rating})
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#cccccc', mb: 2 }}>
                  {doctor.bio}
                </Typography>
                <Button 
                  variant="contained" 
                  fullWidth
                  sx={{ 
                    backgroundColor: '#4CAF50',
                    '&:hover': { backgroundColor: '#45a049' }
                  }}
                >
                  Book Consultation
                </Button>
              </CardContent>
            </DarkCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ConsultDoctors;
