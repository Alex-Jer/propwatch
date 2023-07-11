import { ActionIcon, createStyles, Divider, Group, Modal, Text } from "@mantine/core";
import { Controller, type Control } from "react-hook-form";
import { type FormSchemaType } from "./PropertyForm";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { IconEye, IconTrash } from "@tabler/icons-react";
import { DataTable, type DataTableColumn } from "mantine-datatable";
import { type Media } from "~/types";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileValidateType);

export type MediaItem = {
  id?: string;
  type: "image" | "blueprint" | "video";
  url: string;
  order?: number;
};

interface AddPropertyMediaProps {
  control: Control<FormSchemaType>;
  selectedImages: File[];
  setSelectedImages: (files: File[]) => void;
  selectedBlueprints: File[];
  setSelectedBlueprints: (blueprints: File[]) => void;
  selectedVideos: File[];
  setSelectedVideos: (videos: File[]) => void;
  media?: Media;
  mediaToDelete: MediaItem[];
  setMediaToDelete: (mediaToDelete: MediaItem[]) => void;
}

export function AddPropertyMedia({
  control,
  selectedImages,
  setSelectedImages,
  selectedBlueprints,
  setSelectedBlueprints,
  selectedVideos,
  setSelectedVideos,
  media,
  mediaToDelete,
  setMediaToDelete,
}: AddPropertyMediaProps) {
  const { classes } = useStyles();
  const [previewModalOpened, { open: openPreviewModal, close: closePreviewModal }] = useDisclosure(false);
  const [selectedMediaItem, setSelectedMediaItem] = useState<MediaItem | null>(null);
  /* const [selectedMediaItems, setSelectedMediaItems] = useState<MediaItem[]>([]); */

  const mediaArray = ([] as MediaItem[]).concat(
    media?.photos.map((photo, index) => ({ type: "image", url: photo.url, order: index + 1 })) || [],
    media?.blueprints.map((blueprint) => ({ type: "blueprint", url: blueprint.url })) || [],
    media?.videos.map((video) => ({ type: "video", url: video.url })) || []
  );

  const columns = [
    {
      accessor: "type",
      title: "Type",
      width: 100,
      cellsClassName: "capitalize",
    },
    {
      accessor: "order",
      title: "Order",
      width: 100,
      textAlignment: "center",
    },
    {
      accessor: "actions",
      title: <Text mr="xs">Actions</Text>,
      textAlignment: "right",
      render: (item: MediaItem) => (
        <Group spacing={4} position="right" noWrap>
          <ActionIcon
            color="blue"
            onClick={() => {
              setSelectedMediaItem(item);
              openPreviewModal();
            }}
          >
            <IconEye size={16} />
          </ActionIcon>
          <ActionIcon color="red">
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      ),
    },
  ] as DataTableColumn<MediaItem>[];

  return (
    <>
      <Modal opened={previewModalOpened} onClose={closePreviewModal} title="Preview">
        <div className="flex justify-center">
          <div>{selectedMediaItem?.url}</div>
        </div>
      </Modal>

      {media && (
        <DataTable
          className="mb-8"
          columns={columns}
          records={mediaArray}
          /* selectedRecords={selectedMediaItems} */
          /* onSelectedRecordsChange={setSelectedMediaItems} */
          selectedRecords={mediaToDelete}
          onSelectedRecordsChange={setMediaToDelete}
          idAccessor="url"
        />
      )}

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
