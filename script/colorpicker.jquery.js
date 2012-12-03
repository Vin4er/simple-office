(function( $ ){
$.fn.seColorpicker = function(options) {

    var settings = {
        outer: undefined,
        getMarkers: {},
        getMask:{},
        class: {
            wrap: 'c-p-wrap',
            marker_wheel: "mark_wheel",
            marker_mask: "mark_mask",
            mask_wheel: "c-p_wheel",
            mask_wheelColor: "c-p_wheel-color",
            mask_mask: "c-p_mask",
            mask_maskColor: "c-p_mask-color",
            backdrop: "c-p-backdrop"
        }, 
        pattern: function(opt){
        var cp = this;
            switch(opt){
                case "cp": 
                return "<div class='" + cp.class.wrap + " simple-color'><div  class='" + cp.class.mask_wheelColor + "' data-marker='circle'></div><div class='" + cp.class.mask_mask + "' data-marker='square'></div><div  class='" + cp.class.mask_wheel + "'><div class='" + cp.class.marker_wheel + "' data-type-math='circle'></div></div><div class='" + cp.class.mask_maskColor + "'><div class='" + cp.class.marker_mask + "'  data-type-math='square'></div></div>"
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
            var backdrop = $(cp.pattern("backdrop")).on('mouseup', function(){
                cp.removeColorpicker();
            })
            $("body").append(backdrop);
        },
        removeColorpicker: function(){
            $(".simple-color").remove();
        },

        append: function(obj){
            var cp = this;
            cp._backdropCreate();
            var offset = cp.outer.offset()   
            var item = $(cp.pattern('cp')).offset({left: offset.left, top: offset.top})
            console.log(item)
            $('body').append(item);         
        },
        setPosition: function(marker){
            var cp = this,
            mark = marker.marker,
            markerWidth = mark.width(),
            mouse = {
                x: event.pageX - markerWidth/2,
                y: event.pageY - markerWidth/2
            },
            coord = {};
            switch (marker.type){
                case 'square':
                    var _mask = $(".c-p_mask"),
                    _maskWidth = _mask.width(),
                    _mask_offset = _mask.offset();
                    coord = {
                        x: (mouse.x >= _mask_offset.left && (mouse.x + markerWidth) <= (_maskWidth + _mask.offset().left)) ?( mouse.x)  : mark.offset().left,
                        y: (mouse.y >= _mask_offset.top && (mouse.y + markerWidth) <= ( _maskWidth + _mask.offset().top)) ? (mouse.y) : mark.offset().top,
                    }
                    marker.marker.offset({left: coord.x, top: coord.y})
                break;
                case 'circle':
                    var layer = $(".c-p_wheel-color"),
                    _layer_offset = layer.offset(), 
                    radius = Math.round(layer.width()/2) - 8,  // радиус окружности
                    baseX =  event.pageX - (radius + _layer_offset.left),
                    baseY = -event.pageY + (radius - _layer_offset.top ),
                    x =  Math.sqrt((radius*radius*baseX*baseX)/(baseX*baseX+baseY*baseY) ),
                    y = -(x*baseY/baseX);
                    x = (baseX > 0) ? (-x) : x;
                    y = (baseX > 0) ? (-y) : y                 
                    coord = {
                        x: (Math.abs(x - radius)),
                        y: (Math.abs(y - radius))
                    }
                    coord.y  = isNaN(coord.y) ? 
                            ((baseY < 0 && coord.x == 90) 
                                ? 180 
                                : ((baseY > 0 && coord.x == 90)
                                    ? 0 
                                    :  coord.y)) 
                            : coord.y;
                    marker.marker.css({left: coord.x + "px", top: coord.y + "px"})
                break;
            }
        },
        drug: function(){
            var cp = this;
            $(".c-p-wrap.simple-color").on('mousedown', ".c-p_mask, .c-p_wheel-color" , function(){
                var layer = $(this),
                marker = {
                    marker: $("[data-type-math='" + layer.attr('data-marker') + "']"),
                    type: layer.attr('data-marker'),
                }

                cp.setPosition(marker)

                $(document).mousemove(function(){
                    cp.setPosition(marker)
                })
                
                $(document).mouseup(function(){
                    $(document).unbind();
                    cp.setPosition(marker)
                    return false
                })
            })
            $(".mark_mask").on("mousedown", function(){
                $(" .c-p_mask").mousedown();
            })
            $(".mark_wheel").on("mousedown", function(){
                $(".c-p_wheel-color").mousedown();
            })

        },
        init: function(init_obj){
            var cp = this
            cpk = cp.outer = $(init_obj),
            cp.append();
            cp.getMarkers = {
                wheel: cpk.find("." + cp.class.marker_wheel),
                mask:  cpk.find("." + cp.class.marker_mask)
            };
            cp.getMask = {
                wheel: cpk.find("." + cp.class.mask_wheel),
                mask: cpk.find("." + cp.class.mask_mask),
                maskColor: cpk.find("." + cp.class.mask_maskColor),
            };
            cp.drug();
        }
    };

    if (options){ 
        $.extend(settings, options); // при этом важен порядок совмещения
    }


    return this.each(function() {
        settings.init(this);
    });

};
})(jQuery);