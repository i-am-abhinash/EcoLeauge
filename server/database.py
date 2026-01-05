# server/database.py

import motor.motor_asyncio
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

# Create a client to connect to your MongoDB instance
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)

# Get a reference to the database
# If the database doesn't exist, MongoDB will create it
db = client.edgamedb