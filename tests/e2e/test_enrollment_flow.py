"""End-to-end: HTTP request in, Kafka event out, against the docker compose stack."""

import json
import os
import urllib.request
import uuid

from confluent_kafka import Consumer

STUDENT_SERVICE_URL = os.environ.get("STUDENT_SERVICE_URL", "http://localhost:8001")
KAFKA_BOOTSTRAP_SERVERS = os.environ.get("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
TOPIC = "sms.student.enrolled.v1"


def test_enrolling_a_student_emits_event() -> None:
    consumer = Consumer(
        {
            "bootstrap.servers": KAFKA_BOOTSTRAP_SERVERS,
            "group.id": f"e2e-{uuid.uuid4()}",
            "auto.offset.reset": "earliest",
        }
    )
    consumer.subscribe([TOPIC])

    request = urllib.request.Request(
        f"{STUDENT_SERVICE_URL}/students",
        data=json.dumps(
            {"first_name": "Grace", "last_name": "Hopper", "grade_level": 9}
        ).encode(),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=10) as response:
        assert response.status == 201
        student = json.load(response)

    try:
        for _ in range(60):
            message = consumer.poll(1.0)
            if message is None or message.error():
                continue
            event = json.loads(message.value())
            if event["payload"]["student_id"] == student["student_id"]:
                assert event["event_type"] == TOPIC
                return
        raise AssertionError(f"No event for student {student['student_id']} on {TOPIC}")
    finally:
        consumer.close()
