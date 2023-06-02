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
    const modalMove = movies.filter((movie)=> src.includes(movie.posterImageFileName));
    console.log(modalMove);
    const modalEl = document.createElement('div');
    modalEl.setAttribute('class','modal__layout');
    modalEl.innerHTML = modalTemplate();
    list.prepend(modalEl);
    list.scrollIntoView();
    document.querySelector('.close__btn').addEventListener('click',()=>{
        list.removeChild(modalEl);
    });
});

function modalTemplate(){
    return `
    <div class="modal__layout">
    <section class="modal__card">
        <div class="modal__poster"></div>
        <div class="modal__txt">
            <h3 class="modal__title">탑건 매버릭</h3>
            <div class="subTitle">
                <p class="time">130분</p>
                <span class="age">19+</span>
            </div>
            <div class="modal__btn">
                <button class="play__btn">재생하기</button>
                <button class="close__btn">돌아가기</button>
            </div>
            <p class="director">감독: 조셉 코신스키</p>
            <p class="actor">출연: 톰 크루즈,마일스 텔러, 제니퍼 코넬리, 존 햄, 글렌 포웰, 에드 해리스, 발 킬머, 루이스 풀먼</p>
            <p class="descrpition">최고의 파일럿이자 전설적인 인물 매버릭(톰 크루즈)은 자신이 졸업한 훈련 학교 교관으로 발탁된다. 그의 명성을 모르던 팀원들은 매버릭의 지시를 무시하지만 실전을 방불케 하는 상공 훈련에서 눈으로 봐도 믿기 힘든 전설적인 조종 실력에 모두가 압도된다. 매버릭의 지휘 아래 견고한 팀워크를 쌓아가던 팀원들에게 국경을 뛰어넘는 위험한 임무가 주어지자 매버릭은 자신이 가르친 동료들과 함께 마지막이 될 지 모를 하늘 위 비행에 나서는데…</p>
            </div>
    </section>
</div>
    `
}

