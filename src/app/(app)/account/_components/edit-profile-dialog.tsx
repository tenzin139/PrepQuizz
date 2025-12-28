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
import { doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';
import type { UserProfile } from '@/lib/types';
import { Camera, Upload } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
  const fileInputRef = React.useRef<HTMLInputElement>(null);


  React.useEffect(() => {
    setName(userProfile.name);
    setSelectedFile(null);
    setPreviewUrl(null);
    setShowCamera(false);
  }, [open, userProfile.name]);


  React.useEffect(() => {
    if (showCamera) {
      setPreviewUrl(null);
      setSelectedFile(null);
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
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };


  const handleSave = async () => {
    if (!user || !name) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Name cannot be empty.',
      });
      return;
    }

    setIsSaving(true);
    try {
      let photoURL = userProfile.profileImageURL;

      // If a new photo was uploaded, handle the upload to Firebase Storage
      if (selectedFile) {
        const storage = getStorage();
        // Create a storage reference
        const filePath = `profile-images/${user.uid}/${selectedFile.name}`;
        const newPhotoRef = storageRef(storage, filePath);

        // Upload the file
        const snapshot = await uploadBytes(newPhotoRef, selectedFile);
        
        // Get the download URL
        photoURL = await getDownloadURL(snapshot.ref);
      }
      // Note: Capturing from camera is not implemented yet, so we only handle file uploads.

      const updates: Promise<any>[] = [];

      // Update Firebase Auth profile
      if (auth.currentUser && (name !== userProfile.name || photoURL !== userProfile.profileImageURL)) {
         updates.push(updateProfile(auth.currentUser, { displayName: name, photoURL }));
      }

      // Update Firestore profile document
      const userDocRef = doc(firestore, 'users', user.uid);
      updates.push(updateDoc(userDocRef, { name, profileImageURL: photoURL }));

      await Promise.all(updates);

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
        description: error.message || 'An unexpected error occurred.',
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
            <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowCamera(!showCamera)}>
                    <Camera className="mr-2 h-4 w-4" />
                    {showCamera ? 'Close Camera' : 'Take Photo'}
                </Button>
                 <Button variant="outline" className="flex-1" onClick={handleUploadClick}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Photo
                </Button>
            </div>
          </div>

          {previewUrl && (
            <div className='space-y-2'>
              <Label>Image Preview</Label>
              <Image src={previewUrl} alt="Image preview" width={500} height={281} className="w-full aspect-video rounded-md object-cover bg-muted" />
            </div>
          )}

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
