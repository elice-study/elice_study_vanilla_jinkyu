'use strict';

const rightBtn = document.querySelector('.btn-right');
const leftBtn = document.querySelector('.btn-left');

function slide(){
    let currentSlide = document.querySelector('.slide.active');
    let nextSlide = currentSlide.nextElementSibling;
    if(nextSlide === null){
        nextSlide = currentSlide.parentElement.firstElementChild;
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
    nextSlide.animate({
        opacity:[0,1]
    },{
        duration: 500,
        easing: 'ease',
        iterations: 1,
        fill: 'both',
    });
    nextSlide.classList.add('active');
}

rightBtn.addEventListener('click',slide);