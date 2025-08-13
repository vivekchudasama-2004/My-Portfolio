import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, doc, setDoc, deleteDoc, getDocs, writeBatch } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID,
    measurementId: import.meta.env.VITE_MEASUREMENT_ID
};

// --- INITIALIZE FIREBASE ---
let db, auth;
try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
} catch (e) {
    console.error("Firebase initialization error. Using mock data. Please provide your Firebase config.", e);
    db = null;
    auth = null;
}

// --- UPDATED DATA from your resume ---
const initialData = {
    profile: {
        name: "Vivek Chudasama",
        title: "AI/ML, Python & Web Developer",
        avatarUrl: "https://avatars.githubusercontent.com/u/109827618?v=4",
        bio: "Highly motivated Final-year IT engineering student with an enthusiastic about Web development and emerging technologies like machine learning. Seeking opportunities to apply and further develop my skills in a dynamic environment."
    },
    projects: [
        { id: "1", title: "Disease Prediction Based on Symptoms", description: "Developed a machine learning app to predict over 42 diseases from user-input symptoms using a Random Forest Classifier, achieving high accuracy. Delivered both a web interface and Jupyter Notebook for interactive exploration.", imageUrl: "https://placehold.co/600x400/1a1a1a/ffffff?text=Disease+Prediction", repoUrl: "https://github.com/vivekchudasama-2004/Disease-Prediction-Based-on-Symptoms", tech: ["Python", "MLflow", "Hugging Face Hub", "Streamlit"] },
        { id: "2", title: "E-Commerce Platform", description: "Developed a full-stack e-commerce web app with user authentication, product browsing, cart management, order processing and admin inventory control, featuring email notifications and a demo payment system.", imageUrl: "https://placehold.co/600x400/1a1a1a/ffffff?text=E-Commerce", repoUrl: "https://github.com/vivekchudasama-2004/E-Commerce", tech: ["Java(JSP, Servlets, JDBC)", "HTML", "CSS", "JavaScript", "MySQL"] },
        { id: "3", title: "Object Detection Model", description: "Developed an object detection system using Python and YOLO that processes images to automatically identify and localize objects with bounding boxes.", imageUrl: "https://placehold.co/600x400/1a1a1a/ffffff?text=Object+Detection", repoUrl: "https://github.com/vivekchudasama-2004/Object-detection", tech: ["Python", "Yolo", "OpenCV"] },
    ],
    experience: [
        { id: "1", date: "Jan 2025 – Apr 2025", title: "Internship", company: "TSS Consultancy Pvt Ltd", description: "Worked on a data extractor project aimed at streamlining database operations. Designed a system to extract, verify, and map data, enhancing skills in data management, accuracy verification, and database optimization." },
    ],
    education: [
        { id: "1", date: "2022 - 2026", title: "Bachelor of Technology in Information Technology", institution: "Marwadi University (NAAC A+)", description: "CGPA: 8.47" },
        { id: "2", date: "2021 - 2022", title: "Higher Secondary", institution: "New Era School, Rajkot", description: "Percentage: 54%" },
        { id: "3", date: "2019 - 2020", title: "Matriculation", institution: "New Era School, Rajkot", description: "Percentage: 68.16%" },
    ]
};

const wallpapers = [
    { id: 'light-abstract', name: 'Light Abstract', url: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=2512&auto=format&fit=crop', type: 'image' },
    { id: 'dark-abstract', name: 'Dark Abstract', url: 'https://images.unsplash.com/photo-1532469342337-026ab3edc51d?q=80&w=2574&auto=format&fit=crop', type: 'image' },
];

// --- ICONS (Lucide React) -------------------------------------------------------
const createIcon = (name) => ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        {name === 'Github' && <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>}
        {name === 'Moon' && <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />}
        {name === 'Sun' && <><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></>}
        {name === 'GraduationCap' && <><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.084a1 1 0 0 0 0 1.838l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12v5a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3v-5"/></>}
        {name === 'Briefcase' && <><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></>}
        {name === 'User' && <><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>}
        {name === 'Mail' && <><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></>}
        {name === 'FolderKanban' && <><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/><path d="M8 10v4"/><path d="M12 10v2"/><path d="M16 10v6"/></>}
        {name === 'X' && <path d="M18 6 6 18M6 6l12 12" />}
        {name === 'Settings' && <><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1 0-2l-.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></>}
        {name === 'Upload' && <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></>}
        {name === 'Plus' && <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>}
        {name === 'Trash' && <path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>}
        {name === 'Terminal' && <><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></>}
        {name === 'Maximize2' && <path d="M15 3h6v6M9 21H3v-6M3 3l18 18M21 3l-18 18"/>}
        {name === 'Minimize2' && <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7"/>}
        {name === 'LayoutGrid' && <><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></>}
        {name === 'FileText' && <><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></>}
    </svg>
);

const Icons = {
    Github: createIcon('Github'), Moon: createIcon('Moon'), Sun: createIcon('Sun'), GraduationCap: createIcon('GraduationCap'), Briefcase: createIcon('Briefcase'), User: createIcon('User'), Mail: createIcon('Mail'), FolderKanban: createIcon('FolderKanban'), X: createIcon('X'), Settings: createIcon('Settings'), Upload: createIcon('Upload'), Plus: createIcon('Plus'), Trash: createIcon('Trash'), Terminal: createIcon('Terminal'), Maximize2: createIcon('Maximize2'), Minimize2: createIcon('Minimize2'), LayoutGrid: createIcon('LayoutGrid'), FileText: createIcon('FileText'),
};

// --- UI COMPONENTS --------------------------------------

const Window = ({ title, children, onClose, onMinimize, onMaximize, onFocus, zIndex, state, dockRef }) => {
    const constraintsRef = useRef(null);
    const isMaximized = state === 'maximized';

    const variants = {
        hidden: dockRef ? {
            x: dockRef.x - window.innerWidth / 2,
            y: dockRef.y - window.innerHeight / 2,
            scale: 0,
            opacity: 0,
            transition: { duration: 0.3 }
        } : { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1, scale: 1, x: 0, y: 0,
            width: 700, height: 500,
            top: 'auto', left: 'auto'
        },
        maximized: {
            opacity: 1, scale: 1, x: 0, y: 0,
            width: "calc(100vw - 2rem)",
            height: "calc(100vh - 5rem - 2.5rem)", // account for header and dock
            top: "2.5rem",
            left: "1rem",
        }
    };

    return (
        <motion.div
            ref={constraintsRef}
            className={`absolute bg-white/50 dark:bg-black/50 backdrop-blur-xl rounded-lg shadow-2xl border border-white/20 dark:border-black/20 overflow-hidden`}
            style={{ zIndex }}
            onMouseDown={onFocus}
            drag={!isMaximized}
            dragHandle=".drag-handle"
            dragConstraints={{ left: -window.innerWidth/2 + 350, right: window.innerWidth/2 - 350, top: -window.innerHeight/2 + 250, bottom: window.innerHeight/2 - 250 }}
            initial="hidden"
            animate={isMaximized ? "maximized" : "visible"}
            exit="hidden"
            variants={variants}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
            <div className="drag-handle h-10 bg-white/20 dark:bg-black/20 rounded-t-lg flex items-center justify-between px-4 cursor-move">
                <div className="flex items-center gap-2">
                    <button onClick={onClose} className="w-3.5 h-3.5 bg-red-500 rounded-full hover:bg-red-600"></button>
                    <button onClick={onMinimize} className="w-3.5 h-3.5 bg-yellow-500 rounded-full hover:bg-yellow-600"></button>
                    <button onClick={onMaximize} className="w-3.5 h-3.5 bg-green-500 rounded-full hover:bg-green-600 flex items-center justify-center">
                        {isMaximized ? <Icons.Minimize2 className="w-2 h-2 text-black/50" /> : <Icons.Maximize2 className="w-2 h-2 text-black/50" />}
                    </button>
                </div>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{title}</span>
                <div></div>
            </div>
            <div className={`h-[calc(100%-2.5rem)] w-full overflow-y-auto ${isMaximized ? '' : 'resize'}`}>
                {children}
            </div>
        </motion.div>
    );
};

const Dock = ({ onIconClick, registerDockIconRef }) => {
    const dockItems = [
        { id: 'about', title: 'About Me', icon: 'User' },
        { id: 'projects', title: 'Projects', icon: 'FolderKanban' },
        { id: 'experience', title: 'Experience', icon: 'Briefcase' },
        { id: 'education', title: 'Education', icon: 'GraduationCap' },
        { id: 'resume', title: 'Resume', icon: 'FileText' },
        { id: 'terminal', title: 'Terminal', icon: 'Terminal' },
        { id: 'contact', title: 'Contact', icon: 'Mail' },
        { id: 'settings', title: 'Settings', icon: 'Settings' },
    ];

    return (
        <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center">
            <div className="flex items-end h-20 gap-3 bg-white/50 dark:bg-black/50 backdrop-blur-xl p-3 rounded-2xl border border-white/20 dark:border-black/20 shadow-lg">
                {dockItems.map(item => {
                    const Icon = Icons[item.icon];
                    return (
                        <div key={item.id} className="relative flex flex-col items-center group">
                            <motion.button
                                ref={(el) => registerDockIconRef(item.id, el)}
                                onClick={() => onIconClick(item)}
                                className="w-14 h-14 bg-white/80 dark:bg-black/80 rounded-xl flex items-center justify-center"
                                whileHover={{ y: -10, scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <Icon className="w-8 h-8 text-gray-800 dark:text-gray-200" />
                            </motion.button>
                            <div className="absolute -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {item.title}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const Widget = ({ id, children, onRemove, initialPosition }) => {
    return (
        <motion.div
            drag
            dragMomentum={false}
            className="absolute z-10"
            initial={{ opacity: 0, scale: 0.5, ...initialPosition }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
        >
            <div className="relative group">
                {children}
                <button onClick={() => onRemove(id)} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Icons.X className="w-3 h-3"/>
                </button>
            </div>
        </motion.div>
    );
};

// --- CONTENT VIEWS FOR WINDOWS --------------------------

const ProjectsView = ({ projects }) => {
    const [selectedProject, setSelectedProject] = useState(null);

    if (selectedProject) {
        return (
            <div className="p-6">
                <button onClick={() => setSelectedProject(null)} className="mb-4 font-semibold text-blue-600 dark:text-blue-400">&larr; Back to Projects</button>
                <h2 className="text-3xl font-bold mb-4">{selectedProject.title}</h2>
                <img src={selectedProject.imageUrl} alt={selectedProject.title} className="w-full h-64 object-cover rounded-lg mb-4"/>
                <p className="mb-4">{selectedProject.description}</p>
                <h3 className="font-bold mb-2">Technologies Used:</h3>
                <div className="flex flex-wrap gap-2">
                    {selectedProject.tech.map(t => <span key={t} className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-md text-sm">{t}</span>)}
                </div>
                <a href={selectedProject.repoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-6 font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                    <Icons.Github className="w-4 h-4" />
                    View Repository
                </a>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((item) => (
                    <motion.div key={item.id} className="bg-white/50 dark:bg-gray-800/50 rounded-lg overflow-hidden group cursor-pointer" onClick={() => setSelectedProject(item)} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
                        <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{item.title}</h3>
                            <p className="mt-1 text-gray-700 dark:text-gray-300 text-sm truncate">{item.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

const TimelineView = ({ data, icon }) => {
    const IconComponent = Icons[icon];
    return (
        <div className="p-6">
            <div className="relative max-w-2xl mx-auto">
                <div className="absolute left-4 top-0 w-0.5 h-full bg-gray-300 dark:bg-gray-700"></div>
                {data.map((item) => (
                    <div key={item.id} className="relative pl-12 pb-8">
                        <div className="absolute left-0 top-1 w-8 h-8 bg-white dark:bg-gray-800 rounded-full border-4 border-gray-200 dark:border-gray-700 flex items-center justify-center">
                            <IconComponent className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.date}</p>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{item.title}</h3>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{item.company || item.institution}</p>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AboutView = ({ profile }) => (
    <div className="p-8 flex flex-
    col md:flex-row items-center gap-8">
        <img src={profile.avatarUrl} alt={profile.name} className="w-48 h-48 rounded-full border-4 border-white/50 dark:border-black/50 shadow-lg flex-shrink-0"/>
        <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{profile.name}</h2>
            <p className="text-xl font-medium text-blue-600 dark:text-blue-400">{profile.title}</p>
            <p className="mt-4 text-gray-700 dark:text-gray-300">{profile.bio}</p>
        </div>
    </div>
);

const ContactView = () => (
    <div className="p-8">
        <form className="max-w-xl mx-auto" action="mailto:vivekchudasama39@gmail.com" method="get" encType="text/plain">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="name" className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">Name</label>
                    <input type="text" id="name" name="name" required className="w-full bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white border-transparent rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"/>
                </div>
                <div>
                    <label htmlFor="email" className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">Email</label>
                    <input type="email" id="email" name="email" required className="w-full bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white border-transparent rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"/>
                </div>
            </div>
            <div className="mt-6">
                <label htmlFor="body" className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">Message</label>
                <textarea id="body" name="body" rows="5" required className="w-full bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white border-transparent rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"></textarea>
            </div>
            <div className="text-center mt-8">
                <button type="submit" className="bg-blue-600 text-white px-10 py-3 rounded-md font-bold text-lg hover:bg-blue-700 transition-colors duration-300 w-full md:w-auto">
                    Send Message
                </button>
            </div>
        </form>
    </div>
);

const SettingsView = ({ onWallpaperChange }) => {
    const fileInputRef = useRef(null);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
            const reader = new FileReader();
            reader.onload = (e) => {
                onWallpaperChange(e.target.result, file.type);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Change Wallpaper</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {wallpapers.map(wp => (
                    <div key={wp.id} className="cursor-pointer group" onClick={() => onWallpaperChange(wp.url, wp.type)}>
                        <img src={wp.url} alt={wp.name} className="w-full h-24 object-cover rounded-md border-2 border-transparent group-hover:border-blue-500"/>
                        <p className="text-center text-sm mt-2 text-gray-700 dark:text-gray-300">{wp.name}</p>
                    </div>
                ))}
                <div className="cursor-pointer group" onClick={() => fileInputRef.current.click()}>
                    <div className="w-full h-24 bg-gray-200 dark:bg-gray-700 rounded-md border-2 border-dashed border-gray-400 dark:border-gray-500 group-hover:border-blue-500 flex items-center justify-center">
                        <Icons.Upload className="w-8 h-8 text-gray-500 dark:text-gray-400"/>
                    </div>
                    <p className="text-center text-sm mt-2 text-gray-700 dark:text-gray-300">Upload</p>
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*,video/*" className="hidden" />
                </div>
            </div>
        </div>
    );
};

const TerminalView = ({ data }) => {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState([
        { type: 'output', content: "VivekOS v1.0. Type 'help' for commands." }
    ]);
    const endOfHistoryRef = useRef(null);

    useEffect(() => {
        endOfHistoryRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleCommand = (e) => {
        if (e.key === 'Enter') {
            const command = input.trim().toLowerCase();
            const newHistory = [...history, { type: 'input', content: command }];

            if (command === 'help') {
                newHistory.push({ type: 'output', content: "Available commands: help, ls projects, cat about.txt, clear" });
            } else if (command === 'ls projects') {
                newHistory.push({ type: 'output', content: "Fetching projects..." });
                data.projects.forEach(p => {
                    newHistory.push({ type: 'output', content: `- ${p.title}: ${p.description}` });
                });
            } else if (command === 'cat about.txt') {
                newHistory.push({ type: 'output', content: data.profile.bio });
            } else if (command === 'clear') {
                setHistory([]);
                setInput('');
                return;
            } else {
                newHistory.push({ type: 'output', content: `command not found: ${command}` });
            }

            setHistory(newHistory);
            setInput('');
        }
    };

    return (
        <div className="bg-black/80 text-white font-mono h-full p-4 text-sm" onClick={() => document.getElementById('terminal-input').focus()}>
            {history.map((line, index) => (
                <div key={index}>
                    {line.type === 'input' ? (
                        <p><span className="text-blue-400">user@vivek-portfolio:</span><span className="text-gray-400">~$&nbsp;</span>{line.content}</p>
                    ) : (
                        <p className="text-green-400">{line.content}</p>
                    )}
                </div>
            ))}
            <div className="flex">
                <span className="text-blue-400">user@vivek-portfolio:</span><span className="text-gray-400">~$&nbsp;</span>
                <input
                    id="terminal-input"
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleCommand}
                    className="bg-transparent border-none outline-none text-white font-mono w-full"
                    autoFocus
                />
            </div>
            <div ref={endOfHistoryRef} />
        </div>
    );
};

const ResumeView = ({ data }) => (
    <div className="p-8">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">{data.profile.name}</h2>
            <a href="/vivek-chudasama-resume.pdf" download className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700">Download PDF</a>
        </div>
        <div className="space-y-6 text-gray-800 dark:text-gray-200">
            <div>
                <h3 className="text-xl font-bold border-b-2 border-blue-500 pb-1 mb-2">Professional Summary</h3>
                <p>{data.profile.bio}</p>
            </div>
            <div>
                <h3 className="text-xl font-bold border-b-2 border-blue-500 pb-1 mb-2">Internship Experience</h3>
                {data.experience.map(exp => (
                    <div key={exp.id} className="mb-4">
                        <p className="font-bold">{exp.title} - {exp.company}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{exp.date}</p>
                        <p className="mt-1">{exp.description}</p>
                    </div>
                ))}
            </div>
            <div>
                <h3 className="text-xl font-bold border-b-2 border-blue-500 pb-1 mb-2">Education</h3>
                {data.education.map(edu => (
                    <div key={edu.id} className="mb-4">
                        <p className="font-bold">{edu.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{edu.institution} | {edu.date}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// --- WIDGET COMPONENTS ----------------------------------
const ClockWidget = () => {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const hour = time.getHours() * 30 + time.getMinutes() / 2;
    const minute = time.getMinutes() * 6;
    const second = time.getSeconds() * 6;

    return (
        <div className="w-40 h-40 bg-white/50 dark:bg-black/50 backdrop-blur-md rounded-full shadow-lg border border-white/20 flex items-center justify-center">
            <div className="relative w-36 h-36">
                <div className="absolute w-full h-full rounded-full border-2 border-gray-700 dark:border-gray-300"></div>
                <div className="absolute w-1 h-1 bg-gray-800 dark:bg-white rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute w-0.5 h-12 bg-gray-800 dark:bg-white top-[16.66%] left-1/2 -translate-x-1/2 origin-bottom" style={{ transform: `rotate(${hour}deg)` }}></div>
                <div className="absolute w-0.5 h-16 bg-gray-800 dark:bg-white top-[4.16%] left-1/2 -translate-x-1/2 origin-bottom" style={{ transform: `rotate(${minute}deg)` }}></div>
                <div className="absolute w-px h-16 bg-red-500 top-[4.16%] left-1/2 -translate-x-1/2 origin-bottom" style={{ transform: `rotate(${second}deg)` }}></div>
            </div>
        </div>
    );
};

const WeatherWidget = () => {
    const [weather, setWeather] = useState(null);
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000 * 60); // Update time every minute
        // Mock weather data for Rajkot
        setWeather({ temp: 32, condition: "Partly Cloudy" });
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="w-48 h-40 bg-white/50 dark:bg-black/50 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-4 flex flex-col justify-between">
            <div>
                <p className="font-bold text-lg text-gray-800 dark:text-white">Rajkot, Gujarat</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{time.toLocaleDateString(undefined, { weekday: 'long' })}</p>
            </div>
            <div className="text-right">
                <p className="text-4xl font-bold text-gray-800 dark:text-white">{weather ? `${weather.temp}°C` : '...'}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{weather ? weather.condition : 'Loading...'}</p>
            </div>
        </div>
    );
};

const NotesWidget = () => {
    const [note, setNote] = useState(localStorage.getItem('widget-note') || '');
    useEffect(() => {
        localStorage.setItem('widget-note', note);
    }, [note]);

    return (
        <textarea
            className="w-48 h-40 bg-yellow-100/80 dark:bg-yellow-900/50 backdrop-blur-md rounded-2xl shadow-lg border border-yellow-300/50 p-4 text-yellow-900 dark:text-yellow-200 placeholder-yellow-700/50 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
            placeholder="Jot down a note..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
        />
    );
};

// --- ADMIN PANEL COMPONENTS --------------------------------
const AdminPanel = ({ data, onSignOut }) => {
    const [currentTab, setCurrentTab] = useState('profile');

    const handleSave = async (collectionName, itemData) => {
        if (!db) { alert("Firebase not configured. Cannot save."); return; }
        const docRef = doc(db, collectionName, itemData.id);
        await setDoc(docRef, itemData, { merge: true });
        alert(`${collectionName} item saved!`);
    };

    const handleDelete = async (collectionName, id) => {
        if (!db) { alert("Firebase not configured. Cannot delete."); return; }
        if (window.confirm("Are you sure you want to delete this item?")) {
            await deleteDoc(doc(db, collectionName, id));
            alert(`${collectionName} item deleted!`);
        }
    };

    const renderTabContent = () => {
        switch(currentTab) {
            case 'profile': return <EditableProfile profile={data.profile} onSave={(d) => handleSave('profile', {id: 'main', ...d})} />;
            case 'projects': return <EditableList collectionName="projects" items={data.projects} onSave={handleSave} onDelete={handleDelete} />;
            case 'experience': return <EditableList collectionName="experience" items={data.experience} onSave={handleSave} onDelete={handleDelete} />;
            case 'education': return <EditableList collectionName="education" items={data.education} onSave={handleSave} onDelete={handleDelete} />;
            default: return null;
        }
    };

    const tabs = ['profile', 'projects', 'experience', 'education'];

    return (
        <div className="w-full h-full bg-gray-100 dark:bg-gray-900 flex">
            <div className="w-48 bg-gray-200 dark:bg-gray-800 p-4 flex flex-col">
                <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
                <nav className="flex flex-col gap-2">
                    {tabs.map(tab => (
                        <button key={tab} onClick={() => setCurrentTab(tab)} className={`p-2 rounded text-left capitalize ${currentTab === tab ? 'bg-blue-500 text-white' : 'hover:bg-gray-300 dark:hover:bg-gray-700'}`}>
                            {tab}
                        </button>
                    ))}
                </nav>
                <button onClick={onSignOut} className="mt-auto p-2 rounded bg-red-500 text-white">Sign Out</button>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
                {renderTabContent()}
            </div>
        </div>
    );
};

const EditableProfile = ({ profile, onSave }) => {
    const [formData, setFormData] = useState(profile);

    useEffect(() => setFormData(profile), [profile]);

    const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

    return (
        <div>
            <h3 className="text-2xl font-bold mb-4">Edit Profile</h3>
            <div className="space-y-4">
                <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700"/>
                <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700"/>
                <input name="avatarUrl" value={formData.avatarUrl} onChange={handleChange} placeholder="Avatar URL" className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700"/>
                <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Bio" rows="4" className="w-full p-2 rounded bg-gray-200 dark:bg-gray-700"/>
                <button onClick={() => onSave(formData)} className="px-4 py-2 bg-blue-500 text-white rounded">Save Profile</button>
            </div>
        </div>
    );
};

const EditableList = ({ collectionName, items, onSave, onDelete }) => {
    const [editingItem, setEditingItem] = useState(null);

    const handleAddNew = () => {
        const newId = Date.now().toString();
        const newItem = { id: newId, title: "New Item" }; // Basic new item
        setEditingItem(newItem);
    };

    const handleSaveItem = (itemData) => {
        onSave(collectionName, itemData);
        setEditingItem(null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold capitalize">{collectionName}</h3>
                <button onClick={handleAddNew} className="p-2 bg-green-500 text-white rounded-full"><Icons.Plus className="w-5 h-5"/></button>
            </div>
            {editingItem && <ItemForm item={editingItem} onSave={handleSaveItem} onCancel={() => setEditingItem(null)} />}
            <div className="space-y-2">
                {items.map(item => (
                    <div key={item.id} className="bg-gray-200 dark:bg-gray-800 p-3 rounded flex justify-between items-center">
                        <span>{item.title}</span>
                        <div>
                            <button onClick={() => setEditingItem(item)} className="p-2 text-blue-500">Edit</button>
                            <button onClick={() => onDelete(collectionName, item.id)} className="p-2 text-red-500"><Icons.Trash className="w-5 h-5"/></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ItemForm = ({ item, onSave, onCancel }) => {
    const [formData, setFormData] = useState(item);
    const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

    return (
        <div className="bg-gray-300 dark:bg-gray-700 p-4 rounded mb-4 space-y-2">
            {Object.keys(formData).filter(k => k !== 'id').map(key => (
                <input key={key} name={key} value={formData[key]} onChange={handleChange} placeholder={key} className="w-full p-2 rounded bg-gray-200 dark:bg-gray-600"/>
            ))}
            <button onClick={() => onSave(formData)} className="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
            <button onClick={onCancel} className="px-4 py-2 bg-gray-500 text-white rounded ml-2">Cancel</button>
        </div>
    );
};

const AdminLogin = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!auth) {
            setError("Firebase Auth is not configured.");
            return;
        }
        try {
            await signInWithEmailAndPassword(auth, email, password);
            onLogin();
        } catch (err) {
            setError("Failed to log in. Check your email and password.");
            console.error(err);
        }
    };
    return (
        <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800">
            <form onSubmit={handleSubmit} className="p-8 bg-white dark:bg-gray-700 rounded-lg shadow-xl w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="w-full p-2 rounded mb-4"/>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="w-full p-2 rounded mb-4"/>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">Login</button>
            </form>
        </div>
    );
};


// --- MAIN APP COMPONENT ---------------------------------------------------------

export default function App() {
    const [theme, setTheme] = useState('dark');
    const [windows, setWindows] = useState([]);
    const [zIndexCounter, setZIndexCounter] = useState(10);
    const [wallpaper, setWallpaper] = useState(wallpapers[1].url);
    const dockIconRefs = useRef({});
    const [data, setData] = useState(initialData);
    const [user, setUser] = useState(null);
    const [showAdminPanel, setShowAdminPanel] = useState(false);
    const [widgets, setWidgets] = useState([]);
    const [showWidgetPanel, setShowWidgetPanel] = useState(false);

    // Auth state listener
    useEffect(() => {
        if (auth) {
            const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
                setUser(currentUser);
            });
            return () => unsubscribe();
        }
    }, []);

    // Data fetching from Firestore
    useEffect(() => {
        if (!db) return;

        const collections = ['projects', 'experience', 'education'];
        collections.forEach(colName => {
            const q = collection(db, colName);
            onSnapshot(q, (querySnapshot) => {
                const items = [];
                querySnapshot.forEach((docSnapshot) => items.push({ id: docSnapshot.id, ...docSnapshot.data() }));
                setData(prev => ({ ...prev, [colName]: items }));
            });
        });

        onSnapshot(doc(db, "profile", "main"), (docSnapshot) => {
            if (docSnapshot.exists()) {
                setData(prev => ({ ...prev, profile: docSnapshot.data() }));
            } else {
                // If profile doesn't exist, seed it
                setDoc(doc(db, "profile", "main"), initialData.profile);
                // Seed other collections too if they are empty
                collections.forEach(async (colName) => {
                    const snapshot = await getDocs(collection(db, colName));
                    if (snapshot.empty) {
                        const batch = writeBatch(db);
                        initialData[colName].forEach(item => {
                            const docRef = doc(db, colName, item.id);
                            batch.set(docRef, item);
                        });
                        await batch.commit();
                    }
                });
            }
        });

    }, []);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        const savedWallpaper = localStorage.getItem('wallpaper') || wallpapers[1].url;
        setTheme(savedTheme);
        setWallpaper(savedWallpaper);
        const savedWidgets = JSON.parse(localStorage.getItem('widgets')) || [];
        setWidgets(savedWidgets);
    }, []);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const handleWallpaperChange = (url) => {
        setWallpaper(url);
        localStorage.setItem('wallpaper', url);
    };

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    const openWindow = (item) => {
        setWindows(prev => {
            const existingWindow = prev.find(w => w.id === item.id);
            if (existingWindow) {
                if (existingWindow.state === 'minimized') {
                    return prev.map(w => w.id === item.id ? { ...w, state: 'default', zIndex: zIndexCounter + 1 } : w);
                }
                focusWindow(item.id);
                return prev;
            }
            const dockRef = dockIconRefs.current[item.id]?.getBoundingClientRect();
            return [...prev, { ...item, zIndex: zIndexCounter + 1, state: 'default', dockRef }];
        });
        setZIndexCounter(prev => prev + 1);
    };

    const closeWindow = (id) => {
        setWindows(prev => prev.filter(w => w.id !== id));
    };

    const focusWindow = (id) => {
        setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: zIndexCounter + 1 } : w));
        setZIndexCounter(prev => prev + 1);
    };

    const minimizeWindow = (id) => {
        setWindows(prev => prev.map(w => w.id === id ? { ...w, state: 'minimized' } : w));
    };

    const maximizeWindow = (id) => {
        setWindows(prev => prev.map(w => w.id === id ? { ...w, state: w.state === 'maximized' ? 'default' : 'maximized' } : w));
    };

    const addWidget = (type) => {
        const newWidget = {
            id: Date.now(),
            type,
            initialPosition: { x: Math.random() * 200 - 100, y: Math.random() * 200 - 100 }
        };
        const newWidgets = [...widgets, newWidget];
        setWidgets(newWidgets);
        localStorage.setItem('widgets', JSON.stringify(newWidgets));
    };

    const removeWidget = (id) => {
        const newWidgets = widgets.filter(w => w.id !== id);
        setWidgets(newWidgets);
        localStorage.setItem('widgets', JSON.stringify(newWidgets));
    };

    const renderWindowContent = (id) => {
        switch (id) {
            case 'projects': return <ProjectsView projects={data.projects} />;
            case 'experience': return <TimelineView data={data.experience} icon="Briefcase" />;
            case 'education': return <TimelineView data={data.education} icon="GraduationCap" />;
            case 'about': return <AboutView profile={data.profile} />;
            case 'contact': return <ContactView />;
            case 'settings': return <SettingsView onWallpaperChange={handleWallpaperChange} />;
            case 'terminal': return <TerminalView data={data} />;
            case 'resume': return <ResumeView data={data} />;
            default: return null;
        }
    };

    const Clock = () => {
        const [time, setTime] = useState(new Date());
        useEffect(() => {
            const timer = setInterval(() => setTime(new Date()), 1000);
            return () => clearInterval(timer);
        }, []);
        return <p className="font-semibold">{time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
    }

    const registerDockIconRef = (id, el) => {
        dockIconRefs.current[id] = el;
    }

    const handleSignOut = () => {
        if (auth) {
            signOut(auth);
            setShowAdminPanel(false);
        }
    }

    if (showAdminPanel) {
        return user
            ? <AdminPanel data={data} onSignOut={handleSignOut} />
            : <AdminLogin onLogin={() => {}} />;
    }

    return (
        <div className="bg-gray-300 dark:bg-gray-900 min-h-screen font-sans transition-colors duration-300 overflow-hidden">
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-500 z-0"
                style={{ backgroundImage: `url(${wallpaper})` }}
            ></div>
            <div className="absolute inset-0 bg-black/10 dark:bg-black/30 z-0"></div>

            <header className="absolute top-0 z-40 h-10 bg-white/30 dark:bg-black/30 backdrop-blur-md flex items-center justify-between px-4 text-sm text-black/80 dark:text-white/80 rounded-b-lg">
                <div className="flex items-center gap-4">
                    <div className="font-bold">Vivek's Portfolio OS</div>
                    <button onClick={() => setShowAdminPanel(true)} className="font-semibold">Admin</button>
                    <button onClick={() => setShowWidgetPanel(p => !p)} className="font-semibold">Widgets</button>
                </div>
            </header>

            <main className="relative w-full h-screen flex items-center justify-center z-10">
                <div className="text-center text-white">
                    <motion.h1
                        className="text-7xl font-bold"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        {data.profile.name}
                    </motion.h1>
                    <motion.p
                        className="text-2xl mt-2 text-gray-300"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        {data.profile.title}
                    </motion.p>
                </div>
                <AnimatePresence>
                    {windows.filter(w => w.state !== 'minimized').map(w => (
                        <Window
                            key={w.id}
                            {...w}
                            onClose={() => closeWindow(w.id)}
                            onMinimize={() => minimizeWindow(w.id)}
                            onMaximize={() => maximizeWindow(w.id)}
                            onFocus={() => focusWindow(w.id)}
                        >
                            {renderWindowContent(w.id)}
                        </Window>
                    ))}
                </AnimatePresence>
                <AnimatePresence>
                    {widgets.map(widget => (
                        <Widget key={widget.id} id={widget.id} onRemove={removeWidget} initialPosition={widget.initialPosition}>
                            {widget.type === 'clock' && <ClockWidget />}
                            {widget.type === 'weather' && <WeatherWidget />}
                            {widget.type === 'notes' && <NotesWidget />}
                        </Widget>
                    ))}
                </AnimatePresence>
            </main>

            <Dock onIconClick={openWindow} registerDockIconRef={registerDockIconRef} />

            <div className="absolute top-2 right-4 z-50 flex items-center gap-4">
                <div className="text-black/80 dark:text-white/80"><Clock /></div>
                <motion.button
                    onClick={toggleTheme}
                    className="p-2 rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-sm"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={theme}
                            initial={{ opacity: 0, rotate: -90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: 90 }}
                            transition={{ duration: 0.2 }}
                        >
                            {theme === 'dark' ? <Icons.Sun className="w-5 h-5 text-yellow-400" /> : <Icons.Moon className="w-5 h-5 text-blue-800" />}
                        </motion.div>
                    </AnimatePresence>
                </motion.button>
            </div>

            <AnimatePresence>
                {showWidgetPanel && (
                    <motion.div
                        className="absolute top-12 left-4 z-50 bg-white/50 dark:bg-black/50 backdrop-blur-xl p-4 rounded-lg shadow-lg"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <h3 className="font-bold mb-2">Add a Widget</h3>
                        <div className="flex gap-4">
                            <button onClick={() => addWidget('clock')} className="p-2 bg-gray-200 dark:bg-gray-700 rounded-md">Clock</button>
                            <button onClick={() => addWidget('weather')} className="p-2 bg-gray-200 dark:bg-gray-700 rounded-md">Weather</button>
                            <button onClick={() => addWidget('notes')} className="p-2 bg-gray-200 dark:bg-gray-700 rounded-md">Notes</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
