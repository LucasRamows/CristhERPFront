import { Card } from "../../../components/ui/card";

export const DashboardStatCard = ({ title, value, trend, icon, color }: any) => {
  const colors: any = {
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <Card className="p-6 bg-card">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-2xl ${colors[color]}`}>{icon}</div>
        <div>
          <p className="text-xs font-bold text-primary uppercase tracking-wider">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h4 className="text-2xl font-black text-primary">{value}</h4>
            <span className="text-[10px] font-black text-emerald-500">
              {trend}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};