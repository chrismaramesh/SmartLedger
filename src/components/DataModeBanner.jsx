import React from 'react';
import { Info, CheckCircle2, RotateCcw, ShieldCheck, ArrowRight } from 'lucide-react';

export const DataModeBanner = ({ dataMode, onSwitchMode, onResetSampleData, onClearRealData }) => {
  const isSample = dataMode === 'sample';

  return (
    <div className={`mode-banner ${!isSample ? 'real-mode' : ''}`}>
      <div className="mode-banner-text">
        {isSample ? <Info size={19} /> : <CheckCircle2 size={19} />}
        <div>
          <span className={`badge-tag ${isSample ? 'badge-sample' : 'badge-real'}`} style={{ marginRight: '0.5rem' }}>
            {isSample ? 'Sample Preview Mode' : 'Live User Mode'}
          </span>
          <span style={{ fontSize: '0.86rem', color: isSample ? '#1e3a8a' : '#14532d' }}>
            {isSample 
              ? 'You are viewing realistic demo data. Any edits here will not affect your real transactions.'
              : 'You are viewing your real saved financial transactions stored locally on this device.'}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        {isSample ? (
          <>
            <button 
              className="btn-secondary" 
              onClick={onResetSampleData}
              title="Reset sample transactions to factory defaults"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.785rem', borderColor: '#bfdbfe' }}
            >
              <RotateCcw size={14} />
              <span>Reset Demo</span>
            </button>

            <button 
              className="btn-primary"
              onClick={() => onSwitchMode('real')}
              style={{ padding: '0.35rem 0.85rem', fontSize: '0.785rem' }}
            >
              <ShieldCheck size={14} />
              <span>Switch to Live Ledger</span>
            </button>
          </>
        ) : (
          <>
            <button 
              className="btn-secondary" 
              onClick={onClearRealData}
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.785rem', color: '#b91c1c' }}
            >
              <span>Clear My Data</span>
            </button>

            <button 
              className="btn-secondary"
              onClick={() => onSwitchMode('sample')}
              style={{ padding: '0.35rem 0.85rem', fontSize: '0.785rem' }}
            >
              <span>View Sample Demo</span>
              <ArrowRight size={14} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
