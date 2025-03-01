class StressQuestionnaire:
    def __init__(self):
        self.questions = {
            'anxiety_level': "On a scale of 0-30, how would you rate your anxiety level?",
            'self_esteem': "On a scale of 0-30, how would you rate your self-esteem?",
            'mental_health_history': "Do you have a history of mental health issues? (0 for No, 1 for Yes)",
            'depression': "On a scale of 0-30, how would you rate your depression level?",
            'headache': "On a scale of 0-5, how severe are your headaches?",
            'blood_pressure': "On a scale of 0-5, how would you rate your blood pressure issues?",
            'sleep_quality': "On a scale of 0-5, how would you rate your sleep quality?",
            'breathing_problem': "On a scale of 0-5, how severe are your breathing problems?",
            'noise_level': "On a scale of 0-5, how would you rate your exposure to noise?",
            'living_conditions': "On a scale of 0-5, how would you rate your living conditions?",
            'safety': "On a scale of 0-5, how safe do you feel in your environment?",
            'basic_needs': "On a scale of 0-5, how well are your basic needs met?",
            'academic_performance': "On a scale of 0-5, how would you rate your academic performance?",
            'study_load': "On a scale of 0-5, how heavy is your study load?",
            'teacher_student_relationship': "On a scale of 0-5, how would you rate your relationship with teachers?",
            'future_career_concerns': "On a scale of 0-5, how concerned are you about your future career?",
            'social_support': "On a scale of 0-5, how would you rate your social support?",
            'peer_pressure': "On a scale of 0-5, how much peer pressure do you experience?",
            'extracurricular_activities': "On a scale of 0-5, how involved are you in extracurricular activities?",
            'bullying': "On a scale of 0-5, how much bullying do you experience?"
        }

    def conduct_questionnaire(self):
        responses = {}
        print("\nWelcome to the Stress Assessment Questionnaire")
        print("Please answer all questions honestly for accurate results.\n")

        for key, question in self.questions.items():
            while True:
                try:
                    response = float(input(f"{question}\nYour answer: "))
                    if key == 'mental_health_history' and response not in [0, 1]:
                        raise ValueError
                    if key in ['anxiety_level', 'self_esteem', 'depression'] and (response < 0 or response > 30):
                        raise ValueError
                    if key not in ['anxiety_level', 'self_esteem', 'depression', 'mental_health_history'] and (response < 0 or response > 5):
                        raise ValueError
                    responses[key] = response
                    break
                except ValueError:
                    print("Invalid input. Please enter a valid number within the specified range.")

        return responses 