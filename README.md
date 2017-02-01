# [Project2: Toolbox Functions](https://github.com/CIS700-Procedural-Graphics/Project2-Toolbox-Functions)

* Author: Joseph Gao
* PennKey: gaoj

Features Implemented
--------------------
* Modeling 
I based my wing and feather structure from that of an owl. 

To make the bone, I used QuadraticBezierCurve3 to sketch out its rough outline. I attempted to make the bone follow the general structure of an owl wing by finding points that would make the closest parabola possible. Once the Bezier curve was created, I distributed vertices evenly along the bone structure that would serve as the locations of the 100 feathers.

* Animation
My scene contains a dynamic, movable wind (just use the GUI). The wind force causes the feathers to be blown a different direction in 3D space. The wind itself causes the feathers to vibrate in place, and the intensity of this can be changed. Additionally, the wing is always flapping.

* Interactivity
All the required interactivity features have been implemented, and the user is able to alter the intensity and direction of the wind, manually change the curvature of the bone, alter the number of feathers present on the bone, change the feather size, color, and orientation, as well as alter the flapping speed and intensity of the wing. All this can be done through the GUI in the upper right.


Extra Credit
------------
- No extra credit implemented for this homework. 


