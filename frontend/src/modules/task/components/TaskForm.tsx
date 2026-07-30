import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCreateTask, useUpdateTask } from '../hooks/useTasks';
import type { Task } from '../types';

import { toast } from 'sonner';

const taskFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Title minimal 3 karakter')
    .max(100, 'Title maksimal 100 karakter'),
  description: z.string().trim().max(500, 'Deskripsi maksimal 500 karakter').optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE'] as const).optional(),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  parentTaskId?: string | null;
  taskToEdit?: Task | null;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isOpen,
  onClose,
  projectId,
  parentTaskId,
  taskToEdit,
}) => {
  const isEditing = !!taskToEdit;
  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'TODO',
    },
  });

  useEffect(() => {
    if (taskToEdit) {
      reset({
        title: taskToEdit.title,
        description: taskToEdit.description || '',
        status: taskToEdit.status,
      });
    } else {
      reset({
        title: '',
        description: '',
        status: 'TODO',
      });
    }
  }, [taskToEdit, isOpen, reset]);

  const onSubmit = async (values: TaskFormValues) => {
    try {
      if (isEditing && taskToEdit) {
        await updateMutation.mutateAsync({
          id: taskToEdit.id,
          payload: {
            title: values.title,
            description: values.description || null,
            status: values.status,
          },
        });
        toast.success('Task berhasil diperbarui!');
      } else {
        await createMutation.mutateAsync({
          title: values.title,
          description: values.description || null,
          projectId,
          parentId: parentTaskId || null,
          status: values.status,
        });
        toast.success(parentTaskId ? 'Subtask baru dibuat!' : 'Task baru dibuat!');
      }
      onClose();
    } catch (err: any) {
      toast.error(err?.message || 'Gagal menyimpan task');
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Task' : parentTaskId ? 'Create Subtask' : 'Create Task'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Title *</label>
          <Input
            placeholder="e.g. Implement API"
            {...register('title')}
            disabled={isLoading}
          />
          {errors.title && (
            <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Description</label>
          <textarea
            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px]"
            placeholder="Task description..."
            {...register('description')}
            disabled={isLoading}
          />
          {errors.description && (
            <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
          )}
        </div>

        {isEditing && (
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
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
