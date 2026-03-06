from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.customer import Customer
from app.schemas.customer import CustomerCreate, CustomerResponse
from app.security import hash_password

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
