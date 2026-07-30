import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { DashboardModule } from '@/modules/dashboard/DashboardModule';
import { ProjectModule } from '@/modules/project/ProjectModule';
import { ProjectDetailPage } from '@/modules/project/ProjectDetailPage';
import { ProjectTasksPage } from '@/modules/task/pages/ProjectTasksPage';
import { TaskModule } from '@/modules/task/TaskModule';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <DashboardModule />,
      },
      {
        path: 'projects',
        element: <ProjectModule />,
      },
      {
        path: 'projects/:id',
        element: <ProjectDetailPage />,
      },
      {
        path: 'projects/:projectId/tasks',
        element: <ProjectTasksPage />,
      },
      {
        path: 'tasks',
        element: <TaskModule />,
      },
      {
        path: 'settings',
        element: (
          <div className="p-4">
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground text-sm mt-1">Configure your application settings here.</p>
          </div>
        ),
      },
    ],
  },
]);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};
