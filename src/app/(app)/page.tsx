'use client';

import { redirect } from 'next/navigation';

// This is a temporary redirect component. 
// In a real app, you'd have a proper dashboard here.
export default function RedirectPage() {
  redirect('/home');
}
