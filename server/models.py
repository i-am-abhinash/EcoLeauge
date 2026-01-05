#models.py#
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Any
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(cls, source_type: Any, handler):
        from pydantic_core import core_schema
        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),
            python_schema=core_schema.is_instance_schema(ObjectId),
            serialization=core_schema.plain_serializer_function_ser_schema(lambda x: str(x)))

class MongoModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    model_config = ConfigDict(populate_by_name=True, arbitrary_types_allowed=True)

class UserInDB(MongoModel):
    name: str; username: str; email: EmailStr; school: str; hashed_password: str
    points: int = 0; badges: List[str] = []; completedChallenges: List[PyObjectId] = []

class UserViewModel(BaseModel):
    id: str; name: str; username: str; email: EmailStr; school: str
    points: int; badges: List[str]; completedChallenges: List[str]

class UserCreateModel(BaseModel):
    name: str; username: str; email: EmailStr; password: str; school: str

class UserLoginModel(BaseModel):
    email: EmailStr; password: str

class ChallengeViewModel(BaseModel):
    id: str = Field(..., alias="_id"); title: str; description: str
    difficulty: str; pointsAwarded: int; gameType: str

class ChallengeSubmissionModel(BaseModel):
    userId: str; challengeId: str