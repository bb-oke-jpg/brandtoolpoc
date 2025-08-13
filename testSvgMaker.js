window.onload = function() {
// Create a simple SVG
const svgNS = "http://www.w3.org/2000/svg";
const svg = document.createElementNS(svgNS, "svg");
svg.setAttribute("xmlns", svgNS);
svg.setAttribute("viewBox", "0 0 100 100");
svg.setAttribute("width", "100%");
svg.setAttribute("height", "100%");

// Add a simple circle
const circle = document.createElementNS(svgNS, "circle");
circle.setAttribute("cx", "50");
circle.setAttribute("cy", "50");
circle.setAttribute("r", "40");
circle.setAttribute("fill", "red");
svg.appendChild(circle);

// Display it
const rightPanel = document.getElementById('right-panel');
rightPanel.innerHTML = '';
rightPanel.appendChild(svg);
};