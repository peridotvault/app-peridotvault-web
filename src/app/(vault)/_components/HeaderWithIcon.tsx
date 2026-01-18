import { TypographyH2 } from "@/shared/components/ui/TypographyH2";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const HeaderWithIcon = ({
  icon,
  text,
  iconColor = "",
}: {
  icon: IconDefinition;
  text: string;
  iconColor?: string;
}) => {
  return (
    <div className="flex gap-2 items-center">
      <FontAwesomeIcon icon={icon} className={`text-xl ${iconColor}`} />
      <TypographyH2 text={text} />
    </div>
  );
};
