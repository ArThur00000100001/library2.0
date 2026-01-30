<!-- CHAT WEBSOCKET SYSTEM DOCUMENTATION -->

# Sistema de Chat con WebSocket

## Descripción General

El sistema de mensajería permite que usuarios y administradores se comuniquen en tiempo real mediante WebSocket. Los mensajes se guardan en la base de datos y están disponibles a través de endpoints REST.

## Características

✅ Comunicación bidireccional en tiempo real
✅ Historial de mensajes persistente
✅ Indicador de usuarios en línea
✅ Indicador de escritura
✅ Mensajes leídos/no leídos
✅ Marcado de mensajes como leídos

## Endpoints REST

### 1. Obtener conversación entre dos usuarios

```bash
GET /messages/conversation/:userId/:otherUserId
Authorization: Bearer {token}
```

Respuesta:

```json
{
    "data": [
        {
            "id": 1,
            "senderId": 1,
            "receiverId": 2,
            "content": "Hola, ¿cómo estás?",
            "isRead": true,
            "createdAt": "2026-01-07T08:40:00Z"
        }
    ],
    "message": "Conversación obtenida exitosamente",
    "status": "success"
}
```

### 2. Obtener todos los mensajes de un usuario

```bash
GET /messages/user/:userId
Authorization: Bearer {token}
```

### 3. Contar mensajes sin leer

```bash
GET /messages/unread/:userId
Authorization: Bearer {token}
```

Respuesta:

```json
{
    "data": {
        "unreadCount": 5
    },
    "message": "Conteo de mensajes sin leer obtenido exitosamente",
    "status": "success"
}
```

### 4. Obtener un mensaje específico

```bash
GET /messages/:id
Authorization: Bearer {token}
```

### 5. Marcar mensaje como leído

```bash
POST /messages/:id/mark-as-read
Authorization: Bearer {token}
```

### 6. Eliminar mensaje

```bash
DELETE /messages/:id
Authorization: Bearer {token}
```

## Eventos WebSocket

### Conexión

El cliente debe conectarse incluyendo el userId como query parameter:

```javascript
const socket = io('http://localhost:3000', {
    query: {
        userId: 1, // ID del usuario conectado
    },
});
```

### Eventos del Cliente

#### 1. Enviar mensaje

```javascript
socket.emit('message', {
    senderId: 1,
    receiverId: 2,
    content: 'Hola, ¿cómo estás?',
});
```

Respuestas:

- `messageSent`: El mensaje fue enviado exitosamente
- `error`: Hubo un error al enviar el mensaje

#### 2. Marcar como leído

```javascript
socket.emit('markAsRead', {
    messageId: 123,
});
```

#### 3. Obtener usuarios en línea

```javascript
socket.emit('getOnlineUsers');
```

Respuesta:

```javascript
socket.on('onlineUsers', (users) => {
    console.log(users); // [{userId: 1}, {userId: 2}]
});
```

#### 4. Indicador de escritura

```javascript
// Usuario comienza a escribir
socket.emit('typing', {
    senderId: 1,
    receiverId: 2,
    isTyping: true,
});

// Usuario deja de escribir
socket.emit('typing', {
    senderId: 1,
    receiverId: 2,
    isTyping: false,
});
```

### Eventos del Servidor

#### 1. Mensaje recibido

```javascript
socket.on('newMessage', (message) => {
    console.log('Nuevo mensaje:', message);
    // {
    //   id: 1,
    //   senderId: 1,
    //   receiverId: 2,
    //   content: 'Hola',
    //   createdAt: '2026-01-07T08:40:00Z',
    //   isRead: false
    // }
});
```

#### 2. Usuario en línea

```javascript
socket.on('userOnline', (user) => {
    console.log('Usuario conectado:', user);
    // { userId: 1, socketId: 'xyz', timestamp: '2026-01-07T08:40:00Z' }
});
```

#### 3. Usuario desconectado

```javascript
socket.on('userOffline', (user) => {
    console.log('Usuario desconectado:', user);
    // { userId: 1, timestamp: '2026-01-07T08:40:00Z' }
});
```

#### 4. Mensaje leído

```javascript
socket.on('messageRead', (data) => {
    console.log('Mensaje leído:', data);
    // { messageId: 1, readAt: '2026-01-07T08:40:00Z' }
});
```

#### 5. Usuario escribiendo

```javascript
socket.on('userTyping', (data) => {
    console.log('Usuario escribiendo:', data);
    // { userId: 1, isTyping: true }
});
```

#### 6. Error

```javascript
socket.on('error', (error) => {
    console.error('Error:', error);
    // { message: 'Error al enviar el mensaje', error: 'Error message' }
});
```

## Ejemplo Completo con HTML + JavaScript

```html
<!DOCTYPE html>
<html>
    <head>
        <title>Chat</title>
        <script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
    </head>
    <body>
        <div id="messages"></div>
        <input type="text" id="messageInput" placeholder="Escribe un mensaje..." />
        <button onclick="sendMessage()">Enviar</button>

        <script>
            const userId = 1;
            const receiverId = 2;

            const socket = io('http://localhost:3000', {
                query: { userId },
            });
            socket.on('connect', () => {
                console.log('✅ Conectado al servidor');
                socket.emit('getOnlineUsers');
            });
            socket.on('newMessage', (message) => {
                displayMessage(`${message.senderId}: ${message.content}`);
            });

            socket.on('userOnline', (user) => {
                console.log(`✅ Usuario ${user.userId} conectado`);
            });

            socket.on('userOffline', (user) => {
                console.log(`❌ Usuario ${user.userId} desconectado`);
            });
            socket.on('userTyping', (data) => {
                if (data.isTyping) {
                    console.log(`Usuario ${data.userId} está escribiendo...`);
                }
            });

            function sendMessage() {
                const input = document.getElementById('messageInput');
                const content = input.value;

                socket.emit('message', {
                    senderId: userId,
                    receiverId: receiverId,
                    content: content,
                });
                input.value = '';
            }

            function displayMessage(text) {
                const messagesDiv = document.getElementById('messages');
                messagesDiv.innerHTML += `<p>${text}</p>`;
            }

            document.getElementById('messageInput').addEventListener('keypress', (e) => {
                socket.emit('typing', {
                    senderId: userId,
                    receiverId: receiverId,
                    isTyping: e.target.value.length > 0,
                });
            });
        </script>
    </body>
</html>
```

## Estructura de la Base de Datos

### Tabla: messages

| Campo      | Tipo      | Descripción               |
| ---------- | --------- | ------------------------- |
| id         | INT       | ID único del mensaje      |
| senderId   | INT       | ID del usuario que envía  |
| receiverId | INT       | ID del usuario que recibe |
| content    | TEXT      | Contenido del mensaje     |
| isRead     | BOOLEAN   | Indica si fue leído       |
| createdAt  | TIMESTAMP | Fecha de creación         |

## Notas Importantes

- Los mensajes se guardan automáticamente en la base de datos
- Los usuarios conectados recibirán los mensajes en tiempo real
- Si un usuario no está conectado, el mensaje se guardará y podrá recuperarlo después
- El sistema notifica a ambos usuarios cuando un mensaje es leído
- Los indicadores de escritura son solo en tiempo real (no se guardan)
