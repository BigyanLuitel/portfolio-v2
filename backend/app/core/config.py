from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_name: str = "Bigyan Luitel Portfolio API"
    environment: str = "development"
    OPENAI_API_KEY: str = ""
    cors_origins: str = "http://localhost:3000"
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")
    telegram_bot_token: str = ""
    telegram_chat_id: str = ""

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",")]


settings = Settings()