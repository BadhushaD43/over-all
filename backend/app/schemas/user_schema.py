from pydantic import BaseModel, Field, field_validator


class UserProfileResponse(BaseModel):
    id: int
    name: str
    email: str
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


class UserPasswordUpdateRequest(BaseModel):
    current_password: str = Field(min_length=6, max_length=128)
    new_password: str = Field(min_length=6, max_length=128)
