# Invoice Management App

A fully responsive Invoice Management Application built with React. This project was built as part of a Frontend Mentor challenge.

## Live Demo

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

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
