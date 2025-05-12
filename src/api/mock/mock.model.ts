export enum ECyclePriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export interface IEvent {
  meetings: number;
  emails: number;
  calls: number;
  follows: number;
}

export interface IEventsProjection {
  day: number;
  events: IEvent;
}

export interface ICycleEvent {
  day: number;
  meetings: number;
  emails: number;
  calls: number;
  follows: number;
}

export interface ICycle {
  name: string;
  availableEntities: number;
  priority: ECyclePriority;
  structure: ICycleEvent[];
}

export interface IMockApiResponse {
  eventsProjection: IEventsProjection[];
  cycles: ICycle[];
}
