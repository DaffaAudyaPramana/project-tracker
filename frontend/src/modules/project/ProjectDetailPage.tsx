import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProject } from '@/hooks/useProjects';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ProjectStatusBadge } from '@/components/common/ProjectStatusBadge';
import { PageLoader } from '@/components/common/Loading';
import { EmptyState } from '@/components/common/EmptyState';
import { ProjectFormModal } from './components/ProjectFormModal';
import { DeleteProjectDialog } from './components/DeleteProjectDialog';
import {
  ArrowLeft,
  Calendar,
  Pencil,
  Trash2,
  CheckSquare,
  Clock,
} from 'lucide-react';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data, isLoading, isError } = useProject(id || '');

  const project = data?.data;

  if (isLoading) return <PageLoader />;

  if (isError || !project) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate('/projects')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
        </Button>
        <EmptyState
          title="Project Not Found"
          description="Project yang Anda cari tidak ditemukan atau telah dihapus."
          actionLabel="Back to Projects"
          onAction={() => navigate('/projects')}
        />
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Navigation & Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Button variant="ghost" className="w-fit" onClick={() => navigate('/projects')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
        </Button>

        <div className="flex items-center gap-2">
          <Button variant="default" onClick={() => navigate(`/projects/${project.id}/tasks`)}>
            <CheckSquare className="mr-2 h-4 w-4" /> Manage Tasks
          </Button>
          <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" /> Edit Project
          </Button>
          <Button variant="destructive" onClick={() => setIsDeleteOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      {/* Main Details Card */}
      <Card>
        <CardHeader className="border-b pb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <CardTitle className="text-2xl font-bold">{project.name}</CardTitle>
                <ProjectStatusBadge status={project.status} />
              </div>
              <CardDescription className="text-base">
                {project.description || 'Tidak ada deskripsi untuk project ini.'}
              </CardDescription>
            </div>
            <div className="w-full md:w-64 p-4 rounded-xl bg-muted/40 border">
              <span className="text-xs font-semibold text-muted-foreground uppercase">
                Overall Progress
              </span>
              <div className="text-2xl font-bold mt-1 mb-2">{project.progress}%</div>
              <Progress value={project.progress} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/20 border">
              <Calendar className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-xs text-muted-foreground font-medium">Start Date</p>
                <p className="text-sm font-semibold">{formatDate(project.startDate)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/20 border">
              <Clock className="h-5 w-5 text-amber-500" />
              <div>
                <p className="text-xs text-muted-foreground font-medium">End Date</p>
                <p className="text-sm font-semibold">{formatDate(project.endDate)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/20 border">
              <CheckSquare className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-xs text-muted-foreground font-medium">Total Tasks</p>
                <p className="text-sm font-semibold">{project._count?.tasks || 0} Tasks</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Form Modal */}
      <ProjectFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        projectToEdit={project}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteProjectDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        project={project}
      />
    </div>
  );
};
