'use client';
'use client';

import { motion } from 'framer-motion';
import { RSVPForm } from '../components/RSVPForm';
import { useGuestSession } from '../hooks/useGuestSession';

export default function Dashboard() {
  const { guestId } = useGuestSession();

  return (
    <main className="min-h-screen">
      <section className="relative h-96 bg-cover bg-center" style={{ backgroundImage: 'url(/hero-walking.jpg)' }}>
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-white text-center"
        >
          <h1 className="text-5xl font-playfair">Saeed & Nasrin</h1>
          <p className="text-2xl">March 21, 2026 • 4:00 PM</p>
          <p>Four Seasons Hotel Toronto</p>
        </motion.div>
      </section>
      <RSVPForm guestId={guestId || 'test'} />
      <img src="/hero-running.jpg" alt="Saeed & Nasrin" className="mt-8 max-w-full" />
    </main>
  );
}
