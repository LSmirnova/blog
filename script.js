;(()=>{
    'use strict';
    function closest(item, itemClass, parentClass) {
        if (item.classList.contains(parentClass)) return null;

        while ((item = item.parentElement)
        && !item.classList.contains(itemClass)
        && !item.classList.contains(parentClass));

        return item.classList.contains(parentClass) ? null : item
    }

    let dnd = (element) => {

        let activeDragElement;
        let placeholderElement;
        let startElementRect;


        let onDragOver = (event) => {
            placeholderElement.style.width = startElementRect.width + "px";
            placeholderElement.style.height = startElementRect.height + "px";
            placeholderElement.style.top = startElementRect.top + "px";
            placeholderElement.style.left = startElementRect.left + "px";

            event.preventDefault();
            event.dataTransfer.dropEffect = 'move';

            let target = closest(event.target, 'card', 'card-container');
            if (target && target !== activeDragElement) {
                let rect = target.getBoundingClientRect();
                let horizontal = event.clientY > startElementRect.top && event.clientY < startElementRect.bottom;
                let next = false;

                if (horizontal) {
                    next = (event.clientX - rect.left) / (rect.right - rect.left) > .5;
                } else {
                    next = !((event.clientY - rect.top) / (rect.bottom - rect.top) > .5);
                }


                element.insertBefore(activeDragElement, next && target.nextSibling || target);

                startElementRect = activeDragElement.getBoundingClientRect();
            }
        };

        let onDragEnd = (event) => {
            event.preventDefault();

            placeholderElement.style.width = "0px";
            placeholderElement.style.height = "0px";
            placeholderElement.style.top = "0px";
            placeholderElement.style.left = "0px";

            activeDragElement.classList.remove('moving');
            element.removeEventListener('dragover', onDragOver, false);
            element.removeEventListener('dragend', onDragEnd, false);
        };

        element.addEventListener("dragstart", function (event) {

            if (event.target.getAttribute("draggable") !== "true") {
                event.preventDefault();
                return;
            }

            activeDragElement = event.target;
            startElementRect = activeDragElement.getBoundingClientRect();

            event.dataTransfer.effectAllowed = 'move';

            event.dataTransfer.setData('text/html', this.innerHTML);

            element.addEventListener('dragover', onDragOver, false);
            element.addEventListener('dragend', onDragEnd, false);

            activeDragElement.classList.add('moving');

            placeholderElement = element.querySelector('.placeholder');
        });
    };
    document.addEventListener('DOMContentLoaded', ()=>{
        dnd(document.querySelector(".card-container"));
    });
})();

