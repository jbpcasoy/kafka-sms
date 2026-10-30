import os
from typing import Protocol

from confluent_kafka import Producer


class EventPublisher(Protocol):
    def publish(self, topic: str, key: str, value: bytes) -> None: ...


class KafkaEventPublisher:
    def __init__(self, bootstrap_servers: str | None = None) -> None:
        self._producer = Producer(
            {
                "bootstrap.servers": bootstrap_servers
                or os.environ.get("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092"),
                "enable.idempotence": True,
                "acks": "all",
            }
        )

    def publish(self, topic: str, key: str, value: bytes) -> None:
        self._producer.produce(topic, key=key, value=value)
        # Flush per request keeps the skeleton simple; batch later if throughput matters.
        remaining = self._producer.flush(10)
        if remaining:
            raise RuntimeError(f"{remaining} message(s) not delivered to {topic}")
