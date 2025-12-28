
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/shared/page-header';
import { ReviewPageClient } from './_components/review-page-client';

type ReviewPageProps = {
  params: {
    resultId: string;
  };
};

export default function ReviewPage({ params }: ReviewPageProps) {
  const { resultId } = params;

  if (!resultId) {
    notFound();
  }

  return (
    <div>
      <PageHeader title="Review Quiz" description="See how you did on a past quiz." />
      <Suspense fallback={<ReviewPageClient.Skeleton />}>
        <ReviewPageClient resultId={resultId} />
      </Suspense>
    </div>
  );
}
