'use client';

import * as React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn, getFirebaseErrorMessage } from '@/lib/utils';
import { getAvatarPlaceholders } from '@/lib/placeholder-images';
import { useAuth, useFirestore } from '@/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';

export function SignupForm() {
  const avatars = getAvatarPlaceholders();
  const [selectedAvatar, setSelectedAvatar] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [name, setName] = React.useState('');
  const debouncedName = useDebounce(name, 500);
  const [isNameAvailable, setIsNameAvailable] = React.useState(true);
  const [isCheckingName, setIsCheckingName] = React.useState(false);


  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  React.useEffect(() => {
    const checkNameAvailability = async () => {
      if (!debouncedName) {
        setIsNameAvailable(true); // Don't show error for empty name
        return;
      }
      setIsCheckingName(true);
      try {
        const usersRef = collection(firestore, 'users');
        const q = query(where('name', '==', debouncedName), limit(1));
        const querySnapshot = await getDocs(q);
        setIsNameAvailable(querySnapshot.empty);
      } catch (error) {
        console.error("Error checking name availability:", error);
        // Default to true to not block signup due to a check failure
        setIsNameAvailable(true); 
      } finally {
        setIsCheckingName(false);
      }
    };
    checkNameAvailability();
  }, [debouncedName, firestore]);


  async function handleSignup(formData: FormData) {
    setIsSubmitting(true);
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
        description: 'Please fill out all fields and select an avatar.',
      });
      setIsSubmitting(false);
      return;
    }
    
    if (!isNameAvailable) {
        toast({
            variant: 'destructive',
            title: 'Name Unavailable',
            description: 'This name is already taken. Please choose another one.',
        });
        setIsSubmitting(false);
        return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user) {
        await updateProfile(user, {
            displayName: name,
            photoURL: avatarUrl
        });

        const userProfile = {
          id: user.uid,
          name,
          age: parseInt(age, 10),
          state,
          profileImageURL: avatarUrl,
          quizCredits: 50,
          quizzesTakenToday: 0,
          lastQuizDate: serverTimestamp(),
        };

        const userDocRef = doc(firestore, `users/${user.uid}`);
        // This is a blocking call, but it's okay here since it's part of signup
        await setDoc(userDocRef, userProfile, { merge: true });
        
        router.push('/');
      }
    } catch (error: any) {
      console.error('Signup failed:', error);
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
        description: getFirebaseErrorMessage(error.code),
      });
    } finally {
        setIsSubmitting(false);
    }
  }

  const isSignupDisabled = isSubmitting || !isNameAvailable || isCheckingName || selectedAvatar === '';
  const buttonText = isSubmitting ? 'Creating Account...' : isCheckingName ? 'Checking name...' : 'Create Account';


  return (
    <form action={handleSignup}>
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" name="name" placeholder="Alex Doe" required value={name} onChange={(e) => setName(e.target.value)} />
           {!isCheckingName && !isNameAvailable && name && (
             <p className="text-xs text-destructive">This name is already taken.</p>
           )}
           {isCheckingName && name && (
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin" /> Checking availability...
              </p>
           )}
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
          {!selectedAvatar && (
            <Alert variant="destructive" className="p-2 text-xs">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Please select an avatar to continue.
                </AlertDescription>
            </Alert>
          )}
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
        <Button className="w-full" type="submit" disabled={isSignupDisabled}>
            {isSubmitting || isCheckingName ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {buttonText}
        </Button>
      </CardFooter>
    </form>
  );
}
