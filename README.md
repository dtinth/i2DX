i2DX
====

i2DX is a web-based IIDX controller for iPad. One night project 2011-10-04.

You can use it with [StepMania 5](http://www.stepmania.com/), especially with the
[beatmaniaIIDX15 theme](http://www.stepmania.com/forums/showthread.php?28308-SM5-beatmaniaIIDX15-theme-and-noteskin&p=195991#post195991).

It uses the following technologies:

* [WebSocket](http://websocket.org/)
* Python
	* [Tornado Web Server](http://www.tornadoweb.org/)
	* [pyOSC](https://trac.v2.nl/wiki/pyOSC)
* [OSCulator](http://www.osculator.net/)

It only works with Mac OS X for now due to its requirement of OSCulator.
I also tried to make it work with Windows (using autopy),
but the websocket server has very long latancy. You press the button
on the iPad, it gets registered one second later, thus made it unplayable.

If anyone can port this to make it work on Windows (using any language), or Linux,
I would appreciate it very much!



How it works
------------

HTML files are served via a web server, and a separate WebSocket server receives
key press events from the iPad.

The WebSocket server then sends these events via OSC to OSCulator, which can then be used to
map the received OSC events to joystick events and pass it to the game.

(Note: I can't get it to work with [ixi-software's HID server](http://www.ixi-audio.net/content/body_backyard_python.html).
If you can get it to work with it, please let me know).


Setup
-----

* A Mac OS-based computer
* An iPad
* An additional iPad / iPhone / iPod Touch (used as a separate scatch)
* A working WiFi connection (may or may not have internet access, but I think ad-hoc is the best)
* A beatmaniaIIDX simulator (I use StepMania 5 with IIDX15 theme)


Usage (with OSCulator)
----------------------

You have to install OSCulator, and then use Terminal to install Tornado and pyOSC Python modules.

    sudo easy_install tornado
    sudo easy_install pyOSC

Set OSCulator to port 9000.

`cd` to the client directory and then

    python -m SimpleHTTPServer

This serves the client files in port 8000.

Then, `cd` to the application directory and then

    python server.py

to start the WebSockets server.

Then, use your iPad to navigate to

    http://[your ip]:8000/

and press the buttons and try out the scratches. The OSC messages should show up in OSCulator.
Then in OSCulator, map the messages to the joystick events and enjoy!

Additionally, you can also point your iPhone or another iPad to

    http://[your ip]:8000/scratch.html

to use it as a dedicated scratch controller. I borrowed my friend's iPod Touch for this.
He also has a mat for his iPod so that it doesn't slip when he plays jubeat or other music
games on his iPod. Just telling you a story. ;p

Note that the standalone scratch page only supports up/down movement on iPhone, but you can
use rotation in iPad.


Message maps
------------

* `/key/0`: Key 1
* `/key/1`: Key 2
* `/key/2`: Key 3
* `/key/3`: Key 4
* `/key/4`: Key 5
* `/key/5`: Key 6
* `/key/6`: Key 7
* `/key/8`: Scratch Up
* `/key/9`: Scratch Down

