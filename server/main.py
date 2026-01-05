#main.py#
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from database import db
from models import UserCreateModel, UserViewModel, UserLoginModel, ChallengeViewModel, ChallengeSubmissionModel, UserInDB
from security import hash_password, verify_password
from bson import ObjectId
from typing import List
from pymongo import ReturnDocument

app = FastAPI()

origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

def user_to_view_model(user: dict) -> UserViewModel:
    return UserViewModel(
        id=str(user["_id"]), name=user["name"], username=user["username"],
        email=user["email"], school=user["school"], points=user.get("points", 0),
        badges=user.get("badges", []),
        completedChallenges=[str(c) for c in user.get("completedChallenges", [])])

@app.post("/api/users/register", response_model=UserViewModel, status_code=status.HTTP_201_CREATED)
async def register_user(user_data: UserCreateModel):
    if await db.users.find_one({"email": user_data.email}):
        raise HTTPException(status_code=400, detail="User with this email already exists.")
    if await db.users.find_one({"username": user_data.username}):
        raise HTTPException(status_code=400, detail="Username is already taken.")
    hashed_password = hash_password(user_data.password)
    user_in_db = UserInDB(**user_data.model_dump(exclude={'password'}), hashed_password=hashed_password)
    result = await db.users.insert_one(user_in_db.model_dump(by_alias=True))
    created_user = await db.users.find_one({"_id": result.inserted_id})
    return user_to_view_model(created_user)

@app.post("/api/users/login", response_model=UserViewModel)
async def login_user(form_data: UserLoginModel):
    user = await db.users.find_one({"email": form_data.email})
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return user_to_view_model(user)

@app.get("/api/challenges", response_model=List[ChallengeViewModel])
async def get_challenges():
    challenges = await db.challenges.find().to_list(length=100)
    for challenge in challenges: challenge["_id"] = str(challenge["_id"])
    return challenges

@app.get("/api/leaderboard", response_model=List[UserViewModel])
async def get_leaderboard():
    users_cursor = db.users.find().sort("points", -1).limit(20)
    users = await users_cursor.to_list(length=20)
    return [user_to_view_model(user) for user in users]

@app.post("/api/challenges/submit", response_model=UserViewModel)
async def submit_challenge_result(submission: ChallengeSubmissionModel):
    if not ObjectId.is_valid(submission.userId) or not ObjectId.is_valid(submission.challengeId):
        raise HTTPException(status_code=400, detail="Invalid ID format.")
    challenge = await db.challenges.find_one({"_id": ObjectId(submission.challengeId)})
    if not challenge: raise HTTPException(status_code=404, detail="Challenge not found.")
    
    updated_user = await db.users.find_one_and_update(
        {"_id": ObjectId(submission.userId)},
        {"$inc": {"points": challenge["pointsAwarded"]}, "$addToSet": {"completedChallenges": ObjectId(submission.challengeId)}},
        return_document=ReturnDocument.AFTER
    )
    if not updated_user: raise HTTPException(status_code=404, detail="User not found.")

    if len(updated_user.get("completedChallenges", [])) == 1:
        await db.users.update_one({"_id": ObjectId(submission.userId)}, {"$addToSet": {"badges": "First Win! 🏆"}})
        updated_user = await db.users.find_one({"_id": ObjectId(submission.userId)})
        
    return user_to_view_model(updated_user)