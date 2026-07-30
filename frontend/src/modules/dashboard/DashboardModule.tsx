import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '@/hooks/useProjects';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ProjectStatusBadge } from '@/components/common/ProjectStatusBadge';
import { TableSkeleton } from '@/components/common/SkeletonLoader';
import { ProjectFormModal } from '@/modules/project/components/ProjectFormModal';
import { DeleteProjectDialog } from '@/modules/project/components/DeleteProjectDialog';
import type { Project } from '@/types/project.types';

import {
  FolderKanban,
  CheckCircle2,
  ListTodo,
  TrendingUp,
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
} from 'lucide-react';

export const DashboardModule: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  // Fetch all projects for Summary calculations & latest project table
  const { data, isLoading } = useProjects({
    limit: 100,
  });

  const projects = data?.data || [];

  // Summary Metrics calculations
  const totalProjects = projects.length;
  const completedProjects = projects.filter((p) => p.status === 'DONE').length;

  const totalTasks = projects.reduce((acc, p) => acc + (p._count?.tasks || 0), 0);

  const averageProgress =
    totalProjects > 0
      ? Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / totalProjects)
      : 0;

  // Filtered projects for search
  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Project Tracker Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Ringkasan status project, progress keseluruhan, dan aktivitas workspace.
          </p>
        </div>
        <Button onClick={() => setIsFormModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Project
        </Button>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
              Total Projects
            </CardTitle>
            <FolderKanban className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold">{isLoading ? '-' : totalProjects}</div>
            <p className="text-xs text-muted-foreground mt-1">Active workspace projects</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
              Completed
            </CardTitle>
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold">{isLoading ? '-' : completedProjects}</div>
            <p className="text-xs text-muted-foreground mt-1">Projects finished</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
              Total Tasks
            </CardTitle>
            <ListTodo className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold">{isLoading ? '-' : totalTasks}</div>
            <p className="text-xs text-muted-foreground mt-1">Tasks across all projects</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
              Overall Progress
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold mb-2">
              {isLoading ? '-' : `${averageProgress}%`}
            </div>
            <Progress value={averageProgress} />
          </CardContent>
        </Card>
      </div>

      {/* Quick Search & Table Overview */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b p-4 md:p-6">
          <CardTitle className="text-base font-semibold">Projects Overview</CardTitle>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-9"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6">
              <TableSkeleton rows={4} />
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Belum ada project. Buat project pertama Anda!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wider border-b">
                  <tr>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Progress</th>
                    <th className="px-6 py-3">Schedule</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredProjects.slice(0, 5).map((project) => (
                    <tr
                      key={project.id}
                      onClick={() => navigate(`/projects/${project.id}`)}
                      className="hover:bg-muted/30 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 font-semibold text-foreground">
                        {project.name}
                      </td>
                      <td className="px-6 py-4">
                        <ProjectStatusBadge status={project.status} />
                      </td>
                      <td className="px-6 py-4 w-48">
                        <Progress value={project.progress} showText />
                      </td>
                      <td className="px-6 py-4 text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(project.startDate)} - {formatDate(project.endDate)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="View Details"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/projects/${project.id}`);
                            }}
                          >
                            <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Edit Project"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProject(project);
                              setIsFormModalOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Delete Project"
                            onClick={(e) => {
                              e.stopPropagation();
                              setProjectToDelete(project);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal & Dialogs */}
      <ProjectFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        projectToEdit={selectedProject}
      />

      <DeleteProjectDialog
        isOpen={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        project={projectToDelete}
      />
    </div>
  );
};
