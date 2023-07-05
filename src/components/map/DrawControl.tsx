/* eslint-disable @typescript-eslint/no-unsafe-argument */
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { useControl } from "react-map-gl";
import type { ControlPosition, MapRef } from "react-map-gl";

type DrawControlProps = ConstructorParameters<typeof MapboxDraw>[0] & {
  position?: ControlPosition;
  onCreate?: (evt: MapboxDraw.DrawCreateEvent) => void;
  onUpdate?: (evt: MapboxDraw.DrawUpdateEvent) => void;
  onDelete?: (evt: MapboxDraw.DrawDeleteEvent) => void;
};

const DrawControl: React.FC<DrawControlProps> = (props: DrawControlProps) => {
  useControl(
    () => new MapboxDraw(props),
    ({ map }: { map: MapRef }) => {
      map.on("draw.create", (e) => props.onCreate && props.onCreate(e));
      map.on("draw.update", (e) => props.onUpdate && props.onUpdate(e));
      map.on("draw.delete", (e) => props.onDelete && props.onDelete(e));
    },
    ({ map }: { map: MapRef }) => {
      map.off("draw.create", (e) => props.onCreate && props.onCreate(e));
      map.off("draw.update", (e) => props.onUpdate && props.onUpdate(e));
      map.off("draw.delete", (e) => props.onDelete && props.onDelete(e));
    },
    {
      position: props.position,
    }
  );

  return null;
};

export default DrawControl;
