This directory is where Artieficer looks for clients. The basic file structure of a valid client is as follows:

	CLIENT_NAME
		bootstrap.ts
		.cfg.json

		* (any other file/directory)

The `bootstrap.ts` file must contain an exported function named *init*, which is responsible for executing the client. Artieficer passes the client configuration (`.cfg.json`) as an argument to the *init* function.

The `.cfg.json` file contains the client's configuration. There currently three defined properties:
- enabled (**boolean** type)
- token (**string** type)
- name (**string** type)

The *enabled* and *token* properties are required, and Artieficer will throw an error while reading a client configuration without them.

The *name* property is optional. If it's not defined in the configuration, Artieficer will use the client's root directory name as a substitute.

---

As mentioned above, Artificer passes the configuration as an argument to the init function. This includes any other property defined in the configuration file. If your client uses any custom defined properties, I recommend you extend the base `ClientInstanceConfig` class found in `/classes/ClientInstance.ts` and add your custom properties to the extended class.