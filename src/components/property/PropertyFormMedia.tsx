import { ActionIcon, Button, createStyles, Divider, Group, Modal, Text } from "@mantine/core";
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
import { useEffect, useState } from "react";
import { ConfirmationModal } from "../ConfirmationModal";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileValidateType);

export type MediaItem = {
  id: number;
  type: "image" | "blueprint" | "video";
  url: string;
  order: number;
};

interface PropertyFormMediaProps {
  control: Control<FormSchemaType>;
  selectedImages: File[];
  setSelectedImages: (files: File[]) => void;
  selectedBlueprints: File[];
  setSelectedBlueprints: (blueprints: File[]) => void;
  selectedVideos: File[];
  setSelectedVideos: (videos: File[]) => void;
  media?: Media;
  setMedia: (media: Media) => void;
  mediaToDelete: MediaItem[];
  setMediaToDelete: (mediaToDelete: MediaItem[]) => void;
}

export function PropertyFormMedia({
  control,
  selectedImages,
  setSelectedImages,
  selectedBlueprints,
  setSelectedBlueprints,
  selectedVideos,
  setSelectedVideos,
  media,
  setMedia,
  mediaToDelete,
  setMediaToDelete,
}: PropertyFormMediaProps) {
  const { classes } = useStyles();
  const [previewModalOpened, { open: openPreviewModal, close: closePreviewModal }] = useDisclosure(false);
  const [confirmModalOpened, { open: openConfirmModal, close: closeConfirmModal }] = useDisclosure(false);
  const [selectedMediaItem, setSelectedMediaItem] = useState<MediaItem | null>(null);
  const [selectedMediaToDelete, setSelectedMediaToDelete] = useState<MediaItem[]>([]);
  const [mediaArray, setMediaArray] = useState<MediaItem[]>([]);

  useEffect(() => {
    setMediaArray(
      ([] as MediaItem[]).concat(
        media?.photos.map((photo, index) => ({ id: photo.id, type: "image", url: photo.url, order: index + 1 })) || [],
        media?.blueprints.map((blueprint, index) => ({
          id: blueprint.id,
          type: "blueprint",
          url: blueprint.url,
          order: index + 1,
        })) || [],
        media?.videos.map((video, index) => ({ id: video.id, type: "video", url: video.url, order: index + 1 })) || []
      )
    );
  }, [media]);

  const deleteMediaItem = (mediaItem: MediaItem) => {
    const newMediaArray = mediaArray.filter((m) => m.id !== mediaItem.id);
    setMediaArray(newMediaArray);
    setMediaToDelete([...mediaToDelete, mediaItem]);
  };

  const handleDelete = (mediaItem: MediaItem) => {
    if (selectedMediaToDelete.length > 1 && selectedMediaToDelete.some((s) => s.id === mediaItem.id)) {
      openConfirmModal();
      return;
    }
    deleteMediaItem(mediaItem);
    setMedia((state) => ({
      ...state,
      photos: state.photos.filter((p) => p.id !== mediaItem.id),
      blueprints: state.blueprints.filter((b) => b.id !== mediaItem.id),
      videos: state.videos.filter((v) => v.id !== mediaItem.id),
    }));
  };

  const deleteSelectedMedia = () => {
    setMediaArray((state) => state.filter((o) => !selectedMediaToDelete.some((s) => s.id === o.id)));
    setSelectedMediaToDelete([]);
    setMediaToDelete((state) => [...state, ...selectedMediaToDelete]);
    closeConfirmModal();
  };

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
          <ActionIcon
            color="red"
            onClick={() => {
              handleDelete(item);
            }}
          >
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

      <ConfirmationModal
        opened={confirmModalOpened}
        close={closeConfirmModal}
        yesFunction={deleteSelectedMedia}
        title="Delete selected media"
        text={`Are you sure you want to delete the ${selectedMediaToDelete.length} selected media?`}
        yesBtn={{ text: "Delete", color: "red", variant: "filled", icon: <IconTrash size="1rem" className="-mr-1" /> }}
        noBtn={{ text: "Cancel", variant: "default" }}
      />

      {mediaArray.length > 0 && (
        <DataTable
          className="mb-8"
          columns={columns}
          records={mediaArray}
          selectedRecords={selectedMediaToDelete}
          onSelectedRecordsChange={setSelectedMediaToDelete}
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
              acceptedFileTypes={["image/jpeg", "image/png", "image/webp"]}
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
