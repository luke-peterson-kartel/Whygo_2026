import { QCFramework } from './QCFramework';
import { KartelLabsPlatforms } from './KartelLabsPlatforms';

export function GenerativeCustomContent() {
  return (
    <div className="space-y-6">
      <QCFramework />
      <KartelLabsPlatforms />

      {/* Future additions:
      <RoleTracksMatrix />
      <TalentHandoffWorkflow />
      <Q1Priorities />
      */}
    </div>
  );
}
