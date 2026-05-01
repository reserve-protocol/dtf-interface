import {
  get,
  post,
  type GetOptions,
  type PostOptions,
} from "../transports/api.js";

export type DtfClientApi = {
  readonly baseUrl: string;
  readonly get: <TResult>(
    options: Omit<GetOptions, "baseUrl">,
  ) => Promise<TResult>;
  readonly post: <TResult, TBody = unknown>(
    options: Omit<PostOptions<TBody>, "baseUrl">,
  ) => Promise<TResult>;
};

export function createDtfClientApi({
  baseUrl,
}: {
  readonly baseUrl: string;
}): DtfClientApi {
  return {
    baseUrl,
    get(options) {
      return get({
        ...options,
        baseUrl,
      });
    },
    post(options) {
      return post({
        ...options,
        baseUrl,
      });
    },
  };
}
