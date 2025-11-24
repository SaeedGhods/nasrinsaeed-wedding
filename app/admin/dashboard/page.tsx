'use client';

import { supabase } from '../../../lib/supabase';
import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { sendInvitation } from '../../../lib/sendEmail';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ attending: 0, declined: 0, pending: 0, totalGuests: 0 });
  const [csvFile, setCsvFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const { data: guests } = await supabase.from('guests').select('id');
      const { data: rsvps } = await supabase.from('rsvps').select('attending');

      const attending = rsvps?.filter(r => r.attending === 'yes').length || 0;
      const declined = rsvps?.filter(r => r.attending === 'no').length || 0;
      const pending = (guests?.length || 0) - (attending + declined);

      setStats({ attending, declined, pending, totalGuests: guests?.length || 0 });
    };

    fetchStats();
  }, []);

  const handleImport = async () => {
    if (!csvFile) return;

    Papa.parse(csvFile, {
      header: true,
      complete: async (results) => {
        const guestsToInsert = results.data.map((row: any) => ({
          last_name: row.LastName,
          party_size: parseInt(row.PartySize) || 1,
          passcode: row.LastName + Math.floor(1000 + Math.random() * 9000),
          email: row.Email,
          first_name: row.FirstName,
        }));

        const { error } = await supabase.from('guests').insert(guestsToInsert);

        if (error) {
          alert('Import error: ' + error.message);
        } else {
          alert('Imported ' + guestsToInsert.length + ' guests!');
          // Send emails
          guestsToInsert.forEach(async (guest) => {
            if (guest.email) {
              await sendInvitation(guest.email, guest.passcode, guest.first_name || guest.last_name);
            }
          });
        }
      },
    });
  };

  const exportCSV = async () => {
    const { data: rsvps } = await supabase.from('rsvps').select('*');
    const csv = Papa.unparse(rsvps);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rsvps.csv';
    a.click();
  };

  return (
    <main className="p-8">
      <h1 className="text-4xl font-playfair text-gold-500">Admin Dashboard</h1>
      <div className="grid grid-cols-4 gap-4 my-8">
        <div className="p-4 bg-blush-100 rounded">Attending: {stats.attending}</div>
        <div className="p-4 bg-blush-100 rounded">Declined: {stats.declined}</div>
        <div className="p-4 bg-blush-100 rounded">Pending: {stats.pending}</div>
        <div className="p-4 bg-blush-100 rounded">Total Guests: {stats.totalGuests}</div>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-playfair">Import Guests from CSV</h2>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
          className="block"
        />
        <button onClick={handleImport} className="px-4 py-2 bg-gold-500 text-white rounded">Import</button>
      </div>
      <button onClick={exportCSV} className="mt-4 px-4 py-2 bg-gold-500 text-white rounded">Export RSVPs to CSV</button>
    </main>
  );
}
