import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Rect, Image as KonvaImage, Text } from "react-konva";
import useImage from "use-image";

function Annotator({ imageUrl }) {
  const [rectangles, setRectangles] = useState([]);
  const [newRect, setNewRect] = useState(null);
  const isDrawing = useRef(false);
  const [image] = useImage(imageUrl);
  const [scale, setScale] = useState(1);
  const [currentLabel, setCurrentLabel] = useState("object");

  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;

  // Calculate scale once image loads
  useEffect(() => {
    if (image && image.width && image.height) {
      const scaleX = CANVAS_WIDTH / image.width;
      const scaleY = CANVAS_HEIGHT / image.height;
      const newScale = Math.min(scaleX, scaleY);
      setScale(newScale);
    }
  }, [image]);

  const handleMouseDown = (e) => {
    if (!isDrawing.current) {
      const stage = e.target.getStage();
      const pointer = stage.getPointerPosition();
      isDrawing.current = true;
      setNewRect({
        x: pointer.x,
        y: pointer.y,
        width: 0,
        height: 0,
        label: currentLabel
      });
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current || !newRect) return;
    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();
    const width = pointer.x - newRect.x;
    const height = pointer.y - newRect.y;
    setNewRect({ ...newRect, width, height });
  };

  const handleMouseUp = () => {
    if (newRect) {
      setRectangles([...rectangles, newRect]);
    }
    setNewRect(null);
    isDrawing.current = false;
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Draw bounding boxes on the image</h3>

      <div style={{ marginBottom: "10px" }}>
        <label>
          Label:
          <input
            type="text"
            value={currentLabel}
            onChange={(e) => setCurrentLabel(e.target.value)}
            placeholder="Enter object label"
            style={{ marginLeft: "10px" }}
          />
        </label>
      </div>

      <Stage
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ border: "1px solid #ccc" }}
      >
        <Layer>
          {image && (
            <KonvaImage
              image={image}
              x={0}
              y={0}
              scaleX={scale}
              scaleY={scale}
            />
          )}
          {rectangles.map((rect, i) => (
            <React.Fragment key={i}>
              <Rect
                x={rect.x}
                y={rect.y}
                width={rect.width}
                height={rect.height}
                stroke="red"
                strokeWidth={2}
                draggable
              />
              <Text
                text={rect.label}
                x={rect.x}
                y={rect.y - 20}
                fontSize={16}
                fill="red"
              />
            </React.Fragment>
          ))}
          {newRect && (
            <Rect
              {...newRect}
              stroke="blue"
              dash={[4, 4]}
              strokeWidth={1}
            />
          )}
        </Layer>
      </Stage>

      <h4 style={{ marginTop: "20px" }}>Annotations:</h4>
      <pre style={{ background: "#f4f4f4", padding: "10px", maxHeight: "200px", overflowY: "auto" }}>
        {JSON.stringify(rectangles, null, 2)}
      </pre>
    </div>
  );
}

export default Annotator;
