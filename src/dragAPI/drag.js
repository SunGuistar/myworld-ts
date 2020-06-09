import React, {Component} from 'react'
import { polyfill } from "mobile-drag-drop"
import {scrollBehaviourDragImageTranslateOverride} from "mobile-drag-drop/scroll-behaviour"

require('./drag.css')
export default class Drag extends Component{
    constructor(props){
        super(props)
        this.state = {
            imglist:[{imageUrl:'http://photos.tuchong.com/349669/f/6683901.jpg'},{imageUrl:'http://photos.tuchong.com/349669/f/6695960.jpg'},{imageUrl:'http://photos.tuchong.com/38538/f/6864556.jpg'},
                      {imageUrl:'http://photos.tuchong.com/349669/f/6683901.jpg'},{imageUrl:'http://photos.tuchong.com/349669/f/6695960.jpg'},{imageUrl:'http://photos.tuchong.com/38538/f/6864556.jpg'},
                      {imageUrl:'http://photos.tuchong.com/349669/f/6683901.jpg'},{imageUrl:'http://photos.tuchong.com/349669/f/6695960.jpg'},{imageUrl:'http://photos.tuchong.com/38538/f/6864556.jpg'},
                      {imageUrl:'http://photos.tuchong.com/349669/f/6683901.jpg'},{imageUrl:'http://photos.tuchong.com/349669/f/6695960.jpg'},{imageUrl:'http://photos.tuchong.com/38538/f/6864556.jpg'},
                      {imageUrl:'http://photos.tuchong.com/349669/f/6683901.jpg'},{imageUrl:'http://photos.tuchong.com/349669/f/6695960.jpg'},{imageUrl:'http://photos.tuchong.com/38538/f/6864556.jpg'},
                    ],
            originindex:0,
            targetindex:0,
        }
    }

    //周期函数
    componentDidMount(){
        //兼容移动端
        polyfill({
            dragImageTranslateOverride: scrollBehaviourDragImageTranslateOverride
        })
        var iosDragDropShim = { enableEnterLeave: true }   
        let  dragCon = document.getElementById('drag-wrap')
        dragCon.addEventListener('dragstart', this.startDrag.bind(this), false)

        dragCon.addEventListener('dragover', function (e) {
           e.preventDefault();
         }, false)
        dragCon.addEventListener('dragenter', function (e) {
            e.preventDefault();
        }, false)    
        dragCon.addEventListener('drop', this.exchangeElement.bind(this), false)
    }   

    startDrag(e) {
        let originindex = e.target.id.charAt(e.target.id.length-1)
        console.log(originindex)
        e.dataTransfer.setData('Text', originindex)
    }

    exchangeElement(e){
        e.preventDefault()
        let originindex = e.dataTransfer.getData('Text')
        let targetindex = e.target.id.charAt(e.target.id.length-1)
        console.log(e)
        let oldimageList = this.state.imglist
        let newimglist = this.swapArray(oldimageList,originindex,targetindex)
        this.setState({
            imglist:newimglist
        })
    }   

     swapArray(arr, index1, index2){
         arr[index1] = arr.splice(index2, 1, arr[index1])[0]
         return arr
     }
    render(){
        let { imglist } = this.state
        return(
            <div>
                <ul id='drag-wrap'>
                    {
                        imglist && 
                        imglist.map((item,index) => (
                            <li 
                              key={item+index}
                            >
                                <img src={item.imageUrl} id={`img${index}`} />
                            </li>
                        ))
                    }
                </ul>
            </div>
        )
    }
}
