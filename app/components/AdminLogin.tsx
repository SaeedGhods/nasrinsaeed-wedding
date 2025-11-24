'use client';

import { useForm } from 'react-hook-form';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

type FormData = { email: string; password: string };

export const AdminLogin = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
      alert('Login failed: ' + error.message);
      return;
    }
    router.push('/admin/dashboard');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-8 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <h1 className="text-3xl font-playfair text-center text-gold-500">Admin Login</h1>
      <input
        type="email"
        {...register('email', { required: true })}
        placeholder="Email"
        className="w-full p-3 border rounded"
      />
      {errors.email && <p className="text-red-500 text-sm">Email required</p>}
      <input
        type="password"
        {...register('password', { required: true })}
        placeholder="Password"
        className="w-full p-3 border rounded"
      />
      {errors.password && <p className="text-red-500 text-sm">Password required</p>}
      <button type="submit" className="w-full p-3 bg-gold-500 text-white rounded hover:bg-gold-600">Log In</button>
    </form>
  );
};
