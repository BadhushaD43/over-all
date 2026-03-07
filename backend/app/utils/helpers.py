def format_response(data):
    return {"data": data}


def normalize_language(name: str) -> str:
    return (name or "").strip().lower()
