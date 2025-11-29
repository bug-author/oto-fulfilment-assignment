# Points Service

A points tracking service that manages transactions across multiple payers

## What This Service Does

- **Add transactions**: Record points from different payers with timestamps
- **Spend points**: Deduct points following FIFO rules (oldest points spent first, no payer goes negative)
- **View balances**: See current point totals for each payer

## Prerequisites

Before running this project, you need to install:

### 1. Node.js

Download and install Node.jsfrom: https://nodejs.org

After installation, verify by opening a terminal and running:
```bash
node --version
```
You should see something like `v24.x.x`.

### 2. pnpm (Package Manager)

Install pnpm globally by running:
```bash
npm install -g pnpm
```

Verify the installation:
```bash
pnpm --version
```

## Running the Service

1. **Open a terminal** and navigate to this project folder:
```bash
cd oto-fulfilment-assignment
```

2. **Install dependencies**:
```bash
pnpm install
```

3. **Set up environment variables**:
```bash
cp .env.example .env
```

4. **Start the server**:
```bash
pnpm start:dev
```

You should see output like:
```
Server running on http://localhost:3000
Swagger docs at http://localhost:3000/api
```

## Configuration

The service uses environment variables for configuration. Copy `.env.example` to `.env` and modify as needed:

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |

## API Documentation

Once the server is running, open your browser and go to:

**http://localhost:3000/api**

This opens Swagger UI where you can:
- See all available endpoints
- Read detailed documentation
- Try out the API directly in your browser

## API Endpoints

### POST /add
Add a transaction record.

**Request body:**
```json
{
  "payer": "SHOPIFY",
  "points": 1000,
  "timestamp": "2024-07-02T14:00:00Z"
}
```

### POST /spend
Spend points (oldest first, no payer goes negative).

**Request body:**
```json
{
  "points": 5000
}
```

**Response:**
```json
[
  { "payer": "SHOPIFY", "points": -100 },
  { "payer": "EBAY", "points": -200 },
  { "payer": "AMAZON", "points": -4700 }
]
```

### GET /balance
Get current balances for all payers.

**Response:**
```json
{
  "SHOPIFY": 1000,
  "EBAY": 0,
  "AMAZON": 5300
}
```

## Running Tests

```bash
pnpm test:e2e
```
