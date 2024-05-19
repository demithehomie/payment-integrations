Backend with Mercado Pago Integration

## Overview

This project demonstrates the integration of Mercado Pago's payment gateway into an Express.js application. The backend service supports creating PIX payments and is configured with CORS to allow requests from specific origins.

## Prerequisites

- Node.js and npm installed
- An active Mercado Pago account
- Mercado Pago Access Token

## Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd <repository-directory>
```

2. Install the dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add your Mercado Pago Access Token:

```
ACCESS_TOKEN_MP=your_mercado_pago_access_token
```

4. Start the server:

```bash
npm start
```

## Code Explanation

The main components of the code are:

- **Express.js**: A minimal web application framework for Node.js.
- **Mercado Pago SDK**: To handle payments via Mercado Pago.
- **CORS Middleware**: Configured to allow requests from specific origins.

### CORS Configuration

The CORS options are configured to allow requests from a predefined list of origins. This is essential for security, ensuring that only trusted sources can interact with your API.

```javascript
const corsOptions = {
    origin: function (origin, callback) {
      if (!origin || [
        'http://localhost:5173',
        // Add other trusted origins here
        'https://guerratool.com'
      ].includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 3600
};
```

### Mercado Pago Payment Endpoint

The `/mercadopago/payment/pix` endpoint handles PIX payments. It extracts payment details from the request body, creates a new Mercado Pago payment, and sends the response back to the client.

```javascript
app.post('/mercadopago/payment/pix', verifyTokenMiddleware, async (req, res) => {
    const { transaction_amount, description, payment_method_id, email } = req.body;
    
    const generateIdempotencyKey = () => {  
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    };
    
    const newClient = new MercadoPagoConfig({ 
        accessToken: process.env.ACCESS_TOKEN_MP, 
        options: { timeout: 5000, idempotencyKey: generateIdempotencyKey() }
    });
    
    const payment = new PaymentMethod(newClient);
    const body = {
        transaction_amount: parseFloat(transaction_amount),
        description,
        payment_method_id,
        payer: { email },
    };
    
    const requestOptions = {
        idempotencyKey: generateIdempotencyKey(),
    };
    
    try {
        const response = await payment.create({ body, requestOptions });
        res.send(response);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});
```

## Best Practices

### Good Practices

1. **Environment Variables**: Sensitive information like API keys and tokens are stored in environment variables, which is a good practice to avoid hardcoding credentials.
2. **CORS Configuration**: Properly configured CORS to restrict access to trusted origins, enhancing security.
3. **Error Handling**: Basic error handling with a try-catch block to handle and log errors.

### Areas for Improvement

1. **Token Verification Middleware**: The `verifyTokenMiddleware` is mentioned but not defined. Ensure that it is implemented correctly to validate tokens.
2. **Hardcoded Origins**: Consider using environment variables or a configuration file for the list of allowed origins to make it easier to manage and update.
3. **Logging**: Implement a more robust logging mechanism for better monitoring and debugging.
4. **Security**: Additional security measures, such as input validation and rate limiting, should be considered to prevent attacks like SQL injection and DDoS.

## Conclusion

This setup provides a basic implementation for handling payments with Mercado Pago in an Express.js application. While it includes several good practices, there are areas where security and maintainability can be further enhanced.