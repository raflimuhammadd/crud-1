# Asset Management System

## Setup Instructions

### Prerequisites
- Node.js >= 18
- PostgreSQL 14+ (local or Docker)
- npm >= 9

### Backend Setup

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Configure environment variables** (`.env` already created):
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=
DB_PASSWORD=
DB_NAME=
NODE_ENV=development
```

3. **Create database and run migrations:**
```bash
# Using Docker
docker-compose up -d
```

4. **Run migrations:**
```bash
npm run migration:run
```

5. **Start backend server:**
```bash
npm run start:dev
```

Server runs on `http://localhost:3000`

## API Endpoints

### Create Asset
```bash
curl -X POST http://localhost:3000/assets \
  -H "Content-Type: application/json" \
  -d '{
    "asset_name": "Laptop",
    "stock_quantity": 10,
    "category": "Non-Consumable"
  }'
```

### Get All Assets
```bash
curl http://localhost:3000/assets
```

### Get Single Asset
```bash
curl http://localhost:3000/assets/1
```

### Update Asset
```bash
curl -X PUT http://localhost:3000/assets/1 \
  -H "Content-Type: application/json" \
  -d '{
    "stock_quantity": 15
  }'
```

### Delete Asset
```bash
curl -X DELETE http://localhost:3000/assets/1
```

**Response Codes:**
- `204 No Content` - Asset successfully deleted
- `404 Not Found` - Asset ID doesn't exist

## API Response Codes (RESTful Standard)

| Endpoint | Method | Success | Error |
|----------|--------|---------|-------|
| `/assets` | POST | 201 Created | 400 Bad Request |
| `/assets` | GET | 200 OK | - |
| `/assets/:id` | GET | 200 OK | 404 Not Found |
| `/assets/:id` | PUT | 200 OK | 404 Not Found |
| `/assets/:id` | DELETE | 204 No Content | 404 Not Found |

## Database Schema

**Table: asset**
- `asset_id` (int, PRIMARY KEY, AUTO_INCREMENT)
- `asset_name` (varchar(255), NOT NULL)
- `stock_quantity` (int, NOT NULL, CHECK >= 0)
- `category` (enum: 'Consumable', 'Non-Consumable', NOT NULL)
- `created_at` (timestamp, DEFAULT now())
- `updated_at` (timestamp, DEFAULT now())

## Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## Project Structure

```
asset-fumindo/
├── backend/
│   ├── src/
│   │   ├── database/
│   │   │   └── migrations/
│   │   ├── modules/
│   │   │   └── asset/
│   │   │       ├── entities/
│   │   │       ├── dtos/
│   │   │       ├── controllers/
│   │   │       └── services/
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env
│   ├── data-source.ts
│   └── package.json
├── frontend/
│   ├── src/
│   └── package.json
└── docker-compose.yml
```

## Technology Stack

- **Backend**: NestJS 12, TypeORM, PostgreSQL, Class Validator
- **Frontend**: Vue 3, Vite, Axios
- **Architecture**: Layered (Controllers → Services → Repositories → Database)