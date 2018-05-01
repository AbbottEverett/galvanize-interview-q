(function(document) {
    // Define Elements
    const input = document.getElementById('files');
    const dragDrop = document.getElementById('drag-n-drop');
    const output = document.getElementById('htmlFromFile');

    function handleFileSelect(e) {
        const files = e.target.files;
        for (let i = 0, f; f = files[i]; i++) {
            const reader = new FileReader();
            reader.onload = (function(file) {
                return function (e) {
                    let stack = JSON.parse(e.target.result);
                    clearChildren(output);
                    processStack(stack, output);
                };
            })(f);
            reader.readAsText(f, 'application/json');
        }
    }

    function handleDragOver(e) {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    }

    function handleDragOverFiles(e) {
        e.stopPropagation();
        e.preventDefault();
        const files = e.dataTransfer.files;
        for (let i = 0, f; f = files[i]; i++) {
            const reader = new FileReader();
            reader.onload = (function(file) {
                return function (e) {
                    dragDrop.textContent = f.name;
                    let stack = JSON.parse(e.target.result);
                    clearChildren(output);
                    processStack(stack, output);
                };
            })(f);
            reader.readAsText(f, 'application/json');
        }
    }

    function clearChildren(root) {
        while (root.firstChild) {
            root.removeChild(root.firstChild);
        }
    }

    function processStack(array, root) {
        while (array.length) {
            let currVal = array.shift();
            let newEl = document.createElement(currVal.tag);

            // Check to see if the current element has a defined parent before appending
            currVal.parent ? currVal.parent.appendChild(newEl) : root.appendChild(newEl);

            loadStack(array, currVal.content, newEl);
        }
    }

    function loadStack(stack, content, element) {
        if (Array.isArray(content)) {
            for (let i = content.length-1; i >= 0; i--) {
                content[i].parent = element;
                stack.unshift(content[i]);
            }
        } else if (typeof content === 'object') {
            content.parent = element;
            stack.unshift(content);
        } else {
            element.innerHTML = content;
        }
    }
    
    // Connect event listeners 
    input.addEventListener('change', handleFileSelect, false);
    dragDrop.addEventListener('dragover', handleDragOver, false);
    dragDrop.addEventListener('drop', handleDragOverFiles, false);
}(document));