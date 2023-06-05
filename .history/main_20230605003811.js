'use strict';

const rightBtn = document.querySelector('.btn-right');
const leftBtn = document.querySelector('.btn-left');
const watchBtn = document.querySelector('.btn-Watch');
const header = document.querySelector('#header');
const headerRect = header.getBoundingClientRect();
const list = document.querySelector('#list');
const login = document.querySelector('.user__login');



login.addEventListener('click',()=>{
    alert('로그인 기능 X');
})

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
    ul.classList.add('hide');
    document.querySelector('.close__btn').addEventListener('click',()=>{
        list.removeChild(modalEl);
        ul.classList.remove('hide');
    });
    document.querySelector('.play__btn').addEventListener('click',()=>{
        alert('❗️결제 후 이용하실 수 없습니다');
    });
    document.querySelector('.logo').addEventListener('click',()=>{
        list.removeChild(modalEl);
        ul.classList.remove('hide');
    });

    document.querySelector('.review__btn').addEventListener('click',(e)=>{
        const target =e.target.parentElement.parentElement.firstElementChild.textContent;
        const reviewEl = document.createElement('div');
        reviewEl.setAttribute('class','write__layout');
        reviewEl.innerHTML = reviewTemplate(target);
        list.prepend(reviewEl);
        const writeTextarea = document.querySelector('.write__textarea');
        writeTextarea.value = '';
        document.querySelector('.write__cancell-btn').addEventListener('click',()=>{
            list.removeChild(reviewEl);
        });

        document.querySelector('.logo').addEventListener('click',()=>{
            list.removeChild(reviewEl);
            ul.classList.remove('hide');
        });

        document.querySelector('.write__form').addEventListener('submit',(e)=>{
            e.preventDefault();
            console.log('전송됨');
            writeTextarea.value = '';
        })
    })
});

function modalTemplate(movie){
    const {posterImageFileName, title, runningTimeMinutes, permissibleAge, creator, castMembers, description} = movie
    return `
    <section class="modal__card">
        <div class="modal__poster">
            <img class="poster-img" src="img/${posterImageFileName}" alt="movie poster">
        </div>
        <div class="modal__txt">
            <h3 class="modal__title">${title}</h3>
            <div class="subTitle">
                <p class="time">${runningTimeMinutes}분</p>
                <span class="age">${permissibleAge}+</span>
            </div>
            <div class="modal__btn">
                <button class="play__btn">재생하기</button>
                <button class="close__btn">돌아가기</button>
                <button class="review__btn">리뷰쓰기</button>
            </div>
            <p class="director">감독: ${creator}</p>
            <p class="actor">출연: ${castMembers}</p>
            <p class="descrpition">${description}</p>
        </div>
    </section>
    <ul class="modal__review">
            <li class="review__row">
                <div class="row__grade">
                    <i class="fa fa-star active"></i>
                    <i class="fa fa-star active"></i>
                    <i class="fa fa-star active"></i>
                    <i class="fa fa-star"></i>
                    <i class="fa fa-star"></i>
                </div>
                <div class="row__text">재밌어용 강추강추</div>
                <div class="row__description">
                    <span class="name">Elice</span>
                    <span class="date">2023년 06월 04일</span>
                </div>
                <div class="yes-or-no">
                    <div class="yes">
                        <i class="fa fa-thumbs-up"></i>맞아요
                    </div>
                    <div class="no">
                        <i class="fa fa-thumbs-down"></i>아니에요
                    </div>
                </div>
            </li>
        </ul>
    `
}



function reviewTemplate(title){
    return `
    <div class="write">
        <header class="write__header">
            <h4>감상평 작성하기</h4>
            <button class="write__cancell-btn">ⅹ</button>
        </header>
        <div class="write__title">${title}</div>
        <div class="write__grade">
            <i class="fa fa-star"></i>
            <i class="fa fa-star"></i>
            <i class="fa fa-star"></i>
            <i class="fa fa-star"></i>
            <i class="fa fa-star"></i>
        </div>
        <form class="write__form">
            <textarea
            class="write__textarea"
            placeholder="이 콘텐츠의 어떤 점이 좋거나 싫었는지 다른 사용자들에게 알려주세요. 고객님의 리뷰는 다른 사용자들에게 큰 도움이 됩니다."
            >
            </textarea>
            <div class="check">
                <p>감상평에 스포일러가 포함되어 있나요?</p>
                <div class="related">
                    <label class="check-label" for="checkbox">없음</label>
                    <input type="checkbox" id="checkbox">
                </div>
            </div>
            <button class="registration-btn">등록하기</button>
        </form>
    </div>
    `;
}