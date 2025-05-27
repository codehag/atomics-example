# Reader-Writer Atomics Example

This repo contains a simple reader/writer pattern for a webpage using several workers and a main
thread that writes. It demonstrates the interplay between Atomics.waitAsync (on the main thread) and Atomics.wait (on the worker threads).

To run this locally, you will need to have an http server such as python's http-server. Otherwise
everything should be built in. You can also view it online [here](https://codehag.github.io/atomics-example/)
