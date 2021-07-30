(()=>{
    const hand = document.querySelector(".hand")
    const leaflet = document.querySelector(".leaflet");
    const pageElems = document.querySelectorAll(".page");
    let pageCount = 0;
    let currentMenu = null;
    let handPos = {x:0, y:0};
    let targetPos = {x:0, y:0};
    let distX;
    let distY;

    const render = ()=>{
        distX = targetPos.x - handPos.x;
        distY = targetPos.y - handPos.y;
        handPos.x = handPos.x + distX*0.1;
        handPos.y = handPos.y + distY*0.1;
        hand.style.transform = `translate(${handPos.x-30}px, ${handPos.y+30}px)`
        requestAnimationFrame(render);
    }
    render();

    const getTarget = (el, className)=>{
        while (!el.classList.contains(className)){
            el = el.parentNode;
            if(el.nodeName =="BODY"){
                el = null;
                return;
            }
        }
        return el;
    }
    const closeLeaflet = ()=>{
        document.body.classList.remove("leaflet-opened");
        pageElems[2].classList.remove("page-fliped");
        setTimeout(()=>{
            pageElems[0].classList.remove("page-fliped");
        },500)
        pageCount = 0;
        zoomOut();
    }

    const zoomIn = (elem)=>{
		const rect = elem.getBoundingClientRect();
		const dx = window.innerWidth/2 - (rect.x + rect.width/2);
		const dy = window.innerHeight/2 - (rect.y + rect.height/2);
        let angle;
        const pagenum = Number(elem.parentNode.parentNode.parentNode.dataset.page);
        switch(pagenum){
            case 1:
                angle = -30;
                break;
            case 2:
                angle = 0;
                break;
            case 3:
                angle = 30;
                break;
        }
        document.body.classList.add("zoom-in");
        leaflet.style.transform = `translate3d(${dx}px, ${dy}px, 50vw) rotateY(${angle}deg)`
        currentMenu = elem;
        currentMenu.classList.add("current-menu");
    }

    const zoomOut = ()=>{
        leaflet.style.transform = `translate3D(0,0,0)`
        if(currentMenu){
            currentMenu.classList.remove("current-menu");
            currentMenu = null;
            document.body.classList.remove("zoom-in");
        }
    }

    leaflet.addEventListener("click", e=>{
        // 페이지 클릭 시, 페이지 open
        let  pageEl = getTarget(e.target, "page");
        if(pageEl){
            pageEl.classList.add("page-fliped")
            pageCount++;
            if(pageCount==2){
                document.body.classList.add("leaflet-opened")
            }
        }

        // 리플릿 접기
        let  closeBtnEl = getTarget(e.target, "close-btn");
        if(closeBtnEl){
            closeLeaflet();
        }    
        
        let menuItemElem = getTarget(e.target, "menu-item");
        if(menuItemElem){
            zoomIn(menuItemElem);
        }
        
        let BackBtn = getTarget(e.target, "back-btn");
        if(BackBtn){
            zoomOut();
        }
    })

    leaflet.addEventListener("animationend",()=>{
        leaflet.style.animation = 'none';
    })

    window.addEventListener("mousemove",e=>{
        targetPos.x = e.clientX - window.innerWidth*0.7;
        targetPos.y = e.clientY- window.innerHeight*0.7;
    })

})();