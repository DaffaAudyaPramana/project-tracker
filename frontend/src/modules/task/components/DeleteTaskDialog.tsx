import React from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useDeleteTask } from '../hooks/useTasks';
import type { Task } from '../types';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';

interface DeleteTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

export const DeleteTaskDialog: React.FC<DeleteTaskDialogProps> = ({
  isOpen,
  onClose,
  task,
}) => {
  const deleteMutation = useDeleteTask();

  if (!task) return null;

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(task.id);
      toast.success(`Task "${task.title}" berhasil dihapus.`);
      onClose();
    } catch (err: any) {
      toast.error(err?.message || 'Gagal menghapus task.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Hapus Task"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={deleteMutation.isPending}>
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Menghapus...' : 'Ya, Hapus'}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-3 py-2">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">
            Apakah Anda yakin ingin menghapus task <span className="font-bold">"{task.title}"</span>?
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Jika task ini memiliki subtask, subtask tersebut mungkin juga akan terhapus. Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>
      </div>
    </Modal>
  );
};
