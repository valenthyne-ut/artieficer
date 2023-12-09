# What is an "Artieficer"?

Artieficer is a "platform" to run and manage multiple Discord bots written in [Typescript](https://www.typescriptlang.org/), using [discord.js](https://discord.js.org/), which are my preferred tools to make Discord bots with.

Included are some types and classes that help you quickly set up a bot and focus on developing it instead of writing boilerplate code over and over.

As of v0.1.3, Artieficer looks in the *clients/root* directory for any valid clients, lists how many it found and executes them all (if they're enabled in their configuration).