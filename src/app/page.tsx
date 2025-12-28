'use client';
import { redirect } from 'next/navigation';
import { useUser } from '@/firebase';
import { useEffect } from 'react';

export default function RootPage() {
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (!isUserLoading) {
      if (user) {
        redirect('/home');
      } else {
        redirect('/login');
      }
    }
  }, [user, isUserLoading]);
  
  // You can show a loading spinner here while checking auth state
  return (
    <div className="flex h-screen items-center justify-center">
      <p>Loading...</p>
    </div>
  );
}
