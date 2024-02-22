import { useIsSubmitting } from "remix-validated-form";

export const MySubmitButton = ({ children }: { children: React.ReactNode }) => {
  const isSubmitting = useIsSubmitting();
  return (
    <button type="submit" disabled={isSubmitting}>
      {isSubmitting && "Submitting..."}
      {children}
    </button>
  );
};
