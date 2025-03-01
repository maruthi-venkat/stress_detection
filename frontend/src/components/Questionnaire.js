import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Box, Stepper, Step, StepLabel, Button, Typography, Radio, RadioGroup, FormControlLabel, FormControl, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import ResultPage from './ResultPage';

const questions = [{
  id: 1,
  question: "How frequently do you experience anxiety in daily life?",
  options: [
    { label: "Never", value: 2 },
    { label: "Rarely", value: 7 },
    { label: "Sometimes", value: 10 },
    { label: "Often", value: 14 },
    { label: "Very Often", value: 19 }
  ]
},
{
  id: 2,
  question: "How would you rate your self-esteem and confidence in yourself?",
  options: [
    { label: "Very Low", value: 2 },
    { label: "Low", value: 8 },
    { label: "Below Average", value: 13 },
    { label: "Average", value: 18 },
    { label: "High", value: 23 },
    { label: "Very High", value: 28 }
  ]
},
{
  id: 3,
  question: "Have you ever been diagnosed with or experienced any mental health issues?",
  options: [
    { label: "No", value: 0 },
    { label: "Yes", value: 1 }
  ]
},
{
  id: 4,
  question: "How often do you feel symptoms of depression, such as persistent sadness, hopelessness, or lack of interest in activities?",
  options: [
    { label: "Never", value: 2 },
    { label: "Rarely", value: 7 },
    { label: "Sometimes", value: 12 },
    { label: "Often", value: 17 },
    { label: "Very Often", value: 22 },
    { label: "Almost Always", value: 26 }
  ]
},
{
  id: 5,
  question: "How frequently do you experience headaches?",
  options: [
    { label: "Never", value: 0 },
    { label: "Rarely", value: 1 },
    { label: "Sometimes", value: 2 },
    { label: "Often", value: 3 },
    { label: "Very Often", value: 4 },
    { label: "Always", value: 5 }
  ]
},
{
  id: 6,
  question: "What best describes your blood pressure levels?",
  options: [
    { label: "Low", value: 1 },
    { label: "Normal", value: 2 },
    { label: "High", value: 3 }
  ]
},
{
  id: 7,
  question: "How would you rate your sleep quality?",
  options: [
    { label: "Very Poor", value: 0 },
    { label: "Poor", value: 1 },
    { label: "Fair", value: 2 },
    { label: "Good", value: 3 },
    { label: "Very Good", value: 4 },
    { label: "Excellent", value: 5 }
  ]
},
{
  id: 8,
  question: "How often do you experience breathing problems or shortness of breath?",
  options: [
    { label: "Never", value: 0 },
    { label: "Rarely", value: 1 },
    { label: "Sometimes", value: 2 },
    { label: "Often", value: 3 },
    { label: "Very Often", value: 4 },
    { label: "Always", value: 5 }
  ]
},
{
  id: 9,
  question: "How much noise do you experience in your environment?",
  options: [
    { label: "No Noise", value: 0 },
    { label: "Very Quiet", value: 1 },
    { label: "Quiet", value: 2 },
    { label: "Moderate", value: 3 },
    { label: "Loud", value: 4 },
    { label: "Very Loud", value: 5 }
  ]
},
{
  id: 10,
  question: "How would you rate your current living conditions?",
  options: [
    { label: "Very Poor", value: 0 },
    { label: "Poor", value: 1 },
    { label: "Fair", value: 2 },
    { label: "Good", value: 3 },
    { label: "Very Good", value: 4 },
    { label: "Excellent", value: 5 }
  ]
},
{
  id: 11,
  question: "How safe do you feel in your current environment?",
  options: [
    { label: "Very Unsafe", value: 0 },
    { label: "Unsafe", value: 1 },
    { label: "Neutral", value: 2 },
    { label: "Somewhat Safe", value: 3 },
    { label: "Safe", value: 4 },
    { label: "Very Safe", value: 5 }
  ]
},
{
  id: 12,
  question: "To what extent are your basic needs (food, water, shelter, healthcare) met?",
  options: [
    { label: "Not at all", value: 0 },
    { label: "Barely", value: 1 },
    { label: "Somewhat", value: 2 },
    { label: "Mostly", value: 3 },
    { label: "Completely", value: 4 },
    { label: "More than Enough", value: 5 }
  ]
},
{
  id: 13,
  question: "How would you rate your academic performance?",
  options: [
    { label: "Very Poor", value: 0 },
    { label: "Poor", value: 1 },
    { label: "Fair", value: 2 },
    { label: "Good", value: 3 },
    { label: "Very Good", value: 4 },
    { label: "Excellent", value: 5 }
  ]
},
{
  id: 14,
  question: "How heavy is your study workload?",
  options: [
    { label: "Very Light", value: 0 },
    { label: "Light", value: 1 },
    { label: "Moderate", value: 2 },
    { label: "Heavy", value: 3 },
    { label: "Very Heavy", value: 4 },
    { label: "Overwhelming", value: 5 }
  ]
},
{
  id: 15,
  question: "How would you rate your relationship with your teachers?",
  options: [
    { label: "Very Poor", value: 0 },
    { label: "Poor", value: 1 },
    { label: "Neutral", value: 2 },
    { label: "Good", value: 3 },
    { label: "Very Good", value: 4 },
    { label: "Excellent", value: 5 }
  ]
},
{
  id: 16,
  question: "How concerned are you about your future career?",
  options: [
    { label: "Not at all", value: 0 },
    { label: "Slightly Concerned", value: 1 },
    { label: "Moderately Concerned", value: 2 },
    { label: "Very Concerned", value: 3 },
    { label: "Extremely Concerned", value: 4 },
    { label: "Always Thinking About It", value: 5 }
  ]
},
{
  id: 17,
  question: "How much social support do you receive from friends, family, or others?",
  options: [
    { label: "None", value: 0 },
    { label: "Very Little", value: 1 },
    { label: "Some", value: 2 },
    { label: "A Lot", value: 3 }
  ]
},
{
  id: 18,
  question: "How strongly do you feel peer pressure in your daily life?",
  options: [
    { label: "Not at all", value: 0 },
    { label: "Slightly", value: 1 },
    { label: "Moderately", value: 2 },
    { label: "Strongly", value: 3 },
    { label: "Very Strongly", value: 4 },
    { label: "Overwhelming", value: 5 }
  ]
},
{
  id: 19,
  question: "How actively are you involved in extracurricular activities?",
  options: [
    { label: "Not at all", value: 0 },
    { label: "Rarely", value: 1 },
    { label: "Sometimes", value: 2 },
    { label: "Often", value: 3 },
    { label: "Very Often", value: 4 },
    { label: "Always", value: 5 }
  ]
},
{
  id: 20,
  question: "How frequently do you experience or witness bullying?",
  options: [
    { label: "Never", value: 0 },
    { label: "Rarely", value: 1 },
    { label: "Sometimes", value: 2 },
    { label: "Often", value: 3 },
    { label: "Very Often", value: 4 },
    { label: "Always", value: 5 }
  ]
}
];

const DarkBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#1a1a1a',
  color: '#ffffff',
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  maxWidth: 1000, 
  margin: '0 auto',
  marginTop: theme.spacing(4),
}));

const QuestionContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(4),
  marginTop: theme.spacing(6),
  textAlign: 'center',
  width: '100%',
}));

const QuestionNumber = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: -20,
  left: '50%',
  transform: 'translateX(-50%)',
  width: 40,
  height: 40,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  color: '#ffffff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  zIndex: 1,
}));

const StyledRadio = styled(Radio)(({ theme }) => ({
  color: '#666666',
  '&.Mui-checked': {
    color: '#4CAF50',
  },
}));

const Questionnaire = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();
  const { authenticatedFetch } = useAuth();

  const handleNext = () => {
    if (activeStep === questions.length - 1) {
      submitAssessment();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleAnswer = (value) => {
    setAnswers({
      ...answers,
      [questions[activeStep].id]: parseInt(value, 10)
    });
  };

  const calculateStressScore = (answers) => {
    const totalPossible = Object.keys(answers).length * 5;
    const total = Object.values(answers).reduce((sum, val) => sum + val, 0);
    return Math.round((total / totalPossible) * 100);
  };

  const submitAssessment = async () => {
    setLoading(true);
    try {
      const formattedAnswers = {};
      questions.forEach(q => {
        const value = answers[q.id];
        formattedAnswers[`q${q.id}`] = value !== undefined ? value : 0;
      });

      const response = await authenticatedFetch('http://localhost:5000/api/stress-assessment', {
        method: 'POST',
        body: JSON.stringify({ answers: formattedAnswers })
      });

      if (response.ok) {
        const data = await response.json();
        setResult({
          stressLevel: data.stress_level,
          score: calculateStressScore(formattedAnswers)
        });
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit assessment');
      }
    } catch (error) {
      console.error('Error submitting assessment:', error);
      if (error.message === 'Unauthorized') {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DarkBox sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <CircularProgress sx={{ color: '#4CAF50' }} />
        <Typography sx={{ mt: 2 }}>Processing your assessment...</Typography>
      </DarkBox>
    );
  }

  if (result) {
    return <ResultPage stressLevel={result.stressLevel} />;
  }

  return (
    <DarkBox>
      <Stepper activeStep={activeStep} alternativeLabel>
        {questions.map((_, index) => (
          <Step key={index}>
            <StepLabel />
          </Step>
        ))}
      </Stepper>

      <motion.div
        key={activeStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        <QuestionContainer>
          <QuestionNumber>
            {questions[activeStep].id}
          </QuestionNumber>
          <Typography variant="h5" sx={{ mt: 2, mb: 3 }}>
            {questions[activeStep].question}
          </Typography>

          <FormControl component="fieldset" fullWidth>
            <RadioGroup
              value={answers[questions[activeStep].id] !== undefined ? answers[questions[activeStep].id].toString() : ''}
              onChange={(e) => handleAnswer(e.target.value)}
            >
              {questions[activeStep].options.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value.toString()}
                  control={<StyledRadio />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
          </FormControl>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={activeStep === 0}
              sx={{ color: '#666666', borderColor: '#666666' }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={answers[questions[activeStep].id] === undefined}
              sx={{ backgroundColor: '#4CAF50', '&:hover': { backgroundColor: '#45a049' } }}
            >
              {activeStep === questions.length - 1 ? 'Submit' : 'Next'}
            </Button>
          </Box>
        </QuestionContainer>
      </motion.div>
    </DarkBox>
  );
};

export default Questionnaire;
