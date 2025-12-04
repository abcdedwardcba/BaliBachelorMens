import React, { useState, useEffect, useRef } from 'react';
import { 
  Plane, Calendar, CreditCard, 
  CheckSquare, MessageCircle, Plus, User, 
  ChevronRight, ChevronDown, Moon, Sun, Coffee, Beer,
  Home, ArrowRightLeft, Bike, Navigation, History,
  Edit2, X, DollarSign, LogOut, Lock, MapPin, Trash2,
  Copy, Save, ExternalLink, Clapperboard, Play, Clock
} from 'lucide-react';

// --- FIREBASE IMPORTS ---
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc
} from 'firebase/firestore';

// --- CONFIGURATION ---
const SYSTEM_APP_ID = "Bali_2026_Netflix_Final_Rev3";
const APP_NAME = "BALI BACHELOR"; 

// --- 🔥 这里的 Key 已经帮你填好了 (Bali Bachelor Mens) ---
const firebaseConfig = {
  apiKey: "AIzaSyD9_KvqbU-NlulRsb80wLmZiRJhbDemdFs",
  authDomain: "bali-bachelor-mens.firebaseapp.com",
  projectId: "bali-bachelor-mens",
  storageBucket: "bali-bachelor-mens.firebasestorage.app",
  messagingSenderId: "368365458482",
  appId: "1:368365458482:web:b59c5b6172a06820ec582b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- INITIAL DATA (Cloud Seed) ---
const DEFAULT_USERS = [
  { id: 'u1', name: 'Edward', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Edward' },
  { id: 'u2', name: 'Jayden', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jayden' },
  { id: 'u3', name: 'Eugene', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eugene' },
  { id: 'u4', name: 'Daniel', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Daniel' },
];

const DEFAULT_PACKING_ITEMS = [
  'Passport', 'Powerbank', 'Sunscreen', 'Condoms', 'Cash (IDR)', 'Sunglasses', 'Chargers'
];

const INITIAL_DATA = {
  config: {
    currencyRate: 3500,
    coverPhoto: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?q=80&w=1000&auto=format&fit=crop'
  },
  users: DEFAULT_USERS,
  flights: {
    outbound: { date: '07', month: 'JAN', flight: 'QZ551', route: 'KUL → DPS', time: '10:40 - 13:45', note: '7kg Hand Carry ONLY' },
    inbound: { date: '11', month: 'JAN', flight: 'QZ556', route: 'DPS → KUL', time: '15:55 - 19:10', note: '7kg Hand Carry ONLY' },
    bookings: { 'u1': '', 'u2': '', 'u3': '', 'u4': '' } 
  },
  stays: [
    { 
      id: 1, 
      name: 'The Villain Villa', 
      address: 'North Canggu, Bali', 
      link: 'https://www.airbnb.com', 
      image: 'https://a0.muscache.com/im/pictures/miso/Hosting-53280875/original/c412e622-4414-41d3-9528-7359556b63d6.jpeg?im_w=1200' 
    }
  ],
  schedule: [
    { 
      id: 'd1', day: 'WED', date: '07', month: 'JAN', title: 'THE ARRIVAL',
      activities: [
        { time: '13:45', title: 'Touchdown DPS', icon: 'plane' },
        { time: '15:00', title: 'Villa Check-in', icon: 'home' },
        { time: '17:00', title: 'Sunset @ Finns', icon: 'beer' },
        { time: '23:00', title: 'Villa Pre-game', icon: 'beer' }
      ]
    },
    { 
      id: 'd2', day: 'THU', date: '08', month: 'JAN', title: 'CHAOS IN CANGGU',
      activities: [
        { time: '11:00', title: 'Recovery Brunch', icon: 'coffee' },
        { time: '13:00', title: 'Motorbike Run', icon: 'bike' },
        { time: '22:00', title: 'Motel Mexicola', icon: 'beer' }
      ]
    },
    { 
      id: 'd3', day: 'FRI', date: '09', month: 'JAN', title: 'ULUWATU CLIFFS',
      activities: [
        { time: '13:00', title: 'Ride South', icon: 'bike' },
        { time: '16:00', title: 'Single Fin / Savaya', icon: 'beer' },
        { time: '21:00', title: 'Jimbaran Seafood', icon: 'food' }
      ]
    },
    { 
      id: 'd4', day: 'SAT', date: '10', month: 'JAN', title: 'THE FINALE',
      activities: [
        { time: '14:00', title: 'Beach Club Session', icon: 'beer' },
        { time: '22:00', title: 'ShiShi Nightclub', icon: 'fire' }
      ]
    },
    { 
      id: 'd5', day: 'SUN', date: '11', month: 'JAN', title: 'DEPARTURE',
      activities: [
        { time: '11:00', title: 'Check Out', icon: 'home' },
        { time: '13:30', title: 'Airport Transfer', icon: 'plane' }
      ]
    }
  ],
  expenses: [],
  bikes: [],
  packing: [],
  bucketList: [
    { id: 'b1', title: 'Shooting Range', image: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?auto=format&fit=crop&q=80&w=400', tags: ['Action'] },
    { id: 'b2', title: 'Surf Lesson', image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&q=80&w=400', tags: ['Beach', 'Sport'] },
    { id: 'b3', title: 'Sound Healing', image: 'https://images.unsplash.com/photo-1515023115689-589c33041d3c?auto=format&fit=crop&q=80&w=400', tags: ['Chill'] },
    { id: 'b4', title: 'ATV Adventure', image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?auto=format&fit=crop&q=80&w=400', tags: ['Action'] },
    { id: 'b5', title: 'Go-Karting', image: 'https://images.unsplash.com/photo-1574526033100-8800539169a3?auto=format&fit=crop&q=80&w=400', tags: ['Speed'] },
    { id: 'b6', title: 'Sunset Yoga', image: 'https://images.unsplash.com/photo-1599447421405-0c3072a73efd?auto=format&fit=crop&q=80&w=400', tags: ['Wellness'] },
  ]
};

// --- UTILS ---
const formatMYR = (amount) => new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(amount);

// 🔥 智能压缩：图片太大时自动缩小，防止 Firestore 报错
const compressAndUpload = (file, maxWidth = 400) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
    };
  });
};

// --- HOOKS ---
const useFirestore = (appId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // 1. Auth Setup (Anonymous)
  useEffect(() => {
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (error) {
        console.error("Auth Error: 记得去 Firebase 控制台开启 Anonymous Auth!", error);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // 2. Data Sync
  useEffect(() => {
    if (!user) return;
    
    // Path: artifacts -> {APP_ID} -> public -> data -> trip_data -> netflix_final_v1
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'trip_data', 'netflix_final_v1');
    
    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        const cloudData = snap.data();
        setData(cloudData.data || cloudData); 
      } else {
        // Seed Data if empty
        setDoc(docRef, INITIAL_DATA, { merge: true });
        setData(INITIAL_DATA);
      }
      setLoading(false);
    }, (err) => {
      console.error("Firestore Error: 记得检查 Rules 是否为 true", err);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [user, appId]);

  const updateStore = async (newData) => {
    if (!user) return;
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'trip_data', 'netflix_final_v1');
    setData(prev => ({ ...prev, ...newData })); // Optimistic UI
    await updateDoc(docRef, newData);
  };

  return { data, loading, user, updateStore };
};

// --- COMPONENTS ---

const NetflixCard = ({ children, className = "" }) => (
  <div className={`bg-[#181818] rounded-md border border-[#404040] overflow-hidden ${className}`}>
    {children}
  </div>
);

const DateBadge = ({ day, date, month }) => (
  <div className="flex flex-col items-center justify-center bg-[#E50914] text-white w-14 h-16 rounded shadow-lg shrink-0 leading-none">
    <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">{month}</span>
    <span className="text-2xl font-black">{date}</span>
    <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">{day}</span>
  </div>
);

const ImageUpload = ({ onUpload, className, children }) => {
  const ref = useRef(null);
  return (
    <button onClick={() => ref.current.click()} className={className}>
      <input type="file" ref={ref} className="hidden" accept="image/*" onChange={(e) => {
        if (e.target.files[0]) onUpload(e.target.files[0]);
      }} />
      {children}
    </button>
  );
};

// --- SCREENS ---

const UserSelectScreen = ({ users, onSelect, onUpdateUser }) => {
  const handlePhotoUpload = async (file, userId) => {
    // 头像压缩到 200px
    const base64 = await compressAndUpload(file, 200);
    const updatedUsers = users.map(u => u.id === userId ? { ...u, avatar: base64 } : u);
    onUpdateUser({ users: updatedUsers }); 
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 text-white animate-in fade-in duration-700">
      <h1 className="text-4xl font-medium mb-12 tracking-tight">Who's watching?</h1>
      
      <div className="grid grid-cols-2 gap-8 w-full max-w-sm">
        {users.map(u => (
          <div key={u.id} className="group relative flex flex-col items-center gap-2">
            <button 
              onClick={() => onSelect(u)}
              className="w-28 h-28 rounded-md overflow-hidden hover:ring-4 ring-white transition-all relative"
            >
              <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
            </button>
            <span className="text-gray-400 group-hover:text-white text-lg font-normal">{u.name}</span>
            
            {/* Edit Avatar */}
            <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <ImageUpload 
                 onUpload={(f) => handlePhotoUpload(f, u.id)}
                 className="p-1.5 bg-[#181818] rounded-full hover:bg-white hover:text-black text-white border border-gray-600 transition-colors"
               >
                 <Edit2 size={12} />
               </ImageUpload>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PlanTab = ({ data, updateStore }) => {
  const [expandedDay, setExpandedDay] = useState(null);

  const updateActivity = (dayId, idx, field, value) => {
    const newSchedule = data.schedule.map(d => {
      if (d.id !== dayId) return d;
      const newActs = [...d.activities];
      newActs[idx] = { ...newActs[idx], [field]: value };
      return { ...d, activities: newActs };
    });
    updateStore({ schedule: newSchedule });
  };

  const addActivity = (dayId) => {
    const newSchedule = data.schedule.map(d => {
      if (d.id !== dayId) return d;
      return { 
        ...d, 
        activities: [...d.activities, { time: '00:00', title: 'New Episode', icon: 'sun' }] 
      };
    });
    updateStore({ schedule: newSchedule });
  };

  const deleteActivity = (dayId, idx) => {
    const newSchedule = data.schedule.map(d => {
      if (d.id !== dayId) return d;
      const newActs = d.activities.filter((_, i) => i !== idx);
      return { ...d, activities: newActs };
    });
    updateStore({ schedule: newSchedule });
  };

  return (
    <div className="pb-24 space-y-4 px-4 pt-6">
      <h2 className="text-white text-xl font-bold mb-4">Itinerary</h2>
      {data.schedule.map((day) => {
        const isExpanded = expandedDay === day.id;
        return (
          <div key={day.id} className="group">
            <button 
              onClick={() => setExpandedDay(isExpanded ? null : day.id)}
              className={`w-full flex items-center gap-4 p-3 rounded-md transition-all ${isExpanded ? 'bg-[#2f2f2f]' : 'bg-[#181818] hover:bg-[#2f2f2f]'}`}
            >
              <DateBadge day={day.day} date={day.date} month={day.month} />
              <div className="text-left flex-1">
                <h3 className="text-white font-bold text-lg">{day.title}</h3>
                <p className="text-gray-400 text-xs uppercase tracking-wide">{day.activities.length} Episodes</p>
              </div>
              <ChevronDown className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </button>

            {isExpanded && (
              <div className="ml-14 mt-2 space-y-2 border-l-2 border-[#333] pl-4 animate-in slide-in-from-top-2">
                {day.activities.map((act, idx) => (
                  <div key={idx} className="flex items-center gap-3 py-2 group/act">
                    <input 
                      value={act.time}
                      onChange={(e) => updateActivity(day.id, idx, 'time', e.target.value)}
                      className="text-gray-500 text-xs font-mono min-w-[40px] bg-transparent focus:text-white focus:outline-none border-b border-transparent focus:border-[#555]"
                    />
                    <input 
                      value={act.title}
                      onChange={(e) => updateActivity(day.id, idx, 'title', e.target.value)}
                      className="text-gray-200 text-sm font-medium flex-1 bg-transparent focus:text-white focus:outline-none border-b border-transparent focus:border-[#555]"
                    />
                    <button 
                      onClick={() => deleteActivity(day.id, idx)}
                      className="opacity-0 group-hover/act:opacity-100 text-red-600 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <button 
                  onClick={() => addActivity(day.id)}
                  className="mt-2 text-[10px] text-gray-500 hover:text-white flex items-center gap-1 uppercase tracking-widest font-bold"
                >
                  <Plus size={12} /> Add Episode
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const BucketListTab = ({ data, updateStore }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedDayId, setSelectedDayId] = useState(data.schedule[0]?.id);
  const [selectedTime, setSelectedTime] = useState("12:00");

  const addItemToSchedule = () => {
    if (!selectedItem || !selectedDayId) return;
    
    const newSchedule = data.schedule.map(d => {
      if (d.id === selectedDayId) {
        return {
          ...d,
          activities: [...d.activities, { time: selectedTime, title: selectedItem.title, icon: 'fire' }]
        };
      }
      return d;
    });

    updateStore({ schedule: newSchedule });
    setModalOpen(false);
    setSelectedItem(null);
    alert(`Added ${selectedItem.title} to Itinerary!`);
  };

  const openModal = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handlePhotoUpload = async (file, itemId) => {
    const base64 = await compressAndUpload(file, 300);
    const newBucket = data.bucketList.map(b => b.id === itemId ? { ...b, image: base64 } : b);
    updateStore({ bucketList: newBucket });
  };

  const updateTitle = (id, val) => {
    const newBucket = data.bucketList.map(b => b.id === id ? { ...b, title: val } : b);
    updateStore({ bucketList: newBucket });
  };

  const addNewBucketItem = () => {
    const newItem = {
       id: Date.now(),
       title: 'New Activity',
       image: 'https://images.unsplash.com/photo-1540206395-688085723adb?auto=format&fit=crop&q=80&w=400',
       tags: ['New']
    };
    updateStore({ bucketList: [...(data.bucketList || []), newItem] });
  };

  const deleteBucketItem = (id) => {
    updateStore({ bucketList: data.bucketList.filter(b => b.id !== id) });
  };

  return (
    <div className="pb-24 px-4 pt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-white text-xl font-bold">Must Do in Bali</h2>
        <button onClick={addNewBucketItem} className="bg-[#333] text-white p-2 rounded-full hover:bg-[#444]">
          <Plus size={18} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {data.bucketList?.map((item) => (
          <div key={item.id} className="relative group bg-[#181818] rounded-md overflow-hidden border border-[#333] transition-all hover:scale-105 hover:border-gray-500 hover:z-10 shadow-lg">
             <div className="aspect-[2/3] relative">
               <img src={item.image} className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
               
               {/* Title Input */}
               <input 
                 value={item.title}
                 onChange={(e) => updateTitle(item.id, e.target.value)}
                 className="absolute bottom-10 left-2 right-2 bg-transparent text-white font-black text-lg focus:outline-none drop-shadow-md"
               />
               
               {/* Tags */}
               <div className="absolute bottom-14 left-2 flex gap-1">
                 {item.tags?.map(t => <span key={t} className="text-[9px] bg-red-600 text-white px-1 rounded font-bold">{t}</span>)}
               </div>

               {/* Add to Schedule Button */}
               <button 
                 onClick={() => openModal(item)}
                 className="absolute bottom-2 left-2 right-2 bg-white text-black py-1.5 rounded font-bold text-xs flex items-center justify-center gap-1 hover:bg-gray-200"
               >
                 <Plus size={12} /> Add to Schedule
               </button>

               {/* Controls (Edit Img / Delete) */}
               <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex flex-col gap-2 transition-opacity">
                  <ImageUpload onUpload={(f) => handlePhotoUpload(f, item.id)} className="bg-black/60 text-white p-1.5 rounded-full hover:bg-white hover:text-black">
                    <Edit2 size={12} />
                  </ImageUpload>
                  <button onClick={() => deleteBucketItem(item.id)} className="bg-black/60 text-red-500 p-1.5 rounded-full hover:bg-red-600 hover:text-white">
                    <Trash2 size={12} />
                  </button>
               </div>
             </div>
          </div>
        ))}
      </div>

      {/* ADD TO SCHEDULE MODAL */}
      {modalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#181818] border border-[#444] rounded-xl p-6 w-full max-w-sm shadow-2xl relative">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X /></button>
            <h3 className="text-white font-bold text-xl mb-1">Add "{selectedItem.title}"</h3>
            <p className="text-gray-400 text-xs mb-6">Choose when to add this episode.</p>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 font-bold uppercase block mb-1">Day</label>
                <select 
                  className="w-full bg-black border border-[#333] text-white p-3 rounded"
                  value={selectedDayId}
                  onChange={(e) => setSelectedDayId(e.target.value)}
                >
                  {data.schedule.map(d => (
                    <option key={d.id} value={d.id}>{d.day} - {d.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-500 font-bold uppercase block mb-1">Time</label>
                <div className="flex items-center gap-2 bg-black border border-[#333] p-3 rounded">
                  <Clock size={16} className="text-gray-500" />
                  <input 
                    type="time" 
                    className="bg-transparent text-white w-full focus:outline-none"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                  />
                </div>
              </div>

              <button 
                onClick={addItemToSchedule}
                className="w-full bg-[#E50914] text-white font-bold py-3 rounded mt-2 hover:bg-red-700 transition-colors"
              >
                Confirm & Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TravelTab = ({ data, updateStore, currentUser }) => {
  const myBooking = data.flights.bookings[currentUser.id] || '';
  
  const updateMyBooking = (val) => {
    updateStore({
      flights: {
        ...data.flights,
        bookings: { ...data.flights.bookings, [currentUser.id]: val }
      }
    });
  };

  const updateStay = (id, field, val) => {
    const newStays = data.stays.map(s => s.id === id ? { ...s, [field]: val } : s);
    updateStore({ stays: newStays });
  };

  const copyBooking = () => {
    navigator.clipboard.writeText(myBooking);
  };

  return (
    <div className="pb-24 px-4 pt-6 space-y-8">
      
      {/* Flight Section */}
      <section>
        <h2 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
          <Plane className="text-red-600" /> Flights
        </h2>
        
        {/* Outbound */}
        <NetflixCard className="mb-4">
          <div className="p-4 flex gap-4">
            <DateBadge day="WED" date={data.flights.outbound.date} month={data.flights.outbound.month} />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <span className="text-2xl font-black text-white">KUL</span>
                <ArrowRightLeft className="text-gray-500 mt-1" size={16} />
                <span className="text-2xl font-black text-white">DPS</span>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{data.flights.outbound.time.split('-')[0]}</span>
                <span>{data.flights.outbound.flight}</span>
                <span>{data.flights.outbound.time.split('-')[1]}</span>
              </div>
              <div className="mt-3 bg-red-900/30 text-red-500 text-[10px] font-bold px-2 py-1 rounded w-fit">
                {data.flights.outbound.note}
              </div>
            </div>
          </div>
        </NetflixCard>

        {/* Inbound */}
        <NetflixCard className="mb-6">
          <div className="p-4 flex gap-4">
            <DateBadge day="SUN" date={data.flights.inbound.date} month={data.flights.inbound.month} />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <span className="text-2xl font-black text-white">DPS</span>
                <ArrowRightLeft className="text-gray-500 mt-1" size={16} />
                <span className="text-2xl font-black text-white">KUL</span>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{data.flights.inbound.time.split('-')[0]}</span>
                <span>{data.flights.inbound.flight}</span>
                <span>{data.flights.inbound.time.split('-')[1]}</span>
              </div>
              <div className="mt-3 bg-red-900/30 text-red-500 text-[10px] font-bold px-2 py-1 rounded w-fit">
                {data.flights.inbound.note}
              </div>
            </div>
          </div>
        </NetflixCard>

        {/* Private Booking Input */}
        <div className="bg-[#181818] p-4 rounded-md border border-[#404040] relative">
           <label className="text-gray-400 text-xs font-bold uppercase block mb-2 flex items-center gap-2">
             <Lock size={10} /> My Booking Number (Private)
           </label>
           <div className="flex gap-2">
             <input 
               value={myBooking}
               onChange={(e) => updateMyBooking(e.target.value)}
               placeholder="Enter your Ref No."
               className="w-full bg-black border border-[#333] text-white p-3 rounded focus:outline-none focus:border-red-600 font-mono tracking-widest uppercase"
             />
             <button onClick={copyBooking} className="bg-[#333] text-white px-3 rounded hover:bg-[#444] transition-colors">
               <Copy size={16} />
             </button>
           </div>
        </div>
      </section>

      {/* Accommodation Section */}
      <section>
        <h2 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
          <Home className="text-red-600" /> Accommodation
        </h2>
        {data.stays.map(stay => (
          <div key={stay.id} className="relative rounded-md overflow-hidden group bg-[#181818]">
            <img src={stay.image} className="w-full h-48 object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
              <input 
                className="text-white font-bold text-lg bg-transparent border-none focus:outline-none w-full mb-1 placeholder-gray-500"
                value={stay.name}
                onChange={e => updateStay(stay.id, 'name', e.target.value)}
              />
              <input 
                className="text-gray-300 text-sm bg-transparent border-none focus:outline-none w-full placeholder-gray-500"
                value={stay.address}
                onChange={e => updateStay(stay.id, 'address', e.target.value)}
              />
              <a 
                href={stay.link} 
                target="_blank"
                className="inline-flex items-center gap-1 mt-2 bg-white text-black text-xs font-bold px-3 py-1.5 rounded hover:bg-gray-200"
              >
                View on Airbnb <ExternalLink size={10} />
              </a>
            </div>
          </div>
        ))}
      </section>

    </div>
  );
};

const ExpensesTab = ({ data, updateStore, currentUser }) => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('IDR');
  const [desc, setDesc] = useState('');
  const [viewHistory, setViewHistory] = useState(false);
  const [editingId, setEditingId] = useState(null); 

  // Temp state for editing
  const [editDesc, setEditDesc] = useState('');
  const [editAmount, setEditAmount] = useState('');

  // Filter: Only show current user expenses
  const myExpenses = (data.expenses || []).filter(e => e.userId === currentUser.id);
  const totalMYR = myExpenses.reduce((acc, curr) => {
    const val = curr.currency === 'IDR' ? curr.amount / data.config.currencyRate : parseFloat(curr.amount);
    return acc + val;
  }, 0);

  const handleAdd = async () => {
    if (!amount || !desc) return;
    const newExp = {
      id: Date.now(),
      userId: currentUser.id, 
      desc,
      amount: parseFloat(amount),
      currency,
      date: new Date().toISOString()
    };
    await updateStore({ expenses: [newExp, ...data.expenses] });
    setAmount('');
    setDesc('');
  };

  const handleDelete = async (id) => {
    const remaining = data.expenses.filter(e => e.id !== id);
    await updateStore({ expenses: remaining });
  };

  const startEdit = (e) => {
    setEditingId(e.id);
    setEditDesc(e.desc);
    setEditAmount(e.amount);
  };

  const saveEdit = async (id) => {
    const updatedExpenses = data.expenses.map(e => {
      if (e.id === id) {
        return { ...e, desc: editDesc, amount: parseFloat(editAmount) };
      }
      return e;
    });
    await updateStore({ expenses: updatedExpenses });
    setEditingId(null);
  };

  return (
    <div className="pb-24 px-4 pt-6 min-h-[80vh] flex flex-col">
       <h2 className="text-white text-xl font-bold mb-6">My Expenses</h2>

       {/* Total Card */}
       <div className="bg-gradient-to-br from-[#E50914] to-red-900 p-6 rounded-xl shadow-2xl mb-8 text-center relative overflow-hidden">
          <p className="text-red-200 text-xs font-bold tracking-widest uppercase mb-1">Total Spent</p>
          <h1 className="text-5xl font-black text-white tracking-tighter">
            {formatMYR(totalMYR).replace('RM', '')}<span className="text-lg opacity-50 font-medium">MYR</span>
          </h1>
          <button 
            onClick={() => setViewHistory(!viewHistory)}
            className="mt-4 text-xs font-bold bg-black/20 hover:bg-black/40 text-white px-4 py-2 rounded-full transition-colors flex items-center gap-2 mx-auto"
          >
            <History size={12} /> {viewHistory ? 'Hide History' : 'View History'}
          </button>
       </div>

       {/* Input Area */}
       {!viewHistory && (
         <div className="bg-[#181818] p-5 rounded-xl border border-[#333] space-y-4">
            <input 
              className="w-full bg-transparent text-white text-lg font-medium border-b border-[#333] pb-2 focus:outline-none focus:border-red-600 placeholder-gray-600"
              placeholder="What did you buy?"
              value={desc}
              onChange={e => setDesc(e.target.value)}
            />
            <div className="flex gap-3">
              <div className="relative flex-1">
                  <input 
                    type="number"
                    className="w-full bg-black rounded-lg p-3 text-white font-mono font-bold focus:outline-none border border-[#333]"
                    placeholder="0.00"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                  />
              </div>
              <select 
                className="bg-[#333] text-white rounded-lg px-4 font-bold text-sm focus:outline-none"
                value={currency}
                onChange={e => setCurrency(e.target.value)}
              >
                <option value="IDR">IDR</option>
                <option value="MYR">MYR</option>
              </select>
            </div>
            <button 
             onClick={handleAdd}
             className="w-full py-3 rounded-lg bg-white text-black font-bold hover:bg-gray-200 transition-colors"
            >
              Add Expense
            </button>
            <p className="text-[10px] text-gray-500 text-center mt-2 flex items-center justify-center gap-1">
              <Lock size={8} /> Only visible to you
            </p>
         </div>
       )}

       {/* History List */}
       {viewHistory && (
         <div className="space-y-2 animate-in slide-in-from-bottom-4">
           {myExpenses.map(e => (
             <div key={e.id} className="bg-[#181818] p-3 rounded-lg border border-[#333] flex justify-between items-center group">
                {editingId === e.id ? (
                  /* Edit Mode */
                  <div className="flex-1 flex gap-2 items-center">
                    <div className="flex-1 space-y-1">
                        <input 
                          value={editDesc} 
                          onChange={evt => setEditDesc(evt.target.value)}
                          className="w-full bg-black text-white text-sm px-2 py-1 rounded border border-[#444]"
                        />
                        <input 
                          type="number"
                          value={editAmount} 
                          onChange={evt => setEditAmount(evt.target.value)}
                          className="w-full bg-black text-white text-xs px-2 py-1 rounded border border-[#444]"
                        />
                    </div>
                    <button onClick={() => saveEdit(e.id)} className="p-2 bg-green-600 rounded text-white"><Save size={14}/></button>
                    <button onClick={() => setEditingId(null)} className="p-2 bg-gray-600 rounded text-white"><X size={14}/></button>
                  </div>
                ) : (
                  /* View Mode */
                  <>
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">{e.desc}</p>
                      <p className="text-gray-500 text-[10px]">{new Date(e.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-red-500 font-mono font-bold">{e.currency} {e.amount}</span>
                      <button onClick={() => startEdit(e)} className="text-gray-600 hover:text-white">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(e.id)} className="text-gray-600 hover:text-red-500">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </>
                )}
             </div>
           ))}
           {myExpenses.length === 0 && (
             <p className="text-gray-600 text-center py-4">No records yet.</p>
           )}
         </div>
       )}
    </div>
  );
};

const BikesTab = ({ data, updateStore, currentUser }) => {
  const [loadingLoc, setLoadingLoc] = useState(false);

  // Filter: Only show bikes owned by current user
  const myBikes = (data.bikes || []).filter(b => b.userId === currentUser.id);

  const addBike = () => {
    const newBike = { id: Date.now(), userId: currentUser.id, plate: 'ENTER PLATE', image: null, mapLink: null };
    updateStore({ bikes: [...data.bikes, newBike] });
  };

  const updateBike = (id, field, val) => {
    const updated = data.bikes.map(b => b.id === id ? { ...b, [field]: val } : b);
    updateStore({ bikes: updated });
  };

  const handleBikePhoto = async (file, id) => {
    const base64 = await compressAndUpload(file, 400);
    updateBike(id, 'image', base64);
  };

  const handlePark = async (id) => {
    setLoadingLoc(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const link = `https://www.google.com/maps/search/?api=1&query=${pos.coords.latitude},${pos.coords.longitude}`;
        updateBike(id, 'mapLink', link);
        updateBike(id, 'parkedAt', new Date().toISOString());
        setLoadingLoc(false);
      }, () => {
        alert("GPS Failed. Please check permissions.");
        setLoadingLoc(false);
      });
    } else {
        alert("Geolocation not supported");
        setLoadingLoc(false);
    }
  };

  const deleteBike = (id) => {
    updateStore({ bikes: data.bikes.filter(b => b.id !== id) });
  };

  return (
    <div className="pb-24 px-4 pt-6">
      <h2 className="text-white text-xl font-bold mb-6">My Bike Rental</h2>
      
      {myBikes.length === 0 ? (
        <div className="text-center py-10 bg-[#181818] rounded-xl border border-dashed border-[#404040]">
           <Bike size={48} className="text-[#333] mx-auto mb-4" />
           <p className="text-gray-500 text-sm mb-4">You haven't rented a bike yet.</p>
           <button onClick={addBike} className="bg-white text-black px-6 py-2 rounded font-bold text-sm">
             Add Bike
           </button>
        </div>
      ) : (
        <div className="space-y-6">
          {myBikes.map(bike => (
            <div key={bike.id} className="bg-[#181818] rounded-xl overflow-hidden border border-[#333]">
               {/* Image Area */}
               <div className="h-48 bg-[#111] relative group">
                 {bike.image ? (
                   <img src={bike.image} className="w-full h-full object-cover" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-[#333]"><Bike size={40}/></div>
                 )}
                 <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <ImageUpload onUpload={(f) => handleBikePhoto(f, bike.id)} className="bg-white text-black px-3 py-1.5 rounded text-xs font-bold">
                      Change Photo
                    </ImageUpload>
                 </div>
                 <button onClick={() => deleteBike(bike.id)} className="absolute top-2 right-2 bg-black/50 p-1 rounded-full text-red-500"><X size={14}/></button>
               </div>

               {/* Controls */}
               <div className="p-4 space-y-4">
                 <div>
                   <label className="text-xs text-gray-500 uppercase font-bold">License Plate</label>
                   <input 
                     className="w-full bg-transparent text-2xl font-black text-white focus:outline-none uppercase"
                     value={bike.plate}
                     onChange={e => updateBike(bike.id, 'plate', e.target.value)}
                   />
                 </div>

                 <div className="grid grid-cols-2 gap-3">
                   <button 
                    onClick={() => handlePark(bike.id)}
                    className="bg-[#E50914] hover:bg-red-700 text-white py-3 rounded-md font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                   >
                     {loadingLoc ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <MapPin size={16} />}
                     Park Here
                   </button>
                   {bike.mapLink ? (
                     <a href={bike.mapLink} target="_blank" className="bg-[#333] hover:bg-[#444] text-white py-3 rounded-md font-bold text-sm flex items-center justify-center gap-2 transition-colors">
                       <Navigation size={16} /> Locate
                     </a>
                   ) : (
                     <div className="bg-[#222] text-gray-600 py-3 rounded-md font-bold text-sm flex items-center justify-center">No Location</div>
                   )}
                 </div>
                 {bike.parkedAt && <p className="text-[10px] text-gray-500 text-center">Last parked: {new Date(bike.parkedAt).toLocaleTimeString()}</p>}
               </div>
            </div>
          ))}
          <button onClick={addBike} className="w-full py-3 border border-dashed border-[#333] text-gray-500 hover:text-white hover:border-gray-500 rounded-lg text-sm transition-colors">
            + Add Another Bike
          </button>
        </div>
      )}
    </div>
  );
};

const PackTab = ({ data, updateStore, currentUser }) => {
  // Initialize user list if not exists (Lazy init)
  const myItems = (data.packing || []).filter(i => i.userId === currentUser.id);

  // One-time init for new users
  useEffect(() => {
    // Only init if the user has NO items yet
    if (data && myItems.length === 0) {
      const initialItems = DEFAULT_PACKING_ITEMS.map(item => ({
        id: Date.now() + Math.random(),
        userId: currentUser.id,
        item: item,
        checked: false
      }));
      // Merge with existing
      updateStore({ packing: [...(data.packing || []), ...initialItems] });
    }
  }, [data, currentUser.id]); 

  const toggleCheck = (id) => {
    const updated = data.packing.map(i => i.id === id ? { ...i, checked: !i.checked } : i);
    updateStore({ packing: updated });
  };

  const deleteItem = (id) => {
    const updated = data.packing.filter(i => i.id !== id);
    updateStore({ packing: updated });
  };

  const [newItem, setNewItem] = useState('');
  const addItem = () => {
    if (!newItem) return;
    const item = {
      id: Date.now(),
      userId: currentUser.id,
      item: newItem,
      checked: false
    };
    updateStore({ packing: [...(data.packing || []), item] });
    setNewItem('');
  };

  const progress = myItems.length > 0 
    ? Math.round((myItems.filter(i => i.checked).length / myItems.length) * 100) 
    : 0;

  return (
    <div className="pb-24 px-4 pt-6">
      <h2 className="text-white text-xl font-bold mb-4">Packing List</h2>
      
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>{progress}% Ready</span>
          <span>{myItems.filter(i => i.checked).length}/{myItems.length}</span>
        </div>
        <div className="h-1.5 bg-[#333] rounded-full overflow-hidden">
          <div className="h-full bg-[#E50914] transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {/* List */}
      <div className="space-y-1 mb-4">
        {myItems.map(item => (
          <div 
            key={item.id} 
            onClick={() => toggleCheck(item.id)}
            className={`p-3 rounded-md flex items-center gap-3 cursor-pointer group transition-colors ${item.checked ? 'bg-[#111]' : 'bg-[#181818] hover:bg-[#222]'}`}
          >
            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${item.checked ? 'bg-[#E50914] border-[#E50914]' : 'border-gray-500'}`}>
              {item.checked && <CheckSquare size={12} className="text-white" />}
            </div>
            <span className={`flex-1 text-sm font-medium ${item.checked ? 'text-gray-600 line-through' : 'text-gray-200'}`}>
              {item.item}
            </span>
            <button 
              onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }}
              className="text-[#333] group-hover:text-red-500 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Add Input */}
      <div className="flex gap-2">
        <input 
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
          placeholder="Add item..."
          className="flex-1 bg-[#181818] border border-[#333] rounded px-3 text-sm text-white focus:outline-none focus:border-gray-500"
        />
        <button onClick={addItem} className="bg-white text-black p-2 rounded hover:bg-gray-200">
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
};

const FloatingAgent = () => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="fixed bottom-24 right-4 z-40 flex flex-col items-end">
      {expanded && (
        <a 
          href="https://wa.me/+601165090611"
          target="_blank"
          className="bg-[#25D366] text-white px-4 py-2 rounded-full shadow-lg mb-2 font-bold flex items-center gap-2 animate-in slide-in-from-right-10"
        >
          <MessageCircle size={18} /> Chat Live Agent
        </a>
      )}
      <button 
        onClick={() => setExpanded(!expanded)}
        className="bg-[#181818] text-white p-3 rounded-full shadow-xl border border-[#333] hover:scale-110 transition-transform"
      >
        {expanded ? <X size={20} /> : <div className="flex items-center gap-1 font-bold text-xs"><ChevronDown className="rotate-90" size={16} /> HELP</div>}
      </button>
    </div>
  );
};

// --- APP ROOT ---

const App = () => {
  const { data, loading, user, updateStore } = useFirestore(SYSTEM_APP_ID);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('plan');

  if (loading || !data) return (
    <div className="h-screen w-full bg-black flex flex-col items-center justify-center text-[#E50914]">
       <div className="text-4xl font-black tracking-tighter animate-pulse">NETFLIX</div>
       <div className="text-[10px] text-gray-500 mt-4 font-mono">LOADING TRIP DATA...</div>
    </div>
  );

  if (!currentUser) {
    return (
      <UserSelectScreen 
        users={data.users} 
        onSelect={setCurrentUser} 
        onUpdateUser={(newUsers) => updateStore({ users: newUsers })} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-black font-sans max-w-md mx-auto relative shadow-2xl overflow-hidden border-x border-[#1a1a1a] text-gray-200 selection:bg-red-900 selection:text-white">
      
      {/* HERO */}
      <div className="relative h-[45vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black z-10"></div>
        <img src={data.config.coverPhoto} className="w-full h-full object-cover animate-in fade-in zoom-in duration-1000" />
        
        {/* Navbar overlay */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20">
           <div className="text-[#E50914] text-xl font-black tracking-tighter">N</div>
           <button onClick={() => setCurrentUser(null)} className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
              <img src={currentUser.avatar} className="w-6 h-6 rounded mr-1" />
              <LogOut size={16} />
           </button>
        </div>

        {/* Title Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20 pb-12">
           <div className="flex items-center gap-2 mb-2">
             <span className="text-[#E50914] text-[10px] font-black border border-[#E50914] px-1 rounded-sm">SERIES</span>
             <span className="text-gray-300 text-[10px] font-bold tracking-widest uppercase">2026</span>
           </div>
           <h1 className="text-5xl font-black text-white leading-none mb-2 tracking-tighter">{APP_NAME}</h1>
           <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Casting by: Edward · Jayden · Eugene · Daniel</p>
           <p className="text-sm text-gray-300 font-medium">What happens in Bali, stays in Bali.</p>
           
           {/* Actions */}
           <div className="flex gap-3 mt-4">
              <button onClick={() => setActiveTab('plan')} className="bg-white text-black px-4 py-2 rounded font-bold text-sm flex items-center gap-2 hover:bg-gray-200">
                <Calendar size={16} fill="black" /> Episodes
              </button>
              <button onClick={() => setActiveTab('pack')} className="bg-[#333]/80 backdrop-blur text-white px-4 py-2 rounded font-bold text-sm flex items-center gap-2 hover:bg-[#444]">
                <CheckSquare size={16} /> My List
              </button>
           </div>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="-mt-6 relative z-30 bg-black min-h-[50vh]">
        {activeTab === 'plan' && <PlanTab data={data} updateStore={updateStore} />}
        {activeTab === 'travel' && <TravelTab data={data} updateStore={updateStore} currentUser={currentUser} />}
        {activeTab === 'expenses' && <ExpensesTab data={data} updateStore={updateStore} currentUser={currentUser} />}
        {activeTab === 'bikes' && <BikesTab data={data} updateStore={updateStore} currentUser={currentUser} />}
        {activeTab === 'bucket' && <BucketListTab data={data} updateStore={updateStore} />}
        {activeTab === 'pack' && <PackTab data={data} updateStore={updateStore} currentUser={currentUser} />}
      </div>

      <FloatingAgent />

      {/* NAV BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#121212]/95 backdrop-blur border-t border-[#333] px-4 py-3 flex justify-between items-center z-50 max-w-md mx-auto">
        <NavBtn icon={Calendar} label="Home" active={activeTab === 'plan'} onClick={() => setActiveTab('plan')} />
        <NavBtn icon={Plane} label="Travel" active={activeTab === 'travel'} onClick={() => setActiveTab('travel')} />
        <NavBtn icon={DollarSign} label="$$$" active={activeTab === 'expenses'} onClick={() => setActiveTab('expenses')} />
        <NavBtn icon={Bike} label="Bikes" active={activeTab === 'bikes'} onClick={() => setActiveTab('bikes')} />
        <NavBtn icon={Clapperboard} label="Must Do" active={activeTab === 'bucket'} onClick={() => setActiveTab('bucket')} />
      </div>
    </div>
  );
};

const NavBtn = ({ icon: Icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-white' : 'text-[#555] hover:text-[#888]'}`}>
    <Icon size={20} strokeWidth={active ? 3 : 2} />
    <span className="text-[9px] font-medium">{label}</span>
  </button>
);

export default App;
