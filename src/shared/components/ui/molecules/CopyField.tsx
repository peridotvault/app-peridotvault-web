import { toastService } from "@/shared/infra/toast/toast.service";
import { ButtonWithSound } from "../atoms/ButtonWithSound";

export const CopyField = ({ text }: { text: string }) => {
  const copyTextToClipboard = async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      toastService.success("Text successfully copied to clipboard");
    } catch (err) {
      toastService.success("Failed to copy text: " + err);
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-4 relative overflow-hidden flex gap-4 w-full">
      <input type="text" name="" className="w-80" value={text} />
      <ButtonWithSound
        onClick={() => copyTextToClipboard(text)}
        className="py-2 px-4 bg-accent hover:bg-accent-card duration-300 cursor-pointer rounded-full"
      >
        Copy
      </ButtonWithSound>
    </div>
  );
};
