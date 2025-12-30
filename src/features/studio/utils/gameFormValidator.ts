interface FormValues {
  name: string;
  shortDescription: string;
  description: string;
  categories: string[];
}

export function validateStep(step: number, formData: FormValues): boolean {
  switch (step) {
    case 1:
      return validateBasicInfo(formData);
    case 2:
      return true; // Media optional
    case 3:
      return true; // Builds optional
    default:
      return true;
  }
}

function validateBasicInfo(formData: FormValues): boolean {
  return !!(
    formData.name &&
    formData.shortDescription &&
    formData.description &&
    formData.categories.length > 0
  );
}
