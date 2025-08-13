let colorData;

//loading colors from JSON file using fetch
async function loadColorData() {
    try {
        const response = await fetch('colors.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        colorData = await response.json();
        generateColorButtons();
    } catch (error) {
        console.error('Error loading color data:', error);
    }
}

function generateColorButtons() {
    const colorButtonsContainer = document.getElementById('colorButtons');

    //clear existing buttons
    colorButtonsContainer.innerHTML = '';

    //creating a group for each primary color
    colorData.colors.forEach((color, index) => {
        //creating a container for primary button + shades
        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'color-button-group';

        //creating primary color button 
        const primaryButton = document.createElement('button');
        primaryButton.className = 'primary-color-button';
        primaryButton.style.backgroundColor = color.primaryHex;
        primaryButton.setAttribute('data-color-index', index);
        primaryButton.title = color.name;

        //add click listener -- MIGHT NEED TO CHANGE THIS TO ADD HOVER + CLICK
        primaryButton.addEventListener('click', function() {
            deselectAllButtons();

            this.classList.add('selected');

            //updating active selection
            activeSelection = {
                type: 'primary',
                colorIndex: index
            };

            updatePreviewWindow(color.primaryHex);
        });

        //create a container for the shade buttons
        const shadesContainer = document.createElement('div');
        shadesContainer.className = 'shades-container';

        //create buttons for each shade
        color.shades.forEach((shade, shadeIndex) => {
            const shadeButton = document.createElement('button');
            shadeButton.className = 'shade-button';
            shadeButton.style.backgroundColor = shade.hex;
            shadeButton.title = shade.name;

            //add click listener
            shadeButton.addEventListener('click', function(event) {
                event.stopPropagation(); //this is to prevent the parent button's click
                
                deselectAllButtons();

                this.classList.add('selected');

                activeSelection = {
                    type: 'primary',
                    colorIndex: index,
                    shadeIndex: shadeIndex
                };

                updatePreviewWindow(shade.hex);
            });

            shadesContainer.appendChild(shadeButton);
        });

        //adding hover events to show/hide shades
        buttonGroup.addEventListener('mouseenter', function() {
            shadesContainer.style.display = 'flex';
        });

        buttonGroup.addEventListener('mouseleave', function() {
            setTimeout( function () {
                shadesContainer.style.display = 'none';
            }, 200); //figure out if there's a nicer way to add delay
        });

        //appending new button elements to the DOM
        buttonGroup.appendChild(primaryButton);
        buttonGroup.appendChild(shadesContainer);
        colorButtonsContainer.appendChild(buttonGroup);
    });

}

function deselectAllButtons() {
    document.querySelectorAll('.primary-color-button.selected, .shade-button.selected').forEach(button => {
        button.classList.remove('selected');
    });
}



// function showPrimaryColorInfo(colorIndex) {
//     const selectedColor = colorData.colors[colorIndex];
//     const colorInfoDiv = document.getElementById('colorInfo');

//     //display color information
//     colorInfoDiv.innerHTML = `
    
//         <h2>${selectedColor.name}</h2>
//         <div class="color-preview>" style="background-color: ${selectedColor.primaryHex}></div>
//         <p>Primary Color: ${selectedColor.primaryHex}</p>

//         <h3>Shades</h3>
//         <div class = "tint-shade-container">
//             ${selectedColor.shades.map(shade => `
//                 <div class="color-chip">
//                     <div class="color-sample" style "background-color: ${shade.hex}"></div>
//                     <p>${shade.name}</p>
//                     <p>${shade.hex}</p>
//                     </div>
//                 `).join('')
//             }
//         </div>
//     `;  
// }

function updatePreviewWindow(hexNum) {
    const previewWindow = document.getElementById('right-panel');
    previewWindow.style.backgroundColor = hexNum;
    updateSVGFill(hexNum);

}

function updateSVGFill(hexColor) {
    const svgObject = document.getElementById('svg-object');
    if(svgObject && svgObject.contentDocument) {
        //load svg object
        if (svgObject.contentDocument.readyState === 'complete') {
            const svgDoc = svgObject.contentDocument;
            const paths = svgDoc.querySelectorAll('path, polygon, polyline');
            paths.forEach(path => {
                path.setAttribute('fill', hexColor);
            });
        } else {
            svgObject.addEventListener('load', function() {
                const svgDoc = svgObject.contentDocument;
                const paths = svgDoc.querySelectorAll('path, polygon, polyline');
                paths.forEach(path => {
                    path.setAttribute('fill', hexColor);
                });
            });
        }
            
    }
}
// function showShadeInfo(colorIndex, shadeIndex) {
//     const selectedColor = colorData.colors[colorIndex];
//     const selectedShade = selectedColor.shades[shadeIndex];
//     const colorInfoDiv = document.getElementById('colorInfo');

//     colorInfoDiv.innerHTML = `
//         <h2>${selectedShade.name}></h2>
//         <div class="color-preview" style="background-color: ${selectedShade.primaryHex}></div>
//         <p>Hex: ${selectedShade.hex}</p>
//     `;
// }

document.addEventListener('DOMContentLoaded', loadColorData);