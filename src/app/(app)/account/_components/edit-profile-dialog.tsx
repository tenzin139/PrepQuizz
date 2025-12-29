'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';
import type { UserProfile } from '@/lib/types';
import { Camera, Upload, Trash2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getFirebaseErrorMessage } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type EditProfileDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userProfile: UserProfile;
};

export function EditProfileDialog({ open, onOpenChange, userProfile }: EditProfileDialogProps) {
  const { user } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [name, setName] = React.useState(userProfile.name);
  const [isSaving, setIsSaving] = React.useState(false);
  
  // Camera state
  const [showCamera, setShowCamera] = React.useState(false);
  const [hasCameraPermission, setHasCameraPermission] = React.useState<boolean | undefined>(undefined);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  
  // File upload state
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [isPhotoRemoved, setIsPhotoRemoved] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);


  React.useEffect(() => {
    setName(userProfile.name);
    setPreviewUrl(userProfile.profileImageURL);
    setSelectedFile(null);
    setShowCamera(false);
    setIsPhotoRemoved(false);
  }, [open, userProfile.name, userProfile.profileImageURL]);


  React.useEffect(() => {
    if (showCamera) {
      setPreviewUrl(null);
      setSelectedFile(null);
      setIsPhotoRemoved(false);
      const getCameraPermission = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setHasCameraPermission(true);

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser settings.',
          });
        }
      };

      getCameraPermission();

      return () => {
        if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
        }
      }
    }
  }, [showCamera, toast]);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setShowCamera(false);
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setIsPhotoRemoved(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setShowCamera(false);
    setIsPhotoRemoved(true);
  };

  const handleSave = async () => {
    if (!user || !auth.currentUser) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to update your profile.',
      });
      return;
    }
    if (!name) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Name cannot be empty.',
      });
      return;
    }

    setIsSaving(true);
    try {
      let newPhotoURL = userProfile.profileImageURL;
      let photoHasChanged = false;

      if (isPhotoRemoved) {
        newPhotoURL = '';
        photoHasChanged = true;
      } else if (selectedFile) {
        const storage = getStorage();
        const filePath = `profile-images/${user.uid}/${Date.now()}-${selectedFile.name}`;
        const newPhotoRef = storageRef(storage, filePath);
        const snapshot = await uploadBytes(newPhotoRef, selectedFile);
        newPhotoURL = await getDownloadURL(snapshot.ref);
        photoHasChanged = true;
      }
      
      const nameHasChanged = name !== userProfile.name;
      const updates: Promise<any>[] = [];
      
      // 1. Update Firebase Auth profile
      if (nameHasChanged || photoHasChanged) {
        updates.push(updateProfile(auth.currentUser, { 
          displayName: name, 
          photoURL: newPhotoURL 
        }));
      }

      // 2. Update Firestore user profile document
      const userDocRef = doc(firestore, 'users', user.uid);
      const userDocUpdates: Partial<UserProfile> = {};
      if (nameHasChanged) userDocUpdates.name = name;
      if (photoHasChanged) userDocUpdates.profileImageURL = newPhotoURL;
      
      if (Object.keys(userDocUpdates).length > 0) {
        updates.push(updateDoc(userDocRef, userDocUpdates));
      }

      if (updates.length > 0) {
        await Promise.all(updates);
      }
      
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      });
      onOpenChange(false);

    } catch (error: any) {
      console.error('Failed to update profile:', error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: getFirebaseErrorMessage(error.code) || 'An unexpected error occurred.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Profile Picture</Label>
             <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/png, image/jpeg, image/jpg" />
            <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" onClick={() => setShowCamera(!showCamera)}>
                    <Camera className="mr-2 h-4 w-4" />
                    {showCamera ? 'Close' : 'Camera'}
                </Button>
                 <Button variant="outline" onClick={handleUploadClick}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                </Button>
                <Button variant="outline" onClick={handleRemovePhoto}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove
                </Button>
            </div>
          </div>

          <div className='space-y-2'>
              <Label>Image Preview</Label>
              <div className="w-full aspect-video rounded-md bg-muted flex items-center justify-center">
                 {previewUrl && !isPhotoRemoved ? (
                    <Image src={previewUrl} alt="Image preview" width={500} height={281} className="w-full h-full object-cover rounded-md" />
                 ) : isPhotoRemoved || !previewUrl ? (
                    <Avatar className='h-32 w-32 text-4xl'>
                       <AvatarFallback>{name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                 ) : null}
              </div>
          </div>


          {showCamera && (
            <div className='space-y-2'>
                <video ref={videoRef} className="w-full aspect-video rounded-md bg-muted" autoPlay muted />
                {hasCameraPermission === false && (
                    <Alert variant="destructive">
                        <AlertTitle>Camera Access Required</AlertTitle>
                        <AlertDescription>
                            Please allow camera access in your browser to use this feature.
                        </AlertDescription>
                    </Alert>
                )}
                 {hasCameraPermission === true && (
                   <Button className="w-full" disabled>Capture (Coming Soon)</Button>
                )}
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
