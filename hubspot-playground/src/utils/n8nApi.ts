export interface HubSpotWebhookEvent {
  callbackId: string;
  origin: {
    portalId: number;
    actionDefinitionId: string;
    actionDefinitionVersion: number;
  };
  object: {
    objectId: number;
    objectType: string;
    properties: Record<string, any>;
  };
  fields: Record<string, any>;
}

export interface N8NResponse {
  success: true;
  data: {
    budget: string;
    lead_name: string;
    lead_email: string;
    representative: string;
    destinations: string[];
    guest_count_range: string;
    adults_only: boolean;
    flights_needed: boolean;
  };
}

export interface N8NErrorResponse {
  success: false;
  error: string;
}

export type N8NResult = N8NResponse | N8NErrorResponse;

const N8N_WEBHOOK_URL = 'https://carlosnatanaelpinheiro.app.n8n.cloud/webhook/destify/call-transcription';

export const workflowAction = (
  onProgress: (percent: number) => void
): Promise<N8NResult> => {
  return new Promise(async (resolve, reject) => {
    onProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress = Math.min(progress + 10, 90);
      onProgress(progress);
    }, 300);

    try {
     const username = 'destifychallenge2026';
      const password = 'destifychallenge2026';

      const credentials = btoa(`${username}:${password}`);

      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`,
        },
      });

      clearInterval(interval);
      const result: N8NResult = await response.json();
      onProgress(result.success ? 100 : 90)
      resolve(result);
    } catch (error) {
      clearInterval(interval);
      reject(error);
    }
  });
};