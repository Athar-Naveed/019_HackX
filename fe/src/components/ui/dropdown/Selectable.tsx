import { useField } from "formik";
import CreatableSelect from "react-select/creatable";

interface Option {
  label: string;
  value: string;
}

interface Props {
  label: string;
  name: string;
  options: Option[];
  onCreateOption?: (val: string) => void;
  placeholder?: string;
}

const CreatableSelectField = ({
  label,
  name,
  options,
  onCreateOption,
  placeholder,
}: Props) => {
  const [field, meta, helpers] = useField(name);

  const handleChange = (selected: Option | null) => {
    helpers.setValue(selected?.value || "");
  };

  const selectedValue =
    options.find((option) => option.value === field.value) || null;

  const customStyles = {
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "hsl(var(--primary))"
        : "hsl(var(--secondary))",
      color: "hsl(var(--secondary-foreground))",
      "&:hover": {
        backgroundColor: "hsl(var(--accent))",
        color: "hsl(var(--accent-foreground))",
      },
      padding: "8px 12px",
    }),
    control: (provided: any) => ({
      ...provided,
      backgroundColor: "hsl(var(--background))",
      borderColor: "hsl(var(--border))",
      color: "hsl(var(--foreground))",
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: "hsl(var(--popover))",
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "hsl(var(--foreground))",
    }),
  };

  return (
    <div className="text-white">
      <label className="block text-sm mb-1">{label}</label>
      <CreatableSelect
        isClearable
        options={options}
        value={selectedValue}
        onChange={handleChange}
        onCreateOption={onCreateOption}
        placeholder={placeholder}
        styles={customStyles}
        className="text-black dark:text-white"
        theme={(theme) => ({
          ...theme,
          borderRadius: 6,
          colors: {
            ...theme.colors,
            primary: "hsl(var(--primary))",
            primary25: "hsl(var(--accent))",
            neutral0: "hsl(var(--background))",
            neutral80: "hsl(var(--foreground))",
          },
        })}
      />
      {meta.touched && meta.error ? (
        <div className="text-red-500 text-xs mt-1">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default CreatableSelectField;
