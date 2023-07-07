import { Alert, Button, CloseButton, createStyles, Divider, Text } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useState } from "react";
import { useFieldArray, type UseFormWatch, type Control } from "react-hook-form";
import { SegmentedControl, TextInput } from "react-hook-form-mantine";
import { type FormSchemaType } from "./AddPropertyDrawer";

type AddPropertyCharacteristicsProps = {
  control: Control<FormSchemaType>;
  watch: UseFormWatch<FormSchemaType>;
};

const characteristicTypes = [
  { label: "Numerical", value: "numerical" },
  { label: "Textual", value: "textual" },
];

export function AddPropertyCharacteristics({ control, watch }: AddPropertyCharacteristicsProps) {
  const { fields, append, remove } = useFieldArray({
    name: "characteristics",
    control,
  });

  const { classes } = useStyles();
  const [hoveredIndex, setHoveredIndex] = useState(-1);

  return (
    <>
      <div className="mt-6 flex items-center space-x-2 ">
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          color="blue"
          variant="outline"
          className="flex-grow"
          styles={{ root: { padding: "0.5rem 1rem" } }}
        >
          Characteristics provide additional details about the property
        </Alert>
        <Button
          onClick={() => append({ type: "numerical", name: "", value: "" })}
          styles={{ root: { height: "2.5rem" } }}
        >
          Add Characteristic
        </Button>
      </div>

      {fields.map((field, index) => {
        const characteristicType = watch(`characteristics[${index}].type`);
        const isTextual = characteristicType === "textual";

        return (
          <div key={field.id} onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(-1)}>
            <Divider my="xl" />
            <div className="-mb-5 grid grid-cols-10 gap-4" style={{ minHeight: "60px" }}>
              <div className="col-span-3">
                <Text size="sm" weight={500} className="mb-1">
                  Type
                </Text>
                <SegmentedControl
                  name={`characteristics[${index}].type`}
                  control={control}
                  styles={() => ({ root: { width: "100%" } })}
                  data={characteristicTypes}
                />
              </div>

              <TextInput
                className="col-span-4"
                name={`characteristics[${index}].name`}
                control={control}
                placeholder="Name"
                /* value={description} */
                /* onChange={handleDescriptionChange} */
                /* error={descriptionError} */
              />
              <TextInput
                className="col-span-3"
                name={`characteristics[${index}].value`}
                control={control}
                placeholder="Value"
                type={isTextual ? "text" : "number"}
                /* value={description} */
                /* onChange={handleDescriptionChange} */
                /* error={descriptionError} */
              />
            </div>
            {index > 0 && (
              <CloseButton
                onClick={() => remove(index)}
                radius="xl"
                color="red.8"
                variant="filled"
                className={`absolute transition-opacity ${classes.closeButton} ${
                  hoveredIndex === index ? "opacity-100" : "opacity-0"
                }`}
              />
            )}
          </div>
        );
      })}
      <Divider my="xl" />
    </>
  );
}

const useStyles = createStyles(() => ({
  closeButton: {
    float: "right",
    right: "-32px",
    top: "-75px",
  },
}));
