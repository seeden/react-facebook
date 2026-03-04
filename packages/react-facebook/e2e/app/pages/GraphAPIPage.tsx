import React, { useState } from 'react';
import { FacebookProvider, useGraphAPI } from 'react-facebook';

interface UserData {
  id: string;
  name: string;
}

function GraphAPIDemo() {
  const { data, loading, error, fetch, reset } = useGraphAPI<UserData>({
    path: '/me',
    params: { fields: 'id,name' },
    autoFetch: false,
  });

  return (
    <div data-testid="graph-api-demo">
      <div data-testid="loading-state">{loading ? 'loading' : 'idle'}</div>
      <div data-testid="data-state">{data ? JSON.stringify(data) : 'no-data'}</div>
      <div data-testid="error-state">{error ? error.message : 'no-error'}</div>
      <button data-testid="fetch-button" onClick={() => fetch()}>
        Fetch
      </button>
      <button data-testid="reset-button" onClick={() => reset()}>
        Reset
      </button>
    </div>
  );
}

function AutoFetchDemo() {
  const { data, loading, error } = useGraphAPI<UserData>({
    path: '/me',
    params: { fields: 'id,name' },
    autoFetch: true,
  });

  return (
    <div data-testid="auto-fetch-demo">
      <div data-testid="auto-loading">{loading ? 'loading' : 'idle'}</div>
      <div data-testid="auto-data">{data ? JSON.stringify(data) : 'no-data'}</div>
      <div data-testid="auto-error">{error ? error.message : 'no-error'}</div>
    </div>
  );
}

export default function GraphAPIPage() {
  return (
    <FacebookProvider appId="671184534658954">
      <div data-testid="graph-api-page">
        <section data-testid="scenario-manual">
          <GraphAPIDemo />
        </section>
        <section data-testid="scenario-auto">
          <AutoFetchDemo />
        </section>
      </div>
    </FacebookProvider>
  );
}
