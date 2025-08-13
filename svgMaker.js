// Wait for the page to fully load
window.onload = function() {
console.log("Window loaded");

// Try to process the SVG after a short delay
setTimeout(function() {
    processSVGDirectly();
}, 500);
};

// Process the SVG directly without waiting for the load event
function processSVGDirectly() {
console.log("Processing SVG directly");

// Get the SVG object element
const svgObject = document.getElementById('svg-object');
console.log("SVG object:", svgObject);

if (!svgObject) {
    console.error("SVG object not found!");
    return;
}

try {
    // Try to access the SVG content
    const svgDoc = svgObject.contentDocument;
    console.log("SVG document:", svgDoc);
    
    if (!svgDoc || !svgDoc.documentElement) {
        console.error("Could not access SVG content document");
        fallbackToEmbeddedSVG();
        return;
    }
    
    // Get the SVG content as a string
    const svgContent = new XMLSerializer().serializeToString(svgDoc.documentElement);
    console.log("SVG content length:", svgContent.length);
    
    // Generate and display the pattern
    const result = generateSVG(svgContent);
    
    // Clear the right panel and append the new SVG
    const rightPanel = document.getElementById('right-panel');
    rightPanel.innerHTML = ''; // Remove the original object
    rightPanel.appendChild(result.svg);
    console.log("SVG appended to right panel");
} catch (error) {
    console.error("Error processing SVG:", error);
    fallbackToEmbeddedSVG();
}
}

// Fallback to using a hardcoded SVG
function fallbackToEmbeddedSVG() {
console.log("Falling back to embedded SVG");

// Your SVG content as a string
const svgContent = `<svg width="53" height="26" viewBox="0 0 53 26" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.01123 20.6042C1.01123 11.9777 8.03816 4.9793 16.6647 4.9793H21.3779V2.03711C21.3779 1.52294 21.7779 1.12305 22.292 1.12305H31.2042C31.7184 1.12305 32.1183 1.52294 32.1183 2.03711V4.9793H38.5168V2.03711C38.5168 1.52294 38.9168 1.12305 39.4309 1.12305H48.3431C48.8573 1.12305 49.2572 1.52294 49.2572 2.03711V4.9793H52.485V25.5745H1.01123V20.6042Z" fill="#808080" stroke="black" stroke-width="0.5" stroke-miterlimit="10"/>
</svg>`;

// Generate and display the pattern
const result = generateSVG(svgContent);

// Clear the right panel and append the new SVG
const rightPanel = document.getElementById('right-panel');
rightPanel.innerHTML = ''; // Remove the original object
rightPanel.appendChild(result.svg);
console.log("SVG appended to right panel using fallback");
}

function generateSVG(initialSvgContent) {
console.log("Starting generateSVG function");

// Function to create the SVG
function createSVG() {
    console.log("Starting createSVG function");
    const svgNS = "http://www.w3.org/2000/svg";
    
    // Parse the initial SVG content to get the dimensions and path data
    const parser = new DOMParser();
    const initialSvgDoc = parser.parseFromString(initialSvgContent, "image/svg+xml");
    
    // Check for parsing errors
    const parserError = initialSvgDoc.querySelector('parsererror');
    if (parserError) {
        console.error("SVG parsing error:", parserError.textContent);
        return null;
    }
    
    const originalPath = initialSvgDoc.querySelector("path");
    console.log("Original path found:", originalPath);
    
    if (!originalPath) {
        console.error("No path found in the SVG content");
        return null;
    }
    
    const originalSvgElement = initialSvgDoc.documentElement;
    console.log("Original SVG element:", originalSvgElement);
    
    // Get dimensions from the original SVG
    const viewBox = originalSvgElement.getAttribute("viewBox");
    console.log("ViewBox attribute:", viewBox);
    
    if (!viewBox) {
        console.error("No viewBox attribute found in the SVG");
        return null;
    }
    
    const viewBoxValues = viewBox.split(" ");
    console.log("ViewBox values:", viewBoxValues);
    
    const originalWidth = parseFloat(viewBoxValues[2]);
    const originalHeight = parseFloat(viewBoxValues[3]);
    console.log("Original dimensions:", originalWidth, "x", originalHeight);
    
    // Create the main SVG element
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("xmlns", svgNS);
    
    // Arrays to store the rings for dynamic color updates
    const rings = [];
    
    // Step 1 & 2: Create a pair with the original and flipped brick
    function createPair() {
        console.log("Creating pair");
        const group = document.createElementNS(svgNS, "g");
        
        // Original brick
        const original = document.createElementNS(svgNS, "path");
        original.setAttribute("d", originalPath.getAttribute("d"));
        original.setAttribute("fill", "#888888"); // Gray color to match image
        group.appendChild(original);
        
        // Flipped brick (vertical flip)
        const flipped = document.createElementNS(svgNS, "path");
        flipped.setAttribute("d", originalPath.getAttribute("d"));
        flipped.setAttribute("transform", `translate(${originalWidth}, 0) scale(1, -1) translate(0, -${originalHeight})`);
        flipped.setAttribute("fill", "#888888"); // Gray color to match image
        group.appendChild(flipped);
        
        return {
            element: group,
            width: originalWidth * 2,
            height: originalHeight
        };
    }
    
    // Step 3-7: Create rings with pairs
    function createRings() {
        console.log("Creating rings");
        const pairInfo = createPair();
        console.log("Pair info:", pairInfo);
        
        const pairWidth = pairInfo.width;
        const pairHeight = pairInfo.height;
        
        // The size of the bounding box is determined by the width of the pair
        const boxSize = pairWidth;
        
        // Create 6 rings with increasing number of pairs
        for (let ringIndex = 0; ringIndex < 6; ringIndex++) {
            console.log("Creating ring", ringIndex + 1);
            const numPairsPerSide = ringIndex + 1;
            const ring = document.createElementNS(svgNS, "g");
            const ringPairs = [];
            
            // Calculate the ring's radius (distance from center to the middle of a pair)
            // All rings have the same center point, but different sizes
            const radius = boxSize / 2 + ringIndex * pairHeight;
            
            // Step 4-5: Create pairs around the bounding box
            for (let side = 0; side < 4; side++) {
                for (let pairIndex = 0; pairIndex < numPairsPerSide; pairIndex++) {
                    // Create a pair
                    const pair = createPair().element.cloneNode(true);
                    
                    // Position along the side
                    const sideLength = boxSize + 2 * ringIndex * pairHeight;
                    const spacing = sideLength / numPairsPerSide;
                    const offset = spacing / 2 + pairIndex * spacing;
                    
                    // Position and rotate based on the side
                    let x = 0, y = 0, rotation = 0;
                    
                    switch (side) {
                        case 0: // Top
                            x = -sideLength/2 + offset;
                            y = -radius;
                            rotation = 0;
                            break;
                        case 1: // Right
                            x = radius;
                            y = -sideLength/2 + offset;
                            rotation = 90;
                            break;
                        case 2: // Bottom
                            x = sideLength/2 - offset;
                            y = radius;
                            rotation = 180;
                            break;
                        case 3: // Left
                            x = -radius;
                            y = sideLength/2 + offset;
                            rotation = 270;
                            break;
                    }
                    
                    // Apply transformations
                    pair.setAttribute("transform", `translate(${x}, ${y}) rotate(${rotation})`);
                    
                    // Store the pair in the ring's array for color updates
                    ringPairs.push(pair);
                    ring.appendChild(pair);
                }
            }
            
            // Step 6: Rotate the entire ring by 45 degrees
            ring.setAttribute("transform", `rotate(45)`);
            
            // Store the ring for dynamic color updates
            rings.push({
                element: ring,
                pairs: ringPairs
            });
            
            // Add the ring to the main SVG
            svg.appendChild(ring);
        }
    }
    
    try {
        // Set the viewBox to accommodate all rings
        const pairInfo = createPair();
        const maxRingRadius = pairInfo.width / 2 + 6 * pairInfo.height * 2; // Estimate the maximum radius
        const svgSize = maxRingRadius * 2.5; // Add some padding
        
        console.log("Setting viewBox with size:", svgSize);
        svg.setAttribute("viewBox", `${-svgSize/2} ${-svgSize/2} ${svgSize} ${svgSize}`);
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.setAttribute("style", "background-color: black"); // Black background to match image
        
        // Create all the rings
        createRings();
        console.log("Rings created successfully");
        
        return {
            svg: svg,
            rings: rings
        };
    } catch (error) {
        console.error("Error in createSVG:", error);
        return null;
    }
}

try {
    // Create the SVG
    console.log("Calling createSVG");
    const svgData = createSVG();
    console.log("SVG data returned:", svgData);
    
    // Return the SVG element and rings
    return {
        svg: svgData ? svgData.svg : document.createElementNS("http://www.w3.org/2000/svg", "svg"),
        rings: svgData ? svgData.rings : []
    };
} catch (error) {
    console.error("Error in generateSVG:", error);
    return {
        svg: document.createElementNS("http://www.w3.org/2000/svg", "svg"),
        rings: []
    };
}
}

// Function to update the colors of the rings
function updateRingColors(rings, colors) {
if (!rings || rings.length === 0) {
    console.warn("No rings to update colors for");
    return;
}

console.log("Updating ring colors with:", colors);

// Update each ring with a different color
rings.forEach((ring, index) => {
    const color = colors[index % colors.length];
    console.log(`Setting ring ${index + 1} to color: ${color}`);
    
    // Update all pairs in this ring
    ring.pairs.forEach(pair => {
        // Each pair has two paths (original and flipped)
        const paths = pair.querySelectorAll('path');
        paths.forEach(path => {
            path.setAttribute('fill', color);
        });
    });
});
}