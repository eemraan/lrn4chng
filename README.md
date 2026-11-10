# lrn4chng

Research study app: an **Ionic 9 / Angular 22 / Capacitor 8** mobile app that guides
participants through a multilingual (EN/FR) study flow — consent → demographics →
pretest → photo capture → interactive learning quest — backed by a **FastAPI + MongoDB**
API, with optional **ESP32** environmental-sensor capture (BLE and MQTT).

## Repository map

| Path | What it is |
|---|---|
| `app/lrn4chng/` | The Ionic mobile app (also runs in the browser) |
| `serve/` | FastAPI backend — MongoDB, Redis, Traefik TLS; deployed at `api.lrn4chng.site` |
| `embed/` | ESP32 sensor firmware (Arduino; SCD4x CO₂ + lux → MQTT) |
| `docs/ARCHITECTURE.md` | Architecture, concept map, route/API reference, milestones, known gaps |

## Getting started

```bash
# App (Node ≥ 22 required; nvm has 24.x)
cd app/lrn4chng
npm install
npm start

# Backend
cd serve
docker compose up -d --build
```

ESP32 firmware credentials: copy `embed/esp_mqtt_config.example.h` to
`embed/esp_mqtt_config.h` and fill in your WiFi/MQTT values (git-ignored).

See **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** for the full architecture,
concept map, backend contract, and current project status.
