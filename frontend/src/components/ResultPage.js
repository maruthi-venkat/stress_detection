import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ResultPage = ({ stressLevel }) => {
  const navigate = useNavigate();

  const getStressLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case 'low':
        return '#4caf50';
      case 'mid':
        return '#ff9800';
      case 'high':
        return '#f44336';
      default:
        return '#4caf50';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const textVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        delay: 0.3,
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 1,
        duration: 0.5
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#121212',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3
      }}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        style={{ width: '100%', maxWidth: 600 }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 6,
            backgroundColor: '#1a1a1a',
            color: '#ffffff',
            textAlign: 'center',
            borderRadius: 4
          }}
        >
          <motion.div variants={textVariants}>
            <Typography 
              variant="h6" 
              sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: 2 }}
            >
              Your Stress Level
            </Typography>
          </motion.div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.5
            }}
          >
            <Box
              sx={{
                width: 200,
                height: 200,
                margin: '0 auto',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: getStressLevelColor(stressLevel),
                boxShadow: '0 0 30px rgba(0,0,0,0.3)',
                mb: 4
              }}
            >
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 'bold',
                  color: '#ffffff',
                  textTransform: 'uppercase'
                }}
              >
                {stressLevel}
              </Typography>
            </Box>
          </motion.div>

          <motion.div
            variants={buttonVariants}
            whileHover="hover"
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/dashboard')}
              sx={{
                mt: 4,
                backgroundColor: getStressLevelColor(stressLevel),
                '&:hover': {
                  backgroundColor: getStressLevelColor(stressLevel),
                  filter: 'brightness(1.1)'
                },
                px: 4,
                py: 1.5,
                borderRadius: 2
              }}
            >
              View Dashboard
            </Button>
          </motion.div>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default ResultPage;
