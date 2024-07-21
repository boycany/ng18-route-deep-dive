import { Component, computed, inject, input } from '@angular/core';

import { TaskComponent } from './task/task.component';
import { Task } from './task/task.model';
import { TasksService } from './tasks.service';
import { ActivatedRouteSnapshot, RouterLink } from '@angular/router';

@Component({
  selector: 'app-tasks',
  standalone: true,
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
  imports: [TaskComponent, RouterLink],
})
export class TasksComponent {
  userTasks = input.required<Task[]>();
  userId = input.required<string>();
  order = input<'asc' | 'desc' | undefined>(); // due to provider withComponentInputBinding()

  constructor() {}
}

export const resolveUserTasks = (
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
