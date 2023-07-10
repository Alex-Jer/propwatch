import { createStyles, Divider } from "@mantine/core";
import { Controller, type Control } from "react-hook-form";
import { type FormSchemaType } from "./PropertyForm";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileValidateType);

interface AddPropertyMediaProps {
  control: Control<FormSchemaType>;
  selectedImages: File[];
  setSelectedImages: (files: File[]) => void;
  selectedBlueprints: File[];
  setSelectedBlueprints: (blueprints: File[]) => void;
  selectedVideos: File[];
  setSelectedVideos: (videos: File[]) => void;
}

export function AddPropertyMedia({
  control,
  selectedImages,
  setSelectedImages,
  selectedBlueprints,
  setSelectedBlueprints,
  selectedVideos,
  setSelectedVideos,
}: AddPropertyMediaProps) {
  const { classes } = useStyles();

  return (
    <>
      <div className="mb-8">
        <Divider my="xs" label="Images" labelPosition="center" />
        <Controller
          name="images"
          control={control}
          defaultValue={[]}
          render={({ field: { onChange } }) => (
            <FilePond
              className={classes.filePond}
              files={selectedImages}
              onupdatefiles={(fileItems) => {
                const files = fileItems.map((fileItem) => fileItem.file);
                setSelectedImages(files as File[]);
                onChange(files);
              }}
              labelIdle="Drag & Drop your images or <span class='filepond--label-action'>click to browse</span>"
              allowMultiple={true}
              acceptedFileTypes={["image/jpeg", "image/png", "image/webp", "image/gif"]}
            />
          )}
        />
      </div>

      <div className="mb-8">
        <Divider my="xs" label="Blueprints" labelPosition="center" />
        <Controller
          name="blueprints"
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
              acceptedFileTypes={["image/jpeg", "image/png", "image/webp", "application/pdf"]}
            />
          )}
        />
      </div>

      <div className="mb-6">
        <Divider my="xs" label="Videos" labelPosition="center" />
        <Controller
          name="videos"
          control={control}
          render={({ field: { onChange } }) => (
            <FilePond
              className={classes.filePond}
              files={selectedVideos}
              onupdatefiles={(videoItems) => {
                const videos = videoItems.map((videoItem) => videoItem.file);
                setSelectedVideos(videos as File[]);
                onChange(videos);
              }}
              labelIdle="Drag & Drop your videos or <span class='filepond--label-action'>click to browse</span>"
              allowMultiple={true}
              acceptedFileTypes={["video/mp4", "video/webm", "video/h264", "video/3gp"]}
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
