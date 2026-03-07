from pydantic import BaseModel, EmailStr, Field, field_validator


class UserProfileResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: str
    language: str
    region: str
    dark_mode: bool
    profile_picture: str | None
    is_admin: bool

    class Config:
        from_attributes = True


class UserProfileUpdateRequest(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=120)
    phone: str | None = Field(default=None, min_length=7, max_length=20)
    language: str | None = Field(default=None, min_length=2, max_length=50)
    region: str | None = Field(default=None, min_length=2, max_length=50)
    dark_mode: bool | None = None
    profile_picture: str | None = None

    @field_validator("phone")
    @classmethod
    def phone_must_be_numeric(cls, value: str | None) -> str | None:
        if value is None:
            return None
        cleaned = value.replace("+", "").replace("-", "").replace(" ", "")
        if not cleaned.isdigit():
            raise ValueError("Phone must be numeric.")
        return value

