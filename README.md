# 5nance - AI-Powered Mutual Fund Analysis Dashboard

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Gemini API](https://img.shields.io/badge/Google-Gemini_API-4285F4?logo=google)](https://ai.google.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Recharts](https://img.shields.io/badge/Recharts-2.x-8884d8)](https://recharts.org/)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

An AI-driven financial dashboard that empowers users to analyze and compare mutual funds with personalized insights, risk scoring, and sentiment analysis.

*This is a conceptual project. The screenshot below is for illustrative purposes.*

![5nance Dashboard Screenshot](https://storage.googleapis.com/aistudio-hosting/history/1721245089201/images/5nance-demo.gif)

---

## 🚀 Description

**5nance** is a modern, responsive web application designed to demystify mutual fund investing. It provides a seamless experience for both beginners and seasoned investors, combining a user-friendly interface with powerful AI-driven analytics.

The application features a full user authentication system, an educational home page for newcomers, and a protected dashboard where users can perform in-depth analysis. By simply providing a risk profile and a list of mutual fund tickers, users receive a comprehensive breakdown of each fund, including performance metrics, AI-generated sentiment analysis, and personalized recommendations.

## ✨ Key Features

- **User Authentication**: Secure Login and Signup functionality to provide a personalized experience.
- **Educational Content**: A welcoming home page that explains key investment concepts for beginners.
- **AI-Powered Analysis**: Leverages the Google Gemini API to generate realistic mock data, sentiment analysis from news headlines, and personalized recommendations.
- **Comparative Visualization**: An interactive scatter plot (built with Recharts) to compare multiple funds based on their risk score vs. 1-year or 3-year returns.
- **In-Depth Fund Cards**: Detailed cards for each fund, showing key metrics like returns, expense ratio, volatility, and a 12-month performance line chart.
- **Dynamic Theme**: A sleek Dark/Light mode toggle that persists across sessions, ensuring user comfort in any lighting condition.
- **Responsive Design**: A mobile-first design that looks and works great on all devices, from desktops to smartphones.
- **Animated UI**: Smooth animations and transitions create an engaging and polished user experience.

## 🛠️ Technology Stack

- **Frontend**:
  - [**React.js**](https://react.dev/) (v19) for building the interactive user interface.
  - [**Recharts**](https://recharts.org/) for creating beautiful and responsive charts.
  - **CSS Custom Properties** & **Keyframes** for styling and animations.
- **AI/ML Layer**:
  - [**Google Gemini API** (`@google/genai`)](https://ai.google.dev/) for generating all financial data, analysis, and recommendations.

## ⚙️ Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/5nance.git
    cd 5nance
    ```

2.  **Install dependencies:**
    This project uses an `importmap` in `index.html`, so no traditional `npm install` is needed for the libraries. All dependencies are fetched from a CDN.

3.  **Set up your environment variables:**
    The application requires a Google Gemini API key. Make sure this is available as `process.env.API_KEY` in the execution environment where the app is served.

4.  **Serve the application:**
    You can use a simple local server to run the `index.html` file. For example, using the `http-server` package:
    ```bash
    npx http-server .
    ```
    Then, open your browser to the provided local address.

## 📂 Project Structure

```
.
├── index.html       # The main HTML file, entry point of the app.
├── index.tsx        # The main React application file, contains all components and logic.
├── index.css        # The main stylesheet, contains all styles for the application.
├── README.md        # This documentation file.
└── metadata.json    # Project metadata.
```

- **`index.html`**: Sets up the basic HTML structure, includes the import map for dependencies, and mounts the React application.
- **`index.tsx`**: Contains the entire React application logic, including state management, component definitions (Navbar, Pages, Cards, Charts), and the Gemini API integration.
- **`index.css`**: Defines the visual appearance of the application, including layout, colors (with support for dark mode via CSS variables), and animations.

## 📄 License

This project is licensed under the Apache 2.0 License. See the header of the source files for more information.
