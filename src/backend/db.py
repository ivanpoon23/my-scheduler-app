from pymongo import MongoClient
import certifi
import os
from dotenv import load_dotenv

load_dotenv()
MONGODB_URI = os.getenv("MONGODB_URI")
client = MongoClient(
    MONGODB_URI,
    tls=True,
    tlsCAFile=certifi.where() 
)
print("Connected to MongoDB at", MONGODB_URI)
db = client["canvas_scheduler"]
