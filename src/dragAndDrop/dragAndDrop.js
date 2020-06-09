import React, { Component } from 'react';
import list from "./list";

require("./dragAndDrop.less");

/*
* 必要参数，可考虑从外部接收
* lineHeight是行高
* lineNumber是一行的个数
*/
const lineHeight = 40;
const lineWidth = 102 ;
const lineNumber = 5;

const move = (list ,startIndex, toIndex) => {
  [list[startIndex], list[toIndex]] = [list[toIndex],list[startIndex]];
  return list;
}

class DragMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dragging: false,
      draggingIndex: -1,
      startPageX:0,
      startPageY: 0,
      offsetPageX: 0,
      offsetPageY: 0,
    }
    this.state.list = list;
  }

  handleMouseDown = (e, index) => {
    this.setState({
      dragging :true,
      draggingIndex: index,
      startPageX: e.pageX,
      startPageY: e.pageY,
      currentPageX: e.pageX,
      currentPageY: e.pageY
    })
  }

  handleMouseUp = () => {
    this.setState({
      dragging: false, 
      startPageX: 0, 
      startPageY: 0,
      draggingIndex: -1,
    })
  }

  getDraggingStyle(index) {
    if(index !== this.state.draggingIndex) return {};
    return {
      backgroundImage:"linear-gradient(141deg,#9fb8ad 0%,#1fc8db 51%,#2cb5e8 75%)",
      transform: `translate(${this.state.offsetPageX+5}px, ${this.state.offsetPageY+5}px)`,
    }
  }



  handleMouseMove = e => {
    let offsetY = e.pageY - this.state.startPageY;
    let offsetX = e.pageX - this.state.startPageX;
    const draggingIndex = this.state.draggingIndex;
    let lastLineNumber = this.state.list.length % lineNumber;

    if(draggingIndex < 0 || this.state.list.length <= 0) {
      console.log(`dragAndDrop - handleMouseMove传入数据错误`);
    }
    
    //上移
    if(offsetY < -lineHeight && draggingIndex > (lineNumber - 1)) {
      offsetY += lineHeight;
      this.setState({
        list:move(this.state.list, draggingIndex, draggingIndex - lineNumber),
        draggingIndex: draggingIndex - lineNumber,
        startPageY: this.state.startPageY - lineHeight
      });
    }

    //下移
    if(offsetY > lineHeight && ((lastLineNumber > 0) ? draggingIndex <= (this.state.list.length - lastLineNumber-1) : draggingIndex < (this.state.list.length - lineNumber))) {
      offsetY -= lineHeight;
      //调整位置
      this.setState({
        list:move(this.state.list, draggingIndex, draggingIndex + lineNumber),
        draggingIndex: draggingIndex + lineNumber,
        startPageY: this.state.startPageY + lineHeight,
      });
    }

    //左移      
    if(offsetX < -lineWidth  && (draggingIndex % lineNumber) !== 0) {
      offsetX += lineWidth;
      this.setState({
        list:move(this.state.list, draggingIndex, draggingIndex - 1),
        draggingIndex: draggingIndex - 1,
        startPageX: this.state.startPageX - lineWidth,
      });
    }

    //右移
    if(offsetX > lineWidth && draggingIndex < this.state.list.length - 1 && (draggingIndex % lineNumber) !== 4) {
      offsetX -= lineWidth;
      this.setState({
        list:move(this.state.list, draggingIndex, draggingIndex + 1),
        draggingIndex: draggingIndex + 1,
        startPageX: this.state.startPageX + lineWidth,
      });
    }


    //拖动元素
    this.setState({offsetPageY: offsetY});
    this.setState({offsetPageX: offsetX});
  }

  render() {
    return (
      <div className="drag-content">
        <ul>
          {this.state.list.map((text, index) => (
            <li
              key={text}
              onMouseDown={e => this.handleMouseDown(e, index)}
              style={this.getDraggingStyle(index)}
            >
              {text}
            </li>
          ))}
        </ul>

        {this.state.dragging && (
          <div
            className="drag-mask"
            onMouseMove={this.handleMouseMove}
            onMouseUp={this.handleMouseUp}
          />
        )}
      </div>
    )
  }
}

export default DragMain;