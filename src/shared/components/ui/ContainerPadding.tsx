import { STYLE_PADDING } from "@/shared/constants/style";

export const ContainerPadding = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={"max-w-370 mx-auto w-full " + className + STYLE_PADDING}>
      {children}
    </div>
  );
};
