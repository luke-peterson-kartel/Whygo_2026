import { useParams, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { useWhyGO } from '@/hooks/useWhyGO';
import { useNotes } from '@/hooks/useNotes';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { OutcomeRow } from '@/components/whygo/OutcomeRow';
import { ArrowLeft, Building2, Users, User, TrendingUp, Target, Calendar, MessageSquare, Send, ListChecks } from 'lucide-react';
import { calculateWhyGOAnalytics } from '@/lib/utils/whygoAnalytics';
import { formatDistanceToNow } from 'date-fns';

export function WhyGODetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { whygo, loading, error, refetch } = useWhyGO(id!);
  const { notes, loading: notesLoading, addNote } = useNotes(id!);
  const [noteText, setNoteText] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  // Calculate analytics
  const analytics = useMemo(() => {
    if (!whygo) return null;
    return calculateWhyGOAnalytics(whygo);
  }, [whygo]);

  const handleAddNote = async () => {
    if (!noteText.trim()) return;

    setIsSubmittingNote(true);
    try {
      await addNote(noteText);
      setNoteText(''); // Clear textarea on success
    } catch (err) {
      console.error('Failed to add note:', err);
      alert('Failed to add note. Please try again.');
    } finally {
      setIsSubmittingNote(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading WhyGO details..." />;
  }

  if (error || !whygo) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <ErrorState
          title="WhyGO Not Found"
          message={error?.message || 'The requested WhyGO could not be found.'}
          action={{
            label: 'Go Back',
            onClick: () => navigate(-1),
          }}
        />
      </div>
    );
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'company':
        return 'bg-purple-100 text-purple-800';
      case 'department':
        return 'bg-blue-100 text-blue-800';
      case 'individual':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'company':
        return <Building2 className="w-4 h-4" />;
      case 'department':
        return <Users className="w-4 h-4" />;
      case 'individual':
        return <User className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back</span>
      </button>

      {/* Header Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        {/* Metadata Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className={`px-3 py-1 text-sm font-semibold rounded-full flex items-center gap-2 ${getLevelColor(whygo.level)}`}>
            {getLevelIcon(whygo.level)}
            {whygo.level.charAt(0).toUpperCase() + whygo.level.slice(1)}
          </span>
          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(whygo.status)}`}>
            {whygo.status.charAt(0).toUpperCase() + whygo.status.slice(1)}
          </span>
          {whygo.department && (
            <span className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full">
              {whygo.department}
            </span>
          )}
          <span className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full">
            Owner: {whygo.ownerName}
          </span>
        </div>

        {/* WHY Statement */}
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Why</h2>
          <p className="text-2xl font-bold text-gray-900 leading-relaxed">{whygo.why}</p>
        </div>

        {/* GOAL Statement */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Goal</h2>
          <p className="text-xl text-gray-800 leading-relaxed">{whygo.goal}</p>
        </div>
      </div>

      {/* Analytics Summary Section */}
      {analytics && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Analytics Summary</h2>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {/* YTD Completion */}
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700 mb-2">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm font-semibold">{analytics.currentQuarter} Progress</span>
              </div>
              <p className="text-3xl font-bold text-blue-900">{analytics.ytdCompletion.percentage}%</p>
              <p className="text-sm text-blue-700 mt-1">
                {analytics.ytdCompletion.totalActual.toLocaleString()} / {analytics.ytdCompletion.totalTarget.toLocaleString()}
              </p>
            </div>

            {/* Overall Health */}
            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <div className="flex items-center gap-2 text-green-700 mb-2">
                <Target className="w-5 h-5" />
                <span className="text-sm font-semibold">Overall Health</span>
              </div>
              <p className="text-3xl font-bold text-green-900">
                {analytics.health.overallStatus === '+' && '✓ On Track'}
                {analytics.health.overallStatus === '~' && '~ At Risk'}
                {analytics.health.overallStatus === '-' && '✗ Off Track'}
                {analytics.health.overallStatus === null && 'Not Started'}
              </p>
              <p className="text-sm text-green-700 mt-1">
                {analytics.health.onTrack} of {analytics.health.total} on track
              </p>
            </div>

            {/* Days Until Quarter End */}
            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <div className="flex items-center gap-2 text-purple-700 mb-2">
                <Calendar className="w-5 h-5" />
                <span className="text-sm font-semibold">{analytics.currentQuarter} Ends In</span>
              </div>
              <p className="text-3xl font-bold text-purple-900">{analytics.daysUntilQuarterEnd}</p>
              <p className="text-sm text-purple-700 mt-1">days remaining</p>
            </div>
          </div>

          {/* Health Breakdown Bar */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Outcome Status Breakdown</h3>
            <div className="h-8 rounded-lg overflow-hidden flex shadow-sm">
              {analytics.health.onTrack > 0 && (
                <div
                  className="bg-green-500 flex items-center justify-center text-white text-sm font-semibold"
                  style={{ width: `${(analytics.health.onTrack / analytics.health.total) * 100}%` }}
                >
                  {analytics.health.onTrack}
                </div>
              )}
              {analytics.health.slightlyOff > 0 && (
                <div
                  className="bg-yellow-500 flex items-center justify-center text-white text-sm font-semibold"
                  style={{ width: `${(analytics.health.slightlyOff / analytics.health.total) * 100}%` }}
                >
                  {analytics.health.slightlyOff}
                </div>
              )}
              {analytics.health.offTrack > 0 && (
                <div
                  className="bg-red-500 flex items-center justify-center text-white text-sm font-semibold"
                  style={{ width: `${(analytics.health.offTrack / analytics.health.total) * 100}%` }}
                >
                  {analytics.health.offTrack}
                </div>
              )}
              {analytics.health.notStarted > 0 && (
                <div
                  className="bg-gray-400 flex items-center justify-center text-white text-sm font-semibold"
                  style={{ width: `${(analytics.health.notStarted / analytics.health.total) * 100}%` }}
                >
                  {analytics.health.notStarted}
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-3 text-sm">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                {analytics.health.onTrack} on track
              </span>
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                {analytics.health.slightlyOff} slightly off
              </span>
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                {analytics.health.offTrack} off track
              </span>
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                {analytics.health.notStarted} not started
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Outcomes Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <ListChecks className="w-6 h-6 text-gray-700" />
          <h2 className="text-xl font-semibold text-gray-900">Outcomes</h2>
          <span className="text-sm text-gray-500">({whygo.outcomes?.length || 0})</span>
        </div>

        {whygo.outcomes && whygo.outcomes.length > 0 ? (
          <div className="space-y-3">
            {whygo.outcomes.map((outcome, index) => (
              <OutcomeRow
                key={outcome.id}
                outcome={outcome}
                number={index + 1}
                whygoId={whygo.id}
                refetch={refetch}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-600">
            <ListChecks className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p>No outcomes defined yet.</p>
          </div>
        )}
      </div>

      {/* Notes/Activity Feed Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="w-6 h-6 text-gray-700" />
          <h2 className="text-xl font-semibold text-gray-900">Notes & Activity</h2>
          <span className="text-sm text-gray-500">({notes.length})</span>
        </div>

        {/* Add Note Form */}
        <div className="mb-4">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Add a note about this WhyGO..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={3}
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleAddNote}
              disabled={!noteText.trim() || isSubmittingNote}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
              {isSubmittingNote ? 'Adding...' : 'Add Note'}
            </button>
          </div>
        </div>

        {/* Notes Feed */}
        {notesLoading ? (
          <div className="text-center py-8 text-gray-600">Loading notes...</div>
        ) : notes.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p>No notes yet. Be the first to add one!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div key={note.id} className="border-l-4 border-blue-500 bg-gray-50 rounded-r-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                      {note.authorName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{note.authorName}</p>
                      <p className="text-xs text-gray-500">
                        {note.createdAt && formatDistanceToNow(note.createdAt.toDate(), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-gray-800 whitespace-pre-wrap">{note.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
