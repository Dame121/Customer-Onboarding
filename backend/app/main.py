from fastapi import FastAPI

app = FastAPI(title="Customer Onboarding API")


@app.get("/")
async def root():
    return {"welcome home boy"}

@app.get("/health")
async def health_check():
    return {"status":"ok"}
