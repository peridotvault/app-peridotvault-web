import { CopyField } from "../molecules/CopyField";

export const Share = () => {
  const url = window.location.href;

  return (
    <section className="flex flex-col gap-4 p-6">
      <h2 className="text-2xl">Share</h2>
      <CopyField text={url} />
    </section>
  );
};
