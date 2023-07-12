import { type UseFormResetField, type Control, type UseFormTrigger } from "react-hook-form";
import { type AdministrativeDivision, type SelectOption } from "~/types";
import { type FormSchemaType } from "./PropertyForm";
import { Select, TextInput } from "react-hook-form-mantine";
import { Group, Loader } from "@mantine/core";
import { IconTag, IconWorld } from "@tabler/icons-react";

const formatAdmData = (data: AdministrativeDivision[]) => {
  return data.map((adm) => ({
    value: adm.id.toString(),
    label: adm.name,
  }));
};

type PropertyFormAddressProps = {
  adm1Data: AdministrativeDivision[] | undefined;
  adm2Data: AdministrativeDivision[] | undefined;
  adm3Data: AdministrativeDivision[] | undefined;
  adm1IsLoading: boolean;
  adm2IsLoading: boolean;
  adm3IsLoading: boolean;
  selectedAdm1: string;
  selectedAdm2: string;
  setSelectedAdm1: (value: string | null) => void;
  setSelectedAdm2: (value: string | null) => void;
  control: Control<FormSchemaType>;
  trigger?: UseFormTrigger<FormSchemaType>;
  resetField: UseFormResetField<FormSchemaType>;
  disabled?: boolean;
};

export function PropertyFormAddress({
  adm1Data,
  adm2Data,
  adm3Data,
  adm1IsLoading,
  adm2IsLoading,
  adm3IsLoading,
  selectedAdm1,
  selectedAdm2,
  setSelectedAdm1,
  setSelectedAdm2,
  control,
  trigger,
  resetField,
  disabled,
}: PropertyFormAddressProps) {
  let adm1 = [] as SelectOption[];
  let adm2 = [] as SelectOption[];
  let adm3 = [] as SelectOption[];

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

      <Group className="mb-6" position="apart" grow>
        <TextInput
          name="postal_code"
          label="Postal Code"
          placeholder="Postal Code"
          control={control}
          icon={<IconTag size="1rem" />}
          disabled={disabled}
          onBlur={() => trigger && void trigger("postal_code")}
        />
        <TextInput
          name="coordinates"
          label="Coordinates"
          placeholder="38.6981, -9.20577"
          control={control}
          icon={<IconWorld size="1rem" />}
          disabled={disabled}
        />
      </Group>
      {/* TODO: Map & get address from point */}
    </div>
  );
}
