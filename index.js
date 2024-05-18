const express = require('express');
;
const MercadoPago = require('mercadopago');
const MercadoPagoConfig = MercadoPago.MercadoPagoConfig;
const PaymentMethod = MercadoPago.Payment;
const Customer = MercadoPago.Customer;
const CustomerCard = MercadoPago.CustomerCard;
const cors = require('cors');
const app = express();


const corsOptions = {
    origin: function (origin, callback) {
      if (!origin) {
        // Permite solicitações sem cabeçalho Origin (por exemplo, solicitações de mesma origem, clientes não-navegador)
        callback(null, true);
      } else if ([
        'http://localhost:5173',
        'http://localhost:5173/',
        'http://localhost:5174',
        'http://localhost:5174/',
        'http://localhost:5175',
        'http://localhost:5175/',
        'http://localhost:8081/',  
        'http://localhost:8081',
        'http://localhost:8000/',  
        'http://localhost:8000',
        'https://guerratool.com/',
        'https://guerratool.com',
        'https://qr-code-simples-gd.web.app/',
        'https://qr-code-simples-gd.web.app',
        'https://gd-companion-fm.web.app',
        'https://gd-companion-fm.web.app/',
        'https://gdpayment-mjlrkfgyq9mqzmq5.web.app',
        'https://gdpayment-mjlrkfgyq9mqzmq5.web.app/'
      ].includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'baggage', 'sentry-trace'],
    exposedHeaders: ['Content-Length', 'X-Knowledge-Count'],
    credentials: true,
    maxAge: 3600,
    preflightContinue: false,
    optionsSuccessStatus: 204
  };
  
  
  app.use(cors(corsOptions));
  
  
  
  require('dotenv').config();
  

  app.post('/mercadopago/payment/pix', verifyTokenMiddleware,  async (req, res) => {


    // Extrair corpo da requisição
    const { transaction_amount, description, payment_method_id, email } = req.body;
  
    const generateIdempotencyKey = () => {  
      return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    };
    
    const newClient = new MercadoPagoConfig({ 
      accessToken: process.env.ACCESS_TOKEN_MP, 
      options: 
      { timeout: 5000, 
        idempotencyKey: generateIdempotencyKey() 
      }
     });
    
    // Step 3: Initialize the API object
    const payment = new PaymentMethod(newClient);
  
    // Create the request object
    const body = {
      transaction_amount: parseFloat(transaction_amount),
      description,
      payment_method_id,
      payer: {
        email
      },
    };
  
  
    // Create request options object - Optional
    const requestOptions = {
      idempotencyKey: generateIdempotencyKey(),
    };
  
    // Make the request
    try {
      const response = await payment.create({ body: req.body, requestOptions: req.requestOptions });
      console.log(response);
      res.send(response);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  
  });
  