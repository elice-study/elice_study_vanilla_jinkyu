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

function localStorageSaveData(data){
    const movieData = localStorage.getItem('movies');
    if(movieData){
        return createMovies(movieData);
    }else{
        localStorage.setItem('movies',JSON.stringify(data));
    }
    return createMovies(localStorage.getItem('movies'));
}

async function movieData(){
    return fetch('data/movies.json')
    .then((res) => res.json())
    .then((data)=> {
        localStorageSaveData(data.movies);
    });
}

const ul = document.querySelector('.movies');

function createMovies(movieData){
    const movieList = movieData && JSON.parse(movieData);
    movieList.map((obj)=>{
        const li = document.createElement('li');
        li.setAttribute('class','movie');
        const img = document.createElement('img');
        img.setAttribute('src',`img/${obj.posterImageFileName}`);
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
    const src = e.target.src;
    const data = localStorage.getItem('movies');
    const movies = data && JSON.parse(data);
    const modalMovie = movies.filter((movie)=> src.includes(movie.posterImageFileName));
    const modalEl = document.createElement('div');
    modalEl.setAttribute('class','modal__layout');
    modalEl.innerHTML = modalTemplate(modalMovie[0]);
    list.prepend(modalEl);
    list.scrollIntoView();
    document.querySelector('.close__btn').addEventListener('click',()=>{
        list.removeChild(modalEl);
    });
});

function modalTemplate(movie){
    const {title, runningTimeMinutes, permissibleAge, creator, castMembers, description} = movie
    return `
    <div class="modal__layout">
    <section class="modal__card">
        <div class="modal__poster"></div>
        <div class="modal__txt">
            <h3 class="modal__title">${title}</h3>
            <div class="subTitle">
                <p class="time">${runningTimeMinutes}분</p>
                <span class="age">${permissibleAge}+</span>
            </div>
            <div class="modal__btn">
                <button class="play__btn">재생하기</button>
                <button class="close__btn">돌아가기</button>
            </div>
            <p class="director">감독: ${creator}</p>
            <p class="actor">출연: ${castMembers}</p>
            <p class="descrpition">${description}</p>
            </div>
    </section>
</div>
    `
}

