# Invoice Management App

A fully responsive Invoice Management Application built with React. This project was built as part of a Frontend Mentor challenge.

## Live Demo

https://invoice-app-stage-2-fe.vercel.app/

## Features

- Create, read, update, and delete invoices
- Save invoices as drafts or send as pending
- Mark pending invoices as paid
- Filter invoices by status (draft, pending, paid)
- Toggle between light and dark mode
- Data persists across page refreshes via LocalStorage
- Fully responsive across mobile, tablet, and desktop
- Form validation with error states
- Accessible — keyboard navigable, semantic HTML, focus trapping on modals

## Tech Stack

- React (Vite)
- React Router v6
- CSS Modules
- LocalStorage for data persistence

## Project Structure

src/
├── components/ # Reusable UI components
├── context/ # Global state (invoices + theme)
├── hooks/ # Custom hooks (useLocalStorage)
├── pages/ # Page-level components
├── utils/ # Helper functions and seed data
└── styles/ # Global styles

## What I Learned

This project strengthened my understanding of:

- CRUD operations in a frontend application
- Shared state with React Context
- Persistent browser storage with LocalStorage
- Form validation and error handling
- Routing with React Router
- Responsive component design
- Managing multiple application states in a larger React project

## Running Locally

```bash
git clone https://github.com/Danielumoh/INVOICE-APP-STAGE-2-FE.git
cd INVOICE-APP-STAGE-2-FE
npm install
npm run dev

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
