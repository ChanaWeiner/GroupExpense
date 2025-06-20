export default function GroupSummary({ group, isLoading }) {
  if (isLoading) {
    return <p>Loading group summary...</p>;
  }

  if (!group) {
    return <p>No group data available.</p>;
  }

  return (
    <section className="group-summary">
      <h3 className="group-title">{group.name}</h3>
      <div className="group-details">
        <p><strong>Members:</strong> {group.members.join(', ')}</p>
        <p><strong>Total Balance:</strong> {group.totalBalance}₪</p>
        <p><strong>Active Debts:</strong> {group.activeDebts.length}</p>
      </div>
    </section>
  );
}