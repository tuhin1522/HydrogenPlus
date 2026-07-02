import { PageShell } from "../../../modules/teacher/components/pageShell";
import { EmptyState } from "../../../modules/teacher/components/emptyState";

export default function TeacherProfilePage() {
  return (
    <PageShell
      title="My Profile"
      description="Manage your teaching profile, qualifications, experience, and secure account details."
      badge="Profile"
      actions={<button className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Edit profile</button>}
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-semibold text-primary">AT</div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Amina Tasneem</h2>
              <p className="text-sm text-muted-foreground">Senior Physics Teacher · 8 years experience</p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <p className="text-sm text-muted-foreground">Qualification</p>
              <p className="mt-1 font-medium text-foreground">M.Sc in Physics</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <p className="text-sm text-muted-foreground">Specialization</p>
              <p className="mt-1 font-medium text-foreground">Advanced Mechanics, Olympiad Prep</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <p className="text-sm text-muted-foreground">Experience</p>
              <p className="mt-1 font-medium text-foreground">8 years</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <p className="text-sm text-muted-foreground">Bio</p>
              <p className="mt-1 font-medium text-foreground">Passionate about making complex science intuitive.</p>
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Security</h2>
          <p className="mt-1 text-sm text-muted-foreground">Update your password and keep the account secure.</p>
          <div className="mt-6 space-y-3">
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <p className="text-sm font-medium text-foreground">Change password</p>
              <p className="mt-1 text-sm text-muted-foreground">Use a strong password with at least 8 characters.</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <p className="text-sm font-medium text-foreground">Two-factor verification</p>
              <p className="mt-1 text-sm text-muted-foreground">Coming soon for additional protection.</p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
