import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '@/hooks/useProjects';
import type { Project, ProjectStatus } from '@/types/project.types';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ProjectStatusBadge } from '@/components/common/ProjectStatusBadge';
import { EmptyState } from '@/components/common/EmptyState';
import { TableSkeleton } from '@/components/common/SkeletonLoader';
import { ProjectFormModal } from './components/ProjectFormModal';
import { DeleteProjectDialog } from './components/DeleteProjectDialog';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  FolderKanban,
  ArrowUpDown,
} from 'lucide-react';

export const ProjectModule: React.FC = () => {
  const navigate = useNavigate();

  // Search, Filter, Sort, Pagination states
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | ''>('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const limit = 10;

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, isError } = useProjects({
    page,
    limit,
    search: debouncedSearch || undefined,
    status: statusFilter || undefined,
    sort: sortField,
    order: sortOrder,
  });

  const projects = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 };

  const handleCreate = () => {
    setSelectedProject(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProject(project);
    setIsFormModalOpen(true);
  };

  const handleDelete = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setProjectToDelete(project);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Project Management</h1>
          <p className="text-sm text-muted-foreground">
            Kelola seluruh project, jadwal, progress, dan status secara terpusat.
          </p>
        </div>
        <Button onClick={handleCreate} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Create Project
        </Button>
      </div>

      {/* Filters & Search Toolbar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search project name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <select
                className="flex h-9 w-full md:w-48 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as ProjectStatus | '');
                  setPage(1);
                }}
              >
                <option value="">All Status</option>
                <option value="TODO">🟡 TODO</option>
                <option value="IN_PROGRESS">🔵 IN_PROGRESS</option>
                <option value="DONE">🟢 DONE</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table & Content */}
      <Card>
        <CardHeader className="p-4 md:p-6 border-b">
          <CardTitle className="text-base font-semibold">
            Projects List ({meta.total})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6">
              <TableSkeleton rows={5} />
            </div>
          ) : isError ? (
            <div className="p-8 text-center text-red-500">
              Gagal memuat data project dari backend.
            </div>
          ) : projects.length === 0 ? (
            <EmptyState
              icon={FolderKanban}
              title="No projects found"
              description="Belum ada project yang sesuai dengan pencarian atau filter Anda."
              actionLabel="Create Project"
              onAction={handleCreate}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wider border-b">
                  <tr>
                    <th
                      className="px-6 py-3 cursor-pointer hover:text-foreground"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-1">
                        Name <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Progress</th>
                    <th
                      className="px-6 py-3 cursor-pointer hover:text-foreground"
                      onClick={() => handleSort('startDate')}
                    >
                      <div className="flex items-center gap-1">
                        Schedule <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {projects.map((project) => (
                    <tr
                      key={project.id}
                      onClick={() => navigate(`/projects/${project.id}`)}
                      className="hover:bg-muted/30 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 font-medium text-foreground">
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            {project.name}
                          </p>
                          {project.description && (
                            <p className="text-xs text-muted-foreground truncate max-w-xs">
                              {project.description}
                            </p>
                          )}
                        </div>
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
                            onClick={(e) => handleEdit(project, e)}
                          >
                            <Pencil className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Delete Project"
                            onClick={(e) => handleDelete(project, e)}
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

          {/* Pagination Controls */}
          {meta.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t">
              <span className="text-xs text-muted-foreground">
                Showing Page {meta.page} of {meta.totalPages} ({meta.total} total items)
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= meta.totalPages}
                  onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create / Edit Form Modal */}
      <ProjectFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        projectToEdit={selectedProject}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteProjectDialog
        isOpen={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        project={projectToDelete}
      />
    </div>
  );
};
