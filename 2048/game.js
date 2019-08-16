var GAME_SIZE=4;
//胜利数字
var WIN_NUMBER=2048;
//格子样式
var GRID_CLASS={
	2:"cl_2",
	4:"cl_4",
	8:"cl_8",
	16:"cl_16",
	32:"cl_32",
	64:"cl_64",
	128:"cl_128",
	256:"cl_256",
	512:"cl_512",
	1024:"cl_1024",
	2048:"cl_2048"
}
//操作键	
var OPERATION_KEY={
	"ArrowUp":"upward",
	"ArrowDown":"down",
	"ArrowLeft":"left",
	"ArrowRight":"right"
}
//游戏状态
var GAME_STATE=0;
$(document).ready(function(){
	$(".cell").height($(".cell").width())
	$(document).keydown(function(event){
		if(GAME_STATE!=0)return;
		var value=OPERATION_KEY[event.key];
		if(value){
			switch(value){
				case "upward":
					upward();
					break;
				case "down":
					down();
					break;
				case "left":
					left();
					break;
				case "right":
					right();
					break;
				default :
					console.log("未定义")
					return;
			}
			var state= gameState();
			if(state==1){
				win();
			}else if(state==-1){
				fail();
			}
		}
	})
	
	var MAT;
	var score;			
	
	//生成空的数据集
	function getEmptyMatrix(){
		var mat= new Array();
		for(x=0;x<GAME_SIZE;x++){
			mat[x]=new Array(); 
			for(y=0;y<GAME_SIZE;y++){
				mat[x][y] = 0
			}
		}
		return mat;
	}
	
	//在空块中生成新的2或4
	function getNewNumber(){
		var index_x= parseInt(Math.random()*GAME_SIZE);
		var index_y= parseInt(Math.random()*GAME_SIZE);
		while(MAT[index_x][index_y] !=0){
			index_x= parseInt(Math.random()*GAME_SIZE);
			index_y= parseInt(Math.random()*GAME_SIZE);
		}
		if(Math.random()>=0.3){
			MAT[index_x][index_y]=2;//TODO 有要生成2或4
		}else{
			MAT[index_x][index_y]=4;
		}
		
	}
	
	//刷新界面的显示
	function refreshShow(){
		$("#gameContainer").empty();
		for(x=0;x<GAME_SIZE;x++){
			for(y=0;y<GAME_SIZE;y++){
				var i= MAT[x][y]
				if(i>0){
					var cal=GRID_CLASS[i];
					$("#gameContainer").append("<div class='cell "+cal+"' >"+i+"</div>");
				}else{
					$("#gameContainer").append("<div class='cell'></div>");
				}
			}
		}
		$("#score").text(score);
	}
	
	//向上
	function upward(){
		//var newMat=getEmptyMatrix();
		var isSuccess=false;//是否移动成功
		//向上移动并合并相同数字
		for(x=0;x<GAME_SIZE;x++){
			for(y=0;y<GAME_SIZE;y++){
				var count=x;
				while(count > 0){
					if(MAT[count-1][y]==0 || MAT[count][y] == MAT[count-1][y] ){
						//是合并时，加积分成绩
						if( MAT[count][y]!=0 && MAT[count][y] == MAT[count-1][y]){
							score+=MAT[count][y]+MAT[count-1][y];
						}
						MAT[count-1][y]=MAT[count][y]+MAT[count-1][y]
						MAT[count][y]=0
						isSuccess=true;
					}
					count--;
				}
			}
		}
		if(isSuccess){//至少有一格移动
			getNewNumber();
			refreshShow();
		}
	}
	
	//向下
	function down(){
		var isSuccess=false;//是否移动成功
		for(x=GAME_SIZE-1;x>=0;x--){
			for(y=0;y<GAME_SIZE;y++){
				var count=x;
				while(count < GAME_SIZE-1){
					if(MAT[count+1][y]==0 || MAT[count][y] == MAT[count+1][y] ){
						//是合并时，加积分成绩
						if(MAT[count][y]!=0 && MAT[count][y] == MAT[count+1][y]){
							score+=MAT[count][y]+MAT[count+1][y];
						}
						MAT[count+1][y]=MAT[count][y]+MAT[count+1][y]
						MAT[count][y]=0;
						isSuccess=true;
					}
					count++;
				}
			}
		}
		if(isSuccess){//至少有一格移动
			getNewNumber();
			refreshShow();
		}
	}
	
	//向左
	function left(){
		var isSuccess=false;//是否移动成功
		for(x=0;x<GAME_SIZE;x++){
			for(y=0;y<GAME_SIZE;y++){
				var count=y;
				while(count > 0){
					if(MAT[x][count-1]==0 || MAT[x][count] == MAT[x][count-1] ){
						//是合并时，加积分成绩
						if(MAT[x][count]!=0 && MAT[x][count] == MAT[x][count-1]){
							score+=MAT[x][count]+MAT[x][count-1];
						}
						MAT[x][count-1]=MAT[x][count]+MAT[x][count-1]
						MAT[x][count]=0;
						isSuccess=true;
					}
					count--;
				}
			}
		}
		if(isSuccess){//至少有一格移动
			getNewNumber();
			refreshShow();
		}
	}
	
	//向右
	function right(){
		var isSuccess=false;//是否移动成功
		for(x=0;x<GAME_SIZE;x++){
			for(y=GAME_SIZE-1;y>=0;y--){
				var count=y;
				while(count < GAME_SIZE-1){
					if(MAT[x][count+1]==0 || MAT[x][count] == MAT[x][count+1] ){
						//是合并时，加积分成绩
						if(MAT[x][count]!=0 && MAT[x][count] == MAT[x][count+1]){
							score+=MAT[x][count]+MAT[x][count+1];
						}
						MAT[x][count+1]=MAT[x][count]+MAT[x][count+1]
						MAT[x][count]=0;
						isSuccess=true;
					}
					count++;
				}
			}
		}
		if(isSuccess){//至少有一格移动
			getNewNumber();
			refreshShow();
		}
	}
	
	//获取游戏状态，-1失败(全部满格并且相邻的没有相同的数字)，0继续(还有空格，全部满格但还有相邻的相同的数字)，1胜利(出现2048获得胜利)
	function gameState(){
		//判断是否检测目标数字
		if(WIN_NUMBER >2){
			//判断是否胜利
			for(var x = 0,len = MAT.length; x < len; x++){
				for(y=0, leny=MAT[x].length ;y<leny; y++){
					//已经合成目标数字，获得胜利
					if(MAT[x][y]== WIN_NUMBER){
						console.log("已经合成目标数字，获得胜利");
						return 1;
					}
				}
			}
		}
		
		//判断是否还有空格
		for(var x = 0,len = MAT.length; x < len; x++){
			for(y=0, leny=MAT[x].length ;y<leny; y++){
				//还有空格，游戏继续
				if(MAT[x][y]== 0){
					console.log("还有空格，游戏继续");
					return 0;
				}
			}
		}
		
		//全部满格，判断是否还有相邻(上下左右)相同的数字
		for(var x = 0,len = MAT.length; x < len; x++){
			for(y=0, leny=MAT[x].length ;y<leny; y++){
				//还有相邻的相同数字，游戏继续
				if( (y+1<leny && MAT[x][y] == MAT[x][y+1]) || ( x+1 <len && MAT[x][y] == MAT[x+1][y])){
					console.log("全部满格，还有相邻的相同数字，游戏继续");
					return 0;
				}
			}
		}
		
		//其他情况，游戏结束
		console.log("其他情况，游戏结束");
		return -1;
		
	}
	
	//合成目标数字，游戏胜利
	function win(){
		GAME_STATE=1;
		$(".modal-title").text("游戏胜利")
		$(".modal-body").text("恭喜合成目标数字")
		$('#myModal').modal('show')
	}
	//游戏失败
	function fail(){
		GAME_STATE=-1;
		$(".modal-title").text("游戏失败")
		$(".modal-body").text("本次得分:"+score)
		$('#myModal').modal('show')
	}
	//重置
	reset =function(){
		GAME_STATE=0;
		score=0;
		MAT=getEmptyMatrix();
		getNewNumber();
		getNewNumber();
		refreshShow();
	}
	//继续
	continueGame = function(){
		if(GAME_STATE==-1){
			reset();
			$('#myModal').modal('hide')
			return;
		}
		WIN_NUMBER=1;
		GAME_STATE=0;
		
	}
	start()
	function start(){
		GAME_STATE=0;
		score=0;
		MAT=getEmptyMatrix();
		getNewNumber();
		getNewNumber();
		console.log(MAT);
		refreshShow();
	}
	
})
	
