import {
  ActivatedRouteSnapshot,
  CanMatchFn,
  RedirectCommand,
  ResolveFn,
  Router,
  Routes,
} from '@angular/router';
import {
  NewTaskComponent,
  canLeaveEditPage,
} from '../tasks/new-task/new-task.component';
import { resolveTitle } from './user-tasks/user-tasks.component';
import { inject } from '@angular/core';
import { TasksService } from '../tasks/tasks.service';
import { Task } from '../tasks/task/task.model';
import { TasksComponent } from '../tasks/tasks.component';

const resolveUserTasks: ResolveFn<Task[]> = (
  activatedRouteSnapshot: ActivatedRouteSnapshot
) => {
  const order = activatedRouteSnapshot.queryParams['order'];
  const tasksService = inject(TasksService);
  const tasks = tasksService
    .allTasks()
    .filter(
      (task) => task.userId === activatedRouteSnapshot.paramMap.get('userId')
    );
  console.log('tasks :>> ', tasks);

  /** !order means default sort in DESC
   * (order && oreder === 'desc') means when user click on sort button in DESC */
  if (!order || (order && order === 'desc')) {
    tasks.sort((a, b) => (a.dueDate > b.dueDate ? -1 : 1));
  } else {
    tasks.sort((a, b) => (a.dueDate > b.dueDate ? 1 : -1));
  }

  return tasks.length ? tasks : [];
};

const dummyCanMatch: CanMatchFn = (route, segments) => {
  console.log('routes :>> ', routes);
  console.log('segments :>> ', segments);
  const router = inject(Router);
  const shouldGetAccess = Math.random();
  if (shouldGetAccess < 0.5) {
    return true;
  }
  return new RedirectCommand(router.parseUrl('/unauthorized'));
};

export const routes: Routes = [
  {
    path: '',
    /** Because the users.routes are lazy loading, so set TasksService as providers here will be lazy loading */
    providers: [TasksService],
    children: [
      {
        path: '',
        redirectTo: 'tasks',
        pathMatch: 'prefix',
        /**
         * If set to 'prefix', Angular would take a look at this path combined with any parent route paths, if available.
         * And it checks if the URL that has been entered into the browser start with this path. ('')
         * This path ('') combined with parent's path, if the current url starts with that overall path.
         *
         * If we set pathMatch 'prefix' to the NoTaskComponent, it will report possible infinite redirect error.
         * But set to 'full', it won't. Because it checks the full path matched with the current url.
         */
      },
      {
        path: 'tasks',
        component: TasksComponent,
        // loadComponent: () =>
        //   import('../tasks/tasks.component').then((mod) => mod.TasksComponent),
        /** set to 'always' due to onComplete button click, it will reload the current path, but params didn't change */
        runGuardsAndResolvers: 'always',
        resolve: {
          userTasks: resolveUserTasks,
        },
        title: resolveTitle,
        // canMatch: [dummyCanMatch],
      },
      {
        path: 'tasks/new',
        component: NewTaskComponent,
        canDeactivate: [canLeaveEditPage],
      },
    ],
  },
];
