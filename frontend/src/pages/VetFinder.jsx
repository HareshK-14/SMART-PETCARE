import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Star, MapPin, Clock, Phone, CheckCircle, Filter, Calendar, Award, Users } from 'lucide-react';

const DEMO_VETS = [
  {
    id: 1, name: "Dr. Priya Sharma", specialty: "Small Animal & Surgery",
    clinic: "PawCare Veterinary Clinic", location: "Koramangala, Bangalore",
    rating: 4.9, reviews: 312, exp: "12 yrs", fee: 600, available: true,
    nextSlot: "Today, 3:00 PM",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face",
    tags: ["Dogs", "Cats", "Surgery", "Dental"],
  },
  {
    id: 2, name: "Dr. Arjun Mehta", specialty: "Exotic Animals & Birds",
    clinic: "WildCare Pet Hospital", location: "Indiranagar, Bangalore",
    rating: 4.8, reviews: 198, exp: "9 yrs", fee: 800, available: true,
    nextSlot: "Today, 5:30 PM",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face",
    tags: ["Birds", "Reptiles", "Rabbits", "Hamsters"],
  },
  {
    id: 3, name: "Dr. Sneha Agarwal", specialty: "Dermatology & Nutrition",
    clinic: "HealthyPaws Clinic", location: "HSR Layout, Bangalore",
    rating: 4.7, reviews: 145, exp: "7 yrs", fee: 550, available: false,
    nextSlot: "Tomorrow, 10:00 AM",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop&crop=face",
    tags: ["Skin", "Allergies", "Nutrition", "Dogs"],
  },
  {
    id: 4, name: "Dr. Karthik Nair", specialty: "Orthopedics & Rehabilitation",
    clinic: "BoneCare Animal Hospital", location: "Whitefield, Bangalore",
    rating: 4.9, reviews: 421, exp: "15 yrs", fee: 900, available: true,
    nextSlot: "Today, 4:00 PM",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&h=200&fit=crop&crop=face",
    tags: ["Orthopedics", "Rehab", "Dogs", "Cats"],
  },
  {
    id: 5, name: "Dr. Meera Pillai", specialty: "Oncology & Internal Medicine",
    clinic: "VetCare Specialty Hospital", location: "Jayanagar, Bangalore",
    rating: 4.8, reviews: 267, exp: "11 yrs", fee: 1000, available: true,
    nextSlot: "Tomorrow, 9:30 AM",
    image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=200&h=200&fit=crop&crop=face",
    tags: ["Cancer Care", "Internal Medicine", "All Pets"],
  },
  {
    id: 6, name: "Dr. Rahul Verma", specialty: "General Practice & Vaccination",
    clinic: "CityVet Clinic", location: "Electronic City, Bangalore",
    rating: 4.6, reviews: 189, exp: "6 yrs", fee: 400, available: false,
    nextSlot: "Tomorrow, 11:00 AM",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop&crop=face",
    tags: ["Vaccination", "Deworming", "Puppies", "Kittens"],
  },
];

const specialties = ['All', 'Small Animal & Surgery', 'Exotic Animals & Birds', 'Dermatology & Nutrition', 'Orthopedics & Rehabilitation', 'Oncology & Internal Medicine', 'General Practice & Vaccination'];

const VetFinder = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [booked, setBooked] = useState(null);
  const [allVets, setAllVets] = useState(DEMO_VETS);

  // Merge approved vets from localStorage with demo list
  useEffect(() => {
    const localVets = JSON.parse(localStorage.getItem('pendingVets') || '[]');
    const approved = localVets
      .filter(v => v.status === 'approved')
      .map(v => ({
        id: v.id,
        name: v.name,
        specialty: v.specialization || 'General Practice',
        clinic: v.clinic || 'Private Clinic',
        location: v.location || 'India',
        rating: v.rating || 4.5,
        reviews: v.reviews || 0,
        exp: v.experience ? `${v.experience} yrs` : '—',
        fee: v.fee || 500,
        available: true,
        nextSlot: 'Today — contact to confirm',
        image: v.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(v.name)}&background=6366f1&color=fff&size=200`,
        tags: [v.specialization || 'General Practice'],
        fromRegistry: true,
      }));
    setAllVets([...DEMO_VETS, ...approved]);
  }, []);
  const filtered = allVets.filter(v => {
    const matchName = v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.location.toLowerCase().includes(search.toLowerCase()) ||
      v.clinic.toLowerCase().includes(search.toLowerCase());
    const matchSpec = filter === 'All' || v.specialty === filter;
    return matchName && matchSpec;
  });

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero */}
      <div className="relative bg-gradient-to-br from-teal-900 via-teal-800 to-indigo-900 pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <img src="https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=1600&h=400&fit=crop" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <span className="inline-block bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            🩺 500+ Verified Veterinarians
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight">
            Find a <span className="text-teal-300">Veterinarian</span>
          </h1>
          <p className="text-teal-100 mb-8 text-lg">Book appointments with top-rated vets near you — instantly confirmed</p>

          {/* Search */}
          <div className="flex items-center bg-white rounded-2xl overflow-hidden shadow-2xl">
            <div className="pl-5"><Search className="text-slate-400 w-5 h-5" /></div>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by vet name, clinic, or location..."
              className="flex-1 py-4 px-4 outline-none text-slate-800 placeholder-slate-400 bg-transparent text-base"
            />
            <button className="bg-gradient-to-r from-teal-500 to-indigo-500 text-white px-8 py-4 font-bold hover:opacity-90 transition-opacity">
              Search
            </button>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-8 mt-8 text-sm text-teal-200">
            {[
              { icon: <Award className="w-4 h-4 text-amber-400" />, text: "All vets board-certified" },
              { icon: <Clock className="w-4 h-4 text-teal-400" />, text: "Available today" },
              { icon: <Users className="w-4 h-4 text-indigo-300" />, text: "48,000+ happy owners" },
            ].map((s, i) => (
              <span key={i} className="flex items-center gap-1.5">{s.icon}{s.text}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Specialty filter */}
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-500">Specialty:</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-8">
          {specialties.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${filter === s ? 'bg-teal-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:border-teal-300'
                }`}>
              {s}
            </button>
          ))}
        </div>

        <p className="text-sm text-slate-400 mb-6">{filtered.length} veterinarians found</p>

        {/* Vet cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((vet, idx) => (
            <motion.div
              key={vet.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all overflow-hidden group"
            >
              {/* Clinic hero image */}
              <div className="relative h-36 bg-gradient-to-br from-teal-100 to-indigo-100 overflow-hidden">
                <img
                  src={`https://images.unsplash.com/photo-${['1628009368231-7bb7cfcb0def', '1583337130417-3346a1be7dee', '1574158622682-e6f8a1e9e7f8', '1548199973-03cce0bbc87b', '1601758228041-f3b2795255f1', '1587300003388-59208cc962cb'][idx % 6]}?w=600&h=200&fit=crop`}
                  alt="clinic"
                  className="w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-500"
                />
                <div className="absolute bottom-3 left-4 flex items-center gap-1 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-semibold text-slate-700">
                  <MapPin className="w-3 h-3 text-teal-600" /> {vet.location}
                </div>
                {/* Available badge */}
                <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold ${vet.available ? 'bg-teal-500 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                  {vet.available ? '● Available Now' : '○ Not Available'}
                </div>
              </div>

              <div className="p-5">
                {/* Vet info */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative flex-shrink-0">
                    <img src={vet.image} alt={vet.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md" />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white fill-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">{vet.name}</h3>
                    <p className="text-teal-600 font-semibold text-xs">{vet.specialty}</p>
                    <p className="text-slate-500 text-xs">{vet.clinic}</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {vet.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-full">{tag}</span>
                  ))}
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-4 text-sm mb-4 pb-4 border-b border-slate-100">
                  <span className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-current" /> {vet.rating}
                    <span className="text-slate-400 font-normal">({vet.reviews})</span>
                  </span>
                  <span className="text-slate-500 text-xs">{vet.exp} experience</span>
                  <span className="ml-auto font-bold text-indigo-700">₹{vet.fee}</span>
                </div>

                {/* Next slot */}
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                  <Clock className="w-4 h-4 text-teal-500" />
                  <span>Next slot: <span className="font-semibold text-slate-700">{vet.nextSlot}</span></span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-gradient-to-r from-teal-500 to-indigo-500 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-teal-500/30 hover:-translate-y-0.5 transition-all"
                    onClick={() => setBooked(vet.id)}>
                    <Calendar className="w-4 h-4" />
                    {booked === vet.id ? '✅ Booked!' : 'Book Appointment'}
                  </button>
                  <a href={`tel:+91${Math.floor(Math.random() * 9000000000 + 1000000000)}`}
                    className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:border-teal-400 hover:text-teal-600 transition-all">
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-xl font-semibold text-slate-600">No vets found</p>
            <p className="text-slate-400 mt-2">Try a different name or location</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VetFinder;
