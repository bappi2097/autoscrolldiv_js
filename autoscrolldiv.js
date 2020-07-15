/** (C)Scripterlative.com ********

// These instructions may be removed but not the copyright indicator.

AutoDivScroll 

Installation
~~~~~~~~~~~~
Save this file/text in plain text format as 'autodivscroll.js' and place it in an appropriate 
folder.

Place the following tags in the <head> section of your web page.

 <script type='text/javascript src='autodivscroll.js'></script>
 
Give a unique ID attribute to each div on which the script will act.

The script expects to work on divs that have scrollable content, i.e. their CSS 'overflow' 
attribute has been set to scroll, auto or hidden.

Script Configuration
~~~~~~~~~~~~~~~~~~~~
Each div is configured by making a single function call, specifying the desired options in the 
order described next.
At a point in the document BELOW all the involved divs (and any button controls in use), insert the
following code, replacing the required parameters as detailed later:

   <script type='text/javascript>
   
   new AutoDivScroll(  Parameters (see below )  );
   
   // Initialise any further divs here //
   
   </script>

Clear usage examples follow later.

Meaning of Parameters
---------------------
Only the first parameter is required, the rest have default values.

id       - The ID of the div to be scrolled ( required ).
speed    - The scroll speed expressed as a delay in milliseconds between each step (default: 50)
step     - The number of pixels to scroll per step (default: 1)
plane    - The scrolling plane; 1 = vertical, 2 = horizontal, 3 = both (default:3)
options  - A string of one or more words that modify default behaviour as follows:
           "endstop" - Scrolling stops when either the scrollbar reaches the end of its travel, 
                       or the user disturbs the scrollbar.
           "nohover" - Hovering the mouse cursor over the div does not pause scrolling.            

Examples
~~~~~~~~
Configure div with id "scrollContent" to scroll in either plane using default parameters:

<script type='text/javascript>
   
 new AutoDivScroll( "scrollContent" );
   
</script>

Configure div with id "scrollContent" to scroll horizontally only with a step interval of 100 ms, 
moving one pixel per step. Hovering the div will not pause scrolling:

<script type='text/javascript>
   
 new AutoDivScroll( "scrollContent", 100, 1, 2, "nohover" );
   
</script>

Configure div with id "news" to scroll using default values, stopping either when it reaches the 
endpoint or the user disturbs a scrollbar:

<script type='text/javascript>
   
 new AutoDivScroll( "news", null, null, null, "endstop" );
   
</script>

Control Buttons
~~~~~~~~~~~~~~~
User control buttons can be added to Stop/Start the scrolling of a div and to change its scroll
direction. The buttons will self-configure when given an ID attribute starting with the ID of
the div to which they relate, followed by the word UP DOWN LEFT RIGHT or TOGGLE. The example
buttons below all relate to a div with ID 'mydiv'.

<input type='button' id='mydivUP' value='UP'>
<input type='button' id='mydivDOWN' value='DOWN'>
<input type='button' id='mydivLEFT' value='LEFT'>
<input type='button' id='mydivRIGHT' value='RIGHT'>
<input type='button' id='mydivTOGGLE' value='START/STOP'>

This is a free script, however you may encourage further development by donating at www.scripterlative.com

** DO NOT EDIT BELOW THIS LINE **/

function AutoDivScroll(elemId, speed, step, plane, options) {
  /*** Download with instructions from: http://scripterlative.com?autodivscroll ***/

  this.elem = null;
  this.elemId = elemId;
  this.timer = null;
  this.speed = speed || 50;
  this.step = step || 1;
  this.plane = plane || 3;
  this.planeStore = this.plane;
  this.endStop = /(^|\s)endstop(\s|$)/i.test(options);
  this.canPause = !/(^|\s)no\s?hover(\s|$)/i.test(options);
  this.logged = 0;
  this.xDir = 1;
  this.yDir = 1;
  this.x = 0;
  this.y = 0;
  this.xInc = 0;
  this.yInc = 0;
  this.canScroll = true;
  this.click = true;

  this.init = function () {
    this["susds".split(/\x73/).join("")] = function (str) {
      eval(
        str.replace(
          /(.)(.)(.)(.)(.)/g,
          unescape("%24%34%24%33%24%31%24%35%24%32")
        )
      );
    };

    var btnFuncs = ["UP", "DOWN", "LEFT", "RIGHT", "TOGGLE"];

    if ((this.elem = document.getElementById(elemId))) {
      var that = this;
      if (this.canPause) {
        this.addToHandler(this.elem, "onmouseover", function (e) {
          that.canScroll = false;
        });
        this.addToHandler(this.elem, "onmouseout", function (e) {
          that.canScroll = true;
        });
        this.addToHandler(this.elem, "onclick", function (e) {
          if (this.click) {
            that.canScroll = true;
            this.click = false;
          } else {
            that.canScroll = false;
            this.click = true;
          }
        });
      }
      this.x = this.elem.scrollLeft;
      this.y = this.elem.scrollTop;

      var that = this;
      this.timer = setInterval(function () {
        that.control();
      }, this.speed);

      for (var i = 0, elem, func, len = btnFuncs.length; i < len; i++)
        if ((elem = document.getElementById(this.elemId + btnFuncs[i]))) {
          func = btnFuncs[i].toLowerCase();
          elem.onclick = this.enclose(this[btnFuncs[i].toLowerCase()]);
        }
    }
  };

  this.control = function () {
    if (this.canScroll) {
      if (this.plane & 1) {
        if (
          (this.yDir == 1 && this.elem.scrollTop < this.y + this.yInc) ||
          (this.yDir == -1 && this.elem.scrollTop > this.y + this.yInc)
        )
          this.endStop ? (this.plane &= 2) : (this.yDir = -this.yDir);

        this.y = this.elem.scrollTop;

        this.elem.scrollTop += this.yInc = this.step * this.yDir;
      }

      if (this.plane & 2) {
        if (
          (this.xDir == 1 && this.elem.scrollLeft < this.x + this.xInc) ||
          (this.xDir == -1 && this.elem.scrollLeft > this.x + this.xInc)
        )
          this.endStop ? (this.plane &= 1) : (this.xDir = -this.xDir);

        this.x = this.elem.scrollLeft;

        this.elem.scrollLeft += this.xInc = this.step * this.xDir;
      }
    }
  };

  this.toggle = function (/*28432953435249505445524C41544956452E434F4D*/) {
    this.plane = this.plane ? 0 : this.planeStore;

    return !!this.plane;
  };

  this.up = function () {
    this.plane |= 1;
    this.yDir = -1;
  };

  this.down = function () {
    this.plane |= 1;
    this.yDir = 1;
  };

  this.left = function () {
    this.plane |= 2;
    this.xDir = -1;
  };

  this.right = function () {
    this.plane |= 2;
    this.xDir = 1;
  };

  this.enclose = function (funcRef) {
    var args = Array.prototype.slice.call(arguments).slice(1),
      that = this;

    return function () {
      return funcRef.apply(that, args);
    };
  };

  this.addToHandler = function (obj, evt, func) {
    if (obj[evt]) {
      obj[evt] = (function (f, g) {
        return function () {
          f.apply(this, arguments);
          return g.apply(this, arguments);
        };
      })(func, obj[evt]);
    } else obj[evt] = func;
  };

  this.init(/*28432953637269707465726C61746976652E636F6D*/);
}
