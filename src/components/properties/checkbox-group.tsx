"use client";

import { Checkbox } from "@/components/ui/checkbox";

export function CheckboxGroup({
  options,
  value,
  onChange,
  columns = 2,
}: {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  columns?: 1 | 2 | 3;
}) {
  function toggle(option: string, checked: boolean) {
    if (checked) onChange([...value, option]);
    else onChange(value.filter((item) => item !== option));
  }

  const gridCols = columns === 3 ? "sm:grid-cols-3" : columns === 2 ? "sm:grid-cols-2" : "";

  return (
    <div className={`grid grid-cols-1 gap-2 ${gridCols}`}>
      {options.map((option) => (
        <label key={option} className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={value.includes(option)}
            onCheckedChange={(checked) => toggle(option, checked === true)}
          />
          {option}
        </label>
      ))}
    </div>
  );
}
