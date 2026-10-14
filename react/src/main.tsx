import { createRoot } from "react-dom/client";
import { Demo } from "./Demo";

/* Mount the demo into the placeholder on product.html; other pages simply have no container */
const container = document.getElementById("go-one-demo");
if (container) {
    createRoot(container).render(<Demo />);
}
