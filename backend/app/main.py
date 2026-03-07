from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import customer

app = FastAPI(title="Customer Onboarding API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(customer.router)


@app.get("/")
async def root():
    return {"welcome home boy"}

@app.get("/health")
async def health_check():
    return {"status":"ok"}
