# Backend Implementation Plan
## Wallet Authentication API - Flexible Address Validation

**Created:** 2025-01-15
**Purpose:** Guide to implement backend API for PeridotVault wallet authentication
**Frontend:** Already configured and ready at `localhost:3000`

---

## 📋 Overview

Frontend sudah siap dan mengirim request dengan format berikut:

```json
{
  "signature": "string",
  "message": "Sign this message to authenticate with PeridotVault Studio",
  "publicKey": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA...", // Peridot wallet format
  "address": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA..."  // Same as publicKey
}
```

**Backend perlu:**
1. Accept flexible wallet address formats
2. Verify signature from wallet
3. Generate JWT token
4. Return user data

---

## 🎯 Requirements

### Tech Stack
- Node.js server (Express/Fastify/Hono/etc)
- Port: 4000
- Database: PostgreSQL/MongoDB/your choice
- JWT library for token generation

### API Endpoints

#### 1. POST /api/auth/verify
Verify wallet signature and authenticate user

**Request:**
```json
{
  "signature": "string (from Peridot wallet)",
  "message": "Sign this message to authenticate with PeridotVault Studio",
  "publicKey": "string (Peridot wallet public key)",
  "address": "string (wallet address - can be any format)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Authentication successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresAt": "2025-01-16T10:30:00Z",
    "user": {
      "address": "user_wallet_address",
      "publicKey": "user_public_key",
      "username": null,
      "email": null
    }
  },
  "error": null
}
```

**Error Response (400/401):**
```json
{
  "success": false,
  "message": "Validation failed",
  "data": null,
  "error": ["address must be an Ethereum address"] // ← CHANGE THIS!
}
```

#### 2. GET /api/auth/profile
Get authenticated user profile

**Headers:**
```
Authorization: Bearer {token}
X-Wallet-Address: {address}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "address": "0x...",
      "publicKey": "0x...",
      "username": null,
      "email": null,
      "createdAt": "2025-01-15T10:30:00Z"
    }
  },
  "error": null
}
```

#### 3. POST /api/auth/logout
Logout and invalidate session

**Headers:**
```
Authorization: Bearer {token}
X-Wallet-Address: {address}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully",
  "data": null,
  "error": null
}
```

#### 4. POST /api/auth/refresh (Optional)
Refresh expired token

**Request:**
```json
{
  "token": "expired_token_here"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "token": "new_jwt_token",
    "expiresAt": "2025-01-16T11:30:00Z"
  },
  "error": null
}
```

---

## 🔧 Implementation Steps

### Phase 1: Setup & Dependencies

#### 1.1 Install Required Packages

```bash
# Express example
npm install express cors helmet jsonwebtoken bcrypt

# TypeScript support
npm install -D @types/express @types/cors @types/jsonwebtoken

# Or if using other framework:
# npm install fastify / hono / koa / etc
```

#### 1.2 Environment Variables

Create `.env` file:

```bash
# Server Configuration
PORT=4000
NODE_ENV=development

# JWT Secret (generate secure random string)
JWT_SECRET=your-super-secret-key-min-32-chars-change-this
JWT_EXPIRES_IN=24h

# Database
DATABASE_URL=your-database-connection-string

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:4000
```

---

### Phase 2: Database Schema

#### 2.1 Users Table

**PostgreSQL Example:**
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  address VARCHAR(100) NOT NULL UNIQUE,  -- Flexible for any wallet format
  public_key TEXT NOT NULL,
  username VARCHAR(100),
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_address ON users(address);
```

**MongoDB Example:**
```javascript
const userSchema = new Schema({
  address: {
    type: String,
    required: true,
    unique: true,
    minlength: 10,
    maxlength: 100
  },
  publicKey: {
    type: String,
    required: true
  },
  username: String,
  email: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
```

---

### Phase 3: Validation - FLEXIBLE!

#### 3.1 Remove Strict Ethereum Validation

**❌ DON'T DO THIS:**
```javascript
// STRICT - Don't use!
if (!address.startsWith('0x') || address.length !== 42) {
  return res.status(400).json({
    error: 'address must be an Ethereum address'
  });
}
```

**✅ DO THIS INSTEAD:**

```javascript
// FLEXIBLE - Accept any wallet format!
const validateWalletAddress = (address) => {
  // Basic checks only
  if (!address) {
    return { valid: false, message: 'Address is required' };
  }

  if (typeof address !== 'string') {
    return { valid: false, message: 'Address must be a string' };
  }

  if (address.length < 10) {
    return { valid: false, message: 'Address is too short' };
  }

  if (address.length > 100) {
    return { valid: false, message: 'Address is too long' };
  }

  // Accept any reasonable format
  return { valid: true };
};
```

#### 3.2 With Validation Library

**Zod Example:**
```typescript
import { z } from 'zod';

const verifyAuthSchema = z.object({
  signature: z.string().min(1, 'Signature is required'),
  message: z.string().min(1, 'Message is required'),
  publicKey: z.string().min(1, 'Public key is required'),
  address: z.string()
    .min(10, 'Address too short')
    .max(100, 'Address too long')
    .refine((addr) => /^[a-zA-Z0-9+/=]+$/.test(addr), {
      message: 'Address contains invalid characters'
    })
});

// Use in route
app.post('/api/auth/verify', async (req, res) => {
  const validationResult = verifyAuthSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      error: validationResult.error.errors.map(e => ({
        field: e.path[0],
        message: e.message
      }))
    });
  }

  // Continue with auth logic...
});
```

**Yup Example:**
```javascript
import * as yup from 'yup';

const verifyAuthSchema = yup.object().shape({
  signature: yup.string().required('Signature is required'),
  message: yup.string().required('Message is required'),
  publicKey: yup.string().required('Public key is required'),
  address: yup.string()
    .required('Address is required')
    .min(10, 'Address too short')
    .max(100, 'Address too long')
    .matches(/^[a-zA-Z0-9+/=]+$/, 'Invalid characters in address')
});

// Middleware
const validateRequest = async (req, res, next) => {
  try {
    await verifyAuthSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      error: error.inner.map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }
};

app.post('/api/auth/verify', validateRequest, async (req, res) => {
  // Auth logic...
});
```

**Joi Example:**
```javascript
const Joi = require('joi');

const verifyAuthSchema = Joi.object({
  signature: Joi.string().required(),
  message: Joi.string().required(),
  publicKey: Joi.string().required(),
  address: Joi.string()
    .min(10)
    .max(100)
    .required()
});

app.post('/api/auth/verify', async (req, res) => {
  const { error, value } = verifyAuthSchema.validate(req.body, {
    abortEarly: false
  });

  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      error: error.details.map(e => ({
        field: e.path[0],
        message: e.message
      }))
    });
  }

  // Use validated value
  const { signature, message, publicKey, address } = value;
  // Continue...
});
```

---

### Phase 4: Authentication Logic

#### 4.1 Verify Signature

**IMPORTANT:** Signature verification tergantung pada wallet type.

**Untuk Peridot Wallet, mungkin Anda perlu:**
```javascript
// Simple implementation - store signature for session
// For production, implement actual cryptographic verification

async function verifyWalletSignature(signature, message, publicKey, address) {
  // TODO: Implement actual signature verification
  // For now, we'll do basic checks

  if (!signature || !message || !publicKey || !address) {
    throw new Error('Missing required fields');
  }

  // Basic checks
  if (signature.length < 10) {
    throw new Error('Invalid signature');
  }

  // In production, verify signature cryptography
  // This depends on Peridot wallet's signature format

  return true; // Assume valid for now
}
```

**For Ethereum/MetaMask (if you add support later):**
```javascript
const { recoverAddress } = require('ethers');

async function verifyEthereumSignature(signature, message, address) {
  try {
    const recoveredAddress = recoverAddress(message, signature);
    return recoveredAddress.toLowerCase() === address.toLowerCase();
  } catch {
    return false;
  }
}
```

#### 4.2 Generate JWT Token

```javascript
const jwt = require('jsonwebtoken');

function generateToken(user) {
  const payload = {
    address: user.address,
    publicKey: user.publicKey,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { algorithm: 'HS256' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
}
```

#### 4.3 Complete Auth Route

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS.split(','),
  credentials: true
}));
app.use(express.json());

// POST /api/auth/verify
app.post('/api/auth/verify', async (req, res) => {
  try {
    const { signature, message, publicKey, address } = req.body;

    // 1. Validate input
    if (!signature || !message || !publicKey || !address) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        data: null,
        error: 'Missing required fields'
      });
    }

    // 2. Flexible address validation
    if (typeof address !== 'string' || address.length < 10 || address.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        data: null,
        error: 'Invalid wallet address'
      });
    }

    // 3. Verify signature
    const isValid = await verifyWalletSignature(signature, message, publicKey, address);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Authentication failed',
        data: null,
        error: 'INVALID_SIGNATURE'
      });
    }

    // 4. Find or create user
    let user = await findOrCreateUser(address, publicKey);

    // 5. Generate token
    const token = generateToken(user);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    // 6. Return success
    return res.json({
      success: true,
      message: 'Authentication successful',
      data: {
        token,
        expiresAt,
        user: {
          address: user.address,
          publicKey: user.publicKey,
          username: user.username,
          email: user.email
        }
      },
      error: null
    });

  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: null,
      error: error.message
    });
  }
});

// GET /api/auth/profile
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const user = await findUserByAddress(req.user.address);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        data: null,
        error: 'USER_NOT_FOUND'
      });
    }

    return res.json({
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        user: {
          address: user.address,
          publicKey: user.publicKey,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt
        }
      },
      error: null
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile',
      data: null,
      error: error.message
    });
  }
});

// POST /api/auth/logout
app.post('/api/auth/logout', authenticateToken, async (req, res) => {
  // Optional: Invalidate token in blacklist/redis
  // For now, just return success (client will clear token)

  return res.json({
    success: true,
    message: 'Logged out successfully',
    data: null,
    error: null
  });
});

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const walletAddress = req.headers['x-wallet-address'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
      data: null,
      error: 'INVALID_TOKEN'
    });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      data: null,
      error: 'INVALID_TOKEN'
    });
  }
}

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📡 Ready to accept requests from frontend`);
});
```

---

### Phase 5: Database Operations

```javascript
// Example with PostgreSQL
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function findOrCreateUser(address, publicKey) {
  const client = await pool.connect();

  try {
    // Try to find existing user
    const result = await client.query(
      'SELECT * FROM users WHERE address = $1',
      [address]
    );

    if (result.rows.length > 0) {
      // Update last login
      await client.query(
        'UPDATE users SET updated_at = NOW() WHERE address = $1',
        [address]
      );

      return result.rows[0];
    }

    // Create new user
    const insertResult = await client.query(
      `INSERT INTO users (address, public_key)
       VALUES ($1, $2)
       RETURNING *`,
      [address, publicKey]
    );

    console.log('✅ New user created:', address);
    return insertResult.rows[0];

  } finally {
    client.release();
  }
}

async function findUserByAddress(address) {
  const client = await pool.connect();

  try {
    const result = await client.query(
      'SELECT * FROM users WHERE address = $1',
      [address]
    );

    return result.rows[0] || null;
  } finally {
    client.release();
  }
}
```

---

### Phase 6: Testing

#### 6.1 Test with curl

```bash
# Test verify endpoint
curl -X POST http://localhost:4000/api/auth/verify \
  -H "Content-Type: application/json" \
  -d '{
    "signature": "test_signature",
    "message": "Sign this message to authenticate with PeridotVault Studio",
    "publicKey": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA",
    "address": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA"
  }'

# Expected response with token
```

#### 6.2 Test with Frontend

```bash
# 1. Start backend
node server.js  # or npm start

# 2. Start frontend (already configured)
cd /path/to/frontend
pnpm dev

# 3. Open http://localhost:3000
# 4. Click "Connect Wallet"
# 5. Check backend logs
# 6. Check browser Network tab
```

---

## ✅ Implementation Checklist

### Basic Setup
- [ ] Install dependencies (express, cors, jsonwebtoken, etc.)
- [ ] Setup .env file with JWT_SECRET
- [ ] Create database schema with flexible address field
- [ ] Configure CORS for localhost:3000

### Validation
- [ ] Remove strict Ethereum address validation
- [ ] Add flexible validation (min 10, max 100 chars)
- [ ] Test validation accepts Peridot wallet address

### Auth Endpoints
- [ ] POST /api/auth/verify implemented
- [ ] GET /api/auth/profile implemented
- [ ] POST /api/auth/logout implemented
- [ ] JWT token generation working
- [ ] Token verification middleware working

### Database
- [ ] User creation/find working
- [ ] Address stored correctly (no truncation)
- [ ] Unique constraint on address working

### Testing
- [ ] curl test successful
- [ ] Frontend connection successful
- [ ] User can connect wallet
- [ ] Token stored and sent in subsequent requests
- [ ] Protected routes accessible

---

## 🐛 Common Issues & Solutions

### Issue 1: CORS Error

**Problem:**
```
Access to fetch at 'http://localhost:4000' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solution:**
```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:4000'],
  credentials: true
}));
```

### Issue 2: Address Validation Too Strict

**Problem:**
```json
{
  "error": "address must be an Ethereum address"
}
```

**Solution:** Use flexible validation as shown above

### Issue 3: JWT_SECRET Not Set

**Problem:**
```
Error: secretOrPrivateKey must have a value
```

**Solution:**
```bash
# Create .env file
echo "JWT_SECRET=your-super-secret-key-min-32-chars" >> .env
```

### Issue 4: Port Already in Use

**Problem:**
```
Error: listen EADDRINUSE: address already in use :::4000
```

**Solution:**
```bash
# Find process using port 4000
lsof -ti:4000

# Kill it
kill -9 <PID>

# Or use different port
PORT=4001 node server.js
```

---

## 📚 Additional Resources

### Documentation
- Frontend API Spec: `/path/to/frontend/docs/api-specification.md`
- Frontend Connection Guide: `/path/to/frontend/docs/API_CONNECTION_GUIDE.md`

### Libraries
- express: https://expressjs.com/
- jsonwebtoken: https://github.com/auth0/node-jsonwebtoken
- cors: https://github.com/expressjs/cors

### Testing Tools
- Postman: https://www.postman.com/
- curl: Command line
- Thunder Client: VS Code extension

---

## 🚀 Quick Start (Copy-Paste Ready)

### server.js (Minimal Working Example)

```javascript
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

const SECRET = 'dev-secret-key-change-in-production';

app.post('/api/auth/verify', async (req, res) => {
  const { signature, message, publicKey, address } = req.body;

  // Flexible validation
  if (!address || typeof address !== 'string' || address.length < 10) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      error: 'Invalid address'
    });
  }

  // Generate token (skip signature verification for now)
  const token = jwt.sign({ address }, SECRET, { expiresIn: '24h' });

  res.json({
    success: true,
    message: 'Authentication successful',
    data: {
      token,
      expiresAt: new Date(Date.now() + 24*60*60*1000).toISOString(),
      user: {
        address,
        publicKey,
        username: null,
        email: null
      }
    },
    error: null
  });
});

app.get('/api/auth/profile', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
      error: 'INVALID_TOKEN'
    });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, SECRET);

    res.json({
      success: true,
      message: 'Profile retrieved',
      data: {
        user: {
          address: decoded.address,
          publicKey: '',
          username: null,
          email: null
        }
      },
      error: null
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: 'INVALID_TOKEN'
    });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out',
    data: null,
    error: null
  });
});

app.listen(4000, () => {
  console.log('🚀 Backend running on http://localhost:4000');
});
```

### package.json

```json
{
  "name": "peridotvault-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "jsonwebtoken": "^9.0.2",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

### .env

```
JWT_SECRET=change-this-to-a-secure-random-string-min-32-chars
PORT=4000
NODE_ENV=development
```

---

## 📞 Support

If you encounter issues:

1. Check frontend logs: Browser DevTools → Console
2. Check backend logs: Terminal where server running
3. Check Network tab: See exact request/response
4. Verify CORS is configured
5. Verify validation is flexible

---

**Ready to implement!** 🚀

Follow the phases in order, test each endpoint, and you'll have a working backend in no time!
