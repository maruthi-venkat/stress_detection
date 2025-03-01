import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';

const DarkPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#1a1a1a',
  color: '#ffffff',
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
}));

const Dashboard = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authenticatedFetch } = useAuth();

  useEffect(() => {
    fetchUserHistory();
  }, []);

  const fetchUserHistory = async () => {
    try {
      const response = await authenticatedFetch('http://localhost:5000/api/user-history');
      if (response.ok) {
        const data = await response.json();
        setAssessments(data);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStressManagementTips = (stressLevel) => {
    const level = stressLevel?.toLowerCase() || '';
    switch (level) {
      case 'low':
        return [
          'Take a 10-minute walk in nature daily',
          'Practice gratitude journaling before bed',
          'Do simple stretching exercises every morning',
          'Listen to calming music during work',
          'Stay hydrated throughout the day'
        ];
      case 'mid':
      case 'moderate':
        return [
          'Practice the 4-7-8 breathing technique three times daily',
          'Take regular breaks using the 20-20-20 rule',
          'Do progressive muscle relaxation before bed',
          'Limit caffeine and screen time',
          'Connect with a friend or family member'
        ];
      case 'high':
        return [
          'Schedule an appointment with a mental health professional',
          'Practice guided meditation twice daily',
          'Establish a consistent sleep schedule',
          'Exercise for at least 30 minutes daily',
          'Consider joining a stress management support group'
        ];
      default:
        return [
          'Practice deep breathing exercises daily',
          'Take regular breaks during work',
          'Maintain a consistent sleep schedule',
          'Exercise regularly',
          'Stay connected with friends and family'
        ];
    }
  };

  const calculateStressScore = (assessment) => {
    // Get the stress level prediction from the model
    const stressLevel = assessment.stress_level.toLowerCase();
    
    // Get all the answer values
    const answerValues = Object.values(assessment.answers).map(Number);
    
    // Calculate the base score from answers (0-100)
    const maxPossibleSum = Object.keys(assessment.answers).length * 5; // Maximum possible sum (all answers are 5)
    const actualSum = answerValues.reduce((a, b) => a + b, 0);
    const baseScore = (actualSum / maxPossibleSum) * 100;
    
    // Adjust the score based on stress level prediction to ensure it falls in the correct range
    if (stressLevel === 'low') {
      // For low stress, map the score to 0-30 range
      return Math.min(30, (baseScore / 100) * 30);
    } else if (stressLevel === 'mid') {
      // For mid stress, map the score to 30-70 range
      return 30 + ((baseScore / 100) * 40);
    } else {
      // For high stress, map the score to 70-100 range
      return Math.max(70, 70 + ((baseScore / 100) * 30));
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const chartData = assessments.map(assessment => ({
    date: formatDate(assessment.timestamp),
    fullDateTime: formatDateTime(assessment.timestamp),
    stressScore: Math.round(calculateStressScore(assessment)),
    stressLevel: assessment.stress_level
  }));

  const RecommendedActionsList = ({ stressLevel }) => {
    const tips = getStressManagementTips(stressLevel);
    return (
      <ul style={{ 
        listStyle: 'none', 
        padding: 0, 
        margin: 0 
      }}>
        {tips.map((tip, index) => (
          <li 
            key={index} 
            style={{
              color: '#fff',
              marginBottom: '12px',
              paddingLeft: '20px',
              position: 'relative'
            }}
          >
            <span style={{
              position: 'absolute',
              left: 0,
              color: '#2196F3'
            }}>•</span>
            {tip}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#121212', minHeight: '100vh' }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <DarkPaper>
            <Typography variant="h5" gutterBottom>
              Stress Level Trends
            </Typography>
            <Box sx={{ height: 300, mt: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#ffffff"
                    angle={-45}
                    textAnchor="end"
                    height={50}
                    interval={0}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="#ffffff"
                    domain={[0, 100]}
                    ticks={[0, 20, 40, 60, 80, 100]}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333333' }}
                    labelStyle={{ color: '#ffffff' }}
                    labelFormatter={(label, items) => {
                      const item = items[0]?.payload;
                      return item ? item.fullDateTime : label;
                    }}
                    formatter={(value, name) => {
                      if (name === 'stressScore') {
                        return [`Stress Score: ${value}`];
                      }
                      return [value];
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="stressScore" 
                    stroke="#4CAF50" 
                    strokeWidth={2}
                    dot={{ fill: '#4CAF50', strokeWidth: 2 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </DarkPaper>
        </Grid>

        <Grid item xs={12} md={6}>
          <DarkPaper>
            <Typography variant="h5" gutterBottom>
              Recommended Actions
            </Typography>
            {assessments.length > 0 && (
              <>
                <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                  Current Stress Level: {assessments[assessments.length - 1].stress_level}
                </Typography>
                <Box sx={{ pl: 2 }}>
                  {getStressManagementTips(assessments[assessments.length - 1].stress_level).map((tip, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        mb: 1.5,
                        color: '#fff'
                      }}
                    >
                      <Typography sx={{ color: '#2196F3', mr: 1 }}>•</Typography>
                      <Typography>{tip}</Typography>
                    </Box>
                  ))}
                </Box>
              </>
            )}
            {assessments.length === 0 && (
              <Typography sx={{ color: '#aaa', mt: 2 }}>
                Complete an assessment to get personalized recommendations
              </Typography>
            )}
          </DarkPaper>
        </Grid>

        <Grid item xs={12} md={6}>
          <DarkPaper>
            <Typography variant="h5" gutterBottom>
              Resources
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" color="primary" gutterBottom>
                Recommended Video
              </Typography>
              <Box sx={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '8px', mb: 2 }}>
                <iframe
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none'
                  }}
                  src="https://www.youtube.com/embed/hnpQrMqDoqE"
                  title="Quick Stress Relief Techniques"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </Box>
            </Box>
            <Typography variant="h6" color="primary" gutterBottom>
              Helpful Resources
            </Typography>
            <Box component="ul" sx={{ 
              pl: 3,
              '& a': {
                color: '#2196F3',
                textDecoration: 'none',
                transition: 'color 0.2s',
                '&:hover': {
                  color: '#64B5F6',
                  textDecoration: 'underline'
                }
              }
            }}>
              <Box component="li" sx={{ mb: 2 }}>
                <Box 
                  component="a" 
                  href="https://www.headspace.com/meditation-101" 
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Headspace Meditation Basics Guide
                </Box>
              </Box>
              <Box component="li" sx={{ mb: 2 }}>
                <Box 
                  component="a" 
                  href="https://www.psychologytoday.com/us/therapists" 
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Find a Therapist - Psychology Today
                </Box>
              </Box>
              <Box component="li" sx={{ mb: 2 }}>
                <Box 
                  component="a" 
                  href="https://www.7cups.com/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ display: 'block', mb: 1 }}
                >
                  7 Cups - Online Therapy & Free Counseling
                </Box>
                
              </Box>
              <Box component="li" sx={{ mb: 2 }}>
              <Box 
                  component="a" 
                  href="https://www.reddit.com/r/Anxiety/" 
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Reddit Anxiety Community
                </Box>
              </Box>
            </Box>
          </DarkPaper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
