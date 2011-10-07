![i2DX](http://dl.dropbox.com/u/25097375/Documentation%20Images/i2DX/i2DX.png)
=======

i2DX is a web-based IIDX controller for iPad / Opera Mobile. One night project 2011-10-04. [__Video demo__](http://www.youtube.com/watch?v=C3cZsZYK4Jo)

You can use it with [StepMania 5](http://www.stepmania.com/), especially with the
[beatmaniaIIDX15 theme](http://www.stepmania.com/forums/showthread.php?28308-SM5-beatmaniaIIDX15-theme-and-noteskin&p=195991#post195991).

Because it is __web based__, you just need to run the server application on your Mac, and then point your device's
web browser to the server (they must be on the same wireless network!).
__No application installation needed on the device.__ (I particularly like this because I could borrow
someone's device and use it as a scratch controller [see below] :P).

--------------

It uses the following technologies:

* [WebSocket](http://websocket.org/)
* Python
	* [Tornado Web Server](http://www.tornadoweb.org/)
	* [pyOSC](https://trac.v2.nl/wiki/pyOSC)
* [OSCulator](http://www.osculator.net/)

It only works with Mac OS X host for now due to its requirement of OSCulator.
I first tried to make it work with Windows (using autopy),
but the websocket server seems to have very long latancy. You press the button,
it gets registered half a second later, thus made it unplayable.

__Fork me!__ If anyone can port this to make it work on Windows (using any language),
or Linux, I would appreciate it very much. :)




How it works
------------

The server serves the file to the device's web browser, which connects back to
the server via WebSocket and send the press / release events.

The WebSocket server then sends these events via OSC to OSCulator, which can then be used to
map the received OSC events to joystick events and pass it to the game.

(Note: I can't get it to work with [ixi-software's HID server](http://www.ixi-audio.net/content/body_backyard_python.html).
If you can get it to work with it, please let me know).



The Controllers
---------------

![Main Controller](http://dl.dropbox.com/u/25097375/Documentation%20Images/i2DX/Main.png?x=1)

![Alternate Controller (scratch on the right)](http://dl.dropbox.com/u/25097375/Documentation%20Images/i2DX/Alternate.png?x=1)

![Scratch Controller for iPad](http://dl.dropbox.com/u/25097375/Documentation%20Images/i2DX/Scratch2.png?x=1)

![Scratch Controller for Small Screens](http://dl.dropbox.com/u/25097375/Documentation%20Images/i2DX/Scratch.png?x=1)



Setup
-----

* A Mac OS-based computer
* An iPad or Android tablet device with Opera Mobile
* An additional device (iPad, iPhone, iPod touch, or almost any touch Android phones) (optional, used as a dedicated scratch controller)
* A working WiFi connection (may or may not have internet access. In my opinion, ad-hoc is the best)
* A beatmaniaIIDX simulator (I use StepMania 5 with IIDX15 theme)



Server Instructions (Mac OS X + OSCulator)
------------------------------------------

You have to install OSCulator, and then use Terminal to install Tornado and pyOSC Python modules.

    sudo easy_install tornado
    sudo easy_install pyOSC

Open OSCulator and set it to port 9000.

Then, `cd` to the __server__ directory and then

    python server-mac-osculator.py

to start the i2DX server on port 9876. Make sure the port is accessible from the device.



Client Instructions
-------------------

__Android Users:__ use Opera Mobile!

__For Opera Mobile:__ before using, go to opera:config and search for WebSockets
and __Enable WebSockets__ first, then save.

Then, use your device's web browser to navigate to

    http://[your ip]:9876/

If everything works correctly, then it should say "Ready" at the top left. If you press a button
and it changes to "Disconnected", then the key presses could not get through to OSCulator.
Fix it and refresh the page and try again.

Press the buttons and try out the scratches. The OSC messages should show up in OSCulator.
Then in OSCulator, map the messages to the joystick events and enjoy!

Additionally, you can also point another device to

    http://[your ip]:9876/static/scratch.html

to use it as a dedicated scratch controller. I borrowed my friend's iPod Touch for this.
He also has a mat for his iPod so that it doesn't slip when he plays jubeat or other music
games on his iPod. Just telling you a story. ;p

On the iPad, the dedicated scratch controller supports rotational movements, so if you
can borrow another iPad, then you can use it as a scratch controller! On other devices, it
only supports up / down movement, but it can be used to make the buttons and the turntable farther.

Now that if you have a scratch controller, you may not want it on the main controller anymore,
you can move the scratch area of the main controller to the right, by navigating to

    http://[your ip]:9876/static/alternate.html

on your main controller device.




Available Client Files
----------------------

* `http://[your ip]:9876/static/index.html` - __main controller__ with scratch on the left
* `http://[your ip]:9876/static/alternate.html` - __main controller__ with scratch on the right
* `http://[your ip]:9876/static/scratch.html` - __scratch controller__
    * If you open your scratch controller in iPad, then you can rotate to scratch,
	on other devices it use only up/down motion.



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

