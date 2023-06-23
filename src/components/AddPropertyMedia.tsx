import { createStyles, Divider } from "@mantine/core";
import { Controller, type Control } from "react-hook-form";
import { type FormSchemaType } from "./AddPropertyDrawer";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

interface AddPropertyMediaProps {
  control: Control<FormSchemaType>;
  selectedFiles: File[];
  setSelectedFiles: (files: File[]) => void;
  selectedBlueprints: File[];
  setSelectedBlueprints: (blueprints: File[]) => void;
}

export function AddPropertyMedia({
  control,
  selectedFiles,
  setSelectedFiles,
  selectedBlueprints,
  setSelectedBlueprints,
}: AddPropertyMediaProps) {
  const { classes } = useStyles();

  return (
    <>
      <div className="mb-8">
        <Divider my="xs" label="Images and Videos" labelPosition="center" />
        <Controller
          name="Files"
          control={control}
          defaultValue={[]}
          render={({ field: { onChange } }) => (
            <FilePond
              className={classes.filePond}
              files={selectedFiles}
              onupdatefiles={(fileItems) => {
                const files = fileItems.map((fileItem) => fileItem.file);
                setSelectedFiles(files as File[]);
                onChange(files);
              }}
              labelIdle="Drag & Drop your media or <span class='filepond--label-action'>click to browse</span>"
              allowMultiple={true}
            />
          )}
        />
      </div>

      <div className="mb-6">
        <Divider my="xs" label="Blueprints" labelPosition="center" />
        <Controller
          name="Blueprints"
          control={control}
          render={({ field: { onChange } }) => (
            <FilePond
              className={classes.filePond}
              files={selectedBlueprints}
              onupdatefiles={(blueprintItems) => {
                const blueprints = blueprintItems.map((blueprintItem) => blueprintItem.file);
                setSelectedBlueprints(blueprints as File[]);
                onChange(blueprints);
              }}
              labelIdle="Drag & Drop your blueprints or <span class='filepond--label-action'>click to browse</span>"
              allowMultiple={true}
              acceptedFileTypes={["image/*", "application/pdf"]}
            />
          )}
        />
      </div>
    </>
  );
}

const useStyles = createStyles((theme) => ({
  filePond: {
    "& .filepond--drop-label": {
      color: theme.colors.dark[0],

      "& .filepond--label-action": {
        "&:hover": {
          textDecoration: "underline",
        },
      },
    },

    "& .filepond--panel-root": {
      backgroundColor: theme.colors.dark[5],
    },

    "& .filepond--drip-blob": {
      backgroundColor: theme.colors.dark[1],
    },

    "& .filepond--item-panel": {
      backgroundColor: theme.colors.dark[4],
    },

    "& .filepond--credits": {
      color: theme.colors.gray[0],
    },
  },
}));
