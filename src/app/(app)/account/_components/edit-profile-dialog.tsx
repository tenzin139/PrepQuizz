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
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(userProfile.profileImageURL);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);


  React.useEffect(() => {
    if (open) {
      setName(userProfile.name);
      setPreviewUrl(userProfile.profileImageURL);
      setSelectedFile(null);
      setShowCamera(false);
      setHasCameraPermission(undefined);
    }
  }, [open, userProfile.name, userProfile.profileImageURL]);


  React.useEffect(() => {
    let stream: MediaStream | null = null;
    
    const getCameraPermission = async () => {
      if (showCamera) {
        setPreviewUrl(null);
        setSelectedFile(null);
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
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
      } else {
         if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }
          if (videoRef.current) {
            videoRef.current.srcObject = null;
          }
           setPreviewUrl(userProfile.profileImageURL);
      }
    };

    getCameraPermission();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  }, [showCamera, toast, userProfile.profileImageURL]);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setShowCamera(false);
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        canvas.toBlob((blob) => {
          if (blob) {
            const capturedFile = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
            setSelectedFile(capturedFile);
            setPreviewUrl(URL.createObjectURL(capturedFile));
            setShowCamera(false); // Close camera after capture
          }
        }, 'image/jpeg');
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setPreviewUrl(''); // Set to empty string to signify removal
    setShowCamera(false);
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
    if (!name.trim()) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Name cannot be empty.',
      });
      return;
    }

    setIsSaving(true);
    
    try {
      const trimmedName = name.trim();
      const nameHasChanged = trimmedName !== userProfile.name;
      const photoHasChanged = selectedFile || previewUrl !== userProfile.profileImageURL;

      if (!nameHasChanged && !photoHasChanged) {
        toast({
          title: 'No Changes',
          description: 'You have not made any changes to your profile.',
        });
        onOpenChange(false);
        setIsSaving(false);
        return;
      }
      
      let finalPhotoURL = userProfile.profileImageURL;

      if (selectedFile) {
        const storage = getStorage();
        const filePath = `profile-images/${user.uid}/${Date.now()}-${selectedFile.name}`;
        const newPhotoRef = storageRef(storage, filePath);
        const snapshot = await uploadBytes(newPhotoRef, selectedFile);
        finalPhotoURL = await getDownloadURL(snapshot.ref);
      } else if (previewUrl === '' && userProfile.profileImageURL) {
        // This means the photo was removed
        finalPhotoURL = '';
      }

      // Prepare updates
      const authUpdates: { displayName?: string; photoURL?: string } = {};
      const firestoreUpdates: Partial<UserProfile> = {};

      if (nameHasChanged) {
        authUpdates.displayName = trimmedName;
        firestoreUpdates.name = trimmedName;
      }

      if (photoHasChanged) {
        authUpdates.photoURL = finalPhotoURL;
        firestoreUpdates.profileImageURL = finalPhotoURL;
      }
      
      const updatePromises: Promise<any>[] = [];
      
      if (Object.keys(authUpdates).length > 0) {
        updatePromises.push(updateProfile(auth.currentUser, authUpdates));
      }

      if (Object.keys(firestoreUpdates).length > 0) {
        const userDocRef = doc(firestore, 'users', user.uid);
        updatePromises.push(updateDoc(userDocRef, firestoreUpdates));
      }

      if (updatePromises.length > 0) {
        await Promise.all(updatePromises);
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
             <canvas ref={canvasRef} className="hidden"></canvas>
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
                 {previewUrl && !showCamera ? (
                    <Image src={previewUrl} alt="Image preview" width={500} height={281} className="w-full h-full object-cover rounded-md" />
                 ) : !previewUrl && !showCamera ? (
                    <Avatar className='h-32 w-32 text-4xl'>
                       <AvatarFallback>{name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                 ) : null}
                 {showCamera && <video ref={videoRef} className="w-full aspect-video rounded-md bg-muted" autoPlay muted playsInline/>}
              </div>
          </div>


          {showCamera && (
            <div className='space-y-2'>
                {hasCameraPermission === false && (
                    <Alert variant="destructive">
                        <AlertTitle>Camera Access Required</AlertTitle>
                        <AlertDescription>
                            Please allow camera access in your browser to use this feature.
                        </AlertDescription>
                    </Alert>
                )}
                 {hasCameraPermission === true && (
                   <Button className="w-full" onClick={handleCapture}>Capture</Button>
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
