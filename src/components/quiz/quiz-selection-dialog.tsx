'use client';

import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Quiz } from '@/lib/types';
import { ArrowRight } from 'lucide-react';

type QuizSelectionDialogProps = {
  quiz: Quiz;
  open: boolean;
  onClose: () => void;
};

export function QuizSelectionDialog({ quiz, open, onClose }: QuizSelectionDialogProps) {
  const router = useRouter();

  const handleSelect = (subCategory: string) => {
    // Pass the selected sub-category as a query parameter
    router.push(`/quiz/${quiz.id}?subCategory=${encodeURIComponent(subCategory)}`);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select {quiz.title} Type</DialogTitle>
          <DialogDescription>
            Choose which section of the exam you'd like to practice.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {quiz.subCategories?.map((subCategory) => (
            <Button
              key={subCategory}
              variant="outline"
              size="lg"
              className="justify-between"
              onClick={() => handleSelect(subCategory)}
            >
              <span>{subCategory}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          ))}
        </div>
        <DialogFooter>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
