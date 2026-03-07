from pydantic import BaseModel, EmailStr, Field, field_validator


class SignUpRequest(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    phone: str = Field(min_length=7, max_length=20)
    password: str = Field(min_length=6, max_length=100)
    confirm_password: str = Field(min_length=6, max_length=100)
    language: str = Field(min_length=2, max_length=50)
    region: str = Field(min_length=2, max_length=50)

    @field_validator("phone")
    @classmethod
    def phone_must_be_numeric(cls, value: str) -> str:
        cleaned = value.replace("+", "").replace("-", "").replace(" ", "")
        if not cleaned.isdigit():
            raise ValueError("Phone must be numeric.")
        return value

    @field_validator("confirm_password")
    @classmethod
    def passwords_must_match(cls, value: str, info):
        password = info.data.get("password")
        if password and value != password:
            raise ValueError("Password and confirm password do not match.")
        return value


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=100)


class AuthResponse(BaseModel):
    token: str
    user_id: int
    name: str
    email: EmailStr
    is_admin: bool

