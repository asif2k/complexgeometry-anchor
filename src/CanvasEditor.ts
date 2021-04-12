import EventEmitter from './EventEmitter'

export default class CanvasEditor extends EventEmitter  {
    
    private canvas:HTMLCanvasElement;
    public ctx:CanvasRenderingContext2D;
    public mouseDownX:number=0;
    public mouseDownY:number=0;
    public mouseX:number=0;
    public mouseY:number=0;
    public canvasMouseX:number=0;
    public canvasMouseY:number=0;
    
    public spanX:number=0;
    public spanY:number=0;
    
    
    constructor(canvasElement:HTMLCanvasElement){
        super();
        this.canvas=canvasElement;
        this.setupMouseInput(this.canvas);
        this.ctx=this.canvas.getContext("2d") as CanvasRenderingContext2D;
    }   
    
    public render(){
        const ctx=this.ctx;
        const canv=this.canvas;    
        ctx.clearRect(0,0,canv.width,canv.height);        
        ctx.save();
        let cx=(canv.width*0.5)+this.spanX;    
        let cy=(canv.height*0.5)+this.spanY;
        
        this.canvasMouseX=(this.mouseX-cx) | 0;
        this.canvasMouseY=(this.mouseY-cy) | 0;
        
        
        ctx.setTransform(1,0,0,1,cx,cy);
        
        
        ctx.strokeStyle="rgba(10,10,10,0.5)";
        ctx.beginPath();
        ctx.moveTo(-10000,0);
        ctx.lineTo(10000,0);
        ctx.moveTo(0,-10000);
        ctx.lineTo(0,10000);
        
        ctx.stroke();
        
        this.emit("OnRender",ctx,canv);
        
        
        
        ctx.restore();
        ctx.fillStyle="black";
        ctx.fillText(`${this.canvasMouseX},${this.canvasMouseX}` ,10,10);
    }
    
    private setupMouseInput(elm:HTMLElement){        
        
        elm.addEventListener((/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel",(e:any)=> {                    
            this.emit("MouseWheel",e.detail ? e.detail * (-120) : e.wheelDelta);
            this.render();
        }, false);    
        
        
        elm.addEventListener('mousedown',(e:any)=> {       
            const rect = elm.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.mouseDownX=x;
            this.mouseDownY=y;
            this.mouseX=x | 0;
            this.mouseY=y| 0;                                             
            this.emit("MouseDown",x,y,e);
            this.render();
        });
        
        elm.addEventListener('mousemove',  (e:any)=> {
            const rect = elm.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top; 
            this.mouseX=x;
            this.mouseY=y;                                 
            this.emit("MouseMove",x,y,e);
            if (e.buttons == 1) {                          
                const dx=x-this.mouseDownX;
                const dy=y-this.mouseDownY;
                this.spanX+=dx;
                this.spanY+=dy;       
                this.emit("MouseDrage",dx,dy,e);           
                this.mouseDownX = x;
                this.mouseDownY = y;               
            }
            this.render();
        });        
    }
    
}