import { store } from './../stores/store';
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from '@microsoft/signalr';
import { getClientTimeZone } from '../utils/common';

let hubConnection: HubConnection | undefined = undefined;

export async function createHubConnection(activityId: string) {
  hubConnection = new HubConnectionBuilder()
    .withUrl(
      `/chat?activityId=${activityId}&time_zone=${getClientTimeZone()}`,
      {
        accessTokenFactory: () => store.userStore.user?.token!,
      }
    )
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
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
