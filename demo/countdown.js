var WINDOW_WIDTH=1024;
var WINDOW_HEIGHT=768;
var RADIUS=8;//小球半径是8
var MARGIN_TOP=60;
var MARGIN_LEFT=30;
//设置终止时间为2015年10月10日零点，其中月份是从0开始计算
const endTime=new Date();
endTime.setTime(endTime.getTime()+3600*1000);
var curShowTimeSeconds=0;
var balls = [];
const colors = ["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"]
window.onload=function()
{
	//屏幕自适应
	WINDOW_WIDTH=document.documentElement.clientWidth;
	WINDOW_HEIGHT=document.documentElement.clientHeight;
	MARGIN_LEFT=Math.round(WINDOW_WIDTH/10);
	MARGIN_TOP=Math.round(WINDOW_HEIGHT/5);
	RADIUS=Math.round(WINDOW_WIDTH/5*4/108)-1;
	var canvas=document.getElementById("canvas");
	canvas.width=WINDOW_WIDTH;
	canvas.height=WINDOW_HEIGHT;

	var context=canvas.getContext("2d");	
	curShowTimeSeconds=getCurrentShowTimeSeconds();
    setInterval(
        function(){
            render( context );
            update();
        }
        ,
        50
    );
}

function render(cxt)
{
	//刷新窗口
	cxt.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);
	var hour=parseInt(curShowTimeSeconds/3600);
	var minute=parseInt((curShowTimeSeconds-3600*hour)/60);
	var second=curShowTimeSeconds%60;
	//绘制小时的十位
	renderDigt(MARGIN_LEFT,MARGIN_TOP,parseInt(hour/10),cxt);
	//绘制小时的个位
	renderDigt(MARGIN_LEFT+15*(RADIUS+1),MARGIN_TOP,parseInt(hour%10),cxt);
	//绘制冒号
	renderDigt(MARGIN_LEFT+30*(RADIUS+1),MARGIN_TOP,10,cxt);
	//绘制分钟的十位
	renderDigt(MARGIN_LEFT+39*(RADIUS+1),MARGIN_TOP,parseInt(minute/10),cxt);
	//绘制分钟的个位
	renderDigt(MARGIN_LEFT+54*(RADIUS+1),MARGIN_TOP,parseInt(minute%10),cxt);
	//绘制冒号
	renderDigt(MARGIN_LEFT+69*(RADIUS+1),MARGIN_TOP,10,cxt);
	//绘制分钟的十位
	renderDigt(MARGIN_LEFT+78*(RADIUS+1),MARGIN_TOP,parseInt(second/10),cxt);
	//绘制分钟的个位
	renderDigt(MARGIN_LEFT+93*(RADIUS+1),MARGIN_TOP,parseInt(second%10),cxt);

	//画小球
	for (var i = 0; i < balls.length; i++) 
	{
		cxt.fillStyle=balls[i].color
		cxt.beginPath()
		cxt.arc(balls[i].x,balls[i].y,RADIUS,0,Math.PI*2);
		cxt.closePath();
		cxt.fill();
	}
}

function update()
{
	//下一次刷新的时间
	var nextShowTimeSeconds = getCurrentShowTimeSeconds();
    
    var nextHours = parseInt( nextShowTimeSeconds / 3600);
    var nextMinutes = parseInt( (nextShowTimeSeconds - nextHours * 3600)/60 )
    var nextSeconds = nextShowTimeSeconds % 60
	//当前时间
	var curHours = parseInt( curShowTimeSeconds / 3600);
    var curMinutes = parseInt( (curShowTimeSeconds - curHours * 3600)/60 )
    var curSeconds = curShowTimeSeconds % 60
	if (nextSeconds!=curSeconds)
	 {
	 	//小时的十位数字改变了，就要生成小球
	 	if(parseInt(curHours/10)!=parseInt(nextHours/10))
	 	{
	 		addBalls(MARGIN_LEFT,MARGIN_TOP,parseInt(curHours/10));
	 	}
	 	//小时的个位数发生变化，生成小球
	 	if(parseInt(curHours%10)!=parseInt(nextHours%10))
	 	{
	 		addBalls(MARGIN_LEFT+15*(RADIUS+1),MARGIN_TOP,parseInt(curHours%10));
	 	}
	 	//分钟的十位数发生变化
	 	if(parseInt(curMinutes/10)!=parseInt(nextMinutes/10))
	 	{
	 		addBalls(MARGIN_LEFT+39*(RADIUS+1),MARGIN_TOP,parseInt(curMinutes/10));
	 	}
	 	//分钟的个位数发生变化，生成小球
	 	if(parseInt(curMinutes%10)!=parseInt(nextMinutes%10))
	 	{
	 		addBalls(MARGIN_LEFT+54*(RADIUS+1),MARGIN_TOP,parseInt(curMinutes%10));
	 	}
	 	//秒的十位数发生变化,生成小球
	 	if(parseInt(curSeconds/10)!=parseInt(nextSeconds/10))
	 	{
	 		addBalls(MARGIN_LEFT+78*(RADIUS+1),MARGIN_TOP,parseInt(curSeconds/10));
	 	}
	 	//秒的个位数发生变化，生成小球
	 	if(parseInt(curSeconds%10)!=parseInt(nextSeconds%10))
	 	{
	 		addBalls(MARGIN_LEFT+93*(RADIUS+1),MARGIN_TOP,parseInt(curSeconds%10));
	 	}
 		curShowTimeSeconds=nextShowTimeSeconds;
 		updateBalls();
	 }
}

function updateBalls()
{
	for (var i = 0; i < balls.length; i++)
	{
		balls[i].x+=balls[i].vx;
		balls[i].y+=balls[i].vy;
		balls[i].vy+=balls[i].g;
		//碰撞地板检测
		if(balls[i].y>=WINDOW_HEIGHT-RADIUS)
		{
			balls[i].y=WINDOW_HEIGHT-RADIUS;
			balls[i].vy=-balls[i].vy*0.75;
		}	
	}
	var count=0
	for (var j = 0; j < balls.length; j++)
	{
		if(balls[j].x-RADIUS>0 && balls[j].x+RADIUS<WINDOW_WIDTH)
		{
			balls[count++]=balls[j];
		}
	}
	while(balls.length>count)
	{
		balls.pop();
	}
}



function addBalls(x,y,num)
{
	for (var i = 0; i < digit[num].length; i++)
	{
		for (var j = 0; j < digit[num][i].length; j++)
		{
			if(digit[num][i][j]==1)
			{
				var aBall={
					x:x+(RADIUS+1)*j*2+(RADIUS+1),
					y:y+(RADIUS+1)*i*2+(RADIUS+1),
					//加速度
					g:1.5+Math.random()*10,
					//水平初速度
                    vx:Math.pow( -1 , Math.ceil( Math.random()*1000 ) ) * 10,
					//垂直速度，小球会向上抛
					vy:-5,
					color:colors[parseInt(Math.random()*colors.length*10)]
				}
				balls.push(aBall);
			}			
		}
	}
}
//该函数把毫秒转换为秒
function getCurrentShowTimeSeconds()
{
	//获取当前时间
	var curTime=new Date();
	ret=Math.round((endTime-curTime)/1000);
	return ret>=0 ? ret : 0;
}
function renderDigt(x,y,num,cxt)
{
	var radius=RADIUS;
	cxt.fillStyle="rgb(0,102,153)";
	for (var i = 0; i < digit[num].length; i++) 
	{
		for (var j = 0; j < digit[num][i].length; j++) 
		{
			if(digit[num][i][j]==1)
			{
				cxt.beginPath();
				cxt.arc(x+2*(radius+1)*j+(radius+1),y+2*(radius+1)*i+(radius+1),radius,0,Math.PI*2);
				cxt.closePath();
				cxt.fill();
			}
		}
	}
}