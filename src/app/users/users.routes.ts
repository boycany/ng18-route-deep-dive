import { CanMatchFn, RedirectCommand, Router, Routes } from '@angular/router';
import { TasksComponent, resolveUserTasks } from '../tasks/tasks.component';
import {
  NewTaskComponent,
  canLeaveEditPage,
} from '../tasks/new-task/new-task.component';
import { resolveTitle } from './user-tasks/user-tasks.component';
import { inject } from '@angular/core';

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
];
