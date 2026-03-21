import React from 'react';
import { STATUS_COLORS } from '../../utils/constants';

export default function Badge({ status }) {
  const style = STATUS_COLORS[status] || { bg: '#f3f4f6', color: '#374151' };
  return (
    <span style={{
      background: style.bg, color: style.color,
      padding: '3px 10px', borderRadius: '20px',
      fontSize: '12px', fontWeight: 600,
      display: 'inline-block', whiteSpace: 'nowrap'
    }}>
      {status}
    </span>
  );
}
