from functools import lru_cache
from uuid import uuid4

from fastapi import Depends, FastAPI
from pydantic import BaseModel, Field

from app.events import STUDENT_ENROLLED_TOPIC, EventEnvelope, StudentEnrolled
from app.producer import EventPublisher, KafkaEventPublisher

app = FastAPI(title="student-service")


class EnrollStudentRequest(BaseModel):
    first_name: str = Field(min_length=1)
    last_name: str = Field(min_length=1)
    grade_level: int = Field(ge=1, le=12)


@lru_cache
def get_publisher() -> EventPublisher:
    return KafkaEventPublisher()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/students", status_code=201)
def enroll_student(
    request: EnrollStudentRequest,
    publisher: EventPublisher = Depends(get_publisher),
) -> StudentEnrolled:
    student = StudentEnrolled(student_id=uuid4(), **request.model_dump())
    envelope = EventEnvelope(event_type=STUDENT_ENROLLED_TOPIC, payload=student)
    publisher.publish(
        STUDENT_ENROLLED_TOPIC,
        key=str(student.student_id),
        value=envelope.model_dump_json().encode(),
    )
    return student
