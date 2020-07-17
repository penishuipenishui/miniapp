// Created by SpAC3




window.onload=function()
{
	var canvas=document.getElementById("game"),
		ctx=canvas.getContext("2d");
	  
	var width=250,
		height=450;
	canvas.width=width;
	canvas.height=height;
	
	var view=document.getElementById("view");
	
	document.ontouchmove=function(e)
	{
		e.preventDefault();
	}
	
	window.onresize=function()
	{
		var scale=innerHeight/height;
		var t="translate(-50%,-50%) scale("+scale+") translate(0%,50%)";
		view.style.WebkitTransform=t;
		view.style.MozTransform=t;
		view.style.MsTransform=t;
		view.style.oTransform=t;
		view.style.transform=t;
	}
	window.onresize();
	
	var framerate=1000/60;
	
	var hueArr=[130,190,350];
	function drawPlat(x,y,type)
	{
		var hue=hueArr[type||0];
		ctx.globalAlpha=0.65;
		ctx.fillStyle="hsl("+hue+",100%,35%)";
		ctx.fillRect(x,y,65,21);
		ctx.globalAlpha=1;
		ctx.strokeStyle="hsl(0,0%,18%)";
		ctx.lineWidth=2;
		ctx.lineCap="round";
		ctx.lineJoin="round";
		ctx.strokeRect(x,y,65,18);
	}
	
	function drawDoodler(x,y)
	{
		ctx.save();
		ctx.translate(x,y);
		ctx.scale(old_dx,1);
		ctx.drawImage(sDoodler,-35,-35,70,70);
		ctx.restore();
	}
	
	var sDoodler=document.getElementById("sDoodler")
	
	var id=null; 
	window.onunload=function()
	{
		clearInterval(id);
	}
	window.onbeforeunload=window.onunload;
	  
	var x=150,
		y=400;
	var dy=dx=0,
		old_dx=1;
	
	var canFall=fall=false;
	var fallY=0;
	
	var h=150;
	var score=0;
	
	function randType()
	{	
		var prob=[0,0,0,0];
		if(score>50)  prob.push(1);
		if(score>300) prob.push(1);
		if(score>200) prob.push(2);
		if(score>400) prob.push(2);
		if(score>600) prob.push(1);
		if(score>800) prob.push(2);
		if(score>1000) prob.push(2);
		return prob[Math.floor(Math.random()*prob.length)];
	}
	
	function newPlat(y)
	{
		var dx=Math.random()>.5?-1:1,
			x=Math.random()*235,
			type=randType();
		return {
			x:x,
			y:y,
			dx:dx,
			type:type,
			fall: false
		}
	}
	
	var plat;
	function initPlat()
	{
		plat=[];
		for(var i=0; i<5; i++) 
		{
			plat.push(newPlat(i*90));
		}
	}
	initPlat();
	
	var buttons=document.querySelectorAll("#controller .game-button"),
		replay=document.getElementById("replay");
		
	function setDir(dir)
	{
		dx=dir;
		x+=dx==old_dx?0:dir*20;
	}
	
	buttons[0].ontouchstart=function() { setDir(-1);  }
	buttons[1].ontouchstart=function() { setDir(1); }
	buttons[0].ontouchend=function() { setDir(0); }
	buttons[1].ontouchend=function() { setDir(0); }
	
	buttons[0].onmousedown=function() { setDir(-1);  }
	buttons[1].onmousedown=function() { setDir(1); }
	buttons[0].onmouseup=function() { setDir(0); }
	buttons[1].onmouseup=function() { setDir(0); }
	  
	replay.onclick=function()
	{
		y=400;
		x=150;
		dx=0;
		dy=0;
		old_dx=1;
		canFall=fall=false;
		fallY=score=0;
		initPlat();
		scoreEle.innerHTML="0000";
		id=setInterval(loop,framerate);
		replay.style.display="none";
	}
	
	var id=setInterval(loop,framerate);
	document.getElementById("loader").style.display="none";
	
	var scoreEle=document.getElementById("score");
	
	function loop()
	{
		dy+=0.2;
		if(dy>7) dy=7;
		y+=dy;
		if(y>415) 
		{
			if(!canFall) dy=-7
			else fall=true;
		}
		
		x+=dx*2;
		if(x<0) x=250;
		if(x>250) x=0;
		
		if(fall) 
		{
			fallY+=dy*1.5;
			if(fallY>450) fallY=450;
		}
		
		old_dx=dx||old_dx;
		
		if(fall&&y>950)
		{
			clearInterval(id);
			replay.style.display="block";
			return false;
		} 
		
		ctx.clearRect(0,0,width,height);
		
		ctx.save();
		if(fall) 
		{
			ctx.translate(0, -fallY);
		}
		
		for(var i=0;i<plat.length;i++)
		{
			drawPlat(plat[i].x,plat[i].y,plat[i].type);
			if(y<h) 
			{
				plat[i].y-=dy;
				canFall=true;
				if(plat[i].y>450)
				{
					var p=newPlat(plat[0].y-90)
					plat.splice(i,1);
					plat.unshift(p)
				}
			}
			
			if(plat[i].type==1) 
			{
				if(plat[i].x<0) 
				{
					plat[i].dx=1;
					plat[i].x=0;
				} else if(plat[i].x>235) 
				{
					plat[i].dx=-1;
					plat[i].x=235;
				}
				plat[i].x+=plat[i].dx*3;
			}
			
			if(plat[i].fall)
			{
				plat[i].y+=4;
			}
			
			var p=old_dx*20;
			var sx=x-35;
			if(old_dx<0) sx-=p;
			if(y+25<plat[i].y+5 && 
			  y+25+10>plat[i].y &&
			  sx<plat[i].x+65 &&
			  sx+50>plat[i].x && dy>0 &&
			  !plat[i].fall)
			{ 
				dy=-7;
				if(plat[i].type==2)
				{
					plat[i].fall=true;
				}
			}
		}
		
		if(y<h) 
		{
			score+=0.2;
			var s=Math.round(score);
			if(s<10000) s=("0000"+s).substr(-4);
			scoreEle.innerHTML=s;
			y=h;
		}
		
		drawDoodler(x,y);
		ctx.globalAlpha=0.5;
		if(x-35<0) drawDoodler(x+250,y);
		else if(x+35>250) drawDoodler(x-250,y);
		ctx.restore();
	};
}



