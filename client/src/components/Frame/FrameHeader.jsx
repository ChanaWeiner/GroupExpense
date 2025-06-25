import React from 'react';

export default function FrameHeader({ frame, total }) {
  return (
    <header className="frame-header" style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <h1>{frame.groupName}</h1>
      <p>
        מסגרת הוצאות: {frame.name} | תאריך פתיחה: {new Date(frame.created_at).toLocaleDateString('he-IL')}
      </p>
      <p>תיאור: {frame.description}</p>
      <h2 style={{ color: 'green' }}>סה"כ הוצאות: ₪{total.toFixed(2)}</h2>
    </header>
  );
}
