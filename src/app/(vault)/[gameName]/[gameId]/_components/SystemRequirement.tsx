import { TypographyH2 } from "@/shared/components/ui/TypographyH2";
import { STYLE_ROUNDED_CARD } from "@/shared/constants/style";

export const SystemRequirement = () => {
  const list = [
    {
      title: "OS",
      description: "Windows 10",
    },
    {
      title: "CPU",
      description: "Intel Core i5-4430 / AMD FX-6300",
    },
    {
      title: "Memory",
      description: "8 GB RAM",
    },
    {
      title: "GPU",
      description: "NVIDIA GeForce GTX 960 2GB / AMD Radeon R7 370 2GB",
    },
    {
      title: "Storage",
      description: "60 GB",
    },
  ];
  return (
    <section className="flex flex-col gap-4">
      <TypographyH2 text="System Requirements" />
      <div className={"bg-card p-10 " + STYLE_ROUNDED_CARD}>
        <dl className="grid grid-cols-2 gap-6">
          {list.map((item, index) => (
            <div className="flex flex-col gap-1" key={index}>
              <dt className="text-white/50">{item.title}</dt>
              <dd className="text-xl">{item.description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};
