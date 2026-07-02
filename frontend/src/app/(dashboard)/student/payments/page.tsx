import { ModulePage } from "@/app/modules/students/components/modulePage";

export default function StudentPaymentsPage() {
  return (
    <ModulePage
      title="Payments"
      description="Review invoices, payment history, and outstanding balances securely."
      badge="Billing"
      highlight="Payment status"
      items={[
        "See all recent transactions and payment dates.",
        "Track pending dues and fee reminders.",
        "Download receipts whenever needed.",
      ]}
      metrics={[
        { label: "Paid this month", value: "৳12,000" },
        { label: "Pending", value: "৳4,000" },
        { label: "Last payment", value: "Jun 15" },
      ]}
      actions={<button className="w-full rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Pay now</button>}
    />
  );
}
