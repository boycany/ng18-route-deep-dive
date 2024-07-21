import { Routes } from '@angular/router';
import { NoTaskComponent } from './tasks/no-task/no-task.component';
import {
  UserTasksComponent,
  resolveUserName,
} from './users/user-tasks/user-tasks.component';
import { NotFoundComponent } from './not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    component: NoTaskComponent,
    title: 'No task selected',
  },
  {
    path: 'users/:userId',
    component: UserTasksComponent,
    /** lazy loading */
    loadChildren: () =>
      import('./users/users.routes').then((mod) => mod.routes),
    /** eager loading */
    // children: userRoutes,
    data: {
      message: 'Hello',
    },
    resolve: {
      userNameFromResolve: resolveUserName,
    },
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
