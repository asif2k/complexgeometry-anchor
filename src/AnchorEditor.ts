
import CanvasEditor from './CanvasEditor'
import { position, uv, triangulation } from './designhubz/basemesh';


const distance2d=(x1:number,y1:number,x2:number,y2:number)=>{
    x1=(x2-x1);
    y1=(y2-y1);
    return Math.abs(Math.sqrt(x1*x1+y1*y1));    
}

export default class AnchorEditor extends CanvasEditor {
    
    private pointsZoom:number=100;
    private pointsZoomWheelDelta:number=0.1;
    
    private points:number[]=[];
    private selectedPoints:number[]=[];
    private mousePointIndex:number=-1;
    
    constructor(canvasElement:HTMLCanvasElement,useUvs:boolean){
        super(canvasElement);        
        this.on("OnRender",this.renderCanvas);
        this.on("MouseWheel",this.mouseWheel);
        this.on("MouseDown",this.mouseDown);
        if(useUvs){
            this.loadUVsInPoints();     
            this.pointsZoomWheelDelta=0.5;  
            this.pointsZoom=800;
        }
        else {
            this.pointsZoomWheelDelta=0.1;  
            this.pointsZoom=50;
            this.points=position.slice(0);
            
        }
        
    }
    
    private loadUVsInPoints(){
        this.points=[];
        for(let i=0;i<uv.length;i+=2){
            this.points.push(uv[i]-0.5,0,-(uv[i+1]-0.5));            
        }
    }
    
    private mouseDown(x:number,y:number,e:any){
        if(this.mousePointIndex>-1){
            if(!e.ctrlKey) this.selectedPoints.length=0;
            this.selectedPoints.push(this.mousePointIndex);

            
            var i=this.mousePointIndex;
            
            const _uv:number[]=[uv[i*2],uv[i*2+1]];
            const _pos:number[]=[position[i*3],position[i*3+1],position[i*3+2]];
            
            this.emit("PointSelected",i,_pos,_uv);
            
        }
    }
    
    private mouseWheel(delta:number){
        this.pointsZoom+=delta*this.pointsZoomWheelDelta;    
        this.pointsZoom=Math.max(this.pointsZoom,30);
    }
    
    private renderCanvas(ctx:CanvasRenderingContext2D,canvas:HTMLCanvasElement){
        let x=0;
        let y=0;
        let pi=0;
        let zoom=this.pointsZoom;
        const points=this.points;
        
        ctx.strokeStyle="silver";

        //ignore the Y component in points since we rendering in 2d and mesh was upside down
        for(let i=0;i<triangulation.length;i+=3){
            ctx.beginPath();
            
            pi=triangulation[i]*3;
            x=points[pi]*zoom;
            y=-points[pi+2]*zoom;        
            ctx.moveTo(x,y);
            
            pi=triangulation[i+1]*3;
            x=points[pi]*zoom;
            y=-points[pi+2]*zoom;        
            ctx.lineTo(x,y);
            
            pi=triangulation[i+2]*3;
            x=points[pi]*zoom;
            y=-points[pi+2]*zoom;        
            ctx.lineTo(x,y);
            ctx.closePath();
            
            ctx.stroke();
        }
        
        
        
        this.mousePointIndex=-1;
        
        
        ctx.fillStyle="red";
        for(let i=0;i<points.length;i+=3){
            x=points[i]*zoom;            
            y=-points[i+2]*zoom;
            if(distance2d(x,y,this.canvasMouseX, this.canvasMouseY)<4){
                this.mousePointIndex=i/3;
                ctx.fillRect(x-5,y-5,10,10);              
            }
            else {
                ctx.fillRect(x-2,y-2,4,4);
            }
            
            if(this.selectedPoints.indexOf(i/3)>-1){
                ctx.fillStyle="green";
                ctx.fillRect(x-4,y-4,8,8);
                ctx.fillStyle="red";
            }
            
        }   
        
    }
    
}
