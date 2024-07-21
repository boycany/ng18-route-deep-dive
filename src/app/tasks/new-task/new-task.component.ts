import { Component, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TasksService } from '../tasks.service';
import { RouterLink, Router, CanDeactivateFn } from '@angular/router';

@Component({
  selector: 'app-new-task',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './new-task.component.html',
  styleUrl: './new-task.component.css',
})
export class NewTaskComponent {
  userId = input.required<string>();
  enteredTitle = signal('');
  enteredSummary = signal('');
  enteredDate = signal('');
  submitted = signal(false);
  private tasksService = inject(TasksService);
  private router = inject(Router);

  onSubmit() {
    this.tasksService.addTask(
      {
        title: this.enteredTitle(),
        summary: this.enteredSummary(),
        date: this.enteredDate(),
      },
      this.userId()
    );
    this.submitted.set(true);

    this.router.navigate(['/users', this.userId(), 'tasks'], {
      replaceUrl: true,
      // Set replaceUrl to true to make sure that this navigation action works like
      // a redirect and ensures that the user can't use the back button to go back to
      // this page (Add New Task page) where they're coming from.
      queryParamsHandling: 'preserve',
    });
  }
}

export const canLeaveEditPage: CanDeactivateFn<NewTaskComponent> = (
  component
) => {
  const { enteredTitle, enteredSummary, enteredDate, submitted } = component;

  if (submitted()) {
    return true;
  }

  if (enteredTitle() || enteredSummary() || enteredDate()) {
    return window.confirm('Are you sure you want to discard your changes?');
  }
  return true;
};
