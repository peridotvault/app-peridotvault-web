import { OptimizedImage } from "@/shared/components/ui/atoms/OptimizedImage";

type Props = {
  imgUrl: string;
  label?: string;
};

export const ChainComponent = ({ imgUrl, label }: Props) => {
  return (
    <div className="flex items-center gap-2">
      <div className="h-6 w-6 aspect-square bg-foreground rounded-lg relative">
        <div className="absolute inset-1.5">
          <OptimizedImage
            src={imgUrl}
            fill
            sizes="16px"
            className="object-contain"
            alt={"Image Chain " + label}
          />
        </div>
      </div>
      {label && <span>{label}</span>}
    </div>
  );
};
