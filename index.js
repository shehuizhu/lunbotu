function Slider(opt, wrap) {
    this.wrap = wrap;
    this.list = opt.list || [];
    this.width = opt.width || wrap.width();
    this.height = opt.height || wrap.height();
    this.type = opt.type == undefined ? 'fade' : opt.type;
    this.showChangeBtn = opt.showChangeBtn == undefined ? true : opt.showChangeBtn;
    this.autoTime = opt.autoTime == undefined ? 3000 : opt.autoTime;
    this.isAuto = opt.isAuto == undefined ? true : opt.isAuto;
    this.nowIndex = 0;
    this.listLength = this.list.length;
    this.isAnimate = false;
    this.timer = null;
    //进行初始化  dom 样式  事件绑定  自动轮播
    this.init = function() {
        this.createDom();
        this.initStyle();
        this.bindEvent();
        //如果是自动轮播，则进行触发
        if (this.isAuto) {
            this.autoChange();
        }
    }

    // 创建dom元素
    Slider.prototype.createDom = function() {
            var sliderWrap = $('<div class="my-swiper-wrapper"></div>');
            var sliderContent = $('<ul class="my-swiper-list"></ul>');
            var leftBtn = $('<div class="my-swiper-btn my-swiper-lbtn">&lt</div>');
            var rightBtn = $('<div class="my-swiper-btn my-swiper-rbtn">&gt</div>');
            var spotDiv = $('<div class="my-swiper-spots"></div>');
            for (var i = 0; i < this.list.length; i++) {
                $('<li class="my-swiper-item"></li>').append(this.list[i]).appendTo(sliderContent);
                $('<span class="my-swiper-spot"></span>').appendTo(spotDiv);
            }
            // 如果是animate，则需要在末尾克隆第一个dom结构
            if (this.type == 'animate') {
                $('<li class="my-swiper-item"></li>').append($(this.list[0]).clone()).appendTo(sliderContent);
            }
            //将全部的dom结构放在最外层的容器中，同时添加一个class，用于判断是无缝轮播还是淡入淡出
            sliderWrap.append(sliderContent)
                .append(leftBtn)
                .append(rightBtn)
                .append(spotDiv)
                .appendTo(this.wrap)
                .addClass('my-swiper-' + this.type);


        }
        // 初始化样式
    Slider.prototype.initStyle = function() {

        $('.my-swiper-wrapper', this.wrap).css({
            width: this.width,
            height: this.height
        }).find('.my-swiper-item').css({
            width: this.width,
            height: this.height
        });
        if (this.type == 'fade') {
            $('.my-swiper-item', this.wrap).hide().eq(this.nowIndex).show();
        } else if (this.type == 'animate') {
            $('.my-swiper-list', this.wrap).css({
                width: this.width * (this.listLength + 1)
            });
        }
        // 使用active 进行小圆点的触发
        $('.my-swiper-spot', this.wrap).eq(this.nowIndex).addClass('active');

    }

    Slider.prototype.bindEvent = function() {
            var self = this;
            // right边按钮
            $('.my-swiper-rbtn', this.wrap).click(function() {
                if (self.isAnimate) {
                    return false;
                }
                self.isAnimate = true;
                // 当到了最右边的时候
                if (self.type == 'fade' && self.nowIndex >= self.listLength - 1) {
                    self.nowIndex = 0;
                } else if (self.type == 'animate' && self.nowIndex == self.listLength) {
                    $('.my-swiper-list', this.wrap).css({
                        left: 0
                    })
                    self.nowIndex = 1;
                } else {
                    self.nowIndex++;


                }
                // 进行图片的切换和小圆点的切换
                self.change();
            });



            //左边的按钮
            $('.my-swiper-lbtn', this.wrap).click(function() {
                if (self.isAnimate) {
                    return false;
                }
                self.isAnimate = true;
                //最左边的时候  fade  和 animate
                if (self.nowIndex == 0) {
                    self.nowIndex = self.listLength - 1;
                    if (this.type = 'animate') {
                        $('.my-swiper-list', this.wrap).css({
                            left: -this.width * this.listLength
                        })
                    }
                } else {
                    self.nowIndex--;
                }
                self.change();

            });
            // 鼠标移入进去的时候，停止自动轮播

            $('.my-swiper-wrapper', this.wrap).mouseenter(function() {
                    clearInterval(self.timer);
                }).mouseleave(function() {
                    if (self.isAuto) {
                        self.autoChange();
                    }
                })
                // 鼠标移入小圆点的时候切换
            $('.my-swiper-spots > span', this.wrap).mouseenter(function() {
                if (self.isAnimate) {
                    return false;
                }
                self.isAnimate = true;
                self.nowIndex = $(this).index();
                self.change()
            });
        }
        // 根据nowIndex 进行图片和小圆点样式的切换
    Slider.prototype.change = function() {
            var self = this;
            if (this.type == 'fade') {
                $('.my-swiper-item', this.wrap).fadeOut().eq(this.nowIndex).fadeIn(function() {
                    self.isAnimate = false;
                });
            } else if (this.type == 'animate') {
                $('.my-swiper-item', this.wrap).animate({
                    left: -this.width * this.nowIndex,
                    color: 'red'
                }, function() {
                    self.isAnimate = false;
                })
            }
            $('.my-swiper-item', this.wrap).hide().eq(this.nowIndex).show();
            $('.my-swiper-spot', this.wrap).removeClass('active').eq(this.nowIndex % this.listLength).addClass('active');
        }
        // 自动轮播，相当于点击了右按钮
    Slider.prototype.autoChange = function() {
        var self = this;
        self.timer = setInterval(function() {
            $('.my-swiper-rbtn', self.wrap).click()

        }, this.autoTime)
    }
}


//  给$扩展方法，每次调用是不同的都是新的实例
$.fn.extend({
    swiper: function(opt) {
        var obj = new Slider(opt, this);
        obj.init();
    }
})