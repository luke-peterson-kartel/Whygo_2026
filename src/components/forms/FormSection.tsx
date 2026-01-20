interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  required?: boolean;
}

export function FormSection({ title, description, children, required = false }: FormSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          {title}
          {required && <span className="text-red-500 ml-1">*</span>}
        </h3>
        {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
      </div>
      <div>{children}</div>
    </div>
  );
}
