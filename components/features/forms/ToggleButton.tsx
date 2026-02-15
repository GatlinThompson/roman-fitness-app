import styles from "./ToggleButton.module.css";

type ToggleButtonProps = {
  toggled: boolean;
  title: string;
  OnChange: () => void;
};

export default function ToggleButton({
  toggled,
  OnChange,
  title,
}: ToggleButtonProps) {
  return (
    <div className="grid text-lg font-medium gap-1">
      <span className="text-white font-medium">{title}</span>
      <button
        type="button"
        className={`w-[100px] h-[40px] rounded-3xl  ${
          toggled ? "cool-red" : "glass-black"
        } ${styles["toggle-button"]} `}
        onClick={OnChange}
      >
        <div className="flex h-full text-white font-semibold p-0.5">
          <div
            className={`h-full w-[36px] rounded-3xl transition-all duration-300 ease-in-out flex items-center justify-center ${
              toggled ? "translate-x-[60px] bg-zinc-200" : "bg-zinc-500"
            }`}
          ></div>
        </div>
      </button>
    </div>
  );
}
