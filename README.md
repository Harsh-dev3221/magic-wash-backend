# Magic Wash Backend API

Backend server for Magic Wash application with **Hono**, **Bun**, and **MongoDB Atlas**.

## ⚡ Tech Stack

- **Runtime:** Bun (ultra-fast JavaScript runtime)
- **Framework:** Hono (lightweight web framework)
- **Database:** MongoDB Atlas
- **ODM:** Mongoose

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
bun install
```

### 2. Setup Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Then edit `.env` and add your MongoDB Atlas connection string:

```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/magicwash?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
```

### 3. Start the Server

**Development mode (with auto-reload):**
```bash
bun run dev
```

**Production mode:**
```bash
bun start
```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### Health Check
- **GET** `/api/health` - Check if API is running

### Bookings
- **POST** `/api/bookings` - Create a new booking
- **GET** `/api/bookings` - Get all bookings (with pagination)
- **GET** `/api/bookings/:id` - Get single booking
- **PUT** `/api/bookings/:id` - Update booking status
- **DELETE** `/api/bookings/:id` - Delete a booking

### Partnerships
- **POST** `/api/partnerships` - Create a new partnership application
- **GET** `/api/partnerships` - Get all partnership applications (with pagination)
- **GET** `/api/partnerships/:id` - Get single partnership application
- **PUT** `/api/partnerships/:id` - Update partnership status
- **DELETE** `/api/partnerships/:id` - Delete a partnership application

## 📊 Database Models

### Booking Model
```javascript
{
  name: String (required),
  email: String (required),
  phone: String (required),
  carType: String (required) - sedan, suv, hatchback, luxury,
  serviceType: String (required) - daily-magic, weekly-magic, etc.,
  date: Date (required),
  address: String (required),
  notes: String (optional),
  deviceType: String (required) - ios, android, other,
  status: String - pending, confirmed, completed, cancelled,
  submittedAt: Date,
  timestamps: true
}
```

### Partnership Model
```javascript
{
  fullName: String (required),
  email: String (required),
  phone: String (required),
  city: String (required),
  pincode: String (required),
  investmentCapacity: String (required),
  businessExperience: String (optional),
  preferredLocation: String (required),
  comments: String (optional),
  callSchedule: String (required),
  status: String - pending, contacted, approved, rejected,
  submittedAt: Date,
  timestamps: true
}
```

## 🔧 Query Parameters

### GET /api/bookings
- `status` - Filter by status (pending, confirmed, completed, cancelled)
- `limit` - Number of results per page (default: 50)
- `page` - Page number (default: 1)

### GET /api/partnerships
- `status` - Filter by status (pending, contacted, approved, rejected)
- `city` - Filter by city (case-insensitive)
- `limit` - Number of results per page (default: 50)
- `page` - Page number (default: 1)

## 📝 Example Requests

### Create a Booking
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "carType": "sedan",
    "serviceType": "daily-magic",
    "date": "2024-01-15",
    "address": "123 Main St, Delhi",
    "deviceType": "android",
    "notes": "Please call before arriving"
  }'
```

### Get All Bookings
```bash
curl http://localhost:5000/api/bookings?status=pending&limit=10&page=1
```

## 🔒 Security Notes

⚠️ **Important:** The current API endpoints are public. For production:
1. Add authentication middleware
2. Protect admin routes
3. Add rate limiting
4. Validate and sanitize all inputs
5. Use HTTPS only

## 📦 Dependencies

- **hono** - Ultra-fast web framework
- **mongoose** - MongoDB ODM
- **dotenv** - Environment variables
- **@types/bun** - TypeScript types for Bun

## 🛠️ Development

The server uses:

- **Bun** as the JavaScript runtime (faster than Node.js)
- **Hono** as the web framework (faster than Express)
- **ES6 modules** (`type: "module"` in package.json)

All console logs are formatted with emojis for easy debugging:

- ✅ Success operations
- ❌ Errors
- 📝 New submissions
- 📊 Data retrieval
- 🗑️ Deletions

## 📞 Support

For issues or questions, check the console logs for detailed error messages.

