from fastapi import FastAPI

from app.routers import customer

app = FastAPI(title="Customer Onboarding API")

app.include_router(customer.router)


@app.get("/")
async def root():
    return {"welcome home boy"}

@app.get("/health")
async def health_check():
    return {"status":"ok"}
