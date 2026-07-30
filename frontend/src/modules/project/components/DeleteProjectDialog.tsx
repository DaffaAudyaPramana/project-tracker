import React from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import type { Project } from '@/types/project.types';

import { useDeleteProject } from '@/hooks/useProjects';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';

interface DeleteProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

export const DeleteProjectDialog: React.FC<DeleteProjectDialogProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const deleteMutation = useDeleteProject();

  if (!project) return null;

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(project.id);
      toast.success(`Project "${project.name}" berhasil dihapus.`);
      onClose();
    } catch (err: any) {
      toast.error(err?.message || 'Gagal menghapus project.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Hapus Project"
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
            Apakah Anda yakin ingin menghapus project <span className="font-bold">"{project.name}"</span>?
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Tindakan ini tidak dapat dibatalkan dan semua data task terkait akan terhapus.
          </p>
        </div>
      </div>
    </Modal>
  );
};
