import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";

export default function TeamPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Team <span className="text-accent">Management</span>
        </h1>
        <p className="text-muted-foreground mt-1">Collaborate with your team</p>
      </div>

      {/* Coming Soon */}
      <div className="text-center py-24 bg-muted/50 rounded-xl border-2 border-dashed border-border">
        <FontAwesomeIcon icon={faUsers} className="text-6xl text-muted-foreground mb-6" />
        <h2 className="text-2xl font-bold text-foreground mb-3">Coming Soon</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          Team management features are under development. Soon you&apos;ll be able to invite collaborators,
          manage permissions, and work together on your games.
        </p>

        {/* Planned Features */}
        <div className="max-w-lg mx-auto">
          <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">Planned Features</h3>
          <ul className="text-left space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-accent mt-0.5">•</span>
              <span>Invite team members to your projects</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent mt-0.5">•</span>
              <span>Role-based permissions (Owner, Admin, Editor, Viewer)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent mt-0.5">•</span>
              <span>Team activity log and audit trail</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent mt-0.5">•</span>
              <span>Real-time collaboration on game development</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent mt-0.5">•</span>
              <span>Team settings and member management</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
