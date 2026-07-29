import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { EmptyState } from '@/components/common/EmptyState';
import { CardSkeleton } from '@/components/common/SkeletonLoader';
import { Plus, FolderKanban } from 'lucide-react';
import { toast } from 'sonner';

export const ProjectModule: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading] = useState(false);
  const [projects] = useState<Array<{ id: string; title: string; description: string }>>([
    {
      id: '1',
      title: 'Project Tracker Frontend',
      description: 'Building modern feature-based architecture React application.',
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground">Manage your workspace projects.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Project
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects created yet"
          description="Get started by creating your first project."
          actionLabel="Create Project"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((p) => (
            <Card key={p.id}>
              <CardHeader>
                <CardTitle>{p.title}</CardTitle>
                <CardDescription>{p.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Demo Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Project"
        description="Enter the details for your new project."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast.success('Project created successfully!');
                setIsModalOpen(false);
              }}
            >
              Save Project
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Project Title</label>
            <Input placeholder="e.g., E-Commerce Redesign" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Description</label>
            <Input placeholder="Short project summary..." />
          </div>
        </div>
      </Modal>
    </div>
  );
};
