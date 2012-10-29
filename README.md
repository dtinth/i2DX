* __Scroll Down__ for installation instructions (Windows and Mac OS X).
* Go to [__Download Page__](https://github.com/dtinth/i2DX/downloads) to download latest version of i2DX.


&nbsp;


__Video Demos__

* [1 iPad + 1 iPod Touch + StepMania](http://www.youtube.com/watch?v=C3cZsZYK4Jo) / Ristaccia
* [2 iPads + StepMania](http://www.youtube.com/watch?v=f7GBGOO5DRw&feature=channel) / garden
* [2 iPads v.s. Home Controller + Lunatic Rave 2](http://www.youtube.com/watch?v=RfJ5FoVZiBs) / being torn the sky
* [1 iPad](http://www.youtube.com/watch?v=tiuCW311GEA) / Elisha

&nbsp;

&nbsp;

&nbsp;


i2DX
=======

i2DX is a web-based IIDX controller for iPad / Opera Mobile. One night project 2011-10-04.

You can use it with [StepMania 5](http://www.stepmania.com/), especially with the
[beatmaniaIIDX15 theme](http://www.stepmania.com/forums/showthread.php?28308-SM5-beatmaniaIIDX15-theme-and-noteskin&p=195991#post195991).
You can also use it with Lunatic Rave 2, or other sims as well.

Because it is __web based__, you just need to run the server application on your computer,
and then point your device's web browser to the server (they must be on the same wireless network!).
__No application installation needed on the device.__ (I particularly like this because I could borrow
someone's device and use it as a scratch controller [see below] :P).

--------------

It uses the following technologies:

* [WebSocket](http://websocket.org/)
* Python __2.7__
	* [Tornado Web Server](http://www.tornadoweb.org/)
	* [pyOSC](https://trac.v2.nl/wiki/pyOSC)
* [OSCulator](http://www.osculator.net/) (Mac)
* [autopy](http://www.autopy.org/) (Windows)



How it works
------------

The server serves the file to the device's web browser, which connects back to
the server via WebSocket and send the press / release events.

__On Mac__: The WebSocket server then sends these events via OSC to OSCulator, which can then be used to
map the received OSC events to joystick events and pass it to the game.

__On Windows__: The WebSocket server then use autopy to press the keys.



The Controllers
---------------

![Main Controller](http://dl.dropbox.com/u/25097375/Documentation%20Images/i2DX/Main.png?x=1)

![Alternate Controller (scratch on the right)](http://dl.dropbox.com/u/25097375/Documentation%20Images/i2DX/Alternate.png?x=1)

![Scratch Controller for iPad](http://dl.dropbox.com/u/25097375/Documentation%20Images/i2DX/Scratch2.png?x=1)

![Scratch Controller for Small Screens](http://dl.dropbox.com/u/25097375/Documentation%20Images/i2DX/Scratch.png?x=1)



Setup
-----

* A computer with beatmaniaIIDX simulator (I use StepMania 5 with IIDX15 theme)
* An iPad or an Android tablet device with Opera Mobile
* An additional device (iPad, iPhone, iPod touch, or almost any touch Android phones) (optional, used as a dedicated scratch controller)
* A working WiFi connection (may or may not have internet access. In my opinion, ad-hoc is the best)



Server Instructions (Mac OS X + OSCulator)
------------------------------------------

Install [Python 2.7](http://www.python.org/download/) first.

Then you have to install OSCulator, and then use Terminal to install Tornado and pyOSC Python modules.

    sudo easy_install-2.7 tornado
    sudo easy_install-2.7 https://trac.v2.nl/raw-attachment/wiki/pyOSC/pyOSC-0.3.5b-5294.tar.gz

Open OSCulator and set it to port 9000.

Then, `cd` to the __server__ directory and then

    python2.7 server-mac-osculator.py

to start the i2DX server on port 9876. Make sure the port is accessible from the device.

Now navigate your client to the the server (see __Client Instructions__ below).

If you press a button and the text changes to "Disconnected", then the key presses
could not get through to OSCulator. Fix it and refresh the page and try again.

Press the buttons and try out the scratches. The OSC messages should show up in OSCulator.
Then in OSCulator, map the messages to the joystick events and enjoy!





<span id="easy-installation-windows">Server Instructions (Windows + autopy) (Easy)</span>
---------------------------------------------

Just download the latest [i2DX-Windows-abcdefg.zip](https://github.com/dtinth/i2DX/downloads),
extract, go to __server__, and run __server-windows-autopy.exe__.

On your device, open a web browser and go to i2DX (see __Client Instructions__ below).
Try pressing the buttons, it should type something on your keyboard.

__Then open your game, and set the keyboard config, and enjoy!!__

Or if you want to change the key when the button is being pressed,
edit `key-config.txt`. (Do not leave any blank line.)


Server Instructions (Windows + autopy) (Advanced)
-------------------------------------------------

Download __Python__ from [python.org](http://python.org/download/). I use Python 2.7 as of time of writing.

Then download and install [__AutoPy__](http://pypi.python.org/pypi/autopy/).

Then download and install [__setuptools__](pypi.python.org/pypi/setuptools).

Then open command prompt and run

    C:\Python27\Scripts\easy_install tornado

(replace `C:\Python27` with where you installed Python)

And then go to the __server__ directory and run __server-windows-autopy.py__.

Now navigate your client to the the server (see __Client Instructions__ below).
Try pressing some keys, it should type something on your keyboard.

With that set, open your game and map the pressed key to the corresponding input!





<span id="client-instructions">Client Instructions</span>
-------------------

__Android Users:__ use Opera Mobile!

__For Opera Mobile:__ before using, go to opera:config and search for WebSockets
and __Enable WebSockets__ first, then tap __Save__.

Then, use your device's web browser to navigate to

    http://[your ip]:9876/

You will see a launcher. Set the settings and click Launch i2DX.

If everything works correctly, then it should say "Ready" at the top left corner.

You can bring another device to use it as a dedicated scratch controller.
I borrowed my friend's iPod Touch for this.
He also has a mat for his iPod so that it doesn't slip when he plays jubeat or other music
games on his iPod. Just telling you a story. ;p

On the iPad, the dedicated scratch controller supports rotational movements, so if you
can borrow another iPad, then you can use it as a scratch controller! On other devices, it
only supports up / down movement, but it can be used to make the buttons and the turntable farther.

Now that if you have a scratch controller, you may not want it on the main controller anymore,
you can move the scratch area of the main controller to the right.



Hard Mode
---------

In normal mode, you can slide between buttons.
On real machines / controllers, you might not be able to do that, so in hard
mode, you cannot slide between buttons.




OSC Message maps
----------------

* `/key/0`: Key 1
* `/key/1`: Key 2
* `/key/2`: Key 3
* `/key/3`: Key 4
* `/key/4`: Key 5
* `/key/5`: Key 6
* `/key/6`: Key 7
* `/key/8`: Scratch Up
* `/key/9`: Scratch Down



Keyboard maps (Windows)
-----------------------

* `m`: Key 1
* `k`: Key 2
* `,`: Key 3
* `l`: Key 4
* `.`: Key 5
* `;`: Key 6
* `/`: Key 7
* `[`: Scratch Up
* `]`: Scratch Down
* `o`: Start
* `p`: Select

You can change key mappings in `server\key-config.txt`.
