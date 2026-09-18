from app.schemas.contact import ContactRequest, ContactResponse

# In-memory for now — same reasoning as PROJECTS. This resets every
# time the server restarts, which is fine for local dev but NOT
# something to ship to production as-is. Swapping this for a DB
# write or a Telegram notification later won't require touching
# the route or schema.
SUBMISSIONS: list[ContactRequest] = []