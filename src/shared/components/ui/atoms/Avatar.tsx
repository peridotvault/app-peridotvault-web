import clsx from "clsx";

type Props = {
  src: string;
  alt: string;
  size?: number;
  className: string;
};

export default function Avatar({ src, alt, size = 40, className }: Props) {
  return (
    <div
      className={clsx("rounded-full overflow-hidden bg-gray-200", className)}
      style={{ width: size, height: size }}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <span className="flex justify-center items-center text-gray-500">
          {alt?.[0]}
        </span>
      )}
    </div>
  );
}
