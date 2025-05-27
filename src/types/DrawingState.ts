import MousePosition from "./MousePosition";

export default interface DrawingState {
  isDrawing: boolean;
  drawingFrom: string | null;
  mousePosition: MousePosition;
}