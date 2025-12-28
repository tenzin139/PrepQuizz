'use client';

import * as React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { getAvatarPlaceholders } from '@/lib/placeholder-images';
import { useAuth, useFirestore, setDocumentNonBlocking } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export function SignupForm() {
  const avatars = getAvatarPlaceholders();
  const [selectedAvatar, setSelectedAvatar] = React.useState(avatars[0]?.imageUrl || '');

  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();


  async function handleSignup(formData: FormData) {
    const name = formData.get('name') as string;
    const age = formData.get('age') as string;
    const state = formData.get('state') as string;
    const avatarUrl = formData.get('avatarUrl') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!name || !age || !state || !avatarUrl || !email || !password) {
      toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: 'Please fill out all fields.',
      });
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user) {
        const userProfile = {
          id: user.uid,
          name,
          age: parseInt(age, 10),
          state,
          profileImageURL: avatarUrl,
        };

        const userDocRef = doc(firestore, `users/${user.uid}`);
        setDocumentNonBlocking(userDocRef, userProfile, { merge: true });
        router.push('/');
      }
    } catch (error: any) {
      console.error('Signup failed:', error);
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
        description: error.message || 'An unexpected error occurred.',
      });
    }
  }


  return (
    <form action={handleSignup}>
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" name="name" placeholder="Alex Doe" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input id="age" name="age" type="number" placeholder="23" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input id="state" name="state" placeholder="California" required />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Choose your Avatar</Label>
          <Input type="hidden" name="avatarUrl" value={selectedAvatar} />
          <ScrollArea>
            <div className="flex space-x-4 pb-4">
              {avatars.map((avatar) => (
                <button
                  type="button"
                  key={avatar.id}
                  className={cn(
                    'h-16 w-16 shrink-0 rounded-full overflow-hidden ring-2 ring-offset-2 ring-offset-background transition-all',
                    selectedAvatar === avatar.imageUrl ? 'ring-primary' : 'ring-transparent'
                  )}
                  onClick={() => setSelectedAvatar(avatar.imageUrl)}
                >
                  <Image
                    src={avatar.imageUrl}
                    alt={avatar.description}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                    data-ai-hint={avatar.imageHint}
                  />

                  <span className="sr-only">{avatar.description}</span>
                </button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <div className="space-y-2">
          <Label htmlFor="signup-email">Email</Label>
          <Input id="signup-email" name="email" type="email" placeholder="student@example.com" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="signup-password">Password</Label>
          <Input id="signup-password" name="password" type="password" required />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" type="submit">Create Account</Button>
      </CardFooter>
    </form>
  );
}
