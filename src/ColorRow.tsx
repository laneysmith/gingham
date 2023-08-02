import { useRef, ChangeEvent } from "react";
import type { Identifier, XYCoord } from "dnd-core";
import { useDrag, useDrop } from "react-dnd";
import "./ColorRow.css";
import { DragItem } from "./types";
import trashIcon from "./assets/trashIcon.svg";
import reorderIcon from "./assets/reorderIcon.svg";

const DND_COLOR_TYPE = "color";

interface Props {
  color: string;
  index: number;
  updateColor: (event: ChangeEvent<HTMLInputElement>, index: number) => void;
  moveColor: (dragIndex: number, hoverIndex: number) => void;
  removeColor: (index: number) => void;
  disableRemove: boolean;
}

function ColorRow(props: Props) {
  const { color, index, updateColor, moveColor, removeColor, disableRemove } =
    props;

  const ref = useRef<HTMLLIElement>(null);
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: DND_COLOR_TYPE,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace item with self
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      moveColor(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: DND_COLOR_TYPE,
    item: () => ({ color, index }),
    collect: (monitor: any) => ({ isDragging: monitor.isDragging() }),
  });

  drag(drop(ref));

  return (
    <li
      ref={ref}
      key={index}
      className="control-option"
      style={{ opacity: isDragging ? 0 : 1 }}
      data-handler-id={handlerId}
    >
      <img
        src={reorderIcon}
        className="icon reorder-icon"
        role="presentation"
      />
      <label className="color-label">
        <input
          type="color"
          name="color"
          value={color}
          onChange={(event) => updateColor(event, index)}
        />
        &nbsp; {color.toUpperCase()}
      </label>
      <button
        onClick={() => removeColor(index)}
        disabled={disableRemove}
        aria-label="Remove"
      >
        <img src={trashIcon} className="icon" role="presentation" />
      </button>
    </li>
  );
}

export default ColorRow;
