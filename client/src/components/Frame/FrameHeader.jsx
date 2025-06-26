import React from 'react';
import '../../styles/FrameHeader.css';
export default function FrameHeader({ frame, total }) {
  return (
    <header className="frame-header">
      <h1 className="frame-header-title">{frame.groupName}</h1>
      <p className="frame-header-meta">
        <span className="frame-header-label">מסגרת הוצאות:</span> {frame.name}
        <span className="frame-header-sep">|</span>
        <span className="frame-header-label">תאריך פתיחה:</span> {new Date(frame.created_at).toLocaleDateString('he-IL')}
        {frame.end_date && (
          <>
            <span className="frame-header-sep">|</span>
            <span className="frame-header-label">תאריך סיום:</span>
            <span className="frame-header-end-date">{new Date(frame.end_date).toLocaleDateString('he-IL')}</span>
          </>
        )}
      </p>
      <p className="frame-header-desc">תיאור: {frame.description}</p>
      <h2 className="frame-header-total">סה"כ הוצאות: <span>₪{total.toFixed(2)}</span></h2>
    </header>
  );
}