# from fastapi import FastAPI;

# app = FastAPI()

# @app.get("/")
# def read_root():
#     return {"message":"Workout Tracker API is running!"};

# @app.get("/workouts")
# def get_workouts():
#     # This will eventually fetch data from your workout_data.json or database
#     mock_workout_data = [
#         {"id": 1, "date": "2025-12-16", "type": "Strength", "duration_minutes": 60, "calories_burned": 400},
#         {"id": 2, "date": "2025-12-15", "type": "Cardio", "duration_minutes": 30, "calories_burned": 250},
#     ]
#     return mock_workout_data

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)