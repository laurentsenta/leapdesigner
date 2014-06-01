Leap Designer
=============

- Hacking around the Leap Motion V2 driver.
- Produce a Design tool inspired by [Elon Musk](https://www.youtube.com/watch?v=xNqs_S-zEBY)

Right now, this is a very basic prototype that allows you to move around cubes
in a 3D world.


Usage
-----

- Plug your leap-motion with the current driver (June 01, 2014)
- Run an `http-server` in the src/ folder
- Visit...


Depends on
----------

- The world module is written in Typescript


Structure
---------

Multiple layers:
- Gesture translate leap motion frames & data to events
    - pinch, unpinch, etc
- Interactor translate events to interaction with the world
    - pinch object, move object, etc
- Rest is rendering

                             +--------------> interactions
                             |
                             |
                       +-----+------+
                       |            |
               +------>| Interactor |<-+
               |       |            |  |
               |       +------------+  |
        events |                       |
               |                       |
               |                       |
          +----+----+             +----+----+
          |         |             |         |
          | Gesture |             |  World  |+----------+
          |         |             |         |           |
          +---------+             +---------+           v
               ^                                  +----------+
               |                                  |          |
        frames |                                  |  ThreeJs +-----> rendering
               |                                  |          |
        +------+-----+          +------------+    +----------+
        |            |          |            |          ^
        | LeapMotion |          | RiggedHand +----------+
        |            |          |            |
        +------------+          +------------+