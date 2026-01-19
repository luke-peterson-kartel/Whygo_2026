import { FiveTierPipeline } from './FiveTierPipeline';
import { CommunityEconomics } from './CommunityEconomics';

export function CommunityCustomContent() {
  return (
    <div className="space-y-6">
      <FiveTierPipeline />
      <CommunityEconomics />

      {/* Future additions:
      <Q1Priorities />
      <TalentHandoffMatrix />
      */}
    </div>
  );
}
