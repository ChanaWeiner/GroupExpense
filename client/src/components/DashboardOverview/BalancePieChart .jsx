import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#f87171', '#60a5fa', '#34d399']; // אדום = חוב, כחול = זכות, ירוק = יתרה

export default function BalancePieChart({ balance }) {
  const data = [
    { name: 'את/ה חייב/ת', value: balance.youOwe },
    { name: 'חייבים לך', value: balance.owedToYou },
    { name: 'יתרה כוללת', value: balance.totalCredit },
  ];

  return (
    <PieChart width={300} height={200}>
      <Pie
        data={data}
        cx="50%" cy="50%" outerRadius={80}
        fill="#8884d8" dataKey="value" label
      >
        {data.map((entry, index) => (
          <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};
