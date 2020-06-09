import React from 'react';
import list from './list'

require('./dragAndChange.less')

const {useState, useEffect, useRef} = React

interface normalType {
  [propName:string]: number
}

/*
* 必要参数，可考虑从外部接收
* lineHeight是单格高度
* lineWidth是单格宽度
* lineNumber是一行的最大个数
* proportion 是交换位置的最低比例
*/
const lineHeight:number = 40;
const lineWidth:number = 102 ;
const lineNumber:number = 5;
const proportion:number = 0.6;



const DragChange = () => {
  const rangeUI = useRef<HTMLUListElement>(null);
  const [dragging, setDragging] = useState<boolean>(false);
  const [draggingIndex, setDraggingIndex] = useState<number>(-1);
  const [startPage, setStartPage] = useState<normalType>({"x": 0, "y": 0 });
  const [offsetPage, setOffsetPage] = useState<normalType>({"x": 0, "y": 0});
  const [mainDirection, setMainDirection] = useState<normalType>({"top": 0, "left": 0, "right": 0 ,"bottom": 0});


  useEffect(() => {
    if(rangeUI.current) {
      setMainDirection({"top": rangeUI.current.offsetTop, "left":rangeUI.current.offsetLeft, 
        "right": rangeUI.current.offsetLeft + rangeUI.current.offsetWidth ,"bottom": rangeUI.current.offsetTop + rangeUI.current.offsetHeight})
    }
  },[])

  const handleMouseDown = (e: React.MouseEvent, index: number) => {
      setDragging(true);
      setDraggingIndex(index);
      setStartPage({"x": e.pageX,"y": e.pageY});
  }

  const getDraggingStyle = (index: number) => {
    if(index !== draggingIndex) {
      return;
    }
    return {
      transform: `translate(${offsetPage.x}px, ${offsetPage.y}px)`,
      opacity:0.5,
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
      setOffsetPage({"x": e.pageX - startPage.x, "y": e.pageY - startPage.y});
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    if(draggingIndex < 0) {
      console.log(`dragAndChange-handleMouseUp error`)
      return;
    }
    let lengthX = e.pageX - startPage.x; //X轴移动距离
    let lengthY =e.pageY - startPage.y; //Y轴移动距离
    let flagX = lengthX < 0 ? -1 : 1; //X轴移动方向
    let flagY = lengthY < 0 ? -1 : 1; //Y轴移动方向
    let offsetLastX = Math.abs(lengthX % lineWidth); //X轴移动剩余距离
    let offsetLastY = Math.abs(lengthY % lineHeight); //Y轴移动剩余距离
    let offsetNumberX = Math.floor(Math.abs(lengthX / lineWidth)); //X轴移动格数
    let offsetNumberY = Math.floor(Math.abs(lengthY / lineHeight)); //Y轴移动格数
    let leastX = lineWidth * proportion; //X轴最少移动距离
    let leastY = lineHeight * proportion; //Y轴最少移动距离
    let startIndex = draggingIndex; //移动的项

    //超出范围
    if((flagX === 1 && lengthX > (mainDirection.right - startPage.x))
        || (flagX === -1 && -lengthX > (startPage.x - mainDirection.left))
        || (flagY === 1 && lengthY > (mainDirection.bottom - startPage.y))
        || (flagY === -1 && -lengthY > (startPage.y - mainDirection.top))
      ) {
      console.log(`超出范围 拒绝拖放`)  
    }else {
      /*
      * 算法：计算移动距离，查看是否有匹配项
      */
      if(Math.abs(e.pageX) >= leastX || Math.abs(e.pageY) >= leastY) {
        if(offsetLastX >= leastX) {
          offsetNumberX++;
        }
        if(offsetLastY >= leastY){
          offsetNumberY++;
        }
        let currentIndex = 0;
        currentIndex = startIndex+(offsetNumberX * flagX)+(offsetNumberY * flagY)*lineNumber;
        if(currentIndex < list.length && currentIndex >= 0) {
          [list[startIndex],list[currentIndex]] = [list[currentIndex],list[startIndex]];
        }
      }
    }
    //初始化
    setDragging(false);
    setDraggingIndex(-1);
    setStartPage({"x": 0, "y": 0});
    setOffsetPage({"x": 0, "y": 0})
  }

  return (
    <div className="drag-content">
      <ul
        ref={ rangeUI }
      >
        {list.map((text, index) => (
          <li
            key={text}
            onMouseDown={e => handleMouseDown(e, index)}
            style={getDraggingStyle(index)}
          >
            {text}
          </li>
        ))}
      </ul>

      {dragging && (
        <div 
          className="drag-mask"
          onMouseMove={e => handleMouseMove(e)}
          onMouseUp={e => handleMouseUp(e)}
        />
      )}
    </div>
  )

}

export default DragChange;