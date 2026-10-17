import { createRoot } from "react-dom/client";
import { Calculator } from "./calculator/Calculator";

/* Mount the calculator into the placeholder on business.html; other pages have no container */
const container = document.getElementById("go-one-calculator");
if (container) {
    createRoot(container).render(<Calculator />);
}
