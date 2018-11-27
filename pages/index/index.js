// pages/TestImageEdit/TestImageEdit.js
import {
  Lena
} from '../../utils/lena.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageWidth: 0,
    imageHeight: 0,
    imageUrl: null
  },

  onReady: function () {
    const sys_info = wx.getSystemInfoSync();
    this.width = sys_info.windowWidth;
    this.height = sys_info.windowHeight;
    const canvas_width = this.width;
    const canvas_height = this.height - 80;
    this.setData({
      canvas_width,
      canvas_height,
    }, () => {
    })


  },

  selectImage: function () {
    this.drawCanvasImage()
  },

  /** 
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(Lena);


  },


  drawCanvasImage() {
    const {
      canvas_width,
      canvas_height
    } = this.data

    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePath = res.tempFilePaths[0];

        wx.getImageInfo({
          src: tempFilePath,
          success: ({
            width,
            height
          }) => {
            that.f = that.width / width
            that.setData({
              imageWidth: that.width,
              imageHeight: height / width * that.width,
              imageUrl: tempFilePath
            }, () => {
              const ctx = wx.createCanvasContext('canvas')
              ctx.save()
              // ctx.scale(that.f, that.f)

              ctx.drawImage(that.data.imageUrl, 0, 0, that.data.imageWidth, that.data.imageHeight)

              ctx.restore()
              ctx.draw()

              that.editImage()
            })
          }
        })
      }
    })


  },

  editImage: function () {
    setTimeout(() => {
      var that = this;
      wx.canvasGetImageData({
        canvasId: 'canvas',
        x: 0,
        y: 0,
        width: this.data.imageWidth,
        height: this.data.imageHeight,
        success(res) {
          console.log(res.width) // 100
          console.log(res.height) // 100
          console.log(res.data instanceof Uint8ClampedArray) // true
          console.log(res.data.length) // 100 * 100 * 4

          let newData = res
          newData = Lena.grayscale(res)
          newData = Lena.thresholding(newData, 165);
          // newData = Lena.gaussian(newData)
          
          console.log(res)
          console.log(newData);
          wx.canvasPutImageData({
            canvasId: 'canvas',
            x: 0,
            y: 0,
            width: that.data.imageWidth,
            height: that.data.imageHeight,
            data: newData.data,
            success(res) {
              console.log('res')
            },
            fail: function (err) {
              console.log(err)
            }
          })
        }
      })
    }, 1000);
  },
})