import { useInputState } from "@mantine/hooks";
import { useSession } from "next-auth/react";
import { type UseFormResetField, type Control, type UseFormTrigger } from "react-hook-form";
import { useAdms, useAdms2, useAdms3 } from "~/hooks/useQueries";
import { type AdministrativeDivision, type SelectOption } from "~/types";
import { type FormSchemaType } from "./AddPropertyDrawer";
import { NumberInput, Select, TextInput } from "react-hook-form-mantine";
import { Group, Loader } from "@mantine/core";
import { IconTag, IconWorldLatitude, IconWorldLongitude } from "@tabler/icons-react";

type AddPropertyAddressProps = {
  control: Control<FormSchemaType>;
  trigger?: UseFormTrigger<FormSchemaType>;
  resetField: UseFormResetField<FormSchemaType>;
  disabled?: boolean;
};

export function AddPropertyAddress({ control, trigger, resetField, disabled }: AddPropertyAddressProps) {
  const { data: session, status } = useSession();

  const [selectedAdm1, setSelectedAdm1] = useInputState("");
  const [selectedAdm2, setSelectedAdm2] = useInputState("");

  const { data: adm1Data, isLoading: adm1IsLoading } = useAdms({ session, status });

  const { data: adm2Data, isLoading: adm2IsLoading } = useAdms2({
    session,
    status,
    parentId: selectedAdm1 ? selectedAdm1 : "1",
  });

  const { data: adm3Data, isLoading: adm3IsLoading } = useAdms3({
    session,
    status,
    parentId: selectedAdm2 ? selectedAdm2 : "2",
  });

  let adm1 = [] as SelectOption[];
  let adm2 = [] as SelectOption[];
  let adm3 = [] as SelectOption[];

  const formatAdmData = (data: AdministrativeDivision[]) => {
    return data.map((adm) => ({
      value: adm.id.toString(),
      label: adm.name,
    }));
  };

  if (adm1Data) adm1 = formatAdmData(adm1Data);
  if (adm2Data) adm2 = formatAdmData(adm2Data);
  if (adm3Data) adm3 = formatAdmData(adm3Data);

  // TODO: withAsterisk doesn't match reality, required_without_all:Full Address,Adm 1 Id
  return (
    <div>
      <TextInput
        className="mb-3"
        name="full_address"
        label="Address"
        placeholder="123, Ai Hoshino Street"
        control={control}
        withAsterisk
        data-autofocus
        disabled={disabled}
        onBlur={() => trigger && void trigger("full_address")}
      />
      {!disabled && (
        <Group className="mb-3" position="apart" grow>
          <Select
            data={adm1}
            name="adm1_id"
            label="District"
            placeholder="District"
            icon={adm1IsLoading && <Loader size="1rem" />}
            control={control}
            searchable
            clearable
            nothingFound="No options"
            onChange={(value) => {
              setSelectedAdm1(value);
              setSelectedAdm2(null); // required so Adm3 is disabled
              resetField("adm2_id", { defaultValue: "" });
              resetField("adm3_id", { defaultValue: "" });
            }}
            disabled={disabled}
          />
          <Select
            data={adm2}
            name="adm2_id"
            label="Municipality"
            placeholder="Municipality"
            icon={adm2IsLoading && <Loader size="1rem" />}
            control={control}
            searchable
            clearable
            nothingFound="No options"
            onChange={(value) => {
              setSelectedAdm2(value);
              resetField("adm3_id", { defaultValue: "" });
            }}
            disabled={!selectedAdm1 || disabled}
          />
          <Select
            data={adm3}
            name="adm3_id"
            label="Parish"
            placeholder="Parish"
            icon={adm3IsLoading && <Loader size="1rem" />}
            control={control}
            searchable
            clearable
            nothingFound="No options"
            disabled={!selectedAdm2 || disabled}
          />
        </Group>
      )}

      <Group className="mb-4" position="apart" grow>
        <TextInput
          name="postal_code"
          label="Postal Code"
          placeholder="Postal Code"
          control={control}
          icon={<IconTag size="1rem" />}
          disabled={disabled}
          onBlur={() => trigger && void trigger("postal_code")}
        />
        <NumberInput
          name="latitude"
          label="Latitude"
          placeholder="Latitude"
          precision={6}
          hideControls
          decimalSeparator=","
          control={control}
          icon={<IconWorldLatitude size="1rem" />}
          min={-90}
          max={90}
          disabled={disabled}
        />
        <NumberInput
          name="longitude"
          label="Longitude"
          placeholder="Longitude"
          precision={6}
          hideControls
          decimalSeparator=","
          control={control}
          icon={<IconWorldLongitude size="1rem" />}
          min={-180}
          max={180}
          disabled={disabled}
        />
      </Group>
      {/* TODO: Map & get address from point */}
    </div>
  );
}
