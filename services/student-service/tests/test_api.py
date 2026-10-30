import json

from fastapi.testclient import TestClient

from app.events import STUDENT_ENROLLED_TOPIC
from app.main import app, get_publisher


class FakePublisher:
    def __init__(self) -> None:
        self.messages: list[tuple[str, str, bytes]] = []

    def publish(self, topic: str, key: str, value: bytes) -> None:
        self.messages.append((topic, key, value))


def make_client() -> tuple[TestClient, FakePublisher]:
    publisher = FakePublisher()
    app.dependency_overrides[get_publisher] = lambda: publisher
    return TestClient(app), publisher


def test_health() -> None:
    client, _ = make_client()
    assert client.get("/health").json() == {"status": "ok"}


def test_enroll_student_publishes_event() -> None:
    client, publisher = make_client()

    response = client.post(
        "/students", json={"first_name": "Ada", "last_name": "Lovelace", "grade_level": 7}
    )

    assert response.status_code == 201
    student = response.json()
    assert len(publisher.messages) == 1
    topic, key, value = publisher.messages[0]
    assert topic == STUDENT_ENROLLED_TOPIC
    assert key == student["student_id"]
    event = json.loads(value)
    assert event["event_type"] == STUDENT_ENROLLED_TOPIC
    assert event["payload"] == student


def test_enroll_student_rejects_invalid_grade() -> None:
    client, publisher = make_client()

    response = client.post(
        "/students", json={"first_name": "Ada", "last_name": "Lovelace", "grade_level": 13}
    )

    assert response.status_code == 422
    assert publisher.messages == []
