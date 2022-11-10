// These are the type defs for the backend serverless functions.

export interface I_OpenGraphResponse {
  title: string;
  description: string;
  image: string | undefined;
  url: string;
  error?: number;
}

export interface I_OpenGraphResponseBody {
  data?: I_OpenGraphResponse;
  success: boolean;
  error?: string;
}

export type T_PageSnapshotResponse = string; // base64 string

export interface I_PageSnapshotResponseBody {
  data?: T_PageSnapshotResponse;
  success: boolean;
  error?: string;
}
