import { ModulePage } from "@/app/modules/students/components/modulePage";

export default function StudentLeaderboardPage() {
  return (
    <ModulePage
      title="Leaderboard"
      description="See your rank, compare performance with peers, and stay motivated."
      badge="Ranking"
      highlight="Peer ranking"
      items={[
        "Track your current batch position in real time.",
        "Compare your scores with classmates and top performers.",
        "Use your position as a daily motivation booster.",
      ]}
      metrics={[
        { label: "Your rank", value: "#7" },
        { label: "Batch size", value: "24" },
        { label: "Top score", value: "97%" },
      ]}
      actions={<button className="w-full rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">View full leaderboard</button>}
    />
  );
}
