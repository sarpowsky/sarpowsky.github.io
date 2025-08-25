// assets/js/data/content.js
export const profileData = {
    name: "Sarp Can Karaman",
    profileImage: "/images/profile-picture.png",
    title: "Computer Engineer | ML/DL Enthusiast | Back-end Developer",
    social: {
        github: "https://github.com/sarpowsky",
        linkedin: "https://www.linkedin.com/in/sarp-can-karaman/",
        instagram: "https://www.instagram.com/_sarpowsky/",
        spotify: "https://open.spotify.com/user/ssru8otkx7inhh4g03wlm1j3m?si=6e2ef3eee1534a77"
    }
};

export const aboutData = {
    title: "hi",
    greeting: "Hello, I am Sarp",
    subtitle: "a Computer Engineering Student at Haliç University",
    paragraphs: [
        "I build stuff where code meets machine learning. Still figuring it all out as a second-year student, but I've been a fast learner and fell in love with how ML can turn data into something actually useful. Nothing beats that feeling when your model finally works really.",
        
        "Python's definitely my language of choice most of the times. I practically live in NumPy and Pandas these days. I'm ''the'' annoying friend who always talks about writing clean code and break everything into modules. My GitHub is practically a shrine to commented code.",
        
        "I enjoy the whole ML process, from cleaning up messy datasets (which can be a real pain, but still) to seeing models come alive in production. Still learning tons every day, but that's the fun part. When I'm not debugging my code until the sunrise, I'm probably playing around with a new visualization library or optimizing something that was working perfectly fine already, just to break it and repeat this cycle again."
    ]
};

export const experienceData = {
    title: "Experience",
    experiences: [
        {
            title: "Data & AI Intern",
            company: "TECHBROS • July - August 2025 • İstanbul, Türkiye",
            points: [
                "Participated in TechBros InternCamp2025, a comprehensive training program covering enterprise systems, data analytics, and emerging technologies",
                "Developed expertise in ERP and CRM systems architecture and integration patterns",
                "Implemented DevOps methodologies and deployment pipelines for scalable applications",
                "Gained hands-on experience in Business Intelligence and Data Analytics fundamentals",
                "Designed and optimized Data Warehousing solutions and ETL/ELT processes",
                "Created interactive data visualizations and performed advanced statistical analysis",
                "Worked with SQL and NoSQL database management systems for enterprise applications",
                "Explored Generative AI applications and implementation strategies in real-world scenarios",
                "Integrated Machine Learning solutions into enterprise environments and workflows",
                "Participated in technical workshops and delivered presentations on emerging technologies"
            ]
        }
    ]
};

export const projectsData = {
    title: "Projects",
    projects: [
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

export const skillsData = {
    title: "Technical Competencies",
    categories: [
        {
            name: "Data Science & Machine Learning",
            skills: [
                { name: "Python (Advanced)", level: 70 },
                { name: "NumPy/Pandas/SciPy", level: 65 },
                { name: "Scikit-learn/XGBoost", level: 60 },
                { name: "PyTorch/TensorFlow", level: 55 },
                { name: "Statistical Analysis", level: 60 },
                { name: "Feature Engineering", level: 55 }
            ]
        },
        {
            name: "Data Engineering & Analytics",
            skills: [
                { name: "SQL/PostgreSQL/MySQL", level: 65 },
                { name: "ETL/ELT Processes", level: 60 },
                { name: "Data Warehousing", level: 55 },
                { name: "Power BI/Tableau", level: 55 },
                { name: "Apache Airflow", level: 45 },
                { name: "Data Pipeline Design", level: 50 }
            ]
        },
        {
            name: "Cloud & Enterprise Systems",
            skills: [
                { name: "Huawei Cloud Platform", level: 50 },
                { name: "Google Cloud Platform", level: 45 },
                { name: "ERP/CRM Integration", level: 50 },
                { name: "DevOps/Docker/CI-CD", level: 45 },
                { name: "Business Intelligence", level: 55 },
                { name: "Enterprise Architecture", level: 40 }
            ]
        },
        {
            name: "Development & Tools",
            skills: [
                { name: "FastAPI/RESTful APIs", level: 60 },
                { name: "Git/Version Control", level: 65 },
                { name: "JavaScript/React", level: 55 },
                { name: "Jupyter/Google Colab", level: 70 },
                { name: "AI Development Tools", level: 60 },
                { name: "Technical Documentation", level: 60 }
            ]
        }
    ]
};

export const devicesData = {
    title: "Devices",
    devices: [
        {
            type: "Laptop",
            model: "Msi Katana 15 B12V",
            image: "/images/msi-katana.png",
            description: "Very reliable, extremely powerful laptop. Because I also love playing video games, it really saves my life. Battery goes like ≈3 hours, which sometimes isn't quite enough."
        },
        {
            type: "Phone",
            model: "iPhone 13 Pro Max",
            image: "/images/phone.png",
            description: "I have been using this for about 2.5 years now, battery is still good and reliable. Camera hasn't aged a bit, still takes amazing photos. I'm really happy with it."
        },
        {
            type: "Headphones",
            model: "Airpods Pro 2.Gen",
            image: "/images/airpods-pro.png",
            description: "The integration with the Apple ecosystem was very desirable when I first thought of buying it. The sound quality is amazing, and the noise cancellation is really good. It definetely worths every penny."
        },
        {
            type: "Smartwatch",
            model: "Apple Watch Series 9 45mm",
            image: "/images/apple-watch.png",
            description: "This device is a lifesaver, especially if your routine requires for you to be constantly on the move, and in the situations you are not able to take out your phone out of your pocket, this badboy deals with nearyl everything you need that your phone does. 10/10"
        },
        {
            type: "Tablet",
            model: "ViewSonic WoodPad 7",
            image: "/images/viewsonic-woodpad.png",
            description: "Well, I neither have the budget nor the need to buy an iPad really. This tablet is really good for my needs, and it's really cheap. Also sometimes I appreciate the luxury of having a device that makes me able to do digital drawing."
        }
    ]
};