import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProject } from '@/hooks/useProjects';
import { useProjectTaskTree } from '../hooks/useTasks';
import { TaskTree } from '../components/TaskTree';
import { TaskFormModal } from '../components/TaskForm';
import { DeleteTaskDialog } from '../components/DeleteTaskDialog';
import { PageLoader } from '@/components/common/Loading';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProjectStatusBadge } from '@/components/common/ProjectStatusBadge';
import { Progress } from '@/components/ui/progress';
import { Search, Plus, ArrowLeft, Layers } from 'lucide-react';
import type { Task } from '../types';

export const ProjectTasksPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch project details
  const { data: projectData, isLoading: isLoadingProject } = useProject(projectId || '');
  const project = projectData?.data;

  // Fetch task tree
  const { data: treeData, isLoading: isLoadingTree } = useProjectTaskTree(projectId || '', {
    search: debouncedSearch || undefined,
  });
  const tasks = treeData?.data || [];

  if (isLoadingProject) return <PageLoader />;
  if (!project) {
    return (
      <EmptyState
        title="Project Not Found"
        description="Project yang Anda cari tidak ditemukan."
        actionLabel="Go Back"
        onAction={() => navigate('/projects')}
      />
    );
  }

  const handleCreateRootTask = () => {
    setSelectedParentId(null);
    setTaskToEdit(null);
    setIsTaskFormOpen(true);
  };

  const handleCreateSubtask = (parentId: string) => {
    setSelectedParentId(parentId);
    setTaskToEdit(null);
    setIsTaskFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedParentId(null);
    setTaskToEdit(task);
    setIsTaskFormOpen(true);
  };

  const handleDeleteTask = (task: Task) => {
    setTaskToDelete(task);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Button variant="ghost" className="mb-2 -ml-2" onClick={() => navigate(`/projects/${projectId}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Project Detail
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Layers className="h-6 w-6 text-primary" />
              {project.name}
            </h1>
            <ProjectStatusBadge status={project.status} />
          </div>
        </div>
        
        <div className="w-full md:w-64 p-3 rounded-xl bg-card border shadow-sm">
           <div className="flex justify-between items-end mb-1">
             <span className="text-xs font-semibold text-muted-foreground uppercase">Overall Progress</span>
           </div>
           <Progress value={project.progress} showText />
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-card border rounded-lg p-4 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={handleCreateRootTask}>
          <Plus className="mr-2 h-4 w-4" /> Create Root Task
        </Button>
      </div>

      {/* Tree View */}
      {isLoadingTree ? (
        <PageLoader />
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No tasks found"
          description={debouncedSearch ? `Tidak ada task yang cocok dengan "${debouncedSearch}"` : "Belum ada task di project ini."}
          actionLabel={debouncedSearch ? 'Clear Search' : 'Create Task'}
          onAction={debouncedSearch ? () => setSearch('') : handleCreateRootTask}
        />
      ) : (
        <TaskTree
          tasks={tasks}
          projectId={projectId!}
          onAddSubtask={handleCreateSubtask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          expandAll={!!debouncedSearch}
        />
      )}

      {/* Modals */}
      <TaskFormModal
        isOpen={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
        projectId={projectId!}
        parentTaskId={selectedParentId}
        taskToEdit={taskToEdit}
      />

      <DeleteTaskDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        task={taskToDelete}
      />
    </div>
  );
};
