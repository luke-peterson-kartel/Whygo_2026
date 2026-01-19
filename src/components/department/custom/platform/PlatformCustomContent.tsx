import { PlatformArchitecture } from './PlatformArchitecture';
import { TalentEngineJourney } from './TalentEngineJourney';

export function PlatformCustomContent() {
  return (
    <div className="space-y-6">
      <PlatformArchitecture />
      <TalentEngineJourney />

      {/* Future additions:
      <Q1Priorities />
      <TeamMemberCascade />
      */}
    </div>
  );
}
