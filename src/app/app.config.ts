import { ApplicationConfig } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withRouterConfig,
} from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(),
      withRouterConfig({
        paramsInheritanceStrategy: 'always',
        // Set this parameter to 'always',
        // it will ensure that those dynamic path parameter values are injected into child route.
        // (pass user id from UserTasks Component to Tasks Component input binding)
      })
    ),
  ],
};
