// Global variable to store the SVG pair reference
let svgPair = null;

// Wait for the page to fully load
window.onload = function() {
 console.log("Window loaded");
 loadAndProcessSVG();
};

function loadAndProcessSVG() {
 // Fetch the SVG file
 fetch('brickPath.svg')
     .then(response => {
         if (!response.ok) {
             throw new Error(`Network response was not ok: ${response.status}`);
         }
         return response.text();
     })
     .then(svgText => {
         // Insert the SVG inline
         const container = document.getElementById('svg-container');
         container.innerHTML = svgText;
         
         // Get the inline SVG element
         const svgElement = container.querySelector('svg');
         if (!svgElement) {
             throw new Error("No SVG element found in the loaded content");
         }
         
         // Set an ID for the SVG
         svgElement.id = 'original-svg';
         
         // Process the inline SVG to create the pair
         const pairSvg = duplicateAndFlipSVG(svgElement);
         
         // Store the pair reference
         svgPair = pairSvg;
         
         // Create a square below the pair
         createSquareBelowPair(pairSvg);
     })
     .catch(error => {
         console.error("Error loading or processing SVG:", error);
     });
}

//flipping the first brick
function duplicateAndFlipSVG(svgElement) {
// Get the width and height
const width = parseFloat(svgElement.getAttribute("width") || 
            svgElement.getAttribute("viewBox")?.split(" ")[2] || 
            svgElement.getBBox().width);
const height = parseFloat(svgElement.getAttribute("height") || 
            svgElement.getAttribute("viewBox")?.split(" ")[3] || 
            svgElement.getBBox().height);

console.log(`Original SVG dimensions: ${width}x${height}`);

// Create a new SVG with double width
const newSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
newSvg.setAttribute("id", "duplicated-svg");
newSvg.setAttribute("width", width * 2);
newSvg.setAttribute("height", height);
newSvg.setAttribute("viewBox", `0 0 ${width * 2} ${height}`);

// Create groups for original and flipped content
const originalGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
Array.from(svgElement.childNodes).forEach(node => {
    if (node.nodeType === Node.ELEMENT_NODE) {
        originalGroup.appendChild(node.cloneNode(true));
    }
});

const flippedGroup = originalGroup.cloneNode(true);
flippedGroup.setAttribute("transform", `translate(${width * 2}, 0) scale(-1, 1)`);

// Add both groups to the new SVG
newSvg.appendChild(originalGroup); //real brick
newSvg.appendChild(flippedGroup); //fake brick

// Replace the original SVG with the new one
svgElement.parentNode.replaceChild(newSvg, svgElement);

console.log("SVG has been duplicated and flipped");

return newSvg;
}

//adding the square box
function createSquareBelowPair(pairSvg) {
 // Get the width of the pair
 const pairWidth = parseFloat(pairSvg.getAttribute("width"));
 
 // Create a container for the square
 const squareContainer = document.createElement('div');
 squareContainer.id = 'square-container';
 squareContainer.style.marginTop = '0px'; // Add some space between the pair and square
 
 // Create the square SVG
 const squareSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
 squareSvg.setAttribute("id", "square-svg");
 squareSvg.setAttribute("width", pairWidth);
 squareSvg.setAttribute("height", pairWidth);
 squareSvg.setAttribute("viewBox", `0 0 ${pairWidth} ${pairWidth}`);
 
 // Create the square rectangle with transparent fill and black border
 const square = document.createElementNS("http://www.w3.org/2000/svg", "rect");
 square.setAttribute("x", "0");
 square.setAttribute("y", "0");
 square.setAttribute("width", pairWidth);
 square.setAttribute("height", pairWidth);
 square.setAttribute("fill", "transparent");
 square.setAttribute("stroke", "black");
 square.setAttribute("stroke-width", "1");
 
 // Add the square to the SVG
 squareSvg.appendChild(square);
 
 // Add the SVG to the container
 squareContainer.appendChild(squareSvg);
 
 // Add the container after the pair SVG
 pairSvg.parentNode.insertAdjacentElement('afterend', squareContainer);
 
 console.log(`Created a square with dimensions ${pairWidth}x${pairWidth}`);
 
 // Return the square SVG for reference
 return squareSvg;
}

// Function to access the pair SVG from other scripts if needed
function getSvgPair() {
 return svgPair;
}