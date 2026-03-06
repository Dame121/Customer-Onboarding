from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.deps import get_current_customer
from app.models.customer import Customer
from app.schemas.customer import CustomerCreate, CustomerLogin, CustomerResponse, TokenResponse
from app.security import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/customers", tags=["Customers"])


@router.post("/register", response_model=CustomerResponse, status_code=201)
async def register_customer(customer: CustomerCreate, db: AsyncSession = Depends(get_db)):
    # Check if email already exists
    existing = await db.execute(select(Customer).where(Customer.email == customer.email))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")

    # Check if GSTIN already exists
    existing = await db.execute(select(Customer).where(Customer.gstin == customer.gstin))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="GSTIN already registered")

    new_customer = Customer(
        name=customer.name,
        email=customer.email,
        gstin=customer.gstin,
        password=hash_password(customer.password),
    )
    db.add(new_customer)
    await db.commit()
    await db.refresh(new_customer)

    return new_customer


@router.post("/login", response_model=TokenResponse)
async def login_customer(credentials: CustomerLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Customer).where(Customer.email == credentials.email))
    customer = result.scalar_one_or_none()

    if not customer or not verify_password(credentials.password, customer.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": str(customer.id)})
    return {"access_token": token, "token_type": "bearer"}


@router.get("/profile", response_model=CustomerResponse)
async def get_profile(customer: Customer = Depends(get_current_customer)):
    return customer
