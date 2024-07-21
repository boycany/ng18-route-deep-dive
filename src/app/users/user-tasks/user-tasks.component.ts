import { Component, DestroyRef, computed, inject, input } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterLink,
  RouterOutlet,
  RouterStateSnapshot,
} from '@angular/router';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-user-tasks',
  standalone: true,
  templateUrl: './user-tasks.component.html',
  styleUrl: './user-tasks.component.css',
  imports: [RouterLink, RouterOutlet],
})
export class UserTasksComponent {
  private activatedRoute = inject(ActivatedRoute);
  private usersService = inject(UsersService);

  // Input Binding from Provider
  userId = input.required<string>();
  userName = computed(
    () =>
      this.usersService.users.find((user) => user.id === this.userId())?.name
  );

  // ResolveFn
  userNameFromResolve = input.required<string>();

  private destroyRef = inject(DestroyRef);
  constructor() {}

  ngOnInit() {
    // console.log('this.userId() :>> ', this.userId());
    // console.log('this.userName() :>> ', this.userName());
    // console.log('this.userNameFromResolve() :>> ', this.userNameFromResolve());

    const subscription = this.activatedRoute.paramMap.subscribe({
      next: (paramMap) => {
        // console.log('paramMap :>> ', paramMap);
        // console.log('paramMap.get() :>> ', paramMap.get('userId'));
        const userName =
          this.usersService.users.find((u) => u.id === paramMap.get('userId'))
            ?.name || 'Unknown User';
        // console.log('userName from ActivatedRoute :>> ', userName);
      },
    });

    const dataSub = this.activatedRoute.data.subscribe((data) => {
      console.log('data :>> ', data);
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
      dataSub.unsubscribe();
    });
  }
}

export const resolveUserName: ResolveFn<string> = (
  activatedRoute: ActivatedRouteSnapshot,
  routerState: RouterStateSnapshot
) => {
  const usersService = inject(UsersService);
  const userName =
    usersService.users.find(
      (u) => u.id === activatedRoute.paramMap.get('userId')
    )?.name || 'Unknown User';
  return userName;
};

export const resolveTitle: ResolveFn<string> = (
  ActivatedRoute,
  routerState
) => {
  return resolveUserName(ActivatedRoute, routerState) + `\'s Tasks`;
};
