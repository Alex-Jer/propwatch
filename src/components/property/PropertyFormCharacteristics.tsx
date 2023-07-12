import { Alert, Button, CloseButton, createStyles, Divider, Text } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useState } from "react";
import { useFieldArray, type UseFormWatch, type Control } from "react-hook-form";
import { SegmentedControl, TextInput } from "react-hook-form-mantine";
import { type FormSchemaType } from "./PropertyForm";

const characteristicTypes = [
  { label: "Numerical", value: "numerical" },
  { label: "Textual", value: "textual" },
];

type PropertyFormCharacteristicsProps = {
  control: Control<FormSchemaType>;
  watch: UseFormWatch<FormSchemaType>;
  mode?: "add" | "edit";
};

export function PropertyFormCharacteristics({ control, watch, mode = "add" }: PropertyFormCharacteristicsProps) {
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
        /* @ts-expect-error works fine */
        const characteristicType = watch(`characteristics[${index}].type`);
        /* @ts-expect-error works fine */
        const isTextual = characteristicType === "textual";

        return (
          <div key={field.id} onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(-1)}>
            <Divider mt="xl" mb="xs" />
            <div className=" grid grid-cols-10 gap-4" style={{ minHeight: "60px" }}>
              <div className="col-span-3">
                <Text size="sm" weight={500} className="mb-1">
                  Type
                </Text>
                <SegmentedControl
                  /* @ts-expect-error works fine */
                  name={`characteristics[${index}].type`}
                  control={control}
                  styles={() => ({ root: { width: "100%" } })}
                  data={characteristicTypes}
                />
              </div>

              <TextInput
                className="col-span-4"
                /* @ts-expect-error works fine */
                name={`characteristics[${index}].name`}
                label="Name"
                control={control}
                placeholder="Distance to the beach (Km)"
              />
              <TextInput
                className="col-span-3"
                /* @ts-expect-error works fine */
                name={`characteristics[${index}].value`}
                label="Value"
                control={control}
                placeholder="3.5"
                type={isTextual ? "text" : "number"}
              />
            </div>
            {index > 0 || mode === "edit" ? (
              <CloseButton
                onClick={() => remove(index)}
                radius="xl"
                color="red.8"
                variant="filled"
                className={`absolute transition-opacity ${classes.closeButton} ${
                  hoveredIndex === index ? "opacity-100" : "opacity-0"
                }`}
              />
            ) : null}
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
    top: "-88px",
  },
}));
