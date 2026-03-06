from pydantic import BaseModel, EmailStr


class CustomerCreate(BaseModel):
    name: str
    email: EmailStr
    gstin: str
    password: str


class CustomerLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class CustomerResponse(BaseModel):
    id: int
    name: str
    email: str
    gstin: str

    model_config = {"from_attributes": True}
