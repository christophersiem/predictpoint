# predictpoint
Kleine App für Prediction-Runden: Turnier erstellen, Freunde einladen, Wetten anlegen, tippen & auflösen.

---

## Architektur

- **2-Tier Web-App**:  
  `React/TypeScript-Frontend` ↔ `Spring Boot-Backend`  
  Datenbank: **PostgreSQL**

- **REST-API** mit leichtem Auth-Flow  
  → Login per ID, Registrierung erzeugt eine ID

- **Domain**:
    - `Tournament`
    - `Bet` (Frage, `options`, `status`, `resolved`, `correctOptionIndex`)
    - `Tip` (User-Wahl, Punkte)

> **Nur der Tournament-Admin darf Bets auflösen**

---

## Backend – Setup & Start

**Voraussetzungen**:  
JDK 17+, PostgreSQL, Maven Wrapper

### 1. Datenbank & Datasource

```bash
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/predictpoint
export SPRING_DATASOURCE_USERNAME=postgres
export SPRING_DATASOURCE_PASSWORD=pass
```

### 2. Backend starten

```bash
./mvnw spring-boot:run
```

> **Flyway** führt Migrationen automatisch aus  
> → `src/main/resources/db/migration`

**Läuft auf**:  
`http://localhost:8080`

---

## API – Kurzer Auszug

| Methode | Endpoint                        | Beschreibung |
|--------|----------------------------------|-------------|
| `GET`  | `/api/tournaments/me`            | Turniere inkl. `activeBets`, `pastBets`, `resolvedBets` |
| `POST` | `/api/tips`                      | `{ betId, selectedOptionIndex }` – speichert/überschreibt Tipp |
| `PUT`  | `/api/bets/{betId}/resolve`      | `{ correctOptionIndex }` – **nur Admin** |
| `POST` | `/api/user/login`                | Minimaler Auth-Flow |
| `POST` | `/api/user/logout`               | Logout |

---

## Frontend – Kurz

**Dev-Proxy** (Vite) leitet `/api` zum Backend:

```ts
// vite.config.ts
server: {
  proxy: {
    '/api': 'http://localhost:8080'
  }
}
```

**Start**:

```bash
npm i
npm run dev
# → http://localhost:5173
```

---

## Tech-Stack

| Ebene     | Technologie |
|----------|------------|
| **Backend** | Spring Boot (Java), JPA/Hibernate, PostgreSQL, Flyway |
| **Frontend** | React + TypeScript (Vite), plain CSS mit Design-Tokens |

---

## Hinweise

- `correctOptionIndex = -1` → **„noch unbekannt“**
- `resolved = true` → **erst setzen, wenn aufgelöst**
- **Status-Enum erweitern** → Flyway-Reihenfolge & Backfills beachten

---

> **Bereit für die nächste Runde?**  
> `predictpoint` – einfach, schnell, fair.