// assets/js/data/projectsData.js
export const projectsData = {
    title: "Projects",
    projects: [
        {
            title: "KütüpOS: A full-stack library management application",
            description: "A comprehensive full-stack library management system built for Python 202 Bootcamp, demonstrating progressive development from OOP terminal application to modern web service. Features automatic ISBN lookup via Open Library API, interactive multi-floor visualization, real-time search, and comprehensive REST API built with FastAPI and React.",
            link: "https://github.com/sarpowsky/KutupOS"
        },
        {
            title: "Turquake: Turkish Earthquake Analysis & Prediction",
            description: "Comprehensive machine learning project analyzing earthquake patterns in Turkey using supervised learning for magnitude prediction and unsupervised clustering for risk zone identification. Features LightGBM regression model (RMSE: 0.1032, R²: 0.9502), multi-fault weighted risk analysis, and interactive Streamlit web application with Folium maps. Includes city-specific risk assessment for major Turkish cities and real-world applications for emergency management and urban planning.",
            link: "https://github.com/sarpowsky/turquake"
        },
        {
            title: "OBSS AI Image Captioning Challenge",
            description: "Competition solution achieving 16th place in OBSS Internship Competition on Kaggle for AI image captioning task. Implemented fine-tuned BLIP-Large model with vision encoder freezing and text component fine-tuning approach. Features advanced data augmentation, beam search with nucleus sampling, caption post-processing, and achieved validation FGD score of 0.22008 using PyTorch and Transformers.",
            link: "https://github.com/sarpowsky/obss-competition"
        },
        {
            title: "Metro Simulation",
            description: "A simulation of a driverless metro system that finds optimal routes between stations using path-finding algorithms. Features a Dijkstra for minimal-transfer routes, A* for fastest routes, and an interactive visualization system with matplotlib. Includes a GUI interface for selecting stations and viewing animated route simulations. Developed during the Python with AI Introduction Bootcamp by Akbank and Global AI Hub.",
            link: "https://github.com/sarpowsky/akbank-metro-simulation"
        },
        {
            title: "PityPal",
            description: "Predictive analytics tool for Genshin Impact built with Python backend (NumPy, Pandas, Scikit-learn) and React frontend. Features custom probability models for gacha prediction, SQLite database integration, and comprehensive data visualization dashboard with real-time rate calculation.",
            link: "https://github.com/sarpowsky/PityPal"
        },
        {
            title: "Horoscope-Bot",
            description: "Python-based Telegram bot leveraging aiohttp for RESTful API integration with external horoscope services. Implements stateful conversation flow with SQLite persistence, automated scheduled updates via cron tasks, and NLP-enhanced user intent recognition.",
            link: "https://github.com/sarpowsky/Horoscope-Bot"
        },
        {
            title: "Developer Portfolio",
            description: "Modern JavaScript portfolio with ES6 modules, Canvas-based Matrix animation, and modular component architecture. Features responsive design with Tailwind CSS, dark/light theme switching, and interactive content visualization including latest LinkedIn posts.",
            link: "https://github.com/sarpowsky/sarpowsky.github.io"
        }
    ]
};

