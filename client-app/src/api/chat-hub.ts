import { store } from './../stores/store';
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from '@microsoft/signalr';
import { getClientTimeZone } from '../utils/common';

let hubConnection: HubConnection | undefined = undefined;
const isDevelopment = process.env.NODE_ENV === 'development';

const baseUrl = process.env.REACT_APP_SERVER_URL;
export async function createHubConnection(activityId: string) {
  hubConnection = new HubConnectionBuilder()
    .withUrl(
      `${baseUrl}chat?activityId=${activityId}&time_zone=${getClientTimeZone()}`,
      {
        accessTokenFactory: () => store.userStore.user?.token!,
      }
    )
    .withAutomaticReconnect()
    .configureLogging(isDevelopment ? LogLevel.Information : LogLevel.Warning)
    .build();

  await hubConnection.start();
}

export function registerEventToHub(
  eventName: string,
  func: (...args: any[]) => any
) {
  hubConnection?.on(eventName, func);
}

export function stopHubConnection() {
  if (hubConnection) {
    const result = hubConnection.stop();
    hubConnection = undefined;
    return result;
  }
  return Promise.resolve();
}

export function callMethod(methodName: string, ...args: any[]) {
  if (hubConnection) {
    return hubConnection.invoke(methodName, ...args);
  }
  return Promise.resolve();
}
