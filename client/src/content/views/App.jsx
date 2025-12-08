import Logo from "@/assets/crx.svg";
import { useState } from "react";
import "./App.css";
import Navbar from "../../components/Navbar";

function App() {
  const [show, setShow] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCollapseChange = (collapsed) => {
    setIsCollapsed(collapsed);
    const style = document.querySelector("#crxjs-margin-style");
    const container = document.querySelector("#crxjs-app");
    if (style && container) {
      if (collapsed) {
        style.textContent = "html, body { margin-top: 0 !important; }";
        container.style.width = "48px";
      } else {
        style.textContent = "html, body { margin-top: 64px !important; }";
        container.style.width = "100%";
      }
    }
  };

  return (
    <div
      className={`fixed top-0 text-white flex items-start lg:items-center z-999999 gap-3 hk-ext-animated hk-ext-slideInDown ${
        isCollapsed ? "w-12" : "w-full"
      }`}
    >
      <Navbar onCollapseChange={handleCollapseChange} />
    </div>
  );
}

export default App;
