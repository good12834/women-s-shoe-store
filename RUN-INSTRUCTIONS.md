# How to Run Your Women's Shoe Store with Stripe Integration

## Prerequisites

Make sure you have both Node.js and npm installed on your system.

## Step 1: Install Dependencies

### Server Dependencies

```bash
cd server
npm install
```

### Client Dependencies

```bash
cd client
npm install
```

## Step 2: Start the Server

Open a new terminal/command prompt and run:

```bash
cd server
npm start
```

The server will start on `http://localhost:5000`

You should see:

```
Server running on port 5000
Connected to database
```

## Step 3: Start the Client

Open another new terminal/command prompt and run:

```bash
cd client
npm run dev
```

The client will start on `http://localhost:5173`

You should see:

```
  VITE v7.2.4  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## Step 4: Test the Stripe Integration

1. Open your browser and go to `http://localhost:5173`
2. Navigate to the Checkout page
3. Fill in the shipping information
4. Select "Credit/Debit Card" payment method
5. Review your order
6. Click "Place Order" to proceed to Step 4 (Stripe payment)
7. Use Stripe's test card: **4242 4242 4242 4242**
8. Complete the payment

## Troubleshooting

### If you get connection errors:

- Make sure both server and client are running
- Check that the server is on port 5000 and client on port 5173
- Verify no other applications are using these ports

### If Stripe integration doesn't work:

- Check browser console for errors
- Ensure server is running (API calls should work)
- Verify Stripe keys are correctly set in server/.env

### If you see dependency warnings:

This is normal - the Stripe packages work with React 19 using --legacy-peer-deps

## Test Cards for Stripe

- **Success**: 4242 4242 4242 4242
- **Declined**: 4000 0000 0000 0002
- **Insufficient funds**: 4000 0000 0000 9995

Use any future expiry date, any CVC, and any ZIP code for testing.

## Important Notes

1. **HTTPS for Production**: Stripe requires HTTPS for live payments. Use HTTP for development/testing only.

2. **Test Mode**: Your Stripe keys are in test mode, so no real money will be charged.

3. **Database**: The application uses MySQL. Make sure your database is configured and running.

## Need Help?

If you encounter any issues:

1. Check the server logs for error messages
2. Check the browser console for client-side errors
3. Verify your environment variables are correctly set
4. Ensure all dependencies are installed

Your Stripe integration is fully functional and ready for testing!
