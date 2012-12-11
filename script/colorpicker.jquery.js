// Sergay lubinsky

// clicked.seColorpicker({
//     selector: $('body'),
//     change: function(){ },// смена цвета
//     close: function(){ }// зактрытие колорпикера
// })  

(function( $ ){
$.fn.seColorpicker = function(options) {
    var settings = {
        selector: $("body"), // jQuery тег, у которого изменяем свойства
        style_color: "background-color", //свойство, которое надо изменять
        color: "#ffffff", // дефолтный цвет, если не задан
        outer: undefined, // элемент к которому привязан колоприкер
        radius: undefined, // радиус ^^
        delta: 8, // дельта для окружности (уменьшаем радиус)
        change: function(){}, // юзверьская функция, вызываемая при смене цвета
        class: { // классы элементов колорпикера
            wrap: 'c-p-wrap', 
            marker_wheel: "mark_wheel",
            marker_mask: "mark_mask",
            mask_wheel: "c-p_wheel",
            mask_wheelColor: "c-p_wheel-color",
            mask_mask: "c-p_mask",
            mask_maskColor: "c-p_mask-color",
            backdrop: "c-p-backdrop"
        }, 
        // шаблоны колорпикера и бэкдропа
        pattern: function(opt){
            var cp = this;
            switch(opt){
                case "cp": 
                    return "<div class='" + cp.class.wrap + " simple-color'><div  class='" + cp.class.mask_wheelColor + "' data-marker='circle'></div><div class='" + cp.class.mask_mask + "' data-marker='square'><div class='" + cp.class.marker_mask + "'  data-type-math='square'></div></div><div  class='" + cp.class.mask_wheel + "'><div class='" + cp.class.marker_wheel + "' data-type-math='circle'></div></div><div class='" + cp.class.mask_maskColor + "'></div>"
                break;
                case "backdrop":
                    return "<div class='" + cp.class.backdrop+ " simple-color'></div>"
                break;
            }
        },
        // Создание бэкдропа
        _backdropCreate: function(){
            var cp = this;
            cp.removeColorpicker();
            var backdrop = $(cp.pattern("backdrop")).on('click', function(){
                cp.removeColorpicker();
            })
            $("body").append(backdrop);
        },
        //удаление колорпикера
        removeColorpicker: function(){
            var cp = this;
            $(".simple-color").remove();
             cp.close.call(cp);
        },
        // Создание колорпикера
        append: function(obj){
            var cp = this;
            cp._backdropCreate(); 
            var offset = cp.outer.offset(), 
            item = $(cp.pattern('cp')).offset({
                left: offset.left, 
                top: offset.top+cp.outer.height()+14 // 14 - смещение вниз
            });
            $('body').append(item);        
        },
        // установка координат маркеров. логика передыижения
        setPosition: function(marker){
            var cp = this,
                mark = marker.marker,
                markerWidth = mark.width(),
                //Координаты
                mouse = {
                    x: event.pageX,
                    y: event.pageY
                };

            switch (marker.type){
                
                //пересчет при передвижение маски
                case 'square':
                    var _mask = $(".c-p_mask"),
                        _maskWidth = _mask.width(),
                        _mask_offset = _mask.offset(),
                        // дабы не делать большие условия
                        coordBool = { 
                            left: (mouse.x > (_mask_offset.left)),
                            right: (mouse.x ) < (_maskWidth + _mask.offset().left),
                            top: (mouse.y > (_mask_offset.top)),
                            bottom: (mouse.y ) < (_maskWidth + _mask.offset().top)
                        }
                
                    //расчет координат x, с учетом промежутка [left; right]
                    var x = (coordBool.left && coordBool.right) 
                                ? mouse.x   
                                : !coordBool.left
                                    ? _mask_offset.left
                                    : _mask_offset.left+_mask.width();
                
                    //расчет координаты y, с учетом промежутка [top; bottom]
                    var y = (coordBool.top && coordBool.bottom) 
                                ? mouse.y   
                                : !coordBool.top
                                    ? _mask_offset.top
                                    : _mask_offset.top+_mask.width();
                
                    //Установка позиции и установка цвета
                    mark.offset({left: x, top: y})
                    cp.color =  "#"+cp.conv.RGB2Hex(cp.conv.HSV2RGB(cp.calcHSV()))
                
                break;
                
                //пересчет при передвижение по кругу
                case 'circle':

                    var layer = $("." + cp.class.mask_wheelColor),
                        _layer_offset = layer.offset(), 
                        radius = Math.round(layer.width()/2) - cp.delta,  // радиус окружности
                       
                        // считаем координаты кругового движения
                        baseX =  mouse.x - _layer_offset.left - radius,
                        baseY = -mouse.y + _layer_offset.top + radius,
                    
                        //Уровнение окружности
                        x =  Math.sqrt((radius*radius*baseX*baseX)/(baseX*baseX+baseY*baseY) ),
                        y = -(x*baseY/baseX);

                    cp.radius = radius;

                    // просчет координат, с учетом декарт сист. координат, с началом в центре окружности  
                    x = (Math.abs( ((baseX > 0) ? (-x) : x) - radius)),
                    y = (Math.abs( ((baseX > 0) ? (-y) : y) - radius))

                    //Установка позиции "y" если эта координата равна NaN - уточняем промежуток[0, 180]
                    y  = isNaN(y) && x==90
                            ? (baseY<0) 
                                ? 180 
                                : (baseY>0)
                                    ? 0 
                                    : y 
                            : y;

                    // установка позиции и цвета
                    marker.marker.css({
                        left: x + "px", 
                        top: y + "px"
                    });
                    $("."+ cp.class.mask_maskColor ).css(cp.style_color, "#"+cp.conv.RGB2Hex(cp.conv.HSV2RGB({S: 255, V: 255, H: cp.calcHSV({  x: x, y:y }).H})));
                    cp.color = "#"+cp.conv.RGB2Hex(cp.conv.HSV2RGB(cp.calcHSV()))
                
                break;
            }
            // Юзерская функция, расчитанная на выполнение при изменении цвета
           cp.change.call(cp);
           cp.selector.css("background-color", cp.color )
        },
        // установка событий для перетаскивания
        drug: function(){
            var cp = this;
            $(".c-p-wrap.simple-color").on('mousedown', ".c-p_mask, .c-p_wheel-color", function(){
                var layer = $(this),
                    doc = $(document),
                    marker = {
                        marker: $("[data-type-math='" + layer.attr('data-marker') + "']"),
                        type: layer.attr('data-marker'),
                    }
                    
                // установка меркера
                cp.setPosition(marker);
                
                doc.mousemove(function(){
                // установка меркера по mousedown
                    cp.setPosition(marker);
                })
                doc.mouseup(function(){
                // установка меркера по mouseop
                    doc.unbind();
                    cp.setPosition(marker)
                })
            });
            // силуляция нажатия на маску, когда нажали на маркер
            $("." + cp.class.marker_mask).on("mousedown", function(){
                $(" .c-p_mask").mousedown();
            })
            $(".mark_wheel").on("mousedown", function(){
                $("." + cp.class.mask_wheelColor).mousedown();
            })

        },  
        _setColor: function(){
            var cp = this,
            color = cp.color,
            radius =  Math.round($("." + cp.class.mask_wheelColor).width()/2) - cp.delta,
            coord = {
                x: radius*Math.cos((cp.conv.RGB2HSV(cp.conv.CSScl2RGB(color)).H+255)/180*Math.PI)+radius,
                y: radius*Math.sin((cp.conv.RGB2HSV(cp.conv.CSScl2RGB(color)).H+255)/180*Math.PI)+radius
            }
            $(".mark_wheel").css({
                "left": coord.x +'px', 
                "top": coord.y +'px'
            });
            $("."+ cp.class.mask_maskColor ).css(cp.style_color, "#"+cp.conv.RGB2Hex(cp.conv.HSV2RGB({S: 255, V: 255, H: cp.calcHSV(coord).H})));
            $("." + cp.class.marker_mask).css({
                "left": parseInt(cp.conv.RGB2HSV(cp.conv.CSScl2RGB(color)).S/255*radius)+'px', 
                "top": parseInt((255-cp.conv.RGB2HSV(cp.conv.CSScl2RGB(color)).V)/255*radius)+'px'
            });
        },
        // вычсление параметров цветовой модели HSV
        calcHSV: function(coords){
            var cp = this,
            radius =  Math.round($("." + cp.class.mask_wheelColor).width()/2) - cp.delta,
            maskcolor = $("."+ cp.class.mask_maskColor),
            maskmark =   $("." + cp.class.marker_mask),
            s = Math.round((parseInt(maskmark.css('left')))*255/radius),
            v = Math.round(Math.abs(parseInt(maskmark.css('top')) - radius)*255/radius),
            h = false,  
            //берем цвет маски с черным градиентом. если его нет. то устанавливаем rgb(0,0,0)
            cp_color = ( maskcolor.css(cp.style_color) == "") ? "rgb(0,0,0)" : maskcolor.css(cp.style_color);
            maskcolor.css(cp.style_color, cp_color);// применеие цвета или сохраниенеи старого

            s = (s > 255) ? 255 : ((s < 0) ? 0 : s);
            v = (v > 255) ? 255 : ((v < 0) ? 0 : v);
            if(!coords){ // если нужен только параметр H (цвет дл маски)
                h = cp.conv.RGB2HSV(cp.conv.CSScl2RGB(cp_color)).H
            }else{ //(окружность)
                h = 360 - parseInt(coords.y);
                h = (coords.x > 90) ? (360 - h ) :  h;
            } 

            return { H: h,  V: v,  S: s}
        },
        init: function(init_obj){
            var cp = this
            cpk = cp.outer = $(init_obj),
            cp.append();
            cp.color = cp.selector.css(cp.style_color);
            cp._setColor();
            cp.drug();
            cp.change.call(cp);
            cp.close.call(cp);
        },
          /*
  Конвертация между форматами
    hex2rgb, rgb2hsv, hsv2rgb, rgb2hex, css2rgb, calcHSV
  */
        conv: { // convertate in 
            cp: this,
            Hex2RGB: function(HEX){
                var str = '';
                if(HEX.length == 3){
                    for(var i in HEX){
                        str = str + HEX[i] + HEX[i]
                    }
                    HEX = str;
                    str = '';
                }
                for(var i in HEX){
                    if(HEX[i] == '0'){
                        str = str + HEX[i]
                    }else  break;  
                }
                if(str.length == 6){
                    return { R: 0,  G: 0,  B: 0 }
                }
                if(HEX.length != 6){
                    return false
                }
                if(HEX != str + Math.round(HEX, 16).toString(16)){ 
                    return false
                }
                HEX = Math.round(HEX, 16);
                RGB = {  R:HEX>>16,  G:(HEX&0x00FF00)>>8, B:(HEX&0x0000FF) };
                return RGB;
            },
            RGB2HSV: function (RGB) {
                var h = 0,
                s = 0,
                v = 0,
                min = Math.min(RGB.R, RGB.G, RGB.B),
                max = Math.max(RGB.R, RGB.G, RGB.B),
                delta = max - min;
                if(max!=0){
                    if(RGB.R == max){
                        h = (RGB.G - RGB.B)/delta
                    }else 
                        if(RGB.G == max){
                            h = 2 + (RGB.B - RGB.R)/delta
                        }else{
                            h = 4 + (RGB.R - RGB.G)/delta
                        }
                }else h = -1
                h *= 60;
                if(h < 0){
                    h += 360
                }
                s = (max == 0) ? max : (255*delta/max)
                v = max;
                h = ((RGB.R==RGB.G)&&(RGB.R==RGB.B)) ? 0 : h
                HSV = { H: parseInt(h), S: parseInt(s),    V: parseInt(v)};
                return  HSV;
            },
            HSV2RGB: function (HSV) {
                var r, g, b;
                if(HSV.S == 0){
                    r = g = b = HSV.V
                }else {
                    var t1 = HSV.V,
                    t2 = (255-HSV.S)*HSV.V/255,
                    t3 = (t1-t2)*(HSV.H%60)/60;
                    if(HSV.H<60){
                        r = t1;
                        b = t2;
                        g = t2 + t3;
                    }else 
                        if(HSV.H<120){
                            g = t1;
                            b = t2;
                            r = t1 - t3;
                        }else 
                            if(HSV.H < 180){
                                g = t1; 
                                r = t2;
                                b = t2 + t3;
                            }else 
                                if(HSV.H < 240){
                                    b = t1; 
                                    r = t2;
                                    g = t1 - t3;
                                }else 
                                    if(HSV.H < 300){
                                        b = t1;
                                        g = t2;
                                        r = t2 + t3;
                                    }else 
                                        if(HSV.H < 360){
                                            r = t1;
                                            g = t2;
                                            b = t1-t3;
                                        }else{
                                            r = 0;
                                            g = 0;
                                            b = 0;
                                         }
                };
                r = (r<0)?0:r;
                g = (g<0)?0:g;
                b = (b<0)?0:b;
                return { R: parseInt(r), G: parseInt(g),  B: parseInt(b) };
            },
            RGB2Hex: function (RGB) {
                var HEX = [RGB.R.toString(16), RGB.G.toString(16), RGB.B.toString(16)],
                len = HEX.length
                for(var f=0; f<len; f++){ 
                    if (HEX[f].length == 1){
                        HEX[f] = '0' + HEX[f];
                    }
                }
                return HEX.join('');
            },
            CSScl2RGB: function (s){
                if( (s=='transparent')||(s=='rgba(0, 0, 0, 0)')||(s=='rgb(0, 0, 0)') ){
                    return { R:0, G:0, B:0}
                }
                if(s.indexOf('#') != "-1"){
                    s = s.substring(1); 
                    return this.Hex2RGB(s);
                }else{
                    s = s.substring(4,s.length-1);
                    s = s.split(','); 
                    return { R: parseInt(s[0]),  G: parseInt(s[1]),  B: parseInt(s[2]) }
                }
            },
        },
    };

    if (options){ 
        $.extend(settings, options); // при этом важен порядок совмещения
    }


    return this.each(function() {
        settings.init(this);
    });

};
})(jQuery);