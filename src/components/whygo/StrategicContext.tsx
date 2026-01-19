import { TrendingUp, AlertCircle, AlertTriangle, Lightbulb, Target, Trophy } from 'lucide-react';

export function StrategicContext() {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Strategic Context</h2>

      <div className="space-y-4">
        {/* The Market Shift */}
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-blue-100">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            The Market Shift
          </h3>
          <p className="text-sm text-gray-700">
            Culture now moves faster than ever. Companies are under constant pressure to produce more creative output -
            across more channels, more audiences, and more markets - and to do it efficiently. Creative is no longer episodic.
            It is continuous, distributed, and expected to scale in real time.
          </p>
        </div>

        {/* The Problem */}
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-blue-100">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            The Problem
          </h3>
          <p className="text-sm text-gray-700">
            As companies scale, creative work becomes distributed across teams, agencies, platforms, and markets.
            Output increases, but brand ownership does not. Consistency breaks down, quality becomes inconsistent,
            and insight into what works is lost as work resets from partner to partner.
          </p>
        </div>

        {/* The 70% Problem */}
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-blue-100">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            The 70% Problem
          </h3>
          <p className="text-sm text-gray-700">
            Generative AI accelerates this failure. One-off AI tools deliver quick wins for consumers but fail for enterprise -
            they generalize results and can only deliver approximately 70% accuracy. This is the 70% Problem. Enterprise clients
            require 100% brand accuracy, which demands custom AI models and workflows built on their data, their brand standards,
            and their creative direction.
          </p>
        </div>

        {/* The Kartel Solution */}
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-blue-100">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-green-600" />
            The Kartel Solution
          </h3>
          <p className="text-sm text-gray-700">
            Kartel is Creative Intelligence Infrastructure. We embed generative AI inside creative infrastructure
            so that output can be produced, adapted, and scaled across teams, agencies, and markets - while keeping
            quality, consistency, and learning inside the company. Speed increases, but identity holds. What works compounds
            instead of resetting. Critically, the brand owns its data and its learning.
          </p>
        </div>

        {/* Why 2026 Matters + What Winning Looks Like */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-blue-100">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              Why 2026 Matters
            </h3>
            <p className="text-sm text-gray-700">
              2026 is the year Kartel proves the thesis. Our four priorities are designed to validate market demand,
              demonstrate operational maturity, build the talent engine, and deploy platform infrastructure that creates switching costs.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-blue-100">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              What Winning Looks Like
            </h3>
            <p className="text-sm text-gray-700">
              By end of 2026, Kartel will be the proven Creative Intelligence Infrastructure partner for enterprise brands -
              with referenceable clients across five verticals, operational systems that scale, and a talent engine that compounds our capacity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
