'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { NewsForm } from '@/features/news/components/NewsForm';
import { useCreateNewsMutation, useUpdateNewsMutation } from '@/features/news/mutations';
import { useNewsDetailQuery } from '@/features/news/queries';
import { NewsFormValues } from '@/features/news/validator';
import { CreateNewsRequest, UpdateNewsRequest } from '@/features/news/types';

export default function AdminNewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const newsId = params.news_id as string;
  const isEditing = !!newsId && newsId !== 'new';

  const { data: news, isLoading, isError } = useNewsDetailQuery(newsId);

  const createMutation = useCreateNewsMutation();
  const updateMutation = useUpdateNewsMutation();

  const isSaving = createMutation.isPending || updateMutation.isPending;

  if (isEditing && isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (isEditing && isError) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-500">Error loading news</h1>
        <Button onClick={() => router.push('/admin/news')} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  const initialData: NewsFormValues | undefined =
    isEditing && news
      ? {
          title: news.title,
          summary: news.summary || '',
          content: news.content || '',
          status: news.status,
          images: news.images.map((img) => ({
            id: img.id,
            url: img.url,
          })),
        }
      : undefined;

  const handleSubmit = async (values: NewsFormValues) => {
    try {
      // Transform images to imageIds for backend
      const imageIds = values.images?.map((img) => img.id).filter(Boolean) as string[] || [];
      
      const payload = {
        title: values.title,
        summary: values.summary,
        content: values.content,
        status: values.status,
        imageIds,
      };

      if (isEditing) {
        await updateMutation.mutateAsync({ id: newsId, data: payload as UpdateNewsRequest });
        toast.success('News updated successfully');
      } else {
        await createMutation.mutateAsync(payload as CreateNewsRequest);
        toast.success('News created successfully');
      }
      router.push('/admin/news');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to save news');
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6 flex-col">
      <div className="flex items-center gap-4">
        <Link href="/admin/news">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">
          {isEditing ? 'Edit News' : 'Create News'}
        </h1>
      </div>

      <div className="bg-card rounded-lg border p-6 shadow-sm w-full mx-auto">
        <NewsForm
          initialData={initialData}
          onSubmit={handleSubmit}
          isLoading={isSaving}
        />
      </div>
    </div>
  );
}
