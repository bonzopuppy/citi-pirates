interface FundraisingProgressProps {
  raised: number;
  goal: number;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function FundraisingProgress({
  raised,
  goal,
  showDetails = true,
  size = 'md',
}: FundraisingProgressProps) {
  const percentage = Math.min((raised / goal) * 100, 100);
  const formattedRaised = raised.toLocaleString('en-US');
  const formattedGoal = goal.toLocaleString('en-US');

  const heights = {
    sm: 'h-3',
    md: 'h-6',
    lg: 'h-8',
  };

  return (
    <div className="w-full">
      {showDetails && (
        <div className="flex justify-between items-end mb-3">
          <div>
            <span className="font-display text-3xl md:text-4xl text-white">
              ${formattedRaised}
            </span>
            <span className="text-[#888] ml-2">raised</span>
          </div>
          <div className="text-right">
            <span className="text-[#888]">of </span>
            <span className="font-display text-xl text-[#CC0000]">
              ${formattedGoal}
            </span>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className={`progress-bar rounded-sm ${heights[size]}`}>
        <div
          className={`progress-fill ${heights[size]} rounded-sm`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {showDetails && (
        <div className="flex justify-between items-center mt-2">
          <span className="text-[#888] text-sm">
            {percentage.toFixed(0)}% of goal
          </span>
          <span className="text-[#888] text-sm">
            ${(goal - raised).toLocaleString('en-US')} to go
          </span>
        </div>
      )}
    </div>
  );
}
