'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export const useGuestSession = () => {
  const [guestId, setGuestId ] = useState<string | null>(null);

  useEffect(() => {
    const storedId = localStorage.getItem('guestId');
    if (storedId) setGuestId(storedId);
  }, []);

  const login = async (passcode: string) => {
    const { data: guest, error } = await supabase.from('guests').select('id').eq('passcode', passcode).single();
    if (!error && guest) {
      localStorage.setItem('guestId', guest.id);
      setGuestId(guest.id);
      await supabase.from('guests').update({ has_logged_in: true, last_login: new Date() }).eq('id', guest.id);
    }
    return { error };
  };

  const logout = () => {
    localStorage.removeItem('guestId');
    setGuestId(null);
  };

  return { guestId, login, logout };
};
