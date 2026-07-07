'use client';

interface ParamSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  color?: string;
  onChange: (val: number) => void;
}

export default function ParamSlider({
  label,
  value,
  min,
  max,
  step = 0.1,
  unit,
  color = 'var(--color-primary)',
  onChange,
}: ParamSliderProps) {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm" style={{ color: 'var(--text-body)' }}>
          {label}
        </span>
        <span className="text-sm font-mono font-semibold" style={{ color }}>
          {typeof value === 'number' ? value.toFixed(step < 1 ? 1 : 0) : value} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full"
      />
      <div className="flex justify-between text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
