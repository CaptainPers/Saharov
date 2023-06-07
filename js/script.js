"use strict"


window.addEventListener('load', windowLoad);

function windowLoad () {

    document.body.classList.add('loaded');

    if (document.querySelector('.main-slider')) {
        new Swiper('.main-slider', {
            speed: 2000,
            effect: "fade",
            autoplay: {
                delay: 3000
            },
            pagination: {
                el: '.bullets_items',
                type: 'bullets',
                clickable: true
              },
        });
    }

    document.addEventListener("click", documentActions);

function documentActions(e) {
    const targetElement = e.target;

    if (targetElement.closest('.icon-menu')) {             /*step 2*/
        document.documentElement.classList.toggle('menu-open');     /*создаем класс menu-open*/
    }

    if (targetElement.closest('[data-goto]')) {
        document.documentElement.classList.contains('menu-open') ?              /*при выборе пункта меню закрывается*/
            document.documentElement.classList.remove('menu-open') : null;      /*при выборе пункта меню закрывается*/
        // const goTo = targetElement.closest('[data-goto]').dataset.goto;
        // const goToElement = document.querySelector(goTo);
        // const headerHeight = document.querySelector('.header').offsetHeight;

        // if (goToElement) {
        //     window.scrollTo({
        //         top: goToElement.offsetTop - (headerHeight + 15),
        //         behavior: "smooth"
        //     });
        // }
        e.preventDefault();         /*На этом моменте уже работают ссылки меню*/
    }

/*SEARCH_FORM*/
let searchForm = document.querySelector('.header_form-input');

document.querySelector('.search_icon').onclick = () => {
    searchForm.classList.toggle('active');  
}
window.onscroll = () => {
    searchForm.classList.remove('active');
}

/* SLIDER */
}
}

/*POPUP*/
const popupLinks = document.querySelectorAll('.popup-link');
const body = document.querySelector('body');
const lockPadding = document.querySelectorAll('.lock-padding');

let unlock = true;

const timeout = 500;    /*цифра укзанная в свойстве транзишн*/

if (popupLinks.length > 0) {
    for (let index = 0; index < popupLinks.length; index++) {
        const popupLink = popupLinks[index];
        popupLink.addEventListener("click", function(e) {
            const popupName = popupLink.getAttribute('href').replace('#', '');
            const currentPopup = document.getElementById(popupName);
            popupOpen(currentPopup);
            e.preventDefault(); /** блокируем работу ссылки */
        });
    }
}

const popupCloseIcon = document.querySelectorAll('.close-popup');
if (popupCloseIcon.length > 0) {
    for (let index = 0; index < popupCloseIcon.length; index++) {
        const el = popupCloseIcon[index];
        el.addEventListener('click', function (e) {
            popupClose(el.closest('popup'));
            e.preventDefault();
        });
    }
}

function popupOpen (curentPopup) {
    if (curentPopup && unlock) {
        const popupActive = document.querySelector('.popup.open');
        if (popupActive) {
            popupClose(popupActive, false);
        } else {
            bodyLock();
        }
        curentPopup.classList.add('open');
        curentPopup.addEventListener("clock", function (e) {
            if (!e.target.closest('.popup_content')) {
                popupClose(e.target.closest('.popup'));
            }
        });
    }
}
function popupClose(popupActive, doUnlock = true) {
    if (unlock) {
        popupActive.classList.remove('open');
        if (doUnlock) {
            bodyUnlock();
        }
    }
}

/*1 scroll*/ 
function bodyLock() {
    const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';

    if (lockPadding.length > 0) {
        for (let index = 0; index < lockPadding.length; index++) {
            const el = lockPadding[index];
            el.getElementsByClassName.paddingRight = lockPaddingValue;
        }
    }
    body.style.paddingRight = lockPaddingValue;
    body.classList.add('lock');

    unlock = false;
    setTimeout(function () {
        unlock = true;
    }, timeout);
}

function bodyUnlock() {
    setTimeout(function () {
        if (lockPadding.length > 0) {
            for (let index = 0; index < lockPadding.length; index ++) {
                const el = lockPadding[index];
                el.style.paddingRight = '0px';
            }
        }
        body.style.paddingRight = '0px';
        body.classList.remove('lock');
    }, timeout);
}

/** Close when press Esc */
document.addEventListener('keydown', function (e) {
    if (e.which === 27) {
        const popupActive = document.querySelector('.popup.open');
        popupClose(popupActive);
    }
});


/*АНИМАЦИЯ_ПЕРЕМЕЩЕНИЯ_ТОВАРА_В_КОРЗИНУ*/

const shopping_cart = document.querySelector('.shopping-cart');
const cart_btns = document.querySelectorAll('.add-to-cart');

/*FLY TO CART */

for (let cart_btn of cart_btns) {
    cart_btn.onclick = (e) => {
        
        shopping_cart.classList.add('active');

        //COUNT
        let product_count = Number (shopping_cart.getAttribute('data-product-count')) || 0;
        shopping_cart.setAttribute('data-product-count', product_count + 1);    //increase +1

        //Finding first grand parent of target button
        let target_parent = e.target.parentNode.parentNode.parentNode;
        // console.log(target_parent);
        // target_parent.style.zIndex = "100";
        //Creating separate Image
        let img = target_parent.querySelector('img');
        let flying_img = img.cloneNode();
        flying_img.classList.add('flying-img');

        target_parent.appendChild(flying_img);

        //Finding position of flying image
        const flying_img_pos = flying_img.getBoundingClientRect();
        const shopping_cart_pos = shopping_cart.getBoundingClientRect();

        let data = {
            left: shopping_cart_pos.left - (shopping_cart_pos.width / 2 + flying_img_pos.left + flying_img_pos.width / 2),
            top: shopping_cart_pos.bottom - flying_img_pos.bottom + 30
        }

        flying_img.style.cssText = `
                                --left : ${data.left.toFixed(2)}px;
                                --top : ${data.top.toFixed(2)}px;
                                `;
        

        setTimeout(() => {
            target_parent.style.zIndex = "";
            target_parent.removeChild(flying_img);
            shopping_cart.classList.remove('active');
        }, 1000);
    }
}

/*ИЗМЕНЕНИЕ НАДПИСИ КНОПКИ (ЗАКАЗАТЬ\УБРАТЬ ИЗ КОРЗИНЫ)*/
const button = document.querySelector(".buy_button");
    //   const content = document.querySelector(".contenttabs");
        button.addEventListener("click", (event) => {
        event.preventDefault();
        const { hidetext, showtext } = event.currentTarget.dataset;
        if (event.currentTarget.textContent === showtext) {
          event.currentTarget.textContent = hidetext;
        } else {
          event.currentTarget.textContent = showtext;
        }
        // content.classList.toggle("auto-width");
      });