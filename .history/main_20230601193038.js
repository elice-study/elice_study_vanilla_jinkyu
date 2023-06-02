'use strict';

const rightBtn = document.querySelector('.btn-right');
const leftBtn = document.querySelector('.btn-left');

function slide(direction){
    let currentSlide = document.querySelector('.slide.active');
    let Slide =  direction === 'right' ? currentSlide.nextElementSibling : direction === 'left' ? currentSlide.previousElementSibling : undefined;
    if(Slide === null){
        Slide = currentSlide.parentElement.firstElementChild;
    } 
    currentSlide.animate({
        opacity: [1,0]
    },{
        duration: 500,
        easing: 'ease',
        iterations: 1,
        fill: 'both',
    });
    currentSlide.classList.remove('active');
    Slide.animate({
        opacity:[0,1]
    },{
        duration: 500,
        easing: 'ease',
        iterations: 1,
        fill: 'both',
    });
    Slide.classList.add('active');
}

rightBtn.addEventListener('click',slide('right'));
leftBtn.addEventListener('click',slide('left'));