import type { RequestObject } from 'db://ccgf-kit/net/defines/net-structs';

export interface InFlightRequest {
    request: RequestObject;
    sendTime?: number;
    timeout?: number;
    replayOnReconnect?: boolean;
    onSuccess?: (response: any) => void;
    onError?: (err: Error) => void;
}
