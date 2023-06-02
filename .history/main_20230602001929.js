'use strict';

const rightBtn = document.querySelector('.btn-right');
const leftBtn = document.querySelector('.btn-left');
const watchBtn = document.querySelector('.btn-Watch');
const header = document.querySelector('#header');
const headerRect = header.getBoundingClientRect();
const list = document.querySelector('#list');

watchBtn.addEventListener('click',()=>{
    list.scrollIntoView({behavior:"smooth",block:"start"});
});

document.addEventListener('scroll',()=>{
    if(scrollY >= headerRect.height){
        header.classList.add('dark');
    }else{
        header.classList.remove('dark');
    }
})

function slide(direction){
    let currentSlide = document.querySelector('.slide.active');
    let Slide =  direction === 'right' ? currentSlide.nextElementSibling : direction === 'left' ? currentSlide.previousElementSibling : undefined;
    if(Slide === null && direction === 'right'){
        Slide = currentSlide.parentElement.firstElementChild;
    }
    if(Slide === null && direction === 'left'){
        Slide = currentSlide.parentElement.lastElementChild;
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

rightBtn.addEventListener('click',() => slide('right'));
leftBtn.addEventListener('click',() => slide('left'));

async function movieData(){
    return fetch('data/movies.json')
    .then((res) => res.json())
    .then((data)=> {
        createMovies(data.movies);
    });
}

const ul = document.querySelector('.movies');

function createMovies(movies){
    movies.forEach(movie => {
        const li = document.createElement('li');
        li.setAttribute('class','movie');
        const img = document.createElement('img');
        img.setAttribute('src',`img/${movie.posterImageFileName}`);
        img.setAttribute('class','movie__img');
        li.appendChild(img);
        ul.appendChild(li);
    });
}

window.addEventListener('load',movieData);

ul.addEventListener('click',(e)=>{
    if(e.target.nodeName !=='IMG'){
        return ;
    }
    console.log(e.target);
    // createModal()
});