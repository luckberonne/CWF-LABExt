let isExecuted = false;

function clickButtonsWithDelay(buttonSelectors, delayBetweenClicks) {
    buttonSelectors.forEach((selector, index) => {
        setTimeout(() => {
            try {
                const button = document.evaluate(selector, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                if (button && button.offsetParent !== null) {
                    button.click();
                } else {
                    console.log(`Botón no encontrado o no es visible con selector: ${selector}`);
                }
            } catch (error) {
                console.error(`Error al intentar hacer clic en el botón con selector: ${selector}`, error);
            }
        }, index * delayBetweenClicks);
    });
}

function generateRandomDocumentNumber(cantidadDigitos) {
    const maxNum = Math.pow(10, cantidadDigitos) - 1;
    const randomNum = Math.floor(Math.random() * (maxNum + 1));
    return String(randomNum).padStart(cantidadDigitos, '0');
}

function getFormattedDate(dias) {
    const now = new Date();
    const day = now.getDate() + (dias || 0);
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    return `${day}/${month}/${year}`;
}

function generateMatchingValues() {
    const cantidad = Math.floor(Math.random() * 10) + 1;
    const precioUnit = Math.floor(Math.random() * 100) + 1;
    const subRegistro = cantidad * precioUnit;
    return {
        cantidad,
        precioUnit,
        subRegistro,
        importeTotalSinImpuestos: subRegistro,
        importe: subRegistro
    };
}

function getSampleDataByType(inputType, formControlName) {
    try {
        const dataMap = {
            'nroDocumento': () => generateRandomDocumentNumber(8),
            'ptoVta': () => generateRandomDocumentNumber(5),
            'fechaInicioActividad': () => getFormattedDate(-10),
            'fechaEmision': () => getFormattedDate(),
            'vtoCodAutorizacion': () => getFormattedDate(5),
            'nroCodAutorizacion': () => generateRandomDocumentNumber(14),
            'CodUpcEan13': () => generateRandomDocumentNumber(4),
            'Cantidad': () => Number(values.cantidad),
            'importeTotalSinImpuestos': () => Number(values.importeTotalSinImpuestos),
            'PrecioUnit': () => Number(values.precioUnit),
            'SubRegistro': () => Number(values.subRegistro),
            'importe': () => Number(values.importe),
            'nro': () => generateRandomDocumentNumber(10),
            'observaciones': () => "Prueba Generada por la automatización de pruebas CWF-LABExt, Creada por Lucas Beronne."
        };
        return (dataMap[formControlName] || (() => 'SampleData'))();
    } catch (error) {
        console.error(`Error al obtener datos de muestra para el tipo de input: ${inputType}`, error);
        return 'Sample Data';
    }
}

function fillInputs() {
    try {
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            const inputType = input.type || 'text';
            const formControlName = input.getAttribute('formcontrolname');
            if (inputType !== 'file') {
                if (formControlName !== "sucursal" && formControlName !== "UnidadMedida") {
                    input.checked = true;
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                    const sampleData = getSampleDataByType(inputType, formControlName);
                    input.value = sampleData;
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                }
                else{
                    console.log('No se llenará el input: ', formControlName);
                }
            }
        });
    } catch (error) {
        console.error('Error al llenar los inputs', error);
    }
}

function selectRandomOptionInMatSelects(matSelectIds) {
    matSelectIds.forEach(id => {
        const matSelect = document.querySelector(id);
        if (matSelect && matSelect.classList.contains('mat-select-empty')) {
            matSelect.click();
            setTimeout(() => {
                const options = document.querySelectorAll('.mat-option');
                if (options.length > 0) {
                    options[Math.floor(Math.random() * options.length)].click();
                }
            }, 500);
        }
    });
}

function selectFirstOptionInAllMatSelects(excludedSelects) {
    try {
        const matSelects = document.querySelectorAll('mat-select');
        matSelects.forEach((matSelect, index) => {
            if (!excludedSelects.includes(matSelect.id)) {
                setTimeout(() => {
                    matSelect.click();
                    setTimeout(() => {
                        const options = document.querySelectorAll('.mat-option');
                        if (options.length > 0) {
                            options[0].click();
                            setTimeout(() => {
                                document.body.click();
                            }, 200);
                        }
                    }, 200);
                }, index * 1000);
            }
        });
    } catch (error) {
        console.error('Error al seleccionar la primera opción en los mat-selects', error);
    }
}

function closeMatDialogIfExists() {
    const dialog = document.querySelector('body > div.cdk-overlay-container > div > div > mat-dialog-container');
    if (dialog) {
        const overlay = document.querySelector('.cdk-overlay-backdrop');
        if (overlay) {
            overlay.click();
        }
    }
}

function selectRandomOptionInMatAutocompletes() {
    try {
        const inputs = document.querySelectorAll('.mat-autocomplete-trigger');
        inputs.forEach((input, index) => {
            setTimeout(() => {
                input.click();
                const options = document.querySelectorAll('.mat-option');
                if (options.length > 0) {
                    const nroptions = Math.floor(Math.random() * options.length);
                    options[nroptions].click();
                }
            }, 4500);
        });
    } catch (error) {
        console.error('Error al seleccionar opciones en los mat-autocomplete', error);
    }
}

function uploadFile(filePath) {
    const inputFile = document.querySelector('#fileOriginal');
    if (inputFile) {
        const dataTransfer = new DataTransfer();
        const file = new File([filePath], 'sopamacaco.png', { type: 'image/png' }); // Cambia el nombre y tipo según sea necesario
        dataTransfer.items.add(file);
        inputFile.files = dataTransfer.files;

        // Dispara los eventos necesarios para que el input reconozca el cambio
        const event = new Event('change', { bubbles: true });
        inputFile.dispatchEvent(event);

        console.log('Archivo cargado exitosamente');
    } else {
        console.error('Elemento input de tipo file no encontrado');
    }
}


const values = generateMatchingValues();
setTimeout(() => {
    if (!isExecuted) {
        isExecuted = true;
        const buttonSelectors = [
            "/html/body/app-root/div/app-main-k360/div/div/div[3]/app-carga-manual/div/app-cwf-configuracion/app-carga-archivo/mat-card/mat-card-content/div/div[1]/div[3]",
            "/html/body/div[3]/div[2]/div/mat-dialog-container/app-confirmacion-dialog/div[2]/div[2]/button"
        ];
        const delayBetweenClicks = 1500;
        
        clickButtonsWithDelay(buttonSelectors, delayBetweenClicks);
        
        setTimeout(() => {
            const matSelectIds = [
                '#emisor.mat-select',
                '#receptor.mat-select'
            ];
            
            selectRandomOptionInMatSelects(matSelectIds);
            
            setTimeout(() => {
                closeMatDialogIfExists();
                selectRandomOptionInMatAutocompletes();
                
                setTimeout(() => {
                    fillInputs();
                    const overlay = document.querySelector('.cdk-overlay-backdrop');
                    if (overlay) {
                        overlay.click();
                        console.log('Overlay cerrado');
                    }
                    setTimeout(() => {
                        const excludedSelects = ['emisor', 'receptor'];
                        selectFirstOptionInAllMatSelects(excludedSelects);
                    }, 2000);
                    uploadFile('images/sopamacaco.png');
                }, 3500);
            }, 2000);
            
        }, (buttonSelectors.length * delayBetweenClicks) + 2000);
    }
}, 3000);
