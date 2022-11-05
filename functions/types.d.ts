export interface I_OpenGraphResponse {
  title: string;
  description: string;
  image: string;
  url: string;
  error?: number;
}

export interface I_OpenGraphResponseBody {
  data?: I_OpenGraphResponse;
  success: boolean;
  error?: string;
}

export type T_PageSnapshotResponse = BlobPart;

export interface I_PageSnapshotResponseBody {
  data?: T_PageSnapshotResponse;
  success: boolean;
  error?: string;
}
