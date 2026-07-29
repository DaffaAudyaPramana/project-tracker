import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/common/EmptyState';
import { CheckSquare } from 'lucide-react';

export const TaskModule: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
        <p className="text-sm text-muted-foreground">View and manage assigned tasks across all projects.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task Management</CardTitle>
          <CardDescription>Feature under development for future sprints.</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={CheckSquare}
            title="No Tasks Found"
            description="Tasks will be integrated with the backend API in the upcoming sprints."
          />
        </CardContent>
      </Card>
    </div>
  );
};
