export const ContainerPadding = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={"max-w-420 mx-auto w-full px-6 sm:px-8 md:px-12 " + className}
    >
      {children}
    </div>
  );
};
