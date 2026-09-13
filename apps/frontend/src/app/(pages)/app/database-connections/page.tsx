import { DatabaseConnectionPanel } from "@/features/database-connection/components/database-connection-panel";

export default function DatabaseConnectionsPage() {
  return (
    <div className="h-full overflow-y-auto px-6 py-10">
      <DatabaseConnectionPanel />
    </div>
  );
}
