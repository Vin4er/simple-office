(function( $ ){
  $.fn.seColorpicker = function(options) {

  var settings = {
        outer: undefined,
        getMarkers: {

        },
        getMask:{

        },
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
            return "<div class='" + cp.class.wrap + " simple-color'><div  class='" + cp.class.mask_wheelColor + "'></div><div class='" + cp.class.mask_mask + "'></div><div  class='" + cp.class.mask_wheel + "'><div class='" + cp.class.marker_wheel + "' data-type-math='circle'></div></div><div class='" + cp.class.mask_maskColor + "'><div class='" + cp.class.marker_mask + "'  data-type-math='square'></div></div>"
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

      create: function(obj){
        var cp = this;
            cp._backdropCreate();
            var offset = cp.outer.offset()   
            var item = $(cp.pattern('cp')).offset({left: offset.left, top: offset.top})
            console.log(item)
            $('body').append(item);         
      },
      setPosition: function(marker){
        console.log(marker)

      },
      drug: function(){
        var cp = this;
            $(".c-p_wheel-color, .c-p_mask").on('mousedown', function(){
                var marker = $(this)
                // x3 x3 x3
                cp.setPosition(marker)
                $(document).mousemove(function(){
                    cp.setPosition(marker)
                })
                $(document).mouseup(function(){
                    $(document).unbind();
                    cp.setPosition(marker)
                })
            })
            $(".mark_mask").on("mousedown", function(){
                $(" .c-p_mask").mousedown()
            })
      
            $(".c-p_mask").on("mousedown", function(){
                $(".c-p_wheel-color").mousedown()
            })

      },
      init: function(init_obj){
        var cp = this
            cpk = cp.outer = $(init_obj),
            cp.create();
            cp.getMarkers = {
              wheel: cpk.find("." + cp.class.marker_wheel),
              mask:  cpk.find("." + cp.class.marker_mask)
            };
            cp.getMask = {
              wheel: cpk.find("." + cp.class.mask_wheel),
              mask: cpk.find("." + cp.class.mask_mask),
              maskColor: cpk.find("." + cp.class.mask_maskColor),
            };
            cp.drug()
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