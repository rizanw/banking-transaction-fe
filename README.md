# banking-transaction-fe

# Overview

Backend restful API to manage bank transaction with 2 roles user including authentication using jwt+session and
authorization based on their roles.
`maker` role can create the transaction but can not `approve` the transaction. the `approver` role with review and
approve or reject the transaction.
beside that the registration is also using otp verification code send by email. and many more features inside! kindly
check!

for the backend service please check: https://github.com/rizanw/banking-transaction-be (the endpoints & data model is
explained here)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# Project Structure

This is a [Next.js](https://nextjs.org/) project bootstrapped
with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
With standard App directory style. and in this app basically I split the codebase into 3 parts:

- /app : the pages & router
- /component : the components/widgets for the pages
- /utils : additional tools to support this app

## Package that I use here

- mui (material design ui kit): https://mui.com/
- axios (http client library): https://axios-http.com/docs/intro
- moment (datetime object type): https://momentjs.com/
- etc
  The rest is extension of MUI. I try to not use a lot of library and make it simple as possible.