# Networking

Tina provides a networking interface so you don't need to get it from somewhere else, the interface it's pretty intuitive and it's considered to be something similar to what HTTP Requests look like with methods such as `GET`, `POST`, and `UPDATE`. 

Your Endpoints (that's what they're called like) should be defined once and in a single file (recommended to be under `src/shared` folder). 

### Repositories

Repositories are holders for Endpoints and other repositories, these repositories can have a scope, either being `development` or `production` (covered on "Tina's yaml configuration"). 

```ts
Network.repository({ ...endpoints });
Network.repository({ ...endpoints }).developmentOnly(); // Limited to the development enviroment
```

### Endpoints

Endpoints are, as the name says, end points on your networking. These endpoints can be retrieved, send or receive information from either context. Endpoints are the core to the networking.

###### Register endpoints

To start working with the Networking, you should be registering it once and recommended to be in a single file.

```ts
// src/shared/net.ts
export const Endpoints = Network.registerEndpoints({
    furniture: Network.repository({
        checkId: Network.Method.GET<string, boolean>()
    }),
});
```

###### GET Endpoint

GET is a way to communicate between both contexts, being able to receive data, and return back data depending on that data received earlier. GET only can be retrieved from the client, so the server AND ONLY the server can reply to these requests.

The way to declare a GET Endpoint is to use the `Method` namespace inside `Tina` and pass the types to the generic functions as it follows.

```ts
Network.Method.GET<sendType: string, returnType: number>();
```

The `sendType` it's optional, and can be undefined, or just be skipped completely when using `.get()` instead of `.send()`.

To connect and listen to clients requests, you use `.reply(callback: Callback)`.

```ts
<string, boolean>GETEndpoint.reply((id: string) => Conditions.eval(Registry.has(id)));
```

To get the data back from the request, you will need to make the request itself. This is made with 2 methods.

```ts
GETEndpoint.get(); // NO data being sent, so it doesn't take anything.
GETEndpoint.send(...); // Data can be sent to the server.
```

Both ways will send the request and so on, expect for the reply.

```ts
GETEndpoint
    .when()
    .condition(Conditions.create((hasId: boolean) => hasId))
    .do(() => {
        ...; // perform client furniture placement
    });

GETEndpoint.send("{2345-23142-BED}");
```

###### UPDATE Endpoint

UPDATE is a way to communicate to the client and perform, as the name says, updates to it. 

The way to declare an UPDATE Endpoint is to use the `Method` namespace inside `Tina` and pass the type to send to the client as it follows.

```ts
Network.Method.UPDATE<string>();
```

The client is the only one that can connect to this Endpoint, and so the server it's only available to send data to it.

```ts
// Client
UPDATEEndpoint
    .when()
    .condition(Conditions.create((message: string) => message === "Hello!"))
    .do(() => {
        ...; // code is right, perform client operation
    });

// Server
UPDATEEndpoint.send("Hello!");
```

###### POST Endpoint

POST is a way to send data to the server. Either to work with it, or to verify it (though verifications are highly discouraged to use POST, instead, use GET).

The way to declare an UPDATE Endpoint is to use the `Method` namespace inside `Tina` and pass the type to send to the client as it follows.

```ts
Network.Method.POST<{ data: { kills: number } }>();
```

The server is the only one that can connect to this Endpoint, and so the client it's only available to send data to it.

```ts
// Server
POSTEndpoint
    .when()
    .condition(Conditions.create(({ data }: ...) => Register.checkDeath(data.kills)));
    .do(() => {
        ...; // all right, perform anything needed
    });

// Client
POSTEndpoint.send({
    data: {
        kills: 0,
    },
})
```

###### Middleware

Coming soon.