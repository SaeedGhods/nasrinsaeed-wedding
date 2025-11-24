'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';

type FormData = {
  attending: 'yes' | 'no' | 'maybe';
  partySize: number;
  guests: { name: string; meal: string }[];
  dietary: string;
  message: string;
};

export const RSVPForm = ({ guestId }: { guestId: string }) => {
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: { partySize: 1, guests: [{ name: '', meal: '' }] },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'guests' });
  const [submitted, setSubmitted] = useState(false);

  const partySize = watch('partySize');

  const adjustFields = (size: number) => {
    const current = fields.length;
    if (size > current) {
      for (let i = current; i < size; i++) append({ name: '', meal: '' });
    } else if (size < current) {
      for (let i = current - 1; i >= size; i--) remove(i);
    }
  };

  const onSubmit = async (data: FormData) => {
    const { error } = await supabase
      .from('rsvps')
      .upsert({
        guest_id: guestId,
        attending: data.attending,
        party_size: data.partySize,
        names: data.guests.map(g => g.name),
        meals: data.guests.map(g => g.meal),
        dietary: data.dietary,
        message: data.message,
        timestamp: new Date(),
      });

    if (error) {
      alert('Error: ' + error.message);
      return;
    }
    setSubmitted(true);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-8 bg-white rounded-lg shadow-md max-w-lg mx-auto">
      <h2 className="text-3xl font-playfair text-gold-500">RSVP</h2>
      
      <label className="block">
        <span>Are you attending?</span>
        <select {...register('attending', { required: true })} className="w-full p-2 border rounded">
          <option value="">Select</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
          <option value="maybe">Maybe</option>
        </select>
        {errors.attending && <p className="text-red-500 text-sm">Required</p>}
      </label>
      
      <label className="block">
        <span>Number of guests in your party</span>
        <input
          type="number"
          {...register('partySize', { required: true, min: 1, onChange: (e) => adjustFields(Number(e.target.value)) })}
          className="w-full p-2 border rounded"
        />
        {errors.partySize && <p className="text-red-500 text-sm">Required (at least 1)</p>}
      </label>
      
      {fields.map((field, index) => (
        <div key={field.id} className="space-y-2">
          <label className="block">
            <span>Full name of guest {index + 1}</span>
            <input {...register(`guests.${index}.name`, { required: true })} className="w-full p-2 border rounded" />
            {errors.guests?.[index]?.name && <p className="text-red-500 text-sm">Required</p>}
          </label>
          <label className="block">
            <span>Meal selection for guest {index + 1}</span>
            <select {...register(`guests.${index}.meal`, { required: true })} className="w-full p-2 border rounded">
              <option value="">Select</option>
              <option value="Beef">Beef</option>
              <option value="Chicken">Chicken</option>
              <option value="Fish">Fish</option>
              <option value="Vegan">Vegan</option>
            </select>
            {errors.guests?.[index]?.meal && <p className="text-red-500 text-sm">Required</p>}
          </label>
        </div>
      ))}
      
      <label className="block">
        <span>Dietary restrictions / allergies</span>
        <textarea {...register('dietary')} className="w-full p-2 border rounded" />
      </label>
      
      <label className="block">
        <span>Message to the couple (optional)</span>
        <textarea {...register('message')} className="w-full p-2 border rounded" />
      </label>
      
      <button type="submit" className="w-full p-3 bg-gold-500 text-white rounded hover:bg-gold-600 transition">Submit RSVP</button>
      {submitted && <p className="text-green-500">Thank you for your RSVP!</p>}
    </form>
  );
};
