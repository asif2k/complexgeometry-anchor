import AnchorEditor from './AnchorEditor'

window.addEventListener('load', async e => {
     
     
     const canv=document.getElementById("editor-canvas") as HTMLCanvasElement;
     const searchParams = new URL(location.href).searchParams;
     canv.width=window.innerWidth;
     canv.height=window.innerHeight;

     //uv=true in querystring to load points from uvs instead of position
     
     const editor=new AnchorEditor(canv,searchParams.get('uv')=="true");
     
     
     // control key for multiple select points
     editor.on("PointSelected",(index:number,position:number[],uv:number[])=>{
          console.log(`${index}: position:[${position.join()}]  uv:[${uv.join()}]`);
          
     })
});