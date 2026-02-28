import React, { useState } from 'react';
import { CustomCard } from './CustomCard';
import type { N8NResponse } from '../utils/n8nApi';
import { workflowAction } from '../utils/n8nApi';
import './Playground.css';

export const Playground: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultData, setResultData] = useState<N8NResponse['data'] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startSimulation = async () => {
    setIsProcessing(true);
    setResultData(null);
    setError(null);
    setProgress(0);

    try {
      const result = await workflowAction((p) => setProgress(p));

      if (result.success) {
        setResultData(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Erro ao conectar com o n8n.');
    }

    setIsProcessing(false);
  };

  const cardProps = {
    title: resultData ? `${resultData.lead_name}'s Overview` : 'Customer Overview',
    description: resultData
      ? `Representative: ${resultData.representative}`
      : 'Key metrics and status for this account.',
    status: (error ? 'danger' : progress === 100 ? 'success' : isProcessing ? 'info' : 'warning') as any,
    statusLabel: error ? 'failed' : progress === 100 ? 'Synced' : isProcessing ? 'Processing...' : 'Pending Sync',
    alertMessage: error
      ? error
      : progress === 100
      ? 'Workflow action completed successfully!'
      : isProcessing
      ? 'Processing with n8n...'
      : undefined,
    stats: [
      { label: 'Budget', value: resultData?.budget ?? '-' },
      { label: 'Destinations', value: resultData ? resultData.destinations.join(', ') : '-' },
      { label: 'Guests', value: resultData?.guest_count_range ?? '-' },
      { label: 'Adults Only', value: resultData ? (resultData.adults_only ? 'Yes' : 'No') : '-' },
    ],
    progressValue: progress,
    progressLabel: isProcessing ? 'Workflow Action Progress' : error ? 'Sync Interrupted' : 'Last Sync Status',
    isProcessing,
    onTrigger: startSimulation,
    webhookData: resultData,
  };

  return (
    <div className="playground-container">
      <main className="playground-stage">
        <div className="stage-content">
          <div className="card-wrapper">
            <CustomCard {...cardProps} />
          </div>
        </div>
      </main>
    </div>
  );
};