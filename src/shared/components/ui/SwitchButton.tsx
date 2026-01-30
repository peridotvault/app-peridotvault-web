import { useClickSound } from "@/shared/hooks/useClickSound";
import React from "react";

type SwitchButtonProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
  disabled?: boolean;
};

export const SwitchButton = ({
  checked,
  onChange,
  id,
  disabled = false,
}: SwitchButtonProps) => {
  const play = useClickSound("/sounds/click.mp3", 0.6);
  return (
    <label className="relative inline-block h-8 w-14 cursor-pointer rounded-full bg-gray-300 transition [-webkit-tap-highlight-color:transparent] has-checked:bg-accent">
      <input
        className="peer sr-only"
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => {
          if (!disabled) play();
          onChange(event.target.checked);
        }}
      />
      <span className="absolute inset-y-0 start-0 m-1 size-6 rounded-full bg-gray-300 ring-[6px] ring-inset ring-white transition-all peer-checked:start-8 peer-checked:w-2 peer-checked:bg-white peer-checked:ring-transparent"></span>
    </label>
  );
};
