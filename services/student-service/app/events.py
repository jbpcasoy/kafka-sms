"""Event contracts published by the student service.

Every event shares the same envelope so consumers can route and dedupe
without knowing the payload shape.
"""

from datetime import UTC, datetime
from uuid import UUID, uuid4

from pydantic import BaseModel, Field

STUDENT_ENROLLED_TOPIC = "sms.student.enrolled.v1"


class StudentEnrolled(BaseModel):
    student_id: UUID
    first_name: str
    last_name: str
    grade_level: int


class EventEnvelope(BaseModel):
    event_id: UUID = Field(default_factory=uuid4)
    event_type: str
    occurred_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    payload: StudentEnrolled
