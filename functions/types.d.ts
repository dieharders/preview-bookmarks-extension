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
