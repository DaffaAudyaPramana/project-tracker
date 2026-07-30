import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Project, ProjectStatus } from '@/types/project.types';

import { useCreateProject, useUpdateProject } from '@/hooks/useProjects';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';

const projectFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, 'Nama project minimal 3 karakter')
      .max(100, 'Nama project maksimal 100 karakter'),
    description: z.string().trim().max(500, 'Deskripsi maksimal 500 karakter').optional(),
    status: z.enum(['TODO', 'IN_PROGRESS', 'DONE'] as const),
    startDate: z.string().min(1, 'Tanggal mulai wajib diisi'),
    endDate: z.string().min(1, 'Tanggal selesai wajib diisi'),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;
      return new Date(data.endDate) >= new Date(data.startDate);
    },
    {
      message: 'Tanggal selesai harus sama atau setelah tanggal mulai',
      path: ['endDate'],
    }
  );

type ProjectFormValues = z.infer<typeof projectFormSchema>;

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectToEdit?: Project | null;
}

export const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  isOpen,
  onClose,
  projectToEdit,
}) => {
  const isEditing = !!projectToEdit;
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();

  const [backendError, setBackendError] = React.useState<string | null>(null);

  const formatDateForInput = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toISOString().split('T')[0];
  };

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'TODO',
      startDate: '',
      endDate: '',
    },
  });

  useEffect(() => {
    if (projectToEdit) {
      reset({
        name: projectToEdit.name,
        description: projectToEdit.description || '',
        status: projectToEdit.status,
        startDate: formatDateForInput(projectToEdit.startDate),
        endDate: formatDateForInput(projectToEdit.endDate),
      });
    } else {
      reset({
        name: '',
        description: '',
        status: 'TODO',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
      });
    }
    setBackendError(null);
  }, [projectToEdit, isOpen, reset]);

  const onSubmit = async (values: ProjectFormValues) => {
    setBackendError(null);
    try {
      if (isEditing && projectToEdit) {
        await updateMutation.mutateAsync({
          id: projectToEdit.id,
          payload: {
            name: values.name,
            description: values.description || null,
            status: values.status as ProjectStatus,
            startDate: new Date(values.startDate).toISOString(),
            endDate: new Date(values.endDate).toISOString(),
          },
        });
        toast.success('Project berhasil diperbarui!');
      } else {
        await createMutation.mutateAsync({
          name: values.name,
          description: values.description || null,
          status: values.status as ProjectStatus,
          startDate: new Date(values.startDate).toISOString(),
          endDate: new Date(values.endDate).toISOString(),
        });
        toast.success('Project baru berhasil dibuat!');
      }
      onClose();
    } catch (err: any) {
      const msg = err?.message || 'Gagal menyimpan project';
      setBackendError(msg);

      // Extract field specific errors if schedule overlap detected
      if (
        msg.toLowerCase().includes('schedule') ||
        msg.toLowerCase().includes('overlap') ||
        msg.toLowerCase().includes('tabrakan') ||
        msg.toLowerCase().includes('date')
      ) {
        setError('startDate', { type: 'manual', message: msg });
        setError('endDate', { type: 'manual', message: msg });
      }
      toast.error(msg);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Project' : 'Create New Project'}
      description={
        isEditing
          ? 'Perbarui detail project yang ada.'
          : 'Tambahkan project baru ke workspace.'
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {backendError && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400 text-sm border border-red-200 dark:border-red-900">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{backendError}</span>
          </div>
        )}

        <div>
          <label className="text-sm font-medium mb-1 block">Project Name *</label>
          <Input
            placeholder="e.g. Website Redesign"
            {...register('name')}
            disabled={isLoading}
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Description</label>
          <textarea
            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px]"
            placeholder="Deskripsi ringkas mengenai project..."
            {...register('description')}
            disabled={isLoading}
          />
          {errors.description && (
            <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Status</label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            {...register('status')}
            disabled={isLoading}
          >
            <option value="TODO">🟡 TODO</option>
            <option value="IN_PROGRESS">🔵 IN_PROGRESS</option>
            <option value="DONE">🟢 DONE</option>
          </select>
          {errors.status && (
            <p className="text-xs text-red-500 mt-1">{errors.status.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Start Date *</label>
            <Input
              type="date"
              {...register('startDate')}
              disabled={isLoading}
            />
            {errors.startDate && (
              <p className="text-xs text-red-500 mt-1">{errors.startDate.message}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">End Date *</label>
            <Input
              type="date"
              {...register('endDate')}
              disabled={isLoading}
            />
            {errors.endDate && (
              <p className="text-xs text-red-500 mt-1">{errors.endDate.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
