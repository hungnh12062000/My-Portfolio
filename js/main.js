

/*============NAVIGATION MENU=================*/
(()=>{
    const hamburgerBtn = document.querySelector(".hamburger-btn");
    const navMenu = document.querySelector(".nav-menu");
    const closeNavBtn = navMenu.querySelector(".nav-menu__close");

    hamburgerBtn.addEventListener("click", showNavMenu);
    closeNavBtn.addEventListener("click", hideNavMenu);

    function showNavMenu(){
        navMenu.classList.add("open");
        bodyScrollingToggle();
    }

    function hideNavMenu(){
        navMenu.classList.remove("open");
        fadeOutEffect();
        bodyScrollingToggle();

    }

    function fadeOutEffect(){
        document.querySelector(".fade-out-effect").classList.add("active");
        setTimeout(()=>{
            document.querySelector(".fade-out-effect").classList.remove("active");
        },300)
    }

    //attach an event handler to document
    document.addEventListener("click", (event) =>{
        if(event.target.classList.contains('link-item')){
            /*make sure event.target.hash has a value before overriding default behavior */
            if(event.target.hash !== ""){
                //ngăn chặn hành vi nhấp chuột cố định mặc định
                event.preventDefault();
                const hash = event.target.hash;

                //Hủy active 'section'
                document.querySelector(".section.active").classList.add("hide");
                document.querySelector(".section.active").classList.remove("active");

                //thêm new 'section'
                document.querySelector(hash).classList.add("active");
                document.querySelector(hash).classList.remove("hide");

                //hủy active navigation menu "link-item"
                navMenu.querySelector(".active").classList.add("outer-shadow", "hover-in-shadow");
                navMenu.querySelector(".active").classList.remove("active", "inner-shadow");


                //if checked 'link-item' is contained within the navigation menu
                if(navMenu.classList.contains("open")){
                    //thêm new navigation menu "link-item"
                    event.target.classList.add("active", "inner-shadow");
                    event.target.classList.remove("outer-shadow", "hover-in-shadow");
    
                    //hide navigation menu
                    hideNavMenu();

                }
                else{
                    let navItems = navMenu.querySelectorAll(".link-item");
                    navItems.forEach((item) =>{
                        if(hash == item.hash){
                            //activate new navigation menu "link-item"
                            item.classList.add("active", "inner-shadow");
                            item.classList.remove("outer-shadow", "hover-in-shadow");
                        }
                    })
                    fadeOutEffect();
                }

                //add hash (#) to url
                window.location.hash = hash;
            }
        }
    })

})();





/*============ABOUT SECTION TABS=================*/

/*Hàm IIFE: Là một biểu thức hàm được gọi ngay lập tức. Hàm sẽ được thực thi sau khi hoàn thành định nghĩa */
(()=>{
    const aboutSection = document.querySelector(".about-section");
    const tabsContainer = document.querySelector(".about-tabs");

    //add event click for tabsContainer
    tabsContainer.addEventListener("click", (event) => {
        if(event.target.classList.contains("about-tab__item") && !event.target.classList.contains("active")){
            //truy cập vào HTML element mà event diễn ra. Có 2 cách là sử dụng từ khoá this hoặc sử dụng thuộc tính target

            //Trả về giá trị Boolean, cho biết liệu một phần tử có tên lớp được chỉ định hay không. Nếu có class .about-tab__item và không có class active thì thực hiện lệnh bên dưới

            const target = event.target.getAttribute("data-target");
            //Phương thức getAttribute () trả về giá trị của thuộc tính với tên được chỉ định, của một phần tử. .skills .experience .education

            //xóa active "about-tab-item"
            tabsContainer.querySelector(".active").classList.remove("outer-shadow", "active");
            // thêm active mới
            event.target.classList.add("active", "outer-shadow");

            //xóa active "tab-content"
            aboutSection.querySelector(".tab-content.active").classList.remove("active");
            //thêm active mới
            aboutSection.querySelector(target).classList.add("active");

        }
    })
})();

function bodyScrollingToggle(){
    document.body.classList.toggle("hidden-scrolling");
}
/*============PORTFOLIO FILTER AND POPUP=================*/

(() =>{
    const filterContainer = document.querySelector(".portfolio-filter");
    const portfolioItemsContainer = document.querySelector(".portfolio-items");
    const portfolioItems = document.querySelectorAll(".portfolio-item");
    const popup = document.querySelector(".portfolio-popup");
    const prevBtn = popup.querySelector(".pp-prev");
    const nextBtn = popup.querySelector(".pp-next");
    const closeBtn =  popup.querySelector(".pp-close");
    const projectDetailsContainer =  popup.querySelector(".pp-details");
    const projectDetailsBtn =  popup.querySelector(".pp-project-details-btn");

    let itemIndex, slideIndex, screenshots;

    /*filter portfolio items*/
    filterContainer.addEventListener("click", (event)=>{
        if(event.target.classList.contains("filter-item") && !event.target.classList.contains("active")){
            //xóa active "filter-item"
            filterContainer.querySelector(".active").classList.remove("outer-shadow", "active");
            //thêm active vào "filter-item" được click
            event.target.classList.add("active", "outer-shadow");

            const target = event.target.getAttribute("data-target");

            //lặp qua các item
            portfolioItems.forEach((item)=>{
                if(target === item.getAttribute("data-category") || target === "all"){
                    item.classList.remove("hide");
                    item.classList.add("show");
                }
                else{
                    item.classList.remove("show");
                    item.classList.add("hide");
                }
            })
        }
    })

    portfolioItemsContainer.addEventListener("click", (event)=>{
        if(event.target.closest(".portfolio-item-inner")){
            const portfolioItem = event.target.closest(".portfolio-item-inner").parentElement;

            //Lấy index portfolio item
            itemIndex = Array.from(portfolioItem.parentElement.children).indexOf(portfolioItem);

            screenshots = portfolioItems[itemIndex].querySelector(".portfolio-item-img img").getAttribute("data-screenshots");

            //chuyển screenshots thành Array
            screenshots = screenshots.split(",");
            if(screenshots.length === 1){
                prevBtn.style.display = "none";
                nextBtn.style.display = "none";
            }
            else{
                prevBtn.style.display = "block";
                nextBtn.style.display = "block";
            }
            // console.log(screenshots);
            slideIndex = 0;
            popupToggle();
            popupSlideshow();
            popupDetails();
        }
    })

    closeBtn.addEventListener("click", ()=>{
        popupToggle();
        if(projectDetailsContainer.classList.contains("active")){
            popupDetailsToggle();
        }
    })

    function popupToggle(){
        popup.classList.toggle("open");
        bodyScrollingToggle();
    }

    function popupSlideshow(){
        const imgSrc = screenshots[slideIndex];
        const popupImg = popup.querySelector(".pp-img");
        //load cho tới khi popupImg đã load xong 
        popupImg.src = imgSrc;
        popupImg.onload = ()=>{
            //Hủy loader sau khi popupImg đã load xong
            popup.querySelector(".pp-loader").classList.remove("active");
        }
        popup.querySelector(".pp-counter").innerHTML = (slideIndex+1) + " of " + screenshots.length;
    }

    //next slide
    nextBtn.addEventListener("click", ()=>{
        if(slideIndex === screenshots.length-1){
            slideIndex = 0;
        }
        else{
            slideIndex++;
        }
        popupSlideshow();
    })
    //prev slide
    prevBtn.addEventListener("click", ()=>{
        if(slideIndex === 0){
            slideIndex = screenshots.length-1;
        }
        else{
            slideIndex--;
        }
        popupSlideshow();
    })

    function popupDetails(){

        //if portfolio-item-details not exists
        if(!portfolioItems[itemIndex].querySelector(".portfolio-item-details")){
            projectDetailsBtn.style.display = "none";
            return; //end function execution
        }
        projectDetailsBtn.style.display = "block";

        //get the project details
        const details = portfolioItems[itemIndex].querySelector(".portfolio-item-details").innerHTML;
        //set the project details
        popup.querySelector(".pp-project-details").innerHTML = details;

        //get the project title
        const title = portfolioItems[itemIndex].querySelector(".portfolio-item-title").innerHTML;
        //set the project title
        popup.querySelector(".pp-title h2").innerHTML = title;

        //get the project category
        const category = portfolioItems[itemIndex].getAttribute("data-category");
        //set the project category
        popup.querySelector(".pp-project-category").innerHTML = category.split("-").join(" ");


    }

    projectDetailsBtn.addEventListener("click", ()=>{
        popupDetailsToggle();
    })

    function popupDetailsToggle(){
        if(projectDetailsContainer.classList.contains("active")){
            projectDetailsBtn.querySelector("i").classList.remove("fa-minus");
            projectDetailsBtn.querySelector("i").classList.add("fa-plus");

            projectDetailsContainer.classList.remove("active");
            projectDetailsContainer.style.maxHeight = 0 + "px";
        }
        else{
            projectDetailsBtn.querySelector("i").classList.remove("fa-plus");
            projectDetailsBtn.querySelector("i").classList.add("fa-minus");

            projectDetailsContainer.classList.add("active");
            projectDetailsContainer.style.maxHeight = projectDetailsContainer.scrollHeight + "px";

            popup.scrollTo(0, projectDetailsContainer.offsetTop);
        }
    }

})();

/*============TESTIMONIAL SECTION=================*/

(()=>{
    const sliderContainer = document.querySelector(".testi-slider-container");
    const slides = sliderContainer.querySelectorAll(".testi-item");
    const slideWidth = sliderContainer.offsetWidth;
    const prevBtn = document.querySelector(".testi-slider-nav .prev");
    const nextBtn = document.querySelector(".testi-slider-nav .next");
    const activeSlide = sliderContainer.querySelector(".testi-item.active");

    let slideIndex = Array.from(activeSlide.parentElement.children).indexOf(activeSlide);
    // console.log(slideIndex);

    //set width of all slides
    slides.forEach((slide) =>{
        slide.style.width = slideWidth + "px";
    })

    //set width of sliderContainer
    sliderContainer.style.width = slideWidth * slides.length + "px";

    nextBtn.addEventListener("click", ()=>{
        if(slideIndex === slides.length-1){
            slideIndex = 0;
        }
        else{
            slideIndex++;
        }
        slider();
    })

    prevBtn.addEventListener("click", ()=>{
        if(slideIndex === 0){
            slideIndex = slides.length-1;
        }
        else{
            slideIndex--;
        }
        slider();
    })
    
    function slider(){
        //xoa active slides
        sliderContainer.querySelector(".testi-item.active").classList.remove("active");

        //them new slide
        slides[slideIndex].classList.add("active");

        sliderContainer.style.marginLeft = - (slideWidth * slideIndex) + "px";   
    }
    slider();
})();

/*============ẨN TẤT CẢ SECTIONS NGOẠI TRỪ ACTIVE======*/
(()=>{
    const sections = document.querySelectorAll(".section");
    sections.forEach((section)=>{
        if(!section.classList.contains("active")){
            section.classList.add("hide");
        }
    })
    // console.log(sections);
})();


//PRELOAD
window.addEventListener("load", ()=>{
    //preloader
    document.querySelector(".preloader").classList.add("fade-out");
    setTimeout(()=>{
        document.querySelector(".preloader").style.display = "none";
    }, 600)
})
