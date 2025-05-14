import mockApiResponse from './eventsAPIResponse.json';
import { IMockApiResponse } from './mock.model';

export function fetchMockApi() {
  return new Promise<IMockApiResponse>((resolve) =>
    resolve(mockApiResponse as IMockApiResponse)
  );
}
