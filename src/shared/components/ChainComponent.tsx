/* eslint-disable @next/next/no-img-element */
type Props = {
  imgUrl: string;
  label?: string;
};

export const ChainComponent = ({ imgUrl, label }: Props) => {
  return (
    <div className="flex items-center gap-2">
      <div className="h-8 w-8 aspect-square bg-foreground p-1.5 rounded-lg">
        <img
          src={imgUrl}
          className="w-full h-full object-contain"
          alt={"Image Chain " + label}
        />
      </div>
      {label && <span>{label}</span>}
    </div>
  );
};
