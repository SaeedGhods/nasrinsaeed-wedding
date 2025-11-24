'use client';

import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

type FormData = { passcode: string };

export const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    // Verify passcode against Supabase DB
    const { data: guest, error } = await supabase
      .from('guests')
      .select('*')
      .eq('passcode', data.passcode)
      .single();

    if (error || !guest) {
      alert('Invalid passcode');
      return;
    }

    // Set session (stub for now)
    // await supabase.auth.signInWithPassword({ ... }); // To be implemented with custom auth

    router.push('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto">
      <h1 className="text-3xl font-playfair text-center">Welcome to Saeed & Nasrin's Wedding</h1>
      <input
        {...register('passcode', { required: true })}
        placeholder="Enter your passcode (e.g., Dalir8472)"
        className="w-full p-2 border rounded"
      />
      {errors.passcode && <p className="text-red-500">Passcode is required</p>}
      <button type="submit" className="w-full bg-gold-500 text-white p-2 rounded">Log In</button>
    </form>
  );
};

