import { setAuthTokenGetter } from "@workspace/api-client-react";

export function setupAuthInterceptor(getToken: () => Promise<string | null>) {
  setAuthTokenGetter(getToken);
}
