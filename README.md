# Vivek's Portfolio 

Welcome to my interactive portfolio, designed to look and feel like a modern, glass-morphism-style operating system. This project is a dynamic showcase of my skills in web development, built with a focus on a clean user interface, robust functionality, and a seamless user experience.

The entire portfolio is managed through a secure, integrated admin panel powered by Firebase, allowing for real-time content updates without touching the code.

**Live Demo:** [Link to your deployed portfolio]

![Portfolio Screenshot](https://i.imgur.com/your-screenshot.png)
*(Replace this with a screenshot of your deployed portfolio)*

---

## ✨ Features

* **Interactive OS Interface:** A unique, desktop-like UI with draggable, resizable, and maximizable windows.
* **Live Admin Panel:** A secure, password-protected admin dashboard to manage all portfolio content in real-time.
* **Firebase Integration:** All content (bio, projects, experience, education) is fetched live from a Firestore database.
* **Fully Responsive Design:** The application automatically switches to a clean, single-page layout on mobile devices.
* **Dynamic Widgets:** Add, remove, and drag-and-drop widgets like a live clock, weather display, and sticky notes.
* **Customizable Desktop:** Personalize your experience by changing the desktop wallpaper with pre-selected images or your own uploads.
* **Interactive Terminal:** A functional terminal that accepts commands like `ls projects` and `cat about.txt` to display information.

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v14 or later)
* npm

### Installation

1.  **Clone the repo**
    ```sh
    git clone [https://github.com/vivekchudasama-2004/My-Portfolio.git](https://github.com/vivekchudasama-2004/My-Portfolio.git)
    ```
2.  **Navigate to the project directory**
    ```sh
    cd My-Portfolio
    ```
3.  **Install NPM packages**
    ```sh
    npm install
    ```
4.  **Set up your environment variables**
    * Create a file named `.env.local` in the root of your project.
    * Add your Firebase project configuration keys to this file. The keys must be prefixed with `VITE_`.
        ```env
        VITE_API_KEY="YOUR_API_KEY"
        VITE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
        VITE_PROJECT_ID="YOUR_PROJECT_ID"
        VITE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
        VITE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
        VITE_APP_ID="YOUR_APP_ID"
        ```
5.  **Start the development server**
    ```sh
    npm run dev
    ```

---

## 🛠️ Tech Stack

This project is built with a modern and powerful tech stack:

* **[React](https://reactjs.org/):** A JavaScript library for building user interfaces.
* **[Vite](https://vitejs.dev/):** A next-generation frontend tooling for fast development.
* **[Firebase](https://firebase.google.com/):** Used for the database (Firestore) and secure user authentication.
* **[Framer Motion](https://www.framer.com/motion/):** A production-ready motion library for creating beautiful animations.
* **[Tailwind CSS](https://tailwindcss.com/):** A utility-first CSS framework for rapid UI development.

---

## Usage

* **Desktop View:** Click on the icons in the dock to open applications in draggable windows. You can minimize, maximize, and close windows just like in a real OS.
* **Admin Panel:** Click the "Admin" button in the header to access the login screen. Once logged in, you can manage all the content that appears on the portfolio.
* **Widgets:** Click the "Widgets" button to add, remove, and drag widgets around your desktop.

---

## 📬 Contact

Vivek Chudasama - vivekchudasama170@gmail.com

Project Link: [https://github.com/vivekchudasama-2004/My-Portfolio](https://github.com/vivekchudasama-2004/My-Portfolio)
