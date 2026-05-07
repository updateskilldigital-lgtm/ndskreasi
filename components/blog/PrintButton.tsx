'use client'

export function PrintButton() {
  return (
    <div style={{ background: '#1a1564', color: '#fff', padding: '12px 20px', marginBottom: '20px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '14px' }}>Tekan <strong>Ctrl+P</strong> (atau Cmd+P di Mac) → Save as PDF</span>
      <button
        onClick={() => window.print()}
        style={{ background: '#f97316', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}
      >
        🖨️ Print / Save PDF
      </button>
    </div>
  )
}
