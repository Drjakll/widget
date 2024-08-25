
class CompareTwoImages extends HTMLElement {
    
    static observedAttributes = ["image-one", "image-two"];
    
    template = document.createElement("template");
    
    constructor(){
        
        super();
        
        this.shadow = this.attachShadow({mode: "open"});
        
        this.mouseDown = false;
        
    }
    
    connectedCallback(){
        
        this.SetTemplate();
        
    }
    
    createImg = (src, className) => {
        
        let img = document.createElement("img");
        
        img.className= className;
        
        img.src = src;
        
        let div = document.createElement("div");
        
        div.style.width = `50%`;
        
        div.className = "img-frame";
        
        div.appendChild(img);
        
        return div;
        
    }
    
    slide = (e, circle, frame1, frame2) => {
        
        let deltaX = e.x - this.last_mouse_loc.x;
        
        circle.style.left = `calc(50% + ${deltaX - 25}px)`;
        
        frame1.style.width = `calc(50% + ${deltaX}px)`;
        
        frame2.style.width = `calc(50% - ${deltaX}px)`;
        
    }
    
    SetTemplate(){
        
        let imgOneLink = this.getAttribute("image-one");
        
        let imgTwoLink = this.getAttribute("image-two");
        
        this.imgFrame1 = this.createImg(imgOneLink, "inner-img-1");
        this.imgFrame2 = this.createImg(imgTwoLink, "inner-img-2");
        
        this.midButton = document.createElement("div");
        
        this.midButton.id = "mid-button";
        
        this.midButton.onmousedown = (e)=>{
            
            this.mouseDown = true;
            
            if(!this.last_mouse_loc){
                
                this.last_mouse_loc = {
                    x: e.x,
                    y: e.y
                };
                
            }
        };
        
        this.midButton.onmouseup = (e)=>{
            this.mouseDown = false;
        };
        
        let style = document.createElement("style");
        
        style.textContent = `@import 'https://cdn.jsdelivr.net/gh/Drjakll/widget@main/style.css'`;
        
        let divWrapper = document.createElement("div");
        
        divWrapper.id = "frame";
       
        
        divWrapper.onmousemove = (e)=>{
            
            if(this.mouseDown === false){
                return;
            }
            
            this.slide(e, this.midButton, this.imgFrame1, this.imgFrame2);
        };
        
        divWrapper.appendChild(this.imgFrame1);
        divWrapper.appendChild(this.imgFrame2);
        divWrapper.appendChild(this.midButton);
        
        this.template.content.appendChild(style);
        this.template.content.appendChild(divWrapper);
        
        this.shadow.appendChild(this.template.content);
    }
}

customElements.define("img-comparison", CompareTwoImages);
